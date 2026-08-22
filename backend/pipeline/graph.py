import os
import json
from typing import TypedDict, Any
from google import genai
from google.genai import types
from schemas import ProductData
from .extraction import extract_text as do_extract_text
from .validation import validate_specifications
from .embeddings import generate_embeddings, update_index
from .relationships import map_relationships
from .taxonomy import classify_taxonomy
from tenacity import retry, stop_after_attempt, wait_exponential

class GraphState(TypedDict):
    job_id: str
    filepath: str
    text_content: str
    product_data: Any
    embeddings: Any
    validation_results: Any
    relationship_data: Any

def do_extract_text_wrapper(filepath: str):
    data = do_extract_text(filepath)
    return {
        "text_content": data["text"],
        "cached": data["cached"],
        "product_id": data["product_id"],
        "hash": data["hash"],
        "page_count": data["page_count"]
    }


@retry(stop=stop_after_attempt(10), wait=wait_exponential(multiplier=2, min=5, max=65))
def do_llm_extract(text_content: str):
    prompt = f"""
    You are an expert AI extraction agent for technical specification documents.
    Extract the product details from the following document and output exactly matching the provided JSON schema.
    Ensure you include confidence scores, taxonomy classification, compliance, related products, and source traceability.
    
    CRITICAL REQUIREMENT: For EVERY single extracted field (specifications, taxonomy, compliance items, relationships, validations), you MUST provide:
    1. 'source_page': The exact page number (integer) where this information was found. (Look for '--- Page X ---' markers).
    2. 'source_text': The exact snippet of text from the document that proves this value. Do NOT hallucinate this text.
    
    Document Text:
    {text_content}
    """
    
    from google import genai
    from google.genai import types
    import os
    import json
    from schemas import ProductData
    
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ProductData,
            temperature=0.0
        )
    )
    
    content = response.text
    product_data = ProductData.model_validate_json(content)
    return product_data
