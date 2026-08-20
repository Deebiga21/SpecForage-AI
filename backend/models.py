from sqlalchemy import Column, Integer, String, Float, JSON, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Manufacturer(Base):
    __tablename__ = "manufacturers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String, index=True)
    sku = Column(String, index=True, unique=True, nullable=True)
    manufacturer_id = Column(Integer, ForeignKey("manufacturers.id"), nullable=True)
    category = Column(String, index=True, nullable=True)
    confidence = Column(Float, nullable=True, default=0.0)
    validation_status = Column(String, default="pending") # passed, warning, failed
    compliance_status = Column(String, default="pending")
    review_status = Column(String, default="pending") # pending, approved, rejected, edited

    # Will still keep the raw extracted JSON for fallback/completeness but primarily use related tables
    raw_data = Column(JSON, default=dict)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ProductAttribute(Base):
    __tablename__ = "product_attributes"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), index=True)
    field = Column(String, index=True)
    value = Column(String)
    unit = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    validation_status = Column(String, default="pending") # passed, warning, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SourceEvidence(Base):
    __tablename__ = "source_evidence"
    id = Column(Integer, primary_key=True, index=True)
    attribute_id = Column(Integer, ForeignKey("product_attributes.id"), index=True)
    product_id = Column(Integer, ForeignKey("products.id"), index=True)
    source_page = Column(Integer)
    source_text = Column(String)
    source_region = Column(JSON, nullable=True) # x, y, width, height if applicable
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ProcessingJob(Base):
    __tablename__ = "processing_jobs"
    id = Column(String, primary_key=True, index=True)
    filename = Column(String)
    status = Column(String) # pending, processing, completed, error, cancelled, review_required
    progress = Column(Integer, default=0)
    result_product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    error_message = Column(String, nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    duration_ms = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ProcessingStep(Base):
    __tablename__ = "processing_steps"
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String, ForeignKey("processing_jobs.id"), index=True)
    step_name = Column(String, index=True)
    status = Column(String) # pending, processing, completed, failed, skipped
    progress = Column(Integer, default=0)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    duration_ms = Column(Integer, default=0)
    message = Column(String, nullable=True)
    error = Column(String, nullable=True)
    items_processed = Column(Integer, default=0)
    total_items = Column(Integer, default=0)

class TaxonomyMapping(Base):
    __tablename__ = "taxonomy_mappings"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), index=True)
    taxonomy_standard = Column(String) # e.g., ETIM
    code = Column(String)
    description = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ComplianceRecord(Base):
    __tablename__ = "compliance_records"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), index=True)
    standard = Column(String) # RoHS, REACH, CE, etc.
    status = Column(String) # compliant, non-compliant, unknown
    evidence = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)

class ProductRelationship(Base):
    __tablename__ = "product_relationships"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), index=True)
    related_product_id = Column(Integer, ForeignKey("products.id"), index=True)
    relationship_type = Column(String) # similar, duplicate, compatible, replacement
    confidence = Column(Float, nullable=True)
    reason = Column(String, nullable=True)

class ReviewItem(Base):
    __tablename__ = "review_items"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), index=True)
    attribute_id = Column(Integer, ForeignKey("product_attributes.id"), nullable=True)
    field_name = Column(String, nullable=True)
    original_value = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    reason = Column(String) # e.g., "Low confidence", "Validation failed"
    status = Column(String, default="pending") # pending, resolved
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ReviewAction(Base):
    __tablename__ = "review_actions"
    id = Column(Integer, primary_key=True, index=True)
    review_item_id = Column(Integer, ForeignKey("review_items.id"), index=True)
    action = Column(String) # approve, edit, reject, reprocess
    old_value = Column(String, nullable=True)
    new_value = Column(String, nullable=True)
    comments = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SystemSetting(Base):
    __tablename__ = "system_settings"
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, index=True) # AI, Processing, Review, Taxonomy, Compliance, UI
    key = Column(String, unique=True, index=True)
    value = Column(String) # Store as JSON string or plain string
    type = Column(String) # boolean, integer, float, string
    description = Column(String, nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ChatHistory(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True, index=True)
    role = Column(String) # user or model
    content = Column(String)
    product_context_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
