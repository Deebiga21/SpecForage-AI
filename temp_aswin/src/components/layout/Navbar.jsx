import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, Cpu, User, ShieldCheck, Command } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full h-16 glass-panel border-b border-white/10 dark:border-white/10 px-6 flex items-center justify-between">
      {/* Brand Logo & Wordmark */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg tracking-tight text-slate-900 dark:text-white">
              SpecForge<span className="text-indigo-500">.AI</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              v2.4
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono hidden sm:block">
            Product Intelligence, Verified
          </p>
        </div>
      </div>

      {/* Global Search Input */}
      <div className="relative max-w-md w-full mx-4 hidden md:block">
        <div className={`relative flex items-center rounded-xl transition-all duration-300 ${
          searchFocused ? 'ring-2 ring-indigo-500 bg-slate-900/90' : 'bg-slate-800/40 dark:bg-slate-900/50'
        } border border-slate-700/50`}>
          <Search className="w-4 h-4 text-slate-400 ml-3.5" />
          <input
            type="text"
            placeholder="Search products, SKUs, attributes, taxonomy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full py-2 pl-3 pr-10 bg-transparent text-xs font-sans text-slate-200 placeholder-slate-500 focus:outline-none"
          />
          <div className="absolute right-3 flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* System Status Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>6-Agent Orchestrator Online</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-800/50 dark:bg-slate-900/60 border border-slate-700/50 text-slate-300 hover:text-white hover:border-indigo-500/50 transition-all duration-200"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Notifications Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl bg-slate-800/50 dark:bg-slate-900/60 border border-slate-700/50 text-slate-300 hover:text-white transition-all duration-200"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-slate-900" />
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 glass-panel-glow p-4 rounded-2xl border border-indigo-500/30 shadow-2xl z-50"
              >
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                  <h4 className="font-display font-semibold text-xs text-slate-200">System Notifications</h4>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">3 New</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/5 flex gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-200">Apex 9000X Verified</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Automated validation passed at 96.8% confidence.</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/5 flex gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                    <div>
                      <p className="font-medium text-slate-200">HydroFlow Pump Flagged</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">2 low-confidence fields require human review.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-display font-bold text-xs text-white shadow-md">
            AD
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-200">Alex Drake</div>
            <div className="text-[10px] font-mono text-slate-400">Lead AI Engineer</div>
          </div>
        </div>
      </div>
    </header>
  );
}
