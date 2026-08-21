import React, { useState, useEffect } from 'react';
import { getReviews, postReviewAction } from '../services/api';
import { 
  Check, 
  X, 
  Edit3, 
  AlertTriangle, 
  Eye, 
  FileText, 
  RefreshCw,
  Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviews();
      setReviews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleAction = async (id, action, body = {}) => {
    try {
      await postReviewAction(id, action, body);
      setReviews(prev => prev.filter(r => r.id !== id));
      setEditingId(null);
    } catch (e) {
      alert("Failed to process review action: " + e.message);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader className="w-8 h-8 animate-spin text-blue-600" /></div>;

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-black shadow-sm space-y-4">
         <Check className="w-12 h-12 text-emerald-500" />
         <h2 className="text-xl font-display font-bold text-slate-900">All Caught Up!</h2>
         <p className="text-sm font-mono text-slate-500">There are no pending items that require human review.</p>
         <button onClick={loadReviews} className="px-4 py-2 bg-blue-600 rounded-lg flex items-center gap-2 text-sm mt-4 hover:bg-blue-700 text-white shadow-sm transition-colors"><RefreshCw className="w-4 h-4"/> Refresh</button>
      </div>
    );
  }

  // Group by product
  const grouped = {};
  for (const r of reviews) {
     if (!grouped[r.product_id]) grouped[r.product_id] = { product_name: r.product_name, items: [] };
     grouped[r.product_id].items.push(r);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-black">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">
            Human-in-the-Loop Review
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Review uncertain extracted attributes with visual source document evidence traceability.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {Object.keys(grouped).map(productId => (
           <div key={productId} className="bg-white p-6 rounded-2xl shadow-sm border border-black space-y-4">
              <div className="border-b border-black pb-3 flex items-center gap-3">
                 <AlertTriangle className="w-5 h-5 text-amber-500" />
                 <h2 className="font-bold text-lg font-display text-slate-900">{grouped[productId].product_name}</h2>
                 <span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-xs font-mono">{grouped[productId].items.length} Flagged Fields</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {grouped[productId].items.map(item => (
                    <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-black flex flex-col justify-between hover:border-blue-200 transition-colors">
                       <div className="space-y-3 mb-4">
                          <div className="flex justify-between items-start">
                             <span className="font-semibold text-sm text-blue-800">{item.field_name}</span>
                             <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">{Math.round(item.confidence * 100)}% Conf</span>
                          </div>
                          
                          {editingId === item.id ? (
                             <input type="text" value={editValue} onChange={e => setEditValue(e.target.value)} className="w-full p-2 rounded bg-white border border-blue-500 text-sm font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm" />
                          ) : (
                             <div className="text-base font-mono font-bold text-slate-900 bg-white p-2 border border-black rounded shadow-sm">{item.original_value}</div>
                          )}
                          
                          <div className="text-xs text-slate-600 bg-amber-50/50 p-2 rounded border border-amber-100">
                             <strong className="text-amber-800">Reason:</strong> {item.reason}
                          </div>
                          
                          {item.source_evidence?.text && (
                             <div className="text-xs text-slate-600 font-mono bg-blue-50/50 p-2 rounded border border-blue-100">
                                <strong className="text-blue-800 flex items-center gap-1 mb-1"><Eye className="w-3 h-3"/> Evidence (Pg {item.source_evidence.page})</strong>
                                <span className="italic">"{item.source_evidence.text}"</span>
                             </div>
                          )}
                       </div>
                       
                       <div className="flex items-center gap-2 pt-3 border-t border-black">
                          {editingId === item.id ? (
                             <>
                                <button onClick={() => handleAction(item.id, 'edit', { new_value: editValue, comments: "Manually edited" })} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 transition-colors rounded text-xs font-bold text-white shadow-sm">Save</button>
                                <button onClick={() => setEditingId(null)} className="py-2 px-4 bg-slate-200 hover:bg-slate-300 transition-colors rounded text-xs font-bold text-slate-700 shadow-sm">Cancel</button>
                             </>
                          ) : (
                             <>
                                <button onClick={() => handleAction(item.id, 'approve', { comments: "Looks correct" })} className="flex-1 flex items-center justify-center gap-1 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded text-xs font-bold transition-colors shadow-sm"><Check className="w-3.5 h-3.5"/> Accept</button>
                                <button onClick={() => { setEditingId(item.id); setEditValue(item.original_value); }} className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded text-xs font-bold transition-colors shadow-sm"><Edit3 className="w-3.5 h-3.5"/> Edit</button>
                                <button onClick={() => handleAction(item.id, 'reject', { comments: "Incorrect" })} className="flex-1 flex items-center justify-center gap-1 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded text-xs font-bold transition-colors shadow-sm"><X className="w-3.5 h-3.5"/> Reject</button>
                             </>
                          )}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        ))}
      </div>
    </div>
  );
}
