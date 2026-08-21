from database import SessionLocal
from models import Product
from insights_engine import InsightsEngine

def main():
    db = SessionLocal()
    engine = InsightsEngine(db)
    
    products = db.query(Product).all()
    print(f"Recalculating insights for {len(products)} products...")
    
    for p in products:
        try:
            engine.recalculate_for_product(p.id)
            print(f"Recalculated for product {p.id}")
        except Exception as e:
            print(f"Error on product {p.id}: {e}")
            
    print("Done!")

if __name__ == "__main__":
    main()
