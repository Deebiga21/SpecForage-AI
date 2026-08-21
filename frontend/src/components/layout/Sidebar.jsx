import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  CheckSquare, 
  Network, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/app/products', icon: Package },
    { name: 'Review', path: '/app/review', icon: CheckSquare },
    { name: 'Knowledge Graph', path: '/app/graph', icon: Network },
    { name: 'AI Assistant', path: '/app/assistant', icon: BarChart3 },
    { name: 'Settings', path: '/app/settings', icon: Settings },
  ];

  return (
    <aside className={`relative z-30 transition-all duration-300 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-sm ${
      collapsed ? 'w-20' : 'w-64'
    } h-full p-4 shrink-0`}>
      {/* Upper Navigation Items */}
      <div className="space-y-6">
        {/* Toggle collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-blue-600 border border-blue-400 text-white flex items-center justify-center shadow-md hover:bg-blue-500 transition-all"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* Navigation List */}
        <nav className="space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-xs transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Left Pill Accent */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600"
                      />
                    )}
                    
                    <Icon className={`w-4.5 h-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-blue-600' : 'text-slate-500 dark:text-slate-400 group-hover:text-blue-600'
                    }`} />
                    
                    {!collapsed && (
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">{item.name}</span>
                        {item.badge && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Card */}
      {!collapsed && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs shadow-sm">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold mb-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Agent Engine</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            LangGraph Orchestrator running with 6 specialized models.
          </p>
        </div>
      )}
    </aside>
  );
}
