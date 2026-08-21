import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularStatWidget } from '../components/widgets/CircularStatWidget';
import { getProducts, getDashboardStats, useRealtimeUpdates } from '../services/api';
import { 
  Plus, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowUpRight, 
  CheckCircle2, 
  Sparkles,
  FileText,
  Eye,
  Loader
} from 'lucide-react';
import { motion } from 'framer-motion';

export function DashboardPage() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { lastMessage, connected } = useRealtimeUpdates();

  const loadData = async () => {
    try {
      const p = await getProducts({ sort: 'newest' });
      setProducts(p.slice(0, 10)); // Just 10 recent for dashboard
      
      const s = await getDashboardStats();
      setStats(s);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  
  // Re-fetch on global websocket updates
  useEffect(() => {
    if (lastMessage && (lastMessage.type === 'job_update' || lastMessage.type === 'review_completed' || lastMessage.type === 'new_job')) {
       loadData();
    }
  }, [lastMessage]);

  const filteredProducts = products.filter(p => {
    if (selectedFilter === 'Verified') return p.review_status === 'approved';
    if (selectedFilter === 'Review') return p.review_status === 'pending';
    return true;
  });

  const displayStats = stats ? [
    { id: 's1', label: 'Total Products Extracted', value: stats.total_products, maxValue: Math.max(100, stats.total_products * 2), unit: '', color: 'from-blue-500 to-indigo-600', prefix: '' },
    { id: 's2', label: 'Processing Pipeline Jobs', value: stats.total_jobs, maxValue: Math.max(100, stats.total_jobs * 2), unit: '', color: 'from-blue-400 to-blue-600', prefix: '' },
    { id: 's3', label: 'Active Tasks', value: stats.active_jobs, maxValue: 10, unit: '', color: 'from-amber-400 to-amber-600', prefix: '' },
    { id: 's4', label: 'Failed Jobs', value: stats.failed_jobs, maxValue: 10, unit: '', color: 'from-rose-400 to-rose-600', prefix: '' }
  ] : [];

  if (loading) {
    return <div className="flex justify-center p-20"><Loader className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
            Product Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
            Real-time pipeline orchestration, confidence metrics, and taxonomy mapping.
            {connected ? <span className="ml-2 text-emerald-600">Live 🟢</span> : <span className="ml-2 text-rose-600">Disconnected 🔴</span>}
          </p>
        </div>

        <button
          onClick={() => navigate('/app/scan')}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs font-display tracking-wide shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group shrink-0"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          <span>+ Process New Product</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center bg-white p-6 rounded-2xl shadow-sm border border-black">
        {displayStats.map((stat) => (
          <CircularStatWidget key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Processing Activity Stream */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-black shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-slate-900">
                  Live Processing Activity
                </h3>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-mono border border-emerald-100">
              Active Pipeline
            </span>
          </div>

          <div className="space-y-3">
            {stats?.recent_jobs?.map((job, idx) => (
              <motion.div key={job.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                className="p-3.5 rounded-xl bg-slate-50 border border-black flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center border border-black">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 truncate max-w-[200px]">{job.filename}</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                      Status: {job.status} • Progress: {job.progress}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {job.status === 'review_required' ? (
                     <div className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-mono">Review</div>
                  ) : job.status === 'completed' ? (
                     <div className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-mono">Complete</div>
                  ) : job.status === 'error' ? (
                     <div className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-mono">Failed</div>
                  ) : (
                     <div className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-mono">Processing</div>
                  )}
                  {job.result_product_id && (
                     <button onClick={() => navigate(`/app/products/${job.result_product_id}`)} className="p-1 rounded hover:bg-slate-200">
                        <ArrowUpRight className="w-4 h-4 text-slate-500 hover:text-blue-600" />
                     </button>
                  )}
                </div>
              </motion.div>
            ))}
            {stats?.recent_jobs?.length === 0 && <div className="text-sm text-slate-500 text-center py-4">No recent jobs</div>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-black shadow-sm space-y-5">
           <div className="pb-3 border-b border-black">
            <h3 className="font-display font-semibold text-sm text-slate-900">System Metrics</h3>
            <p className="text-[11px] text-slate-500 font-mono">Overall database health</p>
          </div>
          <div className="space-y-4">
             <div>
              <div className="flex justify-between text-xs font-mono mb-1.5"><span className="text-slate-600">Extraction Confidence</span><span className="text-blue-700 font-bold">~90%</span></div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><motion.div animate={{ width: "90%" }} className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" /></div>
            </div>
             <div>
              <div className="flex justify-between text-xs font-mono mb-1.5"><span className="text-slate-600">Taxonomy Mapping Precision</span><span className="text-emerald-600 font-bold">~95%</span></div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><motion.div animate={{ width: "95%" }} className="h-full bg-emerald-500 rounded-full" /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-black shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-black">
          <div>
            <h3 className="font-display font-semibold text-base text-slate-900">Recent Product Records</h3>
            <p className="text-xs text-slate-500 font-mono">Traceable industrial schemas & verified records</p>
          </div>
          <div className="flex items-center gap-2">
            {['All', 'Verified', 'Review'].map(f => (
              <button key={f} onClick={() => setSelectedFilter(f)} className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${selectedFilter === f ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-black text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                <th className="pb-3 px-3">Product / SKU</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Confidence</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-3.5 px-3">
                    <div className="font-bold font-mono text-slate-900">{p.sku || "N/A"}</div>
                    <div className="text-slate-500 text-[11px] truncate max-w-xs">{p.product_name}</div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 font-mono text-[11px]">{p.category || 'Uncategorized'}</td>
                  <td className="py-3.5 px-3">
                    <span className={`font-mono font-bold ${p.confidence >= 0.9 ? 'text-emerald-600' : p.confidence >= 0.75 ? 'text-amber-600' : 'text-rose-600'}`}>
                      {Math.round(p.confidence * 100)}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    {p.review_status === 'pending' ? (
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-mono text-[10px]">Human Review Needed</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px]">Verified & Enriched</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button onClick={() => navigate(`/app/products/${p.id}`)} className="px-3 py-1.5 rounded-lg bg-white border border-black shadow-sm hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium transition-colors inline-flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" /><span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && <tr><td colSpan="5" className="py-4 text-center text-slate-500">No products found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
