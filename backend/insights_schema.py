from sqlalchemy import Column, Integer, String, Float, JSON, DateTime
from sqlalchemy.sql import func
from database import Base

class ProductInsight(Base):
    __tablename__ = "product_insights"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, index=True)
    insight_type = Column(String, index=True) # gap, duplicate, replacement, compliance, quality, opportunity, taxonomy, risk
    title = Column(String, nullable=True)
    description = Column(String, nullable=True)
    severity = Column(String, index=True) # CRITICAL, HIGH, MEDIUM, LOW
    status = Column(String, default="OPEN", index=True) # OPEN, RESOLVED, DISMISSED
    affected_fields = Column(JSON, default=list)
    evidence = Column(JSON, default=dict)
    recommendation = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    
    # Data Gap specific fields
    missing_fields = Column(JSON, default=list)
    expected_fields = Column(JSON, default=list)
    extracted_fields = Column(JSON, default=list)
    completeness_score = Column(Integer, nullable=True)
    pages_checked = Column(String, nullable=True)
    source_evidence = Column(JSON, default=dict)
    
    # Original fields kept for compatibility
    secondary_product_id = Column(Integer, nullable=True, index=True)
    meta_payload = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class InsightSummaryCache(Base):
    __tablename__ = "insights_summary_cache"
    id = Column(Integer, primary_key=True, index=True)
    cache_key = Column(String, unique=True, index=True)
    payload = Column(JSON, default=dict)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
