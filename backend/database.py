import os
import json
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# SQLite URL format: sqlite:///./sqlite.db
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./specforage.db")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    from models import Base, SystemSetting
    Base.metadata.create_all(bind=engine)
    
    # Seed default settings
    db = SessionLocal()
    default_settings = [
        {"category": "AI", "key": "ai_model", "value": "gemini-3.1-pro", "type": "string", "description": "Gemini model selection"},
        {"category": "AI", "key": "ai_temperature", "value": "0.1", "type": "float", "description": "Temperature"},
        {"category": "AI", "key": "ai_retries", "value": "3", "type": "integer", "description": "Maximum processing retries"},
        {"category": "AI", "key": "ai_confidence_threshold", "value": "0.85", "type": "float", "description": "AI confidence threshold"},
        {"category": "Processing", "key": "parallel_processing", "value": "true", "type": "boolean", "description": "Enable parallel processing"},
        {"category": "Processing", "key": "document_caching", "value": "true", "type": "boolean", "description": "Enable document caching"},
        {"category": "Processing", "key": "max_pdf_size_mb", "value": "50", "type": "integer", "description": "Maximum PDF size (MB)"},
        {"category": "Processing", "key": "processing_timeout_sec", "value": "300", "type": "integer", "description": "Processing timeout"},
        {"category": "Processing", "key": "retry_count", "value": "2", "type": "integer", "description": "Retry count"},
        {"category": "Review", "key": "review_confidence_threshold", "value": "0.85", "type": "float", "description": "Human-review confidence threshold"},
        {"category": "Review", "key": "flag_low_confidence", "value": "true", "type": "boolean", "description": "Automatically flag low-confidence fields"},
        {"category": "Review", "key": "flag_contradictions", "value": "true", "type": "boolean", "description": "Automatically flag contradictions"},
        {"category": "Taxonomy", "key": "etim_enabled", "value": "true", "type": "boolean", "description": "ETIM enabled/disabled"},
        {"category": "Taxonomy", "key": "taxonomy_threshold", "value": "0.80", "type": "float", "description": "Taxonomy matching threshold"},
        {"category": "Compliance", "key": "compliance_checks_enabled", "value": "true", "type": "boolean", "description": "Compliance checks enabled"},
        {"category": "Compliance", "key": "compliance_standards", "value": json.dumps(["RoHS", "REACH", "CE"]), "type": "string", "description": "Compliance standards to check"},
        {"category": "UI", "key": "default_layout", "value": "dashboard", "type": "string", "description": "Product layout selection"},
        {"category": "UI", "key": "show_processing_viz", "value": "true", "type": "boolean", "description": "Processing visualization on/off"},
        {"category": "UI", "key": "realtime_notifications", "value": "true", "type": "boolean", "description": "Real-time notifications on/off"},
    ]
    
    for s in default_settings:
        existing = db.query(SystemSetting).filter_by(key=s["key"]).first()
        if not existing:
            setting = SystemSetting(**s)
            db.add(setting)
    
    db.commit()
    db.close()
