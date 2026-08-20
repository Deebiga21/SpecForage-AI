from pydantic import BaseModel, Field
from typing import List, Optional, Any

class Specification(BaseModel):
    name: str
    value: str
    unit: str | None = None
    confidence: float
    source_page: int | None = None
    source_text: str | None = None

class Taxonomy(BaseModel):
    category: str
    etim_code: str
    confidence: float
    source_page: int | None = None
    source_text: str | None = None

class ComplianceItem(BaseModel):
    name: str
    status: str
    confidence: float = 1.0
    source_page: int | None = None
    source_text: str | None = None

class RelationshipItem(BaseModel):
    name: str
    confidence: float
    reason: str | None = None
    source_page: int | None = None
    source_text: str | None = None

class Relationships(BaseModel):
    similar: List[RelationshipItem] = []
    potential_dup: List[RelationshipItem] = []
    compatible: List[RelationshipItem] = []

class SourceTraceability(BaseModel):
    field: str
    page: int
    context: str

class ValidationItem(BaseModel):
    check: str
    status: str
    source_page: int | None = None
    source_text: str | None = None

class ProductData(BaseModel):
    product_name: str
    manufacturer_name: str = ""
    sku: str | None = None
    category: str | None = None
    confidence: float = 1.0
    specifications: List[Specification] = []
    taxonomy: Taxonomy
    compliance: List[ComplianceItem] = []
    relationships: Relationships
    source_traceability: List[SourceTraceability] = []
    validation: List[ValidationItem] = []

class ReviewInput(BaseModel):
    decision: str  # approve, reject, or edit
    comments: str | None = None
    new_value: str | None = None

class ChatMessage(BaseModel):
    role: str
    content: str
    product_context_id: int | None = None

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
