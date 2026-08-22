import os
import mimetypes
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('image/svg+xml', '.svg')

from dotenv import load_dotenv
load_dotenv()
import uuid
import shutil
import asyncio
from fastapi import FastAPI, File, UploadFile, Depends, BackgroundTasks, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import desc

from database import engine, Base, get_db, SessionLocal
from models import (
    Product, ProcessingJob, ProcessingStep, ProductAttribute, SourceEvidence, 
    TaxonomyMapping, ComplianceRecord, ProductRelationship, ReviewItem, ReviewAction, 
    SystemSetting, ChatHistory, Manufacturer
)
from schemas import ProductData, ReviewInput, ChatRequest, ChatMessage
from processing import process_document_job

# WebSocket Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}
        self.global_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket, job_id: str = None):
        await websocket.accept()
        if job_id:
            if job_id not in self.active_connections:
                self.active_connections[job_id] = []
            self.active_connections[job_id].append(websocket)
        else:
            self.global_connections.append(websocket)

    def disconnect(self, websocket: WebSocket, job_id: str = None):
        if job_id and job_id in self.active_connections:
            self.active_connections[job_id].remove(websocket)
            if not self.active_connections[job_id]:
                del self.active_connections[job_id]
        elif websocket in self.global_connections:
            self.global_connections.remove(websocket)

    async def broadcast_to_job(self, job_id: str, message: dict):
        if job_id in self.active_connections:
            for connection in self.active_connections[job_id]:
                try:
                    await connection.send_json(message)
                except:
                    pass
                    
    async def broadcast_global(self, message: dict):
        for connection in self.global_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()

# Hook for processing.py
import processing
import insights_schema
from insights_worker import run_insights_job

def broadcast_job_status(job_id, status, progress, result_product_id, error_message, steps):
    state = {
        "job_id": job_id,
        "status": status,
        "progress": progress,
        "steps": steps,
        "result_product_id": result_product_id,
        "error_message": error_message
    }
    asyncio.create_task(manager.broadcast_to_job(job_id, state))
    
    # Broadcast globally for dashboard
    asyncio.create_task(manager.broadcast_global({
        "type": "job_update",
        "data": state
    }))
    
    if status == "completed" and result_product_id:
        asyncio.create_task(run_insights_job(result_product_id))

processing.update_job_status = broadcast_job_status

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SpecForage AI Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

from insights_router import router as insights_router
app.include_router(insights_router)

# ----------------- UPLOAD & JOBS -----------------

from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/login")
async def login(req: LoginRequest):
    # Dummy authentication for now
    if req.email and req.password:
        return {"status": "success", "token": "dummy-jwt-token"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/upload")
async def upload_file(background_tasks: BackgroundTasks, file: UploadFile = File(...), db: Session = Depends(get_db)):
    job_id = str(uuid.uuid4())
    filepath = os.path.join(UPLOAD_DIR, f"{job_id}_{file.filename}")
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    new_job = ProcessingJob(id=job_id, filename=file.filename, status="pending", progress=0)
    db.add(new_job)
    db.commit()
    
    background_tasks.add_task(process_document_job, job_id, filepath)
    
    asyncio.create_task(manager.broadcast_global({
        "type": "new_job",
        "data": {"job_id": job_id, "filename": file.filename, "status": "pending"}
    }))
    
    return {"job_id": job_id, "status": "pending"}

@app.get("/api/jobs/{job_id}")
async def get_job_status(job_id: str, db: Session = Depends(get_db)):
    job = db.query(ProcessingJob).filter(ProcessingJob.id == job_id).first()
    if not job: raise HTTPException(status_code=404, detail="Job not found")
    
    steps = db.query(ProcessingStep).filter(ProcessingStep.job_id == job_id).all()
    steps_list = [{
        "id": s.step_name.lower().replace(" ", "_"),
        "name": s.step_name,
        "status": s.status,
        "message": s.message or "",
        "duration_ms": s.duration_ms,
        "items_processed": s.items_processed,
        "total_items": s.total_items
    } for s in steps]
    
    return {
        "job_id": job.id,
        "filename": job.filename,
        "status": job.status,
        "progress": job.progress,
        "result_product_id": job.result_product_id,
        "error_message": job.error_message,
        "steps": steps_list,
        "started_at": job.started_at,
        "completed_at": job.completed_at
    }

@app.get("/api/jobs/{job_id}/steps")
async def get_job_steps(job_id: str, db: Session = Depends(get_db)):
    steps = db.query(ProcessingStep).filter(ProcessingStep.job_id == job_id).all()
    return steps

@app.websocket("/api/ws/global")
async def global_websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.websocket("/api/status/{job_id}/ws")
async def websocket_endpoint(websocket: WebSocket, job_id: str):
    await manager.connect(websocket, job_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, job_id)

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    total_products = db.query(Product).count()
    total_jobs = db.query(ProcessingJob).count()
    completed_jobs = db.query(ProcessingJob).filter(ProcessingJob.status.in_(["completed", "review_required"])).count()
    failed_jobs = db.query(ProcessingJob).filter(ProcessingJob.status == "error").count()
    active_jobs = db.query(ProcessingJob).filter(ProcessingJob.status.in_(["pending", "processing"])).count()
    
    recent_jobs = db.query(ProcessingJob).order_by(ProcessingJob.created_at.desc()).limit(5).all()
    
    return {
        "total_products": total_products,
        "total_jobs": total_jobs,
        "completed_jobs": completed_jobs,
        "failed_jobs": failed_jobs,
        "active_jobs": active_jobs,
        "recent_jobs": recent_jobs
    }

# ----------------- PRODUCTS -----------------

@app.get("/api/products")
async def get_products(
    q: str = "", category: str = "", sku: str = "", manufacturer: str = "",
    status: str = "", min_confidence: float = 0, sort: str = "newest",
    db: Session = Depends(get_db)
):
    query = db.query(Product)
    
    if q: query = query.filter(Product.product_name.ilike(f"%{q}%"))
    if sku: query = query.filter(Product.sku.ilike(f"%{sku}%"))
    if category: query = query.filter(Product.category.ilike(f"%{category}%"))
    if status: query = query.filter(Product.review_status == status)
    if min_confidence > 0: query = query.filter(Product.confidence >= min_confidence)
    if manufacturer:
        m = db.query(Manufacturer).filter(Manufacturer.name.ilike(f"%{manufacturer}%")).first()
        if m:
            query = query.filter(Product.manufacturer_id == m.id)
        else:
            return []
            
    if sort == "newest": query = query.order_by(desc(Product.created_at))
    elif sort == "oldest": query = query.order_by(Product.created_at)
    elif sort == "confidence": query = query.order_by(desc(Product.confidence))
            
    return query.all()

@app.get("/api/products/{id}")
async def get_product(id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == id).first()
    if not product: raise HTTPException(status_code=404, detail="Product not found")
    
    m = db.query(Manufacturer).filter(Manufacturer.id == product.manufacturer_id).first()
    manufacturer_name = m.name if m else ""
    
    p_dict = product.__dict__.copy()
    p_dict['manufacturer_name'] = manufacturer_name
    return p_dict

@app.get("/api/products/{id}/specifications")
async def get_product_specs(id: int, db: Session = Depends(get_db)):
    return db.query(ProductAttribute).filter(ProductAttribute.product_id == id).all()

@app.get("/api/products/{id}/sources")
async def get_product_sources(id: int, db: Session = Depends(get_db)):
    return db.query(SourceEvidence).filter(SourceEvidence.product_id == id).all()

@app.get("/api/products/{id}/compliance")
async def get_product_compliance(id: int, db: Session = Depends(get_db)):
    return db.query(ComplianceRecord).filter(ComplianceRecord.product_id == id).all()

@app.get("/api/products/{id}/relationships")
async def get_product_relationships(id: int, db: Session = Depends(get_db)):
    rels = db.query(ProductRelationship).filter(ProductRelationship.product_id == id).all()
    results = []
    for r in rels:
        rp = db.query(Product).filter(Product.id == r.related_product_id).first()
        if rp:
            results.append({
                "id": r.id,
                "type": r.relationship_type,
                "confidence": r.confidence,
                "related_product": {
                    "id": rp.id,
                    "name": rp.product_name,
                    "sku": rp.sku
                }
            })
    return results

@app.get("/api/knowledge-graph")
async def get_knowledge_graph(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    rels = db.query(ProductRelationship).all()
    
    nodes = []
    edges = []
    
    for p in products:
        nodes.append({"id": f"p_{p.id}", "label": p.product_name or p.sku or f"Prod {p.id}", "type": "product"})
        
    for r in rels:
        edges.append({
            "source": f"p_{r.product_id}", 
            "target": f"p_{r.related_product_id}", 
            "type": r.relationship_type
        })
            
    return {"nodes": nodes, "edges": edges}

# ----------------- REVIEWS -----------------

@app.get("/api/reviews")
async def get_reviews(db: Session = Depends(get_db)):
    items = db.query(ReviewItem).filter(ReviewItem.status == "pending").all()
    results = []
    for i in items:
        p = db.query(Product).filter(Product.id == i.product_id).first()
        ev = db.query(SourceEvidence).filter(SourceEvidence.attribute_id == i.attribute_id).first() if i.attribute_id else None
        
        results.append({
            "id": i.id,
            "product_id": i.product_id,
            "product_name": p.product_name if p else "Unknown",
            "attribute_id": i.attribute_id,
            "field_name": i.field_name,
            "original_value": i.original_value,
            "confidence": i.confidence,
            "reason": i.reason,
            "source_evidence": {
                "page": ev.source_page if ev else None,
                "text": ev.source_text if ev else None
            } if ev else None
        })
    return results

@app.post("/api/reviews/{id}/{action}")
async def post_review_action(id: int, action: str, body: ReviewInput, db: Session = Depends(get_db)):
    if action not in ["approve", "edit", "reject", "reprocess"]:
        raise HTTPException(400, "Invalid action")
        
    item = db.query(ReviewItem).filter(ReviewItem.id == id).first()
    if not item: raise HTTPException(404, "Review item not found")
    
    # Save Action
    ra = ReviewAction(
        review_item_id=item.id,
        action=action,
        old_value=item.original_value,
        new_value=body.new_value if action == "edit" else None,
        comments=body.comments
    )
    db.add(ra)
    
    item.status = "resolved"
    
    # If edited, update the attribute
    if action == "edit" and item.attribute_id and body.new_value:
        attr = db.query(ProductAttribute).filter(ProductAttribute.id == item.attribute_id).first()
        if attr:
            attr.value = body.new_value
            attr.confidence = 1.0 # Reviewed by human
    
    # Update product review status if no more pending reviews
    pending_count = db.query(ReviewItem).filter(ReviewItem.product_id == item.product_id, ReviewItem.status == "pending", ReviewItem.id != id).count()
    if pending_count == 0:
        p = db.query(Product).filter(Product.id == item.product_id).first()
        if p: p.review_status = "approved"
            
    db.commit()
    
    # Notify dashboard
    asyncio.create_task(manager.broadcast_global({
        "type": "review_completed",
        "data": {"product_id": item.product_id}
    }))
    
    return {"status": "success"}

# ----------------- SETTINGS -----------------

@app.get("/api/settings")
async def get_settings(db: Session = Depends(get_db)):
    settings = db.query(SystemSetting).all()
    grouped = {}
    for s in settings:
        if s.category not in grouped: grouped[s.category] = []
        val = s.value
        if s.type == "boolean": val = val.lower() == "true"
        elif s.type == "integer": val = int(val)
        elif s.type == "float": val = float(val)
        
        grouped[s.category].append({
            "key": s.key, "value": val, "type": s.type, "description": s.description
        })
    return grouped

@app.put("/api/settings")
async def update_settings(updates: dict, db: Session = Depends(get_db)):
    for key, val in updates.items():
        s = db.query(SystemSetting).filter(SystemSetting.key == key).first()
        if s:
            s.value = str(val)
    db.commit()
    return {"status": "success"}

# ----------------- CHAT -----------------

@app.get("/api/chat/history")
async def get_chat_history(db: Session = Depends(get_db)):
    history = db.query(ChatHistory).order_by(ChatHistory.timestamp).all()
    return history

@app.post("/api/chat")
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        import httpx
        
        user_msg = request.messages[-1].content
        
        # Save user msg
        db.add(ChatHistory(role="user", content=user_msg))
        db.commit()
        
        # Construct DB Context String using basic RAG (filter by mentioning)
        products = db.query(Product).all()
        relevant_products = []
        for p in products:
            if p.sku.lower() in user_msg.lower() or p.product_name.lower() in user_msg.lower() or p.category.lower() in user_msg.lower():
                relevant_products.append(p)
                
        # If no specific match, just use the first few as an example or leave empty
        if not relevant_products:
            # Maybe just provide a summary of available categories
            categories = list(set([p.category for p in products]))
            db_context = f"No specific product mentioned. Available categories: {', '.join(categories)}\n"
            db_context += "CATALOG ITEMS (Basic):\n"
            for p in products[:10]: # limit to 10 to avoid huge context
                db_context += f"- {p.product_name} (SKU: {p.sku})\n"
        else:
            db_context = "DATABASE CONTENT FOR RELEVANT PRODUCTS:\n"
            for p in relevant_products:
                attrs = db.query(ProductAttribute).filter(ProductAttribute.product_id == p.id).all()
                attr_str = ", ".join([f"{a.field}: {a.value} {a.unit or ''}" for a in attrs])
                db_context += f"Product: {p.product_name} (SKU: {p.sku}), Category: {p.category}, Confidence: {p.confidence}%\n  Attributes: {attr_str}\n\n"
                
        system_instruction = f"You are SPECForge AI Assistant, interacting with a product spec database. Answer truthfully based on this data. You are also an expert in general industry knowledge. When explaining data processes, relationships, or complex topics, ALWAYS provide a Mermaid.js flowchart (using ```mermaid ... ``` block) to visually represent the flow map of the processed data or concepts.\n\n{db_context}"
        
        # Import genai
        from google import genai
        import os
        
        # Build prompt from messages
        prompt = system_instruction + "\n\n"
        for msg in request.messages[-5:]:
            role_str = "User: " if msg.role == "user" else "Assistant: "
            prompt += role_str + msg.content + "\n\n"
            
        client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        
        # Use gemini-3.6-flash which is standard and fast
        genai_response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=prompt
        )
        
        ai_response = genai_response.text
        
        # Save model msg
        db.add(ChatHistory(role="model", content=ai_response))
        db.commit()
        
        return {"response": ai_response}
    except Exception as e:
        import traceback
        traceback.print_exc()
        error_msg = str(e)
        if "RESOURCE_EXHAUSTED" in error_msg:
            return {"response": "Error: Gemini API rate limit exceeded. Please wait a moment and try again."}
        return {"response": f"Error communicating with AI model: {error_msg}"}

@app.get("/api/system/health")
async def get_health():
    return {"status": "ok"}

frontend_dist_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist_path, "assets")), name="frontend_assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        if "." in os.path.basename(full_path):
            file_path = os.path.join(frontend_dist_path, full_path)
            if os.path.exists(file_path):
                return FileResponse(file_path)
            raise HTTPException(status_code=404, detail="File not found")
            
        index_path = os.path.join(frontend_dist_path, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        raise HTTPException(status_code=404, detail="Frontend build not found")
