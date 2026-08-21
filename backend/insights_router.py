from fastapi import APIRouter, Depends, HTTPException, WebSocket
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from database import get_db
from models import Product, ProductAttribute, ReviewItem
from insights_schema import ProductInsight, InsightSummaryCache
from pydantic import BaseModel

router = APIRouter(prefix="/api/insights", tags=["insights"])

class ResolveRequest(BaseModel):
    insight_id: int
    action: str

@router.get("/summary")
async def get_summary(db: Session = Depends(get_db)):
    cache = db.query(InsightSummaryCache).filter(InsightSummaryCache.cache_key == "global_summary").first()
    if cache:
        return cache.payload
    return {
        "products_analyzed": 0, "critical_issues": 0, "needs_review": 0,
        "potential_duplicates": 0, "compliance_gaps": 0
    }

@router.get("/data-gaps")
async def get_data_gaps(db: Session = Depends(get_db)):
    insights = db.query(ProductInsight).filter(ProductInsight.insight_type == "gap", ProductInsight.status == "OPEN").all()
    return [{
        "id": i.id,
        "product_id": i.product_id,
        "product_name": i.meta_payload.get("product_name"),
        "sku": i.meta_payload.get("sku"),
        "title": i.title,
        "description": i.description,
        "missing_attributes": i.missing_fields,
        "expected_fields": i.expected_fields,
        "extracted_fields": i.extracted_fields,
        "completeness_score": i.completeness_score,
        "pages_checked": i.pages_checked,
        "source_evidence": i.source_evidence,
        "severity": i.severity,
        "recommended_action": i.recommendation
    } for i in insights]

@router.get("/duplicates")
async def get_duplicates(db: Session = Depends(get_db)):
    insights = db.query(ProductInsight).filter(ProductInsight.insight_type == "duplicate", ProductInsight.status == "OPEN").all()
    results = []
    for i in insights:
        p_b = db.query(Product).filter(Product.id == i.secondary_product_id).first()
        results.append({
            "id": i.id,
            "product_a": {"id": i.product_id, "sku": i.meta_payload.get("product_a")},
            "product_b": {"id": i.secondary_product_id, "sku": p_b.sku if p_b else "Unknown"},
            "similarity_percentage": int((i.confidence or 0.9) * 100),
            "matching_attributes": ["Category", "Attributes Match"],
            "differences": ["Review needed"],
            "reason": "High attribute overlap"
        })
    return results

@router.get("/replacements")
async def get_replacements(db: Session = Depends(get_db)):
    insights = db.query(ProductInsight).filter(ProductInsight.insight_type == "replacement", ProductInsight.status == "OPEN").all()
    results = []
    for i in insights:
        p_b = db.query(Product).filter(Product.id == i.secondary_product_id).first()
        results.append({
            "id": i.id,
            "current_product": {"id": i.product_id, "sku": i.meta_payload.get("current")},
            "replacement_product": {"id": i.secondary_product_id, "sku": p_b.sku if p_b else "Unknown"},
            "confidence": int((i.confidence or 0.8) * 100),
            "matching_specifications": ["Category Match"]
        })
    return results

@router.get("/compliance")
async def get_compliance(db: Session = Depends(get_db)):
    insights = db.query(ProductInsight).filter(ProductInsight.insight_type == "compliance", ProductInsight.status == "OPEN").all()
    return [{
        "id": i.id,
        "product": {"id": i.product_id, "sku": i.meta_payload.get("product")},
        "standard": i.meta_payload.get("standard"),
        "evidence_status": i.meta_payload.get("status"),
        "source_document": "Datasheet",
        "severity": i.severity
    } for i in insights]

@router.get("/catalog-quality")
async def get_catalog_quality(db: Session = Depends(get_db)):
    cache = db.query(InsightSummaryCache).filter(InsightSummaryCache.cache_key == "global_summary").first()
    completeness = cache.payload.get("catalog_completeness", 0) if cache else 0
    avg_conf = db.query(func.avg(Product.confidence)).scalar() or 0.0
    fails = db.query(ProductInsight).filter(ProductInsight.insight_type == "risk", ProductInsight.status == "OPEN").count()
    return {
        "completeness": completeness,
        "confidence": int(avg_conf * 100),
        "missing_fields": ["Review individual gaps"],
        "low_confidence_fields": [],
        "validation_failures": fails
    }

@router.get("/opportunities")
async def get_opportunities(db: Session = Depends(get_db)):
    insights = db.query(ProductInsight).filter(ProductInsight.insight_type == "opportunity", ProductInsight.status == "OPEN").all()
    return [{
        "category": i.meta_payload.get("category"),
        "missing_attribute": i.meta_payload.get("missing_attribute"),
        "affected_products": i.meta_payload.get("affected"),
        "business_opportunity": "Standardizing this field improves search indexing"
    } for i in insights]

@router.get("/taxonomy")
async def get_taxonomy(db: Session = Depends(get_db)):
    insights = db.query(ProductInsight).filter(ProductInsight.insight_type == "taxonomy", ProductInsight.status == "OPEN").all()
    return [{
        "id": i.id,
        "product": {"id": i.product_id, "sku": i.meta_payload.get("product")},
        "current_class": i.meta_payload.get("current_class"),
        "confidence": int((i.confidence or 0.7) * 100),
        "alternative_class": "Review mapping",
        "classification_status": "Review Required"
    } for i in insights]

@router.get("/risks")
async def get_risks(db: Session = Depends(get_db)):
    insights = db.query(ProductInsight).filter(ProductInsight.insight_type == "risk", ProductInsight.status == "OPEN").all()
    return [{
        "id": i.id,
        "product": {"id": i.product_id, "sku": i.meta_payload.get("product")},
        "conflicting_field": i.meta_payload.get("conflicting_field"),
        "value_a": i.meta_payload.get("value_a"),
        "source_a": "Extraction",
        "value_b": "Validation failed",
        "source_b": "System",
        "risk_severity": i.severity
    } for i in insights]

@router.get("/recommendations")
async def get_recommendations(db: Session = Depends(get_db)):
    insights = db.query(ProductInsight).filter(ProductInsight.status == "OPEN").order_by(desc(ProductInsight.severity)).limit(10).all()
    actions = []
    for i in insights:
        if i.insight_type == "compliance":
            actions.append({"priority": i.severity, "action": f"Resolve compliance gap on {i.meta_payload.get('product')}", "color": "red"})
        elif i.insight_type == "duplicate":
            actions.append({"priority": i.severity, "action": f"Review duplicate candidates for {i.meta_payload.get('product_a')}", "color": "orange"})
        elif i.insight_type == "gap":
            actions.append({"priority": i.severity, "action": f"Fill missing specs for {i.meta_payload.get('sku')}", "color": "yellow"})
        elif i.insight_type == "taxonomy":
            actions.append({"priority": i.severity, "action": f"Check taxonomy for {i.meta_payload.get('product')}", "color": "blue"})
        else:
            actions.append({"priority": i.severity, "action": f"Address {i.insight_type} issue on product {i.product_id}", "color": "indigo"})
            
    # De-duplicate actions
    seen = set()
    dedup = []
    for a in actions:
        if a["action"] not in seen:
            seen.add(a["action"])
            dedup.append(a)
    return dedup[:10]


@router.post("/dismiss")
async def dismiss_insight(req: ResolveRequest, db: Session = Depends(get_db)):
    insight = db.query(ProductInsight).filter(ProductInsight.id == req.insight_id).first()
    if not insight:
        raise HTTPException(status_code=404, detail="Insight not found")
    insight.status = "DISMISSED"
    db.commit()
    return {"status": "success"}

@router.post("/review")
async def review_insight(req: ResolveRequest, db: Session = Depends(get_db)):
    insight = db.query(ProductInsight).filter(ProductInsight.id == req.insight_id).first()
    if not insight:
        raise HTTPException(status_code=404, detail="Insight not found")
    
    # Mark for review in ReviewItem table
    review = ReviewItem(
        product_id=insight.product_id,
        reason=f"Review requested for insight: {insight.insight_type}",
        status="pending"
    )
    db.add(review)
    insight.status = "RESOLVED"
    db.commit()
    return {"status": "success", "message": "Insight sent to human review"}

@router.post("/resolve")
async def resolve_insight(req: ResolveRequest, db: Session = Depends(get_db)):
    insight = db.query(ProductInsight).filter(ProductInsight.id == req.insight_id).first()
    if not insight:
        raise HTTPException(status_code=404, detail="Insight not found")
    insight.status = "RESOLVED"
    db.commit()
    return {"status": "success"}

@router.websocket("/live-stream")
async def websocket_endpoint(websocket: WebSocket):
    from main import manager
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except Exception:
        manager.disconnect(websocket)
