from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import defaultdict
from models import Product, ProductAttribute, ComplianceRecord, TaxonomyMapping, SourceEvidence
from insights_schema import ProductInsight, InsightSummaryCache

REQUIRED_FIELDS = {
    "default": ["Voltage", "Weight", "Dimensions", "Material"],
    "sensor": ["Voltage", "Weight", "Dimensions", "Sensing Range", "Operating Temperature"],
}

class InsightsEngine:
    def __init__(self, db: Session):
        self.db = db

    def calculate_jaccard(self, set1, set2):
        if not set1 and not set2:
            return 0.0
        intersection = len(set1.intersection(set2))
        union = len(set1.union(set2))
        return intersection / union

    def recalculate_for_product(self, product_id: int):
        product = self.db.query(Product).filter(Product.id == product_id).first()
        if not product:
            return

        # Clear existing OPEN insights for this product
        self.db.query(ProductInsight).filter(
            ProductInsight.product_id == product_id,
            ProductInsight.status == "OPEN"
        ).delete()
        self.db.commit()

        self._calc_gaps(product)
        self._calc_similarity(product) # Duplicates & Replacements
        self._calc_compliance(product)
        self._calc_taxonomy(product)
        self._calc_risks(product)
        
        # Global recalculations
        self._calc_opportunities()
        self._update_summary_cache()

    def _calc_gaps(self, p: Product):
        attrs = self.db.query(ProductAttribute).filter(ProductAttribute.product_id == p.id).all()
        existing_fields = {a.field.lower() for a in attrs if a.value}
        
        cat = p.category.lower() if p.category else "default"
        req_fields = REQUIRED_FIELDS.get(cat, REQUIRED_FIELDS["default"])
        
        missing = [f for f in req_fields if f.lower() not in existing_fields]
        
        completeness = 100
        if req_fields:
            completeness = int((len(req_fields) - len(missing)) / len(req_fields) * 100)
            
        if missing:
            severity = "CRITICAL" if len(missing) >= 3 else "HIGH" if len(missing) >= 2 else "MEDIUM"
            insight = ProductInsight(
                insight_type="gap",
                product_id=p.id,
                title="Data Gap Detected",
                description=f"Missing {len(missing)} critical fields out of {len(req_fields)} expected.",
                severity=severity,
                missing_fields=missing,
                expected_fields=req_fields,
                extracted_fields=list(existing_fields),
                completeness_score=completeness,
                recommendation="Obtain the missing specifications from the manufacturer datasheet/source.",
                meta_payload={"product_name": p.product_name, "sku": p.sku}
            )
            self.db.add(insight)
            self.db.commit()

    def _calc_similarity(self, p: Product):
        # Find all other products in the same category
        others = self.db.query(Product).filter(Product.category == p.category, Product.id != p.id).all()
        p_attrs = {f"{a.field.lower()}:{a.value.lower()}" for a in self.db.query(ProductAttribute).filter(ProductAttribute.product_id == p.id).all() if a.value}
        
        if not p_attrs:
            return

        for o in others:
            o_attrs = {f"{a.field.lower()}:{a.value.lower()}" for a in self.db.query(ProductAttribute).filter(ProductAttribute.product_id == o.id).all() if a.value}
            if not o_attrs:
                continue
                
            sim = self.calculate_jaccard(p_attrs, o_attrs)
            if sim >= 0.85:
                # Duplicate
                self.db.add(ProductInsight(
                    insight_type="duplicate",
                    product_id=p.id,
                    secondary_product_id=o.id,
                    severity="HIGH",
                    confidence=sim,
                    meta_payload={"similarity": sim, "product_a": p.sku, "product_b": o.sku}
                ))
            elif 0.60 <= sim < 0.85:
                # Replacement
                self.db.add(ProductInsight(
                    insight_type="replacement",
                    product_id=p.id,
                    secondary_product_id=o.id,
                    severity="LOW",
                    confidence=sim,
                    meta_payload={"similarity": sim, "current": p.sku, "replacement": o.sku}
                ))
        self.db.commit()

    def _calc_compliance(self, p: Product):
        records = self.db.query(ComplianceRecord).filter(ComplianceRecord.product_id == p.id).all()
        for r in records:
            if r.status != "compliant":
                self.db.add(ProductInsight(
                    insight_type="compliance",
                    product_id=p.id,
                    severity="CRITICAL" if r.status == "unknown" else "HIGH",
                    meta_payload={"standard": r.standard, "status": r.status, "product": p.sku}
                ))
        self.db.commit()

    def _calc_taxonomy(self, p: Product):
        mappings = self.db.query(TaxonomyMapping).filter(TaxonomyMapping.product_id == p.id).all()
        for m in mappings:
            if m.confidence and m.confidence < 0.85:
                self.db.add(ProductInsight(
                    insight_type="taxonomy",
                    product_id=p.id,
                    severity="MEDIUM",
                    confidence=m.confidence,
                    meta_payload={"current_class": m.code, "confidence": m.confidence, "product": p.sku}
                ))
        self.db.commit()

    def _calc_risks(self, p: Product):
        attrs = self.db.query(ProductAttribute).filter(ProductAttribute.product_id == p.id, ProductAttribute.validation_status == "failed").all()
        for a in attrs:
            self.db.add(ProductInsight(
                insight_type="risk",
                product_id=p.id,
                severity="CRITICAL",
                meta_payload={"conflicting_field": a.field, "value_a": a.value, "product": p.sku}
            ))
        self.db.commit()

    def _calc_opportunities(self):
        # Clear existing
        self.db.query(ProductInsight).filter(ProductInsight.insight_type == "opportunity", ProductInsight.status == "OPEN").delete()
        
        products = self.db.query(Product).all()
        missing_by_cat = defaultdict(lambda: defaultdict(int))
        total_by_cat = defaultdict(int)
        
        for p in products:
            cat = p.category.lower() if p.category else "default"
            total_by_cat[cat] += 1
            req = REQUIRED_FIELDS.get(cat, REQUIRED_FIELDS["default"])
            
            existing = {a.field.lower() for a in self.db.query(ProductAttribute).filter(ProductAttribute.product_id == p.id).all() if a.value}
            for r in req:
                if r.lower() not in existing:
                    missing_by_cat[cat][r] += 1

        for cat, missing_counts in missing_by_cat.items():
            for field, count in missing_counts.items():
                if count >= 3:
                    self.db.add(ProductInsight(
                        insight_type="opportunity",
                        product_id=0, # Aggregate
                        severity="LOW",
                        meta_payload={"category": cat, "missing_attribute": field, "affected": count}
                    ))
        self.db.commit()

    def _update_summary_cache(self):
        total_products = self.db.query(Product).count()
        critical = self.db.query(ProductInsight).filter(ProductInsight.status == "OPEN", ProductInsight.severity == "CRITICAL").count()
        needs_review = self.db.query(Product).filter(Product.review_status == "pending").count()
        duplicates = self.db.query(ProductInsight).filter(ProductInsight.status == "OPEN", ProductInsight.insight_type == "duplicate").count()
        compliance = self.db.query(ProductInsight).filter(ProductInsight.status == "OPEN", ProductInsight.insight_type == "compliance").count()
        
        # Catalog Quality
        attrs = self.db.query(ProductAttribute).all()
        completed_attrs = len([a for a in attrs if a.value])
        total_expected = len(attrs) if attrs else 1
        completeness = int((completed_attrs / total_expected) * 100) if total_expected else 0
        
        summary = {
            "products_analyzed": total_products,
            "critical_issues": critical,
            "needs_review": needs_review,
            "potential_duplicates": duplicates,
            "compliance_gaps": compliance,
            "catalog_completeness": completeness
        }
        
        cache = self.db.query(InsightSummaryCache).filter(InsightSummaryCache.cache_key == "global_summary").first()
        if not cache:
            cache = InsightSummaryCache(cache_key="global_summary", payload=summary)
            self.db.add(cache)
        else:
            cache.payload = summary
            
        self.db.commit()
