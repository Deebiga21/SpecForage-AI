import re

def normalize_specifications_logic(specs):
    results = []
    for s in specs:
        val = 0.0
        unit = s.unit or ""
        val_str = str(s.value) if s.value else ""
        match = re.search(r"([-+]?\d*\.?\d+|\d+)", val_str)
        if match:
            try:
                val = float(match.group(1))
            except ValueError:
                val = 0.0
            if not unit:
                remainder = val_str[match.end():].strip()
                unit_match = re.search(r"^([a-zA-Z%]+(?:\/[a-zA-Z]+)?)", remainder)
                if unit_match:
                    unit = unit_match.group(1)
        results.append({"property": s.name, "value": val, "unit": unit})
    return results

def find_product_matches_logic(db, sku, manufacturer_id, category, relationships):
    from models import Product
    if not manufacturer_id:
        return []
        
    candidates = db.query(Product).filter(
        Product.manufacturer_id == manufacturer_id,
        Product.sku != sku
    ).all()
    
    matches = []
    all_rels = []
    for r in relationships.similar: all_rels.append((r, 'similar'))
    for r in relationships.potential_dup: all_rels.append((r, 'duplicate'))
    for r in relationships.compatible: all_rels.append((r, 'compatible'))
    
    for rel, rel_type in all_rels:
        for other_product in candidates:
            if rel.name.lower() in other_product.product_name.lower() or (other_product.sku and rel.name.lower() in other_product.sku.lower()):
                matches.append({"matched_id": other_product.id, "score": rel.confidence, "type": rel_type})
                break
    return matches
