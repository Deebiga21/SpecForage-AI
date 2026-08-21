with open('main.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if line.startswith('@app.post("/api/chat")'):
        start_idx = i
    if start_idx != -1 and line.startswith('@app.post("/api/upload")'):
        end_idx = i
        break
if end_idx == -1:
    for i in range(start_idx+1, len(lines)):
        if lines[i].startswith('@app.'):
            end_idx = i
            break
    if end_idx == -1:
        end_idx = len(lines)

new_func = '''@app.post("/api/chat")
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        import requests
        
        user_msg = request.messages[-1].content
        
        # Save user msg
        db.add(ChatHistory(role="user", content=user_msg))
        db.commit()
        
        # Construct DB Context String
        products = db.query(Product).all()
        db_context = "DATABASE CONTENT:\\n"
        for p in products:
            attrs = db.query(ProductAttribute).filter(ProductAttribute.product_id == p.id).all()
            attr_str = ", ".join([f"{a.field}: {a.value} {a.unit or ''}" for a in attrs])
            db_context += f"Product: {p.product_name} (SKU: {p.sku}), Category: {p.category}, Confidence: {p.confidence}, Status: {p.validation_status}\\n  Attributes: {attr_str}\\n\\n"
            
        system_instruction = f"You are SPECForge AI Assistant, interacting with a product spec database. Answer truthfully based on this data. You are also an expert in general industry knowledge (manufacturing, hardware, industrial tech). When explaining data processes, relationships, or complex topics, ALWAYS provide a Mermaid.js flowchart (using \\\mermaid ... \\\ block) to visually represent the flow map of the processed data or concepts.\\n\\n{db_context}"
        
        ollama_messages = [{"role": "system", "content": system_instruction}]
        
        for msg in request.messages:
            role = "user" if msg.role == "user" else "assistant"
            ollama_messages.append({"role": role, "content": msg.content})
            
        payload = {
            "model": "llama3.1:latest",
            "messages": ollama_messages,
            "stream": False
        }
        
        response = requests.post("http://localhost:11434/api/chat", json=payload)
        response.raise_for_status()
        
        ai_response = response.json()["message"]["content"]
        
        # Save model msg
        db.add(ChatHistory(role="model", content=ai_response))
        db.commit()
        
        return {"response": ai_response}
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"response": f"Error communicating with local model: {str(e)}"}

'''

with open('main.py', 'w', encoding='utf-8') as f:
    f.writelines(lines[:start_idx])
    f.write(new_func)
    f.writelines(lines[end_idx:])
