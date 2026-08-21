import json
from database import SessionLocal
from models import Product
from insights_schema import ProductInsight

def main():
    db = SessionLocal()
    
    # Create a dummy product just in case
    prod = Product(product_name="Dummy Pump", sku="DUM-123", category="mechanical")
    db.add(prod)
    db.commit()
    
    gap = ProductInsight(
        product_id=prod.id,
        insight_type="gap",
        title="Data Gap Detected",
        description="Missing 3 critical fields out of 5 expected.",
        severity="CRITICAL",
        missing_fields=["Operating Temperature", "Breaking Capacity", "Weight"],
        expected_fields=["Operating Temperature", "Breaking Capacity", "Weight", "Voltage", "Power"],
        extracted_fields=["Voltage", "Power"],
        completeness_score=40,
        recommendation="Obtain the missing specifications from the manufacturer datasheet.",
        pages_checked="1-12",
        status="OPEN"
    )
    
    duplicate = ProductInsight(
        product_id=prod.id,
        insight_type="duplicate",
        title="Duplicate Found",
        description="Possible duplicate entry detected.",
        severity="HIGH",
        confidence=0.95,
        meta_payload={"product_a": "DUM-123", "product_b": "DUM-123-B", "similarity": 0.95},
        status="OPEN"
    )
    
    db.add(gap)
    db.add(duplicate)
    db.commit()
    print("Injected dummy insights!")

if __name__ == "__main__":
    main()
