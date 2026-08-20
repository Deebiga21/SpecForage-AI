import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../mock/mockData';
import { Package, Search, Download, Eye, CheckCircle2, AlertTriangle, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ProductsPage() {
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filtered = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-content-primary">
            Product Intelligence Catalog
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Enriched industrial records with verified field schemas and graph relationships.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by SKU or name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="py-1.5 pl-9 pr-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(product => (
          <motion.div
            key={product.id}
            whileHover={{ y: -4 }}
            className="glass-panel p-5 rounded-2xl border border-white/10 dark:border-white/10 space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-mono text-xs font-bold text-indigo-400">{product.sku}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                  product.confidence >= 90 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {product.confidence}% Conf
                </span>
              </div>

              <h3 className="font-display font-semibold text-sm text-slate-100 mt-3">
                {product.name}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                Category: {product.category}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Source File:</span>
                  <span className="text-slate-300 truncate max-w-[160px]">{product.documentName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Extracted Fields:</span>
                  <span className="text-indigo-400 font-bold">{product.extractedFields.length} Attributes</span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center gap-2">
              <button
                onClick={() => setSelectedProduct(product)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Record</span>
              </button>
              <button
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(product, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `${product.sku}_record.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-400 hover:text-indigo-400 transition-colors"
                title="Export JSON"
              >
                <FileCode className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Record Inspect Modal Drawer */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel-glow max-w-2xl w-full p-6 rounded-3xl border border-indigo-500/40 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="font-mono text-xs font-bold text-indigo-400">{selectedProduct.sku}</span>
                  <h3 className="font-display font-bold text-base text-slate-100">{selectedProduct.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                <h4 className="font-mono text-xs font-semibold text-slate-300">Extracted Attributes</h4>
                {selectedProduct.extractedFields.map(f => (
                  <div key={f.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">{f.name}</span>
                    <span className="font-mono font-bold text-indigo-300">{f.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
