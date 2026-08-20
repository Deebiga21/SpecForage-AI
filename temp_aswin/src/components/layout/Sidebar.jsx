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
    { name: 'Process New Product', path: '/app/scan', icon: PlusCircle, badge: 'AI Scan', highlight: true },
    { name: 'Human Review', path: '/app/review', icon: CheckSquare, badge: '18' },
    { name: 'Knowledge Graph', path: '/app/graph', icon: Network, badge: '3D' },
    { name: 'Analytics', path: '/app/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/app/settings', icon: Settings },
  ];

  return (
    <aside className={`relative z-30 transition-all duration-300 glass-panel border-r border-white/10 dark:border-white/10 flex flex-col justify-between ${
      collapsed ? 'w-20' : 'w-64'
    } min-h-[calc(100vh-4rem)] p-4`}>
      {/* Upper Navigation Items */}
      <div className="space-y-6">
        {/* Toggle collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-indigo-600 border border-indigo-400 text-white flex items-center justify-center shadow-lg hover:bg-indigo-500 transition-all"
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
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-md font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  } ${item.highlight ? 'ring-1 ring-indigo-500/50 bg-indigo-950/20' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Left Pill Accent */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-indigo-500"
                      />
                    )}
                    
                    <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-300'
                    }`} />
                    
                    {!collapsed && (
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">{item.name}</span>
                        {item.badge && (
                          <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                            item.highlight 
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
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
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-indigo-500/20 text-xs">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
            <Zap className="w-4 h-4" />
            <span>Agent Engine</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            LangGraph Orchestrator running with 6 specialized models.
          </p>
        </div>
      )}
    </aside>
  );
}
