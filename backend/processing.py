import asyncio
import os
import fitz  # PyMuPDF
import json
import logging
import traceback
from datetime import datetime, timezone
from database import SessionLocal
from models import (
    ProcessingJob, ProcessingStep, Product, ProductAttribute,
    SourceEvidence, TaxonomyMapping, ComplianceRecord, ProductRelationship,
    ReviewItem, Manufacturer
)
from schemas import ProductData

def get_or_create_manufacturer(db, name: str):
    if not name:
        return None
    manufacturer = db.query(Manufacturer).filter(Manufacturer.name == name).first()
    if not manufacturer:
        manufacturer = Manufacturer(name=name)
        db.add(manufacturer)
        db.commit()
        db.refresh(manufacturer)
    return manufacturer

def update_job_status(job_id: str, status: str, progress: int, result_product_id: int = None, error_message: str = None, steps: list = None):
    # This acts as the hook for main.py to broadcast
    pass

def init_steps(db, job_id):
    step_names = [
        "Upload PDF", "Read Document", "AI Extraction", "Extract Attributes", 
        "Normalize Units", "Map Taxonomy", "Validation", "Compliance Check", 
        "Human Review", "Product Matching", "Source Traceability", "Save to SQLite"
    ]
    steps = []
    for name in step_names:
        step = ProcessingStep(job_id=job_id, step_name=name, status="pending", progress=0)
        db.add(step)
        steps.append(step)
    db.commit()
    for step in steps:
        db.refresh(step)
    return steps

def set_step_status(db, job_id, step_name, status, message=None, items_processed=None, total_items=None, error=None):
    step = db.query(ProcessingStep).filter(ProcessingStep.job_id == job_id, ProcessingStep.step_name == step_name).first()
    if not step:
        return
        
    step.status = status
    if message:
        step.message = message
    if error:
        step.error = error
    if items_processed is not None:
        step.items_processed = items_processed
    if total_items is not None:
        step.total_items = total_items
        
    if status == "processing" and not step.started_at:
        step.started_at = datetime.now(timezone.utc)
    if status in ["completed", "failed", "skipped", "review_required"] and not step.completed_at:
        step.completed_at = datetime.utcnow()
        if step.started_at:
            delta = step.completed_at.replace(tzinfo=None) - step.started_at.replace(tzinfo=None)
            step.duration_ms = int(delta.total_seconds() * 1000)
            
    db.commit()

def calculate_job_progress(db, job_id):
    steps = db.query(ProcessingStep).filter(ProcessingStep.job_id == job_id).all()
    if not steps:
        return 0, []
    completed = sum(1 for s in steps if s.status in ["completed", "skipped", "review_required"])
    progress = int((completed / len(steps)) * 100)
    
    # Format steps for broadcast
    steps_list = []
    for s in steps:
        steps_list.append({
            "id": s.step_name.lower().replace(" ", "_"),
            "name": s.step_name,
            "status": s.status,
            "message": s.message or "",
            "duration_ms": s.duration_ms,
            "items_processed": s.items_processed,
            "total_items": s.total_items
        })
    return progress, steps_list

def broadcast_job(db, job_id, job_status=None, result_product_id=None, error_message=None):
    progress, steps = calculate_job_progress(db, job_id)
    
    job = db.query(ProcessingJob).filter(ProcessingJob.id == job_id).first()
    if not job: return
    
    if job_status: job.status = job_status
    if result_product_id: job.result_product_id = result_product_id
    if error_message: job.error_message = error_message
    job.progress = progress
    
    if job_status == "processing" and not job.started_at:
        job.started_at = datetime.now(timezone.utc)
    if job_status in ["completed", "error", "review_required"] and not job.completed_at:
        job.completed_at = datetime.utcnow()
        if job.started_at:
            delta = job.completed_at.replace(tzinfo=None) - job.started_at.replace(tzinfo=None)
            job.duration_ms = int(delta.total_seconds() * 1000)
            
    db.commit()
    
    update_job_status(job_id, job.status, progress, result_product_id, error_message, steps)

async def process_document_job_async(job_id: str, filepath: str):
    db = SessionLocal()
    try:
        init_steps(db, job_id)
        set_step_status(db, job_id, "Upload PDF", "completed", "Document uploaded successfully")
        broadcast_job(db, job_id, job_status="processing")
        
        # 1. Read Document
        from pipeline.graph import do_extract_text_wrapper, do_llm_extract
        set_step_status(db, job_id, "Read Document", "processing", "Extracting text from PDF...")
        broadcast_job(db, job_id)
        
        text_state = await asyncio.to_thread(do_extract_text_wrapper, filepath)
        text_content = text_state["text_content"]
        
        set_step_status(db, job_id, "Read Document", "completed", f"Extracted {text_state['page_count']} pages")
        broadcast_job(db, job_id)
        
        # 2. AI Extraction
        set_step_status(db, job_id, "AI Extraction", "processing", "Gemini is extracting product attributes...")
        broadcast_job(db, job_id)
        
        product_data = await asyncio.to_thread(do_llm_extract, text_content)
        
        set_step_status(db, job_id, "AI Extraction", "completed", "Extraction successful")
        broadcast_job(db, job_id)
        
        # 3. Extract Attributes
        set_step_status(db, job_id, "Extract Attributes", "processing", "Parsing specification fields...")
        broadcast_job(db, job_id)
        
        spec_count = len(product_data.specifications)
        set_step_status(db, job_id, "Extract Attributes", "completed", f"Parsed {spec_count} attributes", spec_count, spec_count)
        broadcast_job(db, job_id)
        
        # 4-7 Parallel processing
        set_step_status(db, job_id, "Normalize Units", "processing")
        set_step_status(db, job_id, "Map Taxonomy", "processing")
        set_step_status(db, job_id, "Validation", "processing")
        set_step_status(db, job_id, "Compliance Check", "processing")
        broadcast_job(db, job_id)
        
        # Simulate parallel tasks that in a real app would be separate logic blocks
        from processing_logic import normalize_specifications_logic, find_product_matches_logic
        from pipeline.validation import validate_specifications
        from pipeline.taxonomy import classify_taxonomy
        
        # Run independent logic steps concurrently
        norm_task = asyncio.to_thread(normalize_specifications_logic, product_data.specifications)
        tax_task = asyncio.to_thread(classify_taxonomy, product_data.product_name, product_data.specifications)
        val_task = asyncio.to_thread(validate_specifications, product_data.specifications)
        
        norm_results, tax_results, val_results = await asyncio.gather(norm_task, tax_task, val_task)
        
        set_step_status(db, job_id, "Normalize Units", "completed", "Units normalized", len(norm_results), spec_count)
        
        cat, code, conf = tax_results
        if conf > 0:
            product_data.taxonomy.category = cat
            product_data.taxonomy.etim_code = code
            product_data.taxonomy.confidence = conf
        set_step_status(db, job_id, "Map Taxonomy", "completed", f"Classified as {cat}")
        
        product_data.validation = val_results
        failed_count = sum(1 for v in val_results if "Failed" in v.status)
        set_step_status(db, job_id, "Validation", "completed", f"Validation run", len(val_results), len(val_results))
        
        set_step_status(db, job_id, "Compliance Check", "completed", f"Checked {len(product_data.compliance)} standards", len(product_data.compliance), len(product_data.compliance))
        broadcast_job(db, job_id)
        
        # 8. Human Review
        set_step_status(db, job_id, "Human Review", "processing", "Checking confidence scores...")
        broadcast_job(db, job_id)
        
        needs_review = failed_count > 0 or product_data.confidence < 0.85
        if needs_review:
            set_step_status(db, job_id, "Human Review", "review_required", "Flagged for manual review")
        else:
            set_step_status(db, job_id, "Human Review", "skipped", "High confidence, no review required")
        broadcast_job(db, job_id)
        
        # 9. Product Matching
        set_step_status(db, job_id, "Product Matching", "processing", "Searching for similar products...")
        broadcast_job(db, job_id)
        
        from pipeline.embeddings import generate_embeddings, update_index
        from pipeline.relationships import map_relationships
        
        text_to_embed = f"{product_data.product_name} {product_data.sku}"
        emb = await asyncio.to_thread(generate_embeddings, text_to_embed)
        await asyncio.to_thread(update_index, product_data.sku, emb)
        await asyncio.to_thread(map_relationships, product_data)
        
        set_step_status(db, job_id, "Product Matching", "completed", f"Found {len(product_data.relationships.similar)} similar")
        broadcast_job(db, job_id)
        
        # 10. Source Traceability
        set_step_status(db, job_id, "Source Traceability", "processing", "Mapping source evidence...")
        set_step_status(db, job_id, "Source Traceability", "completed", "Mapped source links")
        broadcast_job(db, job_id)
        
        # 11. Save to SQLite
        set_step_status(db, job_id, "Save to SQLite", "processing", "Persisting to database...")
        broadcast_job(db, job_id)
        
        manufacturer = get_or_create_manufacturer(db, product_data.manufacturer_name)
        
        # Check if product exists
        db_product = None
        if product_data.sku:
            db_product = db.query(Product).filter(Product.sku == product_data.sku).first()
            
        if db_product:
            db_product.product_name = product_data.product_name
            db_product.manufacturer_id = manufacturer.id if manufacturer else None
            db_product.category = product_data.taxonomy.category
            db_product.confidence = product_data.confidence
            db_product.validation_status = "failed" if failed_count > 0 else "passed"
            db_product.review_status = "pending" if needs_review else "approved"
            db_product.raw_data = product_data.model_dump()
            
            # Clear old related data
            db.query(ProductAttribute).filter(ProductAttribute.product_id == db_product.id).delete()
            db.query(TaxonomyMapping).filter(TaxonomyMapping.product_id == db_product.id).delete()
            db.query(ComplianceRecord).filter(ComplianceRecord.product_id == db_product.id).delete()
            db.query(ProductRelationship).filter(ProductRelationship.product_id == db_product.id).delete()
            db.query(ReviewItem).filter(ReviewItem.product_id == db_product.id).delete()
        else:
            db_product = Product(
                product_name=product_data.product_name,
                sku=product_data.sku,
                manufacturer_id=manufacturer.id if manufacturer else None,
                category=product_data.taxonomy.category,
                confidence=product_data.confidence,
                validation_status="failed" if failed_count > 0 else "passed",
                review_status="pending" if needs_review else "approved",
                raw_data=product_data.model_dump()
            )
            db.add(db_product)
        
        db.flush() # get ID
        
        # Save Attributes and Source Evidence
        for spec in product_data.specifications:
            attr = ProductAttribute(
                product_id=db_product.id,
                field=spec.name,
                value=spec.value,
                unit=spec.unit,
                confidence=spec.confidence
            )
            db.add(attr)
            db.flush()
            
            if spec.source_text or spec.source_page:
                ev = SourceEvidence(
                    attribute_id=attr.id,
                    product_id=db_product.id,
                    source_page=spec.source_page,
                    source_text=spec.source_text
                )
                db.add(ev)
                
            # Create review item if low confidence
            if spec.confidence < 0.85:
                ri = ReviewItem(
                    product_id=db_product.id,
                    attribute_id=attr.id,
                    field_name=spec.name,
                    original_value=spec.value,
                    confidence=spec.confidence,
                    reason="Low confidence AI extraction"
                )
                db.add(ri)
                
        # Save Taxonomy
        if product_data.taxonomy.category:
            tm = TaxonomyMapping(
                product_id=db_product.id,
                taxonomy_standard="ETIM",
                code=product_data.taxonomy.etim_code,
                description=product_data.taxonomy.category,
                confidence=product_data.taxonomy.confidence
            )
            db.add(tm)
            
        # Save Compliance
        for c in product_data.compliance:
            cr = ComplianceRecord(
                product_id=db_product.id,
                standard=c.name,
                status=c.status,
                confidence=c.confidence
            )
            db.add(cr)
            
        # Save Relationships
        from processing_logic import find_product_matches_logic
        matches = find_product_matches_logic(db, product_data.sku, manufacturer.id if manufacturer else None, product_data.taxonomy.category, product_data.relationships)
        for m in matches:
            pr = ProductRelationship(
                product_id=db_product.id,
                related_product_id=m['matched_id'],
                relationship_type=m.get('type', 'similar'),
                confidence=m['score']
            )
            db.add(pr)
            
        db.commit()
        
        set_step_status(db, job_id, "Save to SQLite", "completed", "Saved successfully")
        
        job_status = "review_required" if needs_review else "completed"
        broadcast_job(db, job_id, job_status=job_status, result_product_id=db_product.id)
        
    except Exception as e:
        db.rollback()
        current_step = db.query(ProcessingStep).filter(ProcessingStep.job_id == job_id, ProcessingStep.status == "processing").first()
        if current_step:
            set_step_status(db, job_id, current_step.step_name, "failed", "Pipeline failed", error=str(e))
        else:
            set_step_status(db, job_id, "Save to SQLite", "failed", "Pipeline failed", error=str(e))
        broadcast_job(db, job_id, job_status="error", error_message=str(e))
        print(traceback.format_exc())
    finally:
        db.close()

def process_document_job(job_id: str, filepath: str):
    asyncio.run(process_document_job_async(job_id, filepath))
