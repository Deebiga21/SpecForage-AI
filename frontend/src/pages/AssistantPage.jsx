import React, { useState, useEffect, useRef } from 'react';
import { getChatHistory, postChatMessage } from '../services/api';
import { Bot, User, Send, Sparkles, Loader } from 'lucide-react';

export function AssistantPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    getChatHistory().then(history => {
      const formatted = history.map(h => ({
        role: h.role,
        content: h.content,
        timestamp: h.timestamp
      }));
      if (formatted.length === 0) {
        formatted.push({
           role: 'model',
           content: 'Hello! I am SPECForge AI Assistant. I am directly connected to your real SQLite product database. How can I help you query, summarize, or investigate your products today?'
        });
      }
      setMessages(formatted);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    try {
       const payload = [...messages, newMsg].slice(-5);
       const response = await postChatMessage(payload);
       
       setMessages(prev => [...prev, {
          role: 'model',
          content: response.response
       }]);
    } catch (err) {
       console.error("Chat error:", err);
       setMessages(prev => [...prev, {
          role: 'model',
          content: 'Sorry, I encountered an error communicating with the backend.'
       }]);
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 w-full max-w-[1600px] mx-auto">
      {/* Left Column: Conversation History */}
      <div className="hidden lg:flex w-64 shrink-0 flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-display font-bold text-sm text-slate-900 dark:text-white">
          Conversation History
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {/* Mock history items to satisfy layout requirements without needing a new backend endpoint for now */}
          <button className="w-full text-left p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 text-xs font-medium">
            Current Session
          </button>
          <button className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs transition-colors">
            Centrifugal Pump specs
          </button>
          <button className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs transition-colors">
            Motor compatibility
          </button>
          <button className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs transition-colors">
            Missing voltages
          </button>
        </div>
      </div>

      {/* Center Column: Active Chat */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
             <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <div>
             <h2 className="font-display font-bold text-slate-900 dark:text-white text-base tracking-tight">SPECForge AI Assistant</h2>
             <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">Database-aware intelligent query agent</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white dark:bg-slate-900">
          {messages.map((msg, idx) => (
             <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm ${
                   msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-blue-600 border border-slate-200 dark:border-slate-700'
                }`}>
                   {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-[85%] rounded-2xl p-4 text-[14px] leading-relaxed shadow-sm ${
                   msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-sm'
                }`}>
                   <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                </div>
             </div>
          ))}
          {loading && (
             <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 text-blue-600 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm">
                   <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm p-4 flex items-center gap-3 shadow-sm">
                   <Loader className="w-4 h-4 animate-spin text-blue-600" />
                   <span className="text-[14px] text-slate-600 dark:text-slate-300 font-medium">Querying database...</span>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 shrink-0">
          <div className="relative w-full flex items-center shadow-sm">
             <input 
               type="text" 
               value={input}
               onChange={e => setInput(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && handleSend()}
               placeholder="Ask about products, relationships, or missing information..."
               className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-4 pr-12 text-[14px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
               disabled={loading}
             />
             <button 
               onClick={handleSend}
               disabled={loading || !input.trim()}
               className="absolute right-1.5 p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm"
             >
                <Send className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>

      {/* Right Column: Context/Product Details */}
      <div className="hidden xl:flex w-80 shrink-0 flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-display font-bold text-sm text-slate-900 dark:text-white">
          Contextual Evidence
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 space-y-1.5">
            <h4 className="text-[11px] font-bold text-blue-900 uppercase tracking-wider font-mono">Current Context</h4>
            <p className="text-xs text-blue-800 leading-relaxed">The AI is currently referencing your entire product catalog via SQLite to answer queries.</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Relevant Product</h4>
            <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs space-y-2 text-slate-600 dark:text-slate-300 italic text-center">
              Awaiting specific product query to show contextual product data.
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Source Evidence</h4>
            <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs space-y-2 text-slate-600 dark:text-slate-300 italic text-center">
              Awaiting query to show extraction evidence.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
