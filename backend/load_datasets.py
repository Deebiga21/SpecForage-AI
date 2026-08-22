import os
import csv
import json
from datetime import datetime
from database import SessionLocal, engine
import models
from models import Product, ProductAttribute, SourceEvidence, ComplianceRecord, ProductRelationship
from insights_schema import ProductInsight

def load_data():
    # Clear existing data
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datasets")
    
    # 1. Load Products
    product_map = {} # CSV id string -> DB id integer
    with open(os.path.join(data_dir, "products.csv"), "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            p = Product(
                product_name=row["product_name"],
                sku=row["sku"],
                category=row["category"],
                confidence=95.0,
                validation_status="passed" if row["product_status"] == "Active" else "warning",
                compliance_status="passed"
            )
            db.add(p)
            db.flush()
            product_map[row["product_id"]] = p.id
    
    # 2. Load Extracted Attributes
    attr_map = {} # CSV attribute_name -> DB attribute id
    with open(os.path.join(data_dir, "extracted_attributes.csv"), "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            db_pid = product_map.get(row["product_id"])
            if not db_pid: continue
            
            pa = ProductAttribute(
                product_id=db_pid,
                field=row["attribute_name"],
                value=row["normalized_value"],
                unit=row["unit"],
                confidence=float(row["confidence"]),
                validation_status="passed"
            )
            db.add(pa)
            db.flush()
            attr_map[f"{row['product_id']}_{row['attribute_name']}"] = pa.id
            
    # 3. Load Source Evidence
    with open(os.path.join(data_dir, "source_evidence.csv"), "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            db_pid = product_map.get(row["product_id"])
            db_attr_id = attr_map.get(f"{row['product_id']}_{row['attribute_name']}")
            if not db_pid or not db_attr_id: continue
            
            se = SourceEvidence(
                product_id=db_pid,
                attribute_id=db_attr_id,
                source_page=int(row["page_number"]) if row["page_number"] else 1,
                source_text=row["source_text"]
            )
            db.add(se)

    # 4. Load Compliance
    with open(os.path.join(data_dir, "compliance.csv"), "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            db_pid = product_map.get(row["product_id"])
            if not db_pid: continue
            
            cr = ComplianceRecord(
                product_id=db_pid,
                standard=row["standard"],
                status=row["status"],
                evidence=row["evidence_text"],
                confidence=float(row["confidence"]) if row["confidence"] else 0.0
            )
            db.add(cr)

    # 5. Load Relationships
    with open(os.path.join(data_dir, "product_relationships.csv"), "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            src_db_id = product_map.get(row["source_product_id"])
            tgt_db_id = product_map.get(row["target_product_id"])
            if not src_db_id or not tgt_db_id: continue
            
            pr = ProductRelationship(
                product_id=src_db_id,
                related_product_id=tgt_db_id,
                relationship_type=row["relationship_type"],
                confidence=float(row["confidence"]) if row["confidence"] else 0.0,
                reason=row["reason"]
            )
            db.add(pr)

    # 6. Load Insights
    with open(os.path.join(data_dir, "insights.csv"), "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            db_pid = product_map.get(row["product_id"])
            if not db_pid: continue
            
            pi = ProductInsight(
                product_id=db_pid,
                insight_type=row["insight_type"].lower(),
                title=row["title"],
                description=row["description"],
                severity=row["severity"],
                recommendation=row["recommended_action"],
                status=row["status"]
            )
            db.add(pi)

    db.commit()
    print("Database populated successfully from datasets folder.")

if __name__ == "__main__":
    load_data()
