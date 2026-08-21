import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Edit3, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { CircularStatWidget } from './CircularStatWidget';

export function ReviewPanel({ isOpen, onClose, product, layoutId }) {
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Simulate loading skeleton delay
      const timer = setTimeout(() => {
        setLoading(false);
        // Mock extracted fields based on product or just generic mock data
        setFields([
          { id: 1, name: 'Operating Temperature', value: '-40 to 85°C', confidence: 0.65, flagged: true },
          { id: 2, name: 'Input Voltage', value: '12-24V DC', confidence: 0.98, flagged: false },
          { id: 3, name: 'IP Rating', value: 'IP67', confidence: 0.95, flagged: false },
          { id: 4, name: 'Material', value: 'Stainless Steel', confidence: 0.72, flagged: true },
        ].sort((a, b) => a.confidence - b.confidence));
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-colors dark:bg-black/60"
          />

          {/* Drawer */}
          <motion.div
            layoutId={layoutId}
            initial={{ x: '100%', scale: 0.95, opacity: 0 }}
            animate={{ x: 0, scale: 1, opacity: 1 }}
            exit={{ x: '100%', scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-full w-full md:w-[85%] lg:w-[75%] bg-white dark:bg-slate-900 dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-700 dark:border-slate-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:bg-slate-900/50 backdrop-blur">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white dark:text-white">
                    {product?.product_name || 'Review Record'}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 dark:text-slate-400">
                      SKU: {product?.sku || 'N/A'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
                      Needs Review
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                 {/* Circular Confidence Dial (mock) */}
                 <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full border-4 border-blue-100 dark:border-slate-800 flex items-center justify-center relative">
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                           <circle cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-blue-500" strokeDasharray="100" strokeDashoffset={100 - ((product?.confidence || 0.85) * 100)} />
                        </svg>
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 dark:text-slate-300">
                           {Math.round((product?.confidence || 0.85) * 100)}%
                        </span>
                    </div>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 dark:text-slate-400">Confidence</span>
                 </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Column: Document Viewer */}
              <div className="w-1/2 flex flex-col border-r border-slate-200 dark:border-slate-700 dark:border-slate-800 bg-slate-100 dark:bg-[#0b1121]">
                {loading ? (
                  <div className="flex-1 p-6 space-y-4 animate-pulse">
                    <div className="w-full h-full bg-slate-200/50 dark:bg-slate-800/50 rounded-xl" />
                  </div>
                ) : (
                  <div className="flex-1 p-6 overflow-y-auto">
                    {/* Mock Document Canvas */}
                    <div className="w-full min-h-[800px] bg-white dark:bg-slate-900 dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-700 p-8 relative">
                       {/* Mock Highlights */}
                       <div className="absolute top-32 left-12 w-64 h-8 bg-blue-500/20 border border-blue-500/50 rounded pointer-events-none" />
                       <div className="absolute top-[280px] left-12 w-48 h-8 bg-amber-500/20 border border-amber-500/50 rounded pointer-events-none" />
                       
                       <div className="space-y-4 text-slate-300 dark:text-slate-700">
                          <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-700 rounded mb-8" />
                          <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded" />
                          <div className="h-4 w-5/6 bg-slate-100 dark:bg-slate-800 rounded" />
                          <div className="h-4 w-4/6 bg-slate-100 dark:bg-slate-800 rounded mb-12" />
                          
                          <div className="flex gap-4">
                             <div className="h-32 w-1/3 bg-slate-100 dark:bg-slate-800 rounded" />
                             <div className="h-32 w-2/3 bg-slate-100 dark:bg-slate-800 rounded" />
                          </div>
                       </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Extracted Fields */}
              <div className="w-1/2 flex flex-col bg-white dark:bg-slate-900 dark:bg-slate-900">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 dark:border-slate-800 flex justify-between items-center">
                   <h3 className="font-semibold text-sm text-slate-900 dark:text-white dark:text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" /> Extracted Attributes
                   </h3>
                   <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 dark:text-slate-300">
                         Flag Low-Confidence
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50">
                         Accept High-Confidence
                      </button>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loading ? (
                    Array(4).fill(0).map((_, i) => (
                      <div key={i} className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
                    ))
                  ) : (
                    fields.map((field, i) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 + 0.1 }}
                        className={`p-4 rounded-xl border ${field.flagged ? 'border-amber-300 dark:border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.1)] dark:shadow-[0_0_15px_rgba(245,158,11,0.15)] bg-amber-50/30 dark:bg-amber-900/10' : 'border-slate-200 dark:border-slate-700 dark:border-slate-800 bg-white dark:bg-slate-900 dark:bg-slate-800/40'} flex flex-col gap-3 relative overflow-hidden`}
                      >
                         <div className="flex justify-between items-start">
                            <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 dark:text-slate-200">{field.name}</span>
                            <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded border ${field.confidence >= 0.8 ? 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800/50' : 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/30 dark:border-amber-800/50'}`}>
                               {Math.round(field.confidence * 100)}%
                            </span>
                         </div>
                         <div className="flex items-center gap-3">
                            <input 
                               type="text" 
                               defaultValue={field.value} 
                               className="flex-1 bg-slate-50 dark:bg-slate-800 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono text-slate-900 dark:text-white dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                            <div className="flex items-center gap-1">
                               <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-md transition-colors"><Check className="w-4 h-4" /></button>
                               <button className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-md transition-colors"><AlertTriangle className="w-4 h-4" /></button>
                            </div>
                         </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:bg-slate-900/50 backdrop-blur flex justify-between items-center">
              <button className="px-4 py-2 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors">
                Reject / Send Back
              </button>
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:bg-slate-800 transition-colors">
                  Save & Continue
                </button>
                <button onClick={onClose} className="px-6 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all">
                  Approve Record
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
