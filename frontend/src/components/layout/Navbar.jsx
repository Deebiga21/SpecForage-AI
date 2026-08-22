import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, Cpu, User, ShieldCheck, Command } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import SplitText from '../SplitText';
import { NavLink } from 'react-router-dom';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-black dark:border-slate-800 px-6 flex items-center justify-between shadow-sm transition-colors duration-300">
      {/* Brand Logo & Wordmark */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center">
          <img src="/logo.png" className="w-full h-full object-contain mix-blend-multiply dark:invert dark:mix-blend-screen" alt="Logo" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <SplitText
              text={
                <>
                  SPECForge<span className="text-blue-600">.AI</span>
                </>
              }
              className="font-display font-bold text-lg tracking-tight text-slate-900 dark:text-white"
              delay={50}
              duration={1.25}
              tag="span"
            />
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-50 text-blue-600 border border-blue-200">
              v2.4
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono hidden sm:block">
            Product Intelligence, Verified
          </p>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex items-center gap-1 mx-6 overflow-x-auto no-scrollbar">
        {[
          { name: 'Dashboard', path: '/app/dashboard' },
          { name: 'Products', path: '/app/products' },
          { name: 'Insights', path: '/app/insights' },
          { name: 'Assistant', path: '/app/assistant' },
          { name: 'Settings', path: '/app/settings' },
        ].map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative px-3 py-1.5 rounded-lg font-medium text-xs transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="topNavIndicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-t-full bg-blue-600"
                  />
                )}
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Global Search Input */}
      <div className="relative max-w-xs w-full ml-auto mr-4 hidden xl:block">
        <div className={`relative flex items-center rounded-xl transition-all duration-300 ${
          searchFocused ? 'ring-2 ring-blue-500 bg-white' : 'bg-slate-50'
        } border border-black`}>
          <Search className="w-4 h-4 text-slate-400 ml-3.5" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full py-1.5 pl-3 pr-10 bg-transparent text-xs font-sans text-slate-700 placeholder-slate-400 focus:outline-none"
          />
          <div className="absolute right-2 flex items-center gap-1 text-[9px] font-mono text-slate-400 bg-white px-1 py-0.5 rounded border border-black">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* System Status Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>6-Agent Orchestrator Online</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-slate-50 border border-black text-slate-600 hover:bg-slate-100 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700/50 transition-all duration-200"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl bg-slate-50 border border-black text-slate-600 hover:bg-slate-100 transition-all duration-200"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-4 ring-white" />
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 bg-white p-4 rounded-2xl border border-black shadow-xl z-50"
              >
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-black">
                  <h4 className="font-display font-semibold text-xs text-slate-900">System Notifications</h4>
                  <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">3 New</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-black flex gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">Apex 9000X Verified</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Automated validation passed at 96.8% confidence.</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-black flex gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <div>
                      <p className="font-medium text-slate-900">HydroFlow Pump Flagged</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">2 low-confidence fields require human review.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-black">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-display font-bold text-xs text-white shadow-md">
            AD
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-900">Alex Drake</div>
            <div className="text-[10px] font-mono text-slate-500">Lead AI Engineer</div>
          </div>
        </div>
      </div>
    </header>
  );
}
