from typing import Tuple

# Simple mapping of common industrial categories to ETIM codes
ETIM_MAPPING = {
    "pump": "EC001330",
    "motor": "EC001851",
    "valve": "EC001085",
    "sensor": "EC001824",
    "transformer": "EC002048",
    "cable": "EC000022",
    "connector": "EC001121"
}

def classify_taxonomy(product_name: str, specifications: list) -> Tuple[str, str, float]:
    """
    Classify a product into a taxonomy category based on its name and specs.
    Returns (category, etim_code, confidence).
    """
    name_lower = product_name.lower()
    
    # Try to find a match in the product name
    for cat, code in ETIM_MAPPING.items():
        if cat in name_lower:
            return (cat.capitalize(), code, 0.9)
            
    # Try to find a match in specifications
    spec_text = " ".join([f"{s.name} {s.value}" for s in specifications]).lower()
    for cat, code in ETIM_MAPPING.items():
        if cat in spec_text:
            return (cat.capitalize(), code, 0.7)
            
    # Default fallback
    return ("Unclassified", "UNKNOWN", 0.0)
