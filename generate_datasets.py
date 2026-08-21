import os
import csv
import json
import random
from datetime import datetime, timedelta

output_dir = os.path.join("d:\\SpecForage AI", "datasets")
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# --- Define Base Products ---
base_products = [
    {"id": "PROD-001", "cat": "Circuit Breakers", "name": "Molded Case Circuit Breaker 250A", "sku": "MCCB-250-3P", "mfg": "Siemens", "type": "complete"},
    {"id": "PROD-002", "cat": "Circuit Breakers", "name": "Miniature Circuit Breaker 16A", "sku": "MCB-16-1P", "mfg": "Schneider Electric", "type": "conflict"},
    {"id": "PROD-003", "cat": "Circuit Breakers", "name": "Air Circuit Breaker 1000A", "sku": "ACB-1000-4P", "mfg": "ABB", "type": "missing"},
    {"id": "PROD-004", "cat": "Terminal Blocks", "name": "Spring-Cage Terminal Block 2.5mm", "sku": "TB-SC-2.5", "mfg": "Phoenix Contact", "type": "complete"},
    {"id": "PROD-005", "cat": "Terminal Blocks", "name": "Push-in Terminal Block 4mm", "sku": "TB-PI-4.0", "mfg": "WAGO", "type": "complete"},
    {"id": "PROD-006", "cat": "Terminal Blocks", "name": "Screw Terminal Block 6mm", "sku": "TB-SCW-6.0", "mfg": "Weidmuller", "type": "missing"},
    {"id": "PROD-007", "cat": "Pressure Sensors", "name": "Industrial Pressure Transmitter 100bar", "sku": "PT-100B-420", "mfg": "WIKA", "type": "complete"},
    {"id": "PROD-008", "cat": "Pressure Sensors", "name": "Digital Pressure Switch 10bar", "sku": "PS-10B-DIG", "mfg": "SMC", "type": "conflict"},
    {"id": "PROD-009", "cat": "Pressure Sensors", "name": "Differential Pressure Transmitter", "sku": "DPT-500", "mfg": "Endress+Hauser", "type": "complete"},
    {"id": "PROD-010", "cat": "Temperature Sensors", "name": "PT100 RTD Sensor", "sku": "RTD-PT100-3W", "mfg": "Omega Engineering", "type": "complete"},
    {"id": "PROD-011", "cat": "Temperature Sensors", "name": "Thermocouple Type K", "sku": "TC-K-PROBE", "mfg": "Fluke", "type": "missing"},
    {"id": "PROD-012", "cat": "Temperature Sensors", "name": "Infrared Temperature Sensor", "sku": "IR-TS-420", "mfg": "Micro-Epsilon", "type": "complete"},
    {"id": "PROD-013", "cat": "Industrial Connectors", "name": "Heavy Duty Connector 16P", "sku": "HDC-16-PIN", "mfg": "Harting", "type": "complete"},
    {"id": "PROD-014", "cat": "Industrial Connectors", "name": "M12 Circular Connector 5P", "sku": "M12-5P-FEM", "mfg": "Binder", "type": "conflict"},
    {"id": "PROD-015", "cat": "Industrial Connectors", "name": "RJ45 Industrial Ethernet Plug", "sku": "RJ45-IND-IP67", "mfg": "Telegartner", "type": "incomplete_compliance"},
    {"id": "PROD-016", "cat": "Switches", "name": "Limit Switch Roller Lever", "sku": "LS-RL-IP67", "mfg": "Omron", "type": "complete"},
    {"id": "PROD-017", "cat": "Switches", "name": "Safety Interlock Switch", "sku": "SIS-2NC-1NO", "mfg": "Pilz", "type": "duplicate_a"},
    {"id": "PROD-018", "cat": "Switches", "name": "Safety Interlock Switch Guard", "sku": "SIS-2NC-1NO-G", "mfg": "Pilz", "type": "duplicate_b"},
    {"id": "PROD-019", "cat": "Relays", "name": "General Purpose Relay 24VDC", "sku": "GPR-24DC-DPDT", "mfg": "Finder", "type": "complete"},
    {"id": "PROD-020", "cat": "Relays", "name": "Solid State Relay 40A", "sku": "SSR-40A-Z", "mfg": "Crydom", "type": "missing"},
    {"id": "PROD-021", "cat": "Relays", "name": "Safety Relay Dual Channel", "sku": "SR-2CH-24V", "mfg": "Sick", "type": "complete"},
    {"id": "PROD-022", "cat": "Contactors", "name": "3-Pole Contactor 9A", "sku": "CON-3P-9A", "mfg": "Eaton", "type": "complete"},
    {"id": "PROD-023", "cat": "Contactors", "name": "4-Pole Contactor 25A", "sku": "CON-4P-25A", "mfg": "Schneider Electric", "type": "incomplete_compliance"},
    {"id": "PROD-024", "cat": "Contactors", "name": "Capacitor Switching Contactor", "sku": "CAP-CON-50KVAR", "mfg": "ABB", "type": "complete"},
    {"id": "PROD-025", "cat": "Industrial Controllers", "name": "Micro PLC 14 I/O", "sku": "PLC-M-14IO", "mfg": "Siemens", "type": "complete"},
    {"id": "PROD-026", "cat": "Industrial Controllers", "name": "PID Temperature Controller", "sku": "PID-TC-4848", "mfg": "Omron", "type": "missing"},
    {"id": "PROD-027", "cat": "Industrial Controllers", "name": "Motion Controller 4-Axis", "sku": "MC-4AX-ENET", "mfg": "Beckhoff", "type": "complete"},
    {"id": "PROD-028", "cat": "Power Supplies", "name": "DIN Rail Power Supply 24V 10A", "sku": "PS-DIN-24V10A", "mfg": "Mean Well", "type": "duplicate_a2"},
    {"id": "PROD-029", "cat": "Power Supplies", "name": "DIN Rail PS 24V 10A", "sku": "PS-DIN-24V10A-B", "mfg": "Mean Well", "type": "duplicate_b2"},
    {"id": "PROD-030", "cat": "Power Supplies", "name": "Switching Power Supply 12V 5A", "sku": "SPS-12V5A", "mfg": "Delta Electronics", "type": "complete"},
]

def write_csv(filename, fieldnames, data):
    with open(os.path.join(output_dir, filename), 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in data:
            writer.writerow({k: v for k, v in row.items() if k in fieldnames})

print("Generating Data...")
# Generate files
products_data = []
datasheets_data = []
extracted_attrs = []
expected_attrs = []
compliance_data = []
taxonomy_data = []
relationships = []
source_evidence = []
conflicts = []
insights = []
human_review = []
processing_logs = []
product_intelligence = {}

# Standard expected attributes
expected_map = {
    "Circuit Breakers": ["Rated Voltage", "Rated Current", "Number of Poles", "Breaking Capacity"],
    "Terminal Blocks": ["Rated Voltage", "Rated Current", "Cross Section", "Mounting Type"],
    "Pressure Sensors": ["Pressure Range", "Output Type", "Accuracy", "Process Connection"],
    "Temperature Sensors": ["Temperature Range", "Sensor Type", "Accuracy", "Connection"],
    "Industrial Connectors": ["Rated Voltage", "Rated Current", "IP Rating", "Number of Pins"],
    "Switches": ["Contact Configuration", "Rated Voltage", "Rated Current", "IP Rating"],
    "Relays": ["Coil Voltage", "Contact Rating", "Contact Configuration", "Mounting Type"],
    "Contactors": ["Coil Voltage", "Rated Current", "Number of Poles", "Auxiliary Contacts"],
    "Industrial Controllers": ["Supply Voltage", "Number of Inputs", "Number of Outputs", "Communication Protocol"],
    "Power Supplies": ["Input Voltage", "Output Voltage", "Output Current", "Power Rating"]
}

for cat, attrs in expected_map.items():
    for a in attrs:
        expected_attrs.append({
            "category": cat, "attribute_name": a, "unit": "Various", 
            "required": "Yes", "description": f"Essential specification: {a}"
        })

import uuid
now = datetime.utcnow()

for p in base_products:
    pid = p["id"]
    ptype = p["type"]
    cat = p["cat"]
    
    # 1. Products
    products_data.append({
        "product_id": pid, "product_name": p["name"], "sku": p["sku"], "manufacturer": p["mfg"],
        "category": cat, "subcategory": "Industrial", "description": f"{p['name']} by {p['mfg']}",
        "model_number": f"MOD-{p['sku']}", "country_of_origin": "Germany", "product_status": "Active",
        "datasheet_filename": f"{p['sku']}_datasheet.pdf"
    })
    
    # 2. Datasheets
    doc_id = f"DOC-{pid}"
    datasheets_data.append({
        "document_id": doc_id, "product_id": pid, "filename": f"{p['sku']}_datasheet.pdf",
        "document_type": "PDF Datasheet", "page_count": random.randint(2, 12),
        "file_size_kb": random.randint(500, 5000), "language": "English", "upload_date": now.isoformat(),
        "text_blocks_detected": random.randint(50, 200), "tables_detected": random.randint(1, 5),
        "images_detected": random.randint(1, 10), "ocr_required": "False", "document_quality": "High",
        "processing_status": "Completed", "extraction_confidence": round(random.uniform(90.0, 99.9), 1)
    })
    
    # 3. Attributes & 8. Source Traceability & 9. Conflicts
    cat_attrs = expected_map.get(cat, [])
    extracted = []
    
    for a in cat_attrs:
        val = f"{random.randint(10, 500)}"
        unit = "V" if "Voltage" in a else "A" if "Current" in a else "Unit"
        
        # Missing data logic
        if ptype == "missing" and random.random() < 0.5:
            continue
            
        page = random.randint(1, 4)
        conf = random.randint(80, 100)
        
        extracted_attrs.append({
            "product_id": pid, "attribute_name": a, "original_value": f"{val} {unit} Max",
            "normalized_value": val, "unit": unit, "confidence": conf, "source_page": page,
            "source_text": f"The maximum {a.lower()} is rated at {val} {unit}.", "extraction_status": "Verified"
        })
        
        source_evidence.append({
            "product_id": pid, "attribute_name": a, "value": val, "document_id": doc_id,
            "page_number": page, "section": "Technical Data", 
            "source_text": f"The maximum {a.lower()} is rated at {val} {unit}.",
            "evidence_type": "Text", "confidence": conf, "verification_status": "Passed"
        })
        
        # Conflict logic
        if ptype == "conflict" and a == cat_attrs[0]:
            val2 = f"{int(val)+100}"
            conflicts.append({
                "conflict_id": f"CONF-{pid}", "product_id": pid, "attribute_name": a,
                "value_1": val, "source_page_1": page, "value_2": val2, "source_page_2": page+1,
                "conflict_type": "Value Mismatch", "severity": "High", "resolution_status": "Open",
                "recommended_action": "Manual Review Required"
            })
            human_review.append({
                "review_id": f"REV-{pid}-1", "product_id": pid, "field_name": a, "issue_type": "Conflict",
                "current_value": val, "reason": "Values conflict across pages", "priority": "High",
                "review_status": "Pending", "reviewer_comment": "", "recommended_action": "Verify with manufacturer"
            })
            
    # 5. Compliance
    standards = ["CE", "RoHS", "UL", "IEC 60947"]
    for s in standards:
        status = "Certified"
        if ptype == "incomplete_compliance" and s in ["UL", "IEC 60947"]:
            status = "Missing"
        
        compliance_data.append({
            "product_id": pid, "standard": s, "standard_version": "Latest", "status": status,
            "evidence_found": "Yes" if status == "Certified" else "No",
            "evidence_text": f"Complies with {s}" if status == "Certified" else "",
            "source_page": random.randint(5, 8) if status == "Certified" else "",
            "confidence": 99 if status == "Certified" else 0,
            "verification_status": "Passed" if status == "Certified" else "Failed"
        })
        
    # 6. Taxonomy
    taxonomy_data.append({
        "product_id": pid, "category": cat, "subcategory": "Industrial", "etim_class": f"EC00{random.randint(1000, 9999)}",
        "etim_description": f"ETIM Class for {cat}", "primary_class": cat, "classification_confidence": 98,
        "alternative_class_1": f"Alt {cat}", "alternative_confidence_1": 85,
        "alternative_class_2": f"Other {cat}", "alternative_confidence_2": 60,
        "classification_evidence": "Based on extracted specifications"
    })
    
    # 12. Processing Logs
    stages = ["UPLOAD", "EXTRACT", "UNDERSTAND", "NORMALIZE", "TAXONOMY", "COMPLIANCE", "VALIDATION", "TRACEABILITY"]
    t = now
    for st in stages:
        dur = random.randint(100, 1500)
        processing_logs.append({
            "process_id": f"PROC-{pid}", "product_id": pid, "stage": st, "status": "Completed",
            "started_at": t.isoformat(), "completed_at": (t + timedelta(milliseconds=dur)).isoformat(),
            "duration_ms": dur, "records_processed": 1, "confidence": 99, "message": f"Successfully finished {st}"
        })
        t = t + timedelta(milliseconds=dur)
        
    # JSON Building
    product_intelligence[pid] = {
        "Product Summary": {"name": p["name"], "sku": p["sku"]},
        "Validation": {"Overall Confidence": "98%", "Validation Status": "PASSED"}
    }

# 7. Relationships
relationships.append({"source_product_id": "PROD-017", "target_product_id": "PROD-018", "relationship_type": "POSSIBLE_DUPLICATE", "similarity_score": 96, "matching_attributes": "Voltage, Current", "different_attributes": "Guard", "relationship_confidence": 95})
relationships.append({"source_product_id": "PROD-028", "target_product_id": "PROD-029", "relationship_type": "POSSIBLE_DUPLICATE", "similarity_score": 98, "matching_attributes": "Voltage, Current, Series", "different_attributes": "SKU Suffix", "relationship_confidence": 98})
relationships.append({"source_product_id": "PROD-001", "target_product_id": "PROD-002", "relationship_type": "SIMILAR", "similarity_score": 85, "matching_attributes": "Type", "different_attributes": "Current Rating", "relationship_confidence": 90})

# 10. Insights
insights.extend([
    {"insight_id": "INS-1", "product_id": "PROD-003", "insight_type": "DATA_GAP", "severity": "High", "title": "Missing Specifications", "description": "3 critical specifications are missing.", "affected_attribute": "Multiple", "evidence": "Not found in PDF", "recommended_action": "Review datasheet", "confidence": 100},
    {"insight_id": "INS-2", "product_id": "PROD-017", "insight_type": "DUPLICATE_RISK", "severity": "Medium", "title": "Possible Duplicate", "description": "PROD-017 has 96% similarity with PROD-018.", "affected_attribute": "Product", "evidence": "Similar SKU and specs", "recommended_action": "Merge records", "confidence": 96},
    {"insight_id": "INS-3", "product_id": "PROD-002", "insight_type": "CONFLICT_RISK", "severity": "High", "title": "Conflicting Values", "description": "Voltage information conflicts between pages.", "affected_attribute": "Rated Voltage", "evidence": "Page 1 vs Page 2", "recommended_action": "Manual Verification", "confidence": 99},
    {"insight_id": "INS-4", "product_id": "PROD-015", "insight_type": "COMPLIANCE_GAP", "severity": "High", "title": "Missing UL Certification", "description": "UL certification evidence was not found.", "affected_attribute": "UL", "evidence": "No matches found", "recommended_action": "Request updated certificate", "confidence": 100}
])

# Write files
write_csv('products.csv', ['product_id','product_name','sku','manufacturer','category','subcategory','description','model_number','country_of_origin','product_status','datasheet_filename'], products_data)
write_csv('datasheets.csv', ['document_id','product_id','filename','document_type','page_count','file_size_kb','language','upload_date','text_blocks_detected','tables_detected','images_detected','ocr_required','document_quality','processing_status','extraction_confidence'], datasheets_data)
write_csv('extracted_attributes.csv', ['product_id','attribute_name','original_value','normalized_value','unit','confidence','source_page','source_text','extraction_status'], extracted_attrs)
write_csv('expected_attributes.csv', ['category','attribute_name','unit','required','description'], expected_attrs)
write_csv('compliance.csv', ['product_id','standard','standard_version','status','evidence_found','evidence_text','source_page','confidence','verification_status'], compliance_data)
write_csv('taxonomy.csv', ['product_id','category','subcategory','etim_class','etim_description','primary_class','classification_confidence','alternative_class_1','alternative_confidence_1','alternative_class_2','alternative_confidence_2','classification_evidence'], taxonomy_data)
write_csv('product_relationships.csv', ['source_product_id','target_product_id','relationship_type','similarity_score','matching_attributes','different_attributes','relationship_confidence'], relationships)
write_csv('source_evidence.csv', ['product_id','attribute_name','value','document_id','page_number','section','source_text','evidence_type','confidence','verification_status'], source_evidence)
write_csv('conflicts.csv', ['conflict_id','product_id','attribute_name','value_1','source_page_1','value_2','source_page_2','conflict_type','severity','resolution_status','recommended_action'], conflicts)
write_csv('insights.csv', ['insight_id','product_id','insight_type','severity','title','description','affected_attribute','evidence','recommended_action','confidence'], insights)
write_csv('human_review.csv', ['review_id','product_id','field_name','issue_type','current_value','reason','priority','review_status','reviewer_comment','recommended_action'], human_review)
write_csv('processing_logs.csv', ['process_id','product_id','stage','status','started_at','completed_at','duration_ms','records_processed','confidence','message'], processing_logs)

with open(os.path.join(output_dir, 'product_intelligence.json'), 'w') as f:
    json.dump(product_intelligence, f, indent=2)

with open(os.path.join(output_dir, 'README.md'), 'w') as f:
    f.write("# SPECForge AI Synthetic Dataset\nThis directory contains 12 CSV files and 1 JSON file representing 30 industrial products designed to test the frontend and backend.\n- Products demonstrating missing data: PROD-003, PROD-006, PROD-011, PROD-020, PROD-026\n- Products demonstrating conflicts: PROD-002, PROD-008, PROD-014\n- Duplicate testing: PROD-017/PROD-018 and PROD-028/PROD-029\n- Compliance gaps: PROD-015, PROD-023")

print("Done!")
