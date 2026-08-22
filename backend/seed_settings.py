import sqlite3

def seed_settings():
    conn = sqlite3.connect("specforage.db")
    cursor = conn.cursor()
    
    settings = [
        # AI Models
        ("model.extraction", "Extraction Model", "llama3.1:latest", "string", "AI Models"),
        ("model.vision", "Vision Model (Diagrams/Images)", "qwen-vl", "string", "AI Models"),
        ("model.insights", "Insights/Chatbot Model", "llama3.1:latest", "string", "AI Models"),
        
        # Thresholds
        ("threshold.auto_approve", "Auto-Approval Confidence Threshold (%)", "95", "integer", "Processing Thresholds"),
        ("threshold.flag_review", "Flag for Review Threshold (%)", "85", "integer", "Processing Thresholds"),
        
        # Pipeline Configuration
        ("pipeline.enable_ocr", "Enable OCR for Scanned PDFs", "true", "boolean", "Pipeline Configuration"),
        ("pipeline.extract_tables", "Enable Table Extraction", "true", "boolean", "Pipeline Configuration"),
        ("pipeline.layout_analysis", "Enable Complex Layout Analysis", "true", "boolean", "Pipeline Configuration"),
        ("pipeline.batch_size", "Batch Processing Size", "10", "integer", "Pipeline Configuration"),
        
        # Chatbot Settings
        ("chatbot.enable_streaming", "Enable Streaming Responses", "false", "boolean", "Chatbot Config"),
        ("chatbot.context_window", "Max Context Window Size", "8192", "integer", "Chatbot Config"),
        ("chatbot.temperature", "Chatbot Temperature", "0.2", "float", "Chatbot Config"),
        
        # System
        ("system.debug_mode", "Enable Debug Logging", "false", "boolean", "System"),
        ("system.erp_sync", "Enable Automatic ERP Sync", "false", "boolean", "System"),
    ]
    
    for key, desc, val, stype, category in settings:
        cursor.execute("SELECT id FROM system_settings WHERE key = ?", (key,))
        if not cursor.fetchone():
            cursor.execute('''
                INSERT INTO system_settings (key, description, value, type, category, updated_at) 
                VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ''', (key, desc, val, stype, category))
            
    conn.commit()
    conn.close()
    print("Settings seeded successfully!")

if __name__ == "__main__":
    seed_settings()
