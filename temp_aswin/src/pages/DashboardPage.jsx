import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularStatWidget } from '../components/widgets/CircularStatWidget';
import { MOCK_STATS, MOCK_PRODUCTS } from '../mock/mockData';
import { 
  Plus, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Sliders, 
  Sparkles,
  FileText,
  Filter,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

export function DashboardPage() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    if (selectedFilter === 'Verified') return p.status === 'Verified';
    if (selectedFilter === 'Review') return p.status === 'Review Needed';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-content-primary">
            Product Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
            Real-time pipeline orchestration, confidence metrics, and taxonomy mapping.
          </p>
        </div>

        {/* Floating Prominent Primary Action CTA */}
        <button
          onClick={() => navigate('/app/scan')}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white font-semibold text-xs font-display tracking-wide shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group shrink-0"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          <span>+ Process New Product</span>
        </button>
      </div>

      {/* SECTION 5: CIRCULAR STAT WIDGETS HERO ROW */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            Control Room Metrics (Click dial to expand)
          </h2>
          <span className="text-[11px] font-mono text-indigo-400">Live Agent Stream • 100% Validated</span>
        </div>

        {/* Circular Dials Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center py-2">
          {MOCK_STATS.map((stat) => (
            <CircularStatWidget key={stat.id} stat={stat} />
          ))}
        </div>
      </div>

      {/* TWO COLUMN GRID: Activity Feed & Data Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Processing Activity Stream */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-content-primary">
                  Processing Activity
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">Automated agent handoff sequence</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-mono border border-emerald-500/20">
              Active Pipeline
            </span>
          </div>

          <div className="space-y-3">
            {MOCK_PRODUCTS.map((prod, idx) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3.5 rounded-xl bg-slate-900/40 hover:bg-slate-800/50 border border-white/5 flex items-center justify-between transition-colors group cursor-pointer"
                onClick={() => navigate(prod.reviewNeeded ? '/app/review' : '/app/products')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800/80 flex items-center justify-center font-mono text-xs font-semibold text-slate-300">
                    <FileText className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-200">{prod.sku}</span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-[300px]">{prod.name}</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5 flex items-center gap-3">
                      <span>Doc: {prod.documentName}</span>
                      <span>•</span>
                      <span>{prod.dateAdded}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Indicator Pill */}
                  {prod.reviewNeeded ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-mono">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Review Needed ({prod.confidence}%)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Complete ({prod.confidence}%)</span>
                    </div>
                  )}
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Data Quality Progress Bars */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 dark:border-white/10 space-y-5">
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-display font-semibold text-sm text-content-primary">
              Data Quality Index
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">Multi-agent validation metrics</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-300">Extraction Confidence</span>
                <span className="text-indigo-400 font-bold">96.8%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "96.8%" }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-300">Taxonomy Mapping Precision</span>
                <span className="text-emerald-400 font-bold">98.2%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "98.2%" }}
                  transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-300">Source Evidence Traceability</span>
                <span className="text-purple-400 font-bold">100%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                  className="h-full bg-purple-500 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-300">Unit Standardization</span>
                <span className="text-blue-400 font-bold">94.5%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "94.5%" }}
                  transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Validation Agent automatically re-evaluates low confidence fields upon document rescan.</span>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT PRODUCTS TABLE SECTION */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-display font-semibold text-base text-content-primary">
              Recent Product Records
            </h3>
            <p className="text-xs text-slate-400 font-mono">Traceable industrial schemas & verified records</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {['All', 'Verified', 'Review'].map(f => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  selectedFilter === f
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="pb-3 px-3">Product / SKU</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Confidence</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="py-3.5 px-3">
                    <div className="font-bold font-mono text-slate-200">{p.sku}</div>
                    <div className="text-slate-400 text-[11px] truncate max-w-xs">{p.name}</div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 font-mono text-[11px]">{p.category}</td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold ${
                        p.confidence >= 90 ? 'text-emerald-400' : p.confidence >= 75 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {p.confidence}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    {p.reviewNeeded ? (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-[10px]">
                        Human Review Needed
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px]">
                        Verified & Enriched
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => navigate(p.reviewNeeded ? '/app/review' : '/app/products')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-medium transition-colors inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
