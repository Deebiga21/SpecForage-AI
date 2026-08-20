import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../mock/mockData';
import { 
  Check, 
  X, 
  Edit3, 
  AlertTriangle, 
  Eye, 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  CheckCircle2, 
  Maximize2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ReviewPage() {
  const [selectedProduct, setSelectedProduct] = useState(MOCK_PRODUCTS[1]); // HydroFlow Pump (Needs review)
  const [fields, setFields] = useState(selectedProduct.extractedFields);
  const [activeEvidenceField, setActiveEvidenceField] = useState(null);
  const [editingFieldId, setEditingFieldId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleAcceptField = (id) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, verified: true, reviewNotes: null } : f));
  };

  const handleSaveEdit = (id) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, value: editValue, verified: true, reviewNotes: 'Manually verified by reviewer' } : f));
    setEditingFieldId(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-content-primary">
            Human-in-the-Loop Review
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Review uncertain extracted attributes with visual source document evidence traceability.
          </p>
        </div>

        {/* Product Selector Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-mono text-slate-400">Select Record:</label>
          <select
            value={selectedProduct.id}
            onChange={(e) => {
              const p = MOCK_PRODUCTS.find(item => item.id === e.target.value);
              if (p) {
                setSelectedProduct(p);
                setFields(p.extractedFields);
                setActiveEvidenceField(null);
              }
            }}
            className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            {MOCK_PRODUCTS.map(p => (
              <option key={p.id} value={p.id}>
                {p.sku} — {p.name} ({p.confidence}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SPLIT VIEW WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Document Preview & Evidence Inspector */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl border border-white/10 dark:border-white/10 space-y-4 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span className="font-mono text-xs font-semibold text-slate-200">
                {selectedProduct.documentName}
              </span>
            </div>
            
            {/* Zoom Controls */}
            <div className="flex items-center gap-2 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-xs font-mono">
              <button onClick={() => setZoomLevel(Math.max(75, zoomLevel - 15))} className="text-slate-400 hover:text-white">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-indigo-400 font-bold">{zoomLevel}%</span>
              <button onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))} className="text-slate-400 hover:text-white">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Document Viewport */}
          <div className="relative aspect-[3/4] bg-slate-950 rounded-xl border border-slate-800 overflow-auto p-6 font-mono text-xs text-slate-400">
            <div 
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
              className="relative w-full h-full space-y-6 transition-transform duration-200"
            >
              <div className="text-center font-bold text-slate-300 border-b border-slate-800 pb-3">
                HYDROFLOW HEAVY DUTY SLURRY PUMP TECHNICAL SPECIFICATION
              </div>

              <div className="space-y-4">
                <p className="text-[11px] leading-relaxed text-slate-400">
                  The HydroFlow 4050-H features high-efficiency closed impellers designed for abrasive slurry transport applications. All wet-end components are manufactured from high-chrome alloy.
                </p>

                {/* Bounding Box Highlights overlaid on document */}
                {fields.map(f => {
                  const isHighlighted = activeEvidenceField?.id === f.id;
                  const isLowConf = f.confidence < 85;

                  return (
                    <div
                      key={f.id}
                      onClick={() => setActiveEvidenceField(f)}
                      className={`p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                        isHighlighted
                          ? 'bg-indigo-600/30 border-indigo-400 ring-2 ring-indigo-400 shadow-xl'
                          : isLowConf && !f.verified
                          ? 'bg-amber-500/10 border-amber-500/50'
                          : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-slate-300">{f.name}:</span>
                        <span className={isLowConf ? 'text-amber-400' : 'text-emerald-400'}>
                          {f.value}
                        </span>
                      </div>
                      {isHighlighted && (
                        <div className="mt-1 text-[10px] text-indigo-300 flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>Exact Source Evidence Region (Page {f.boundingBox.page})</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Extracted Field List & Validation Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 dark:border-white/10">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-display font-semibold text-sm text-slate-200">
                Extracted Fields ({fields.length})
              </h3>
              <span className="text-[11px] font-mono text-amber-400">
                {fields.filter(f => !f.verified).length} Pending Review
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {fields.map((field) => {
                const isLowConf = field.confidence < 85;
                const isEditing = editingFieldId === field.id;

                return (
                  <motion.div
                    key={field.id}
                    layout
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      isLowConf && !field.verified
                        ? 'glass-panel-glow border-amber-500/50 bg-amber-500/5'
                        : 'bg-slate-900/40 border-slate-800'
                    }`}
                  >
                    {/* Field Header */}
                    <div className="flex items-center justify-between">
                      <span className="font-display font-medium text-xs text-slate-300">
                        {field.name}
                      </span>
                      
                      {/* Mini Confidence Dial Ring */}
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className={isLowConf ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                          {field.confidence}%
                        </span>
                      </div>
                    </div>

                    {/* Value Display / Edit Form */}
                    <div className="mt-2">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-indigo-500 text-xs font-mono text-white focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveEdit(field.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="font-mono text-sm font-bold text-slate-100">
                          {field.value}
                        </div>
                      )}

                      {field.reviewNotes && (
                        <div className="mt-1.5 text-[11px] text-amber-300 font-mono flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0 text-amber-400" />
                          <span>{field.reviewNotes}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setActiveEvidenceField(field)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-indigo-300 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Evidence</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingFieldId(field.id);
                            setEditValue(field.value);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          title="Edit Field Value"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {!field.verified && (
                          <button
                            onClick={() => handleAcceptField(field.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
