import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, TrendingUp, Info } from 'lucide-react';

export function CircularStatWidget({ stat }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // SVG Circular progress math
  const radius = 42;
  const strokeWidth = 5.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stat.percentage / 100) * circumference;

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div
            layoutId={`stat-card-${stat.id}`}
            onClick={() => setIsExpanded(true)}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group cursor-pointer relative flex flex-col items-center justify-center p-5 rounded-full glass-panel transition-shadow duration-300 hover:shadow-indigo-500/20 border border-white/10 dark:border-white/10 shadow-lg w-44 h-44 select-none"
            title="Click to expand detailed breakdown"
          >
            {/* Soft Ambient Radial Glow */}
            <div 
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-25 transition-opacity duration-500 blur-xl"
              style={{ backgroundColor: stat.color }}
            />

            {/* Circular Progress SVG */}
            <svg className="w-36 h-36 transform -rotate-90">
              {/* Background Ring */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-slate-200 dark:text-slate-800"
                fill="transparent"
              />
              {/* Animated Foreground Progress Ring */}
              <motion.circle
                cx="72"
                cy="72"
                r={radius}
                stroke={stat.color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
              <span className="text-2xl font-bold font-display tracking-tight text-content-primary">
                {stat.value}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5 max-w-[100px] truncate">
                {stat.unit}
              </span>
            </div>

            {/* Hover Tooltip Pill */}
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-indigo-600 text-[10px] font-medium text-white shadow-md flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span>Expand</span>
              <ChevronRight className="w-3 h-3" />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            layoutId={`stat-card-${stat.id}`}
            className="absolute z-50 top-0 left-0 w-80 glass-panel-glow p-5 rounded-2xl shadow-2xl border border-indigo-500/30"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }} />
                <h4 className="font-display font-semibold text-sm tracking-wide text-slate-800 dark:text-slate-100">
                  {stat.title}
                </h4>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Primary Stat Display */}
            <div className="my-4 flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold font-display" style={{ color: stat.color }}>
                  {stat.value}
                </span>
                <span className="ml-2 text-xs font-mono text-slate-400">{stat.unit}</span>
              </div>
              <div className="flex items-center text-emerald-400 text-xs font-mono gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12.4%</span>
              </div>
            </div>

            {/* Micro Sparkline Visualizer */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>7-Day Trend</span>
                <span>Active Stream</span>
              </div>
              <div className="h-10 flex items-end gap-1.5 bg-slate-950/20 p-1.5 rounded-lg border border-white/5">
                {stat.sparkline.map((val, idx) => {
                  const max = Math.max(...stat.sparkline);
                  const min = Math.min(...stat.sparkline);
                  const pct = Math.max(15, ((val - min) / (max - min || 1)) * 100);
                  return (
                    <motion.div
                      key={idx}
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ delay: idx * 0.05, duration: 0.4 }}
                      className="flex-1 rounded-sm opacity-80 hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: stat.color }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Sub-segment Breakdown List */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Category Breakdown
              </div>
              {stat.breakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-900/30 border border-white/5">
                  <span className="text-slate-300 truncate max-w-[140px]">{item.label}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400 text-[11px]">({item.count})</span>
                    <span className="font-semibold text-indigo-400">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Hint */}
            <button
              onClick={() => setIsExpanded(false)}
              className="mt-4 w-full py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors text-center"
            >
              Close Details
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
