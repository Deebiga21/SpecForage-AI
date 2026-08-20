import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/api';
import { Package, Search, Download, Eye, CheckCircle2, AlertTriangle, FileCode, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ProductsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(data => {
      if (data) setProducts(data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => 
    p.product_name?.toLowerCase().includes(search.toLowerCase()) || 
    p.sku?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">
            Product Intelligence Catalog
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
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
              className="py-2 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-64 transition-all"
            />
          </div>
        </div>
      </div>

      {loading ? (
         <div className="flex justify-center p-20"><Loader className="w-8 h-8 animate-spin text-blue-600" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(product => (
            <motion.div
              key={product.id}
              whileHover={{ y: -4 }}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-mono text-xs font-bold text-blue-700">{product.sku || 'N/A'}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                    product.confidence >= 0.9 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {Math.round(product.confidence * 100)}% Conf
                  </span>
                </div>

                <h3 className="font-display font-semibold text-sm text-slate-900 mt-3 line-clamp-2">
                  {product.product_name || 'Unnamed Product'}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono mt-1">
                  Category: {product.category || 'Uncategorized'}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-50 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-500">
                    <span>Manufacturer:</span>
                    <span className="text-slate-800 font-medium truncate max-w-[160px]">{product.manufacturer_name || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Validation Status:</span>
                    <span className={`font-bold ${product.validation_status === 'passed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {product.validation_status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center gap-2">
                <button
                  onClick={() => navigate(`/app/products/${product.id}`)}
                  className="flex-1 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Record</span>
                </button>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && <div className="col-span-full text-center text-slate-500 py-10 bg-white rounded-2xl border border-slate-200 shadow-sm">No products match your search.</div>}
        </div>
      )}
    </div>
  );
}
