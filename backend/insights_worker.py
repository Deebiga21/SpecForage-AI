import asyncio
from database import SessionLocal
from insights_engine import InsightsEngine

async def run_insights_job(product_id: int):
    """
    Background worker that recalculates insights for a specific product
    and emits a websocket event.
    """
    db = SessionLocal()
    try:
        engine = InsightsEngine(db)
        engine.recalculate_for_product(product_id)
        
        # Emitting websocket event via main's manager
        # We need to import it here to avoid circular imports if possible
        try:
            from main import manager
            await manager.broadcast_global({
                "type": "INSIGHTS_UPDATED",
                "data": {"product_id": product_id}
            })
        except ImportError:
            pass
            
    except Exception as e:
        print(f"Error in background insights job for product {product_id}: {e}")
    finally:
        db.close()
