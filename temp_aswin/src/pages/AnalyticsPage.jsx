import React from 'react';
import { 
  MOCK_ANALYTICS_VOLUME, 
  MOCK_AGENT_PERFORMANCE 
} from '../mock/mockData';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  CartesianGrid 
} from 'recharts';
import { BarChart3, TrendingUp, Clock, Zap, Cpu } from 'lucide-react';

export function AnalyticsPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight text-content-primary">
          System Performance & Analytics
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Extraction throughput, agent latency distribution, and confidence accuracy tracking.
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 dark:border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Avg Processing Time</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-display text-slate-100">10.9s</div>
          <p className="text-[10px] text-emerald-400 font-mono">↓ 1.4s improvement across 6 agents</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 dark:border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Automated Pass Rate</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-display text-slate-100">96.4%</div>
          <p className="text-[10px] text-emerald-400 font-mono">↑ 2.1% from previous benchmark</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 dark:border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Total Schemas Processed</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-display text-slate-100">1,428</div>
          <p className="text-[10px] text-slate-400 font-mono">28 pending human review</p>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Extraction Volume Area Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-sm text-slate-200">
              Monthly Product Record Throughput
            </h3>
            <span className="text-[11px] font-mono text-indigo-400">YTD Growth</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_ANALYTICS_VOLUME}>
                <defs>
                  <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#volumeGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Latency Breakdown Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-sm text-slate-200">
              Agent Execution Latency (ms)
            </h3>
            <span className="text-[11px] font-mono text-emerald-400">Sub-second Latency</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_AGENT_PERFORMANCE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} interval={0} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="latencyMs" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
