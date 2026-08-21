import re

filepath = "backend/insights_router.py"
with open(filepath, "r") as f:
    content = f.read()

# Add ReviewItem to imports
content = content.replace("from models import Product, ProductAttribute", "from models import Product, ProductAttribute, ReviewItem")

# Replace get_data_gaps completely
old_get_data_gaps = '''@router.get("/data-gaps")
async def get_data_gaps(db: Session = Depends(get_db)):
    insights = db.query(ProductInsight).filter(ProductInsight.insight_type == "gap", ProductInsight.status == "OPEN").all()
    return [{
        "product_id": i.product_id,
        "product_name": i.meta_payload.get("product_name"),
        "sku": i.meta_payload.get("sku"),
        "missing_attributes": i.meta_payload.get("missing_attributes", []),
        "severity": i.severity,
        "recommended_action": "Extract missing specifications"
    } for i in insights]'''

new_get_data_gaps = '''@router.get("/data-gaps")
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
    } for i in insights]'''

content = content.replace(old_get_data_gaps, new_get_data_gaps)

# Add review and dismiss endpoints before resolve endpoint
new_endpoints = '''
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
'''

content = content.replace('@router.post("/resolve")', new_endpoints + '\n@router.post("/resolve")')

with open(filepath, "w") as f:
    f.write(content)
print("Patched insights_router.py")
