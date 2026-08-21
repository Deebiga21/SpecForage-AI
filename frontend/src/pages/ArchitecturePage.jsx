import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Server, Cpu, Globe, Layers, Share2, Workflow, ArrowRight } from 'lucide-react';

export function ArchitecturePage() {
  const [view, setView] = useState('dataFlow'); // 'dataFlow' or 'systemLayers'

  const dataFlowNodes = [
    { id: 'user', label: 'User / Dashboard', icon: UserIcon, x: 50, y: 150 },
    { id: 'frontend', label: 'Frontend (Vite/React)', icon: Globe, x: 250, y: 150 },
    { id: 'api', label: 'FastAPI Backend', icon: Server, x: 450, y: 150 },
    { id: 'orchestrator', label: 'LangGraph Orchestrator', icon: Workflow, x: 650, y: 150 },
    { id: 'agents', label: '6 Specialized Agents', icon: Cpu, x: 850, y: 150 },
    { id: 'db', label: 'PostgreSQL / Neo4j', icon: Database, x: 650, y: 300 },
  ];

  const systemLayerNodes = [
    { id: 'l1', label: 'Presentation Layer', desc: 'React, Tailwind, Zustand, Framer Motion', y: 50 },
    { id: 'l2', label: 'API & Orchestration Layer', desc: 'FastAPI, LangGraph, WebSockets', y: 150 },
    { id: 'l3', label: 'Agentic Intelligence Layer', desc: 'LLMs, Extraction Agent, Taxonomy Agent', y: 250 },
    { id: 'l4', label: 'Data & Knowledge Layer', desc: 'PostgreSQL, Neo4j, Vector DB', y: 350 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-800 transition-colors">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white dark:text-white">
            System Architecture
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 font-mono mt-1 max-w-2xl">
            SpecForge AI uses a multi-agent pipeline to transform unstructured industrial product documents into standardized, enriched, validated and traceable product records.
          </p>
        </div>
        
        {/* Segmented Control */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setView('dataFlow')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              view === 'dataFlow' 
                ? 'bg-white dark:bg-slate-900 dark:bg-slate-700 text-slate-900 dark:text-white dark:text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Data Flow
          </button>
          <button
            onClick={() => setView('systemLayers')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              view === 'systemLayers' 
                ? 'bg-white dark:bg-slate-900 dark:bg-slate-700 text-slate-900 dark:text-white dark:text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            System Layers
          </button>
        </div>
      </div>

      <div className="relative w-full h-[600px] bg-white dark:bg-slate-900 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-800 overflow-hidden flex items-center justify-center p-8 transition-colors">
        <AnimatePresence mode="wait">
          {view === 'dataFlow' ? (
            <DataFlowDiagram key="dataFlow" />
          ) : (
            <SystemLayersDiagram key="systemLayers" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function UserIcon(props) {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

function DataFlowDiagram() {
  const nodes = [
    { id: 'user', label: 'User / Dashboard', icon: UserIcon, col: 0, row: 0, desc: 'Uploads PDFs, reviews extracted data' },
    { id: 'frontend', label: 'Frontend (React)', icon: Globe, col: 1, row: 0, desc: 'Vite, Tailwind, Realtime WebSocket UI' },
    { id: 'api', label: 'FastAPI Backend', icon: Server, col: 2, row: 0, desc: 'API Endpoints, Job Queue Management' },
    { id: 'orchestrator', label: 'LangGraph Orchestrator', icon: Workflow, col: 3, row: 0, desc: 'Stateful Multi-Agent Flow' },
    { id: 'agents', label: '6 AI Agents', icon: Cpu, col: 4, row: 0, desc: 'Extractor, Taxonomy, Compliance...' },
    { id: 'db', label: 'PostgreSQL / Neo4j', icon: Database, col: 3, row: 1, desc: 'Relational & Graph Storage' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full h-full relative"
    >
       <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Animated connection lines */}
          <g stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="2" fill="none" strokeDasharray="6,6">
            <line x1="15%" y1="30%" x2="30%" y2="30%" />
            <line x1="38%" y1="30%" x2="52%" y2="30%" />
            <line x1="60%" y1="30%" x2="75%" y2="30%" />
            <line x1="83%" y1="30%" x2="95%" y2="30%" />
            
            <path d="M 60% 38% L 60% 75% L 50% 75%" />
          </g>
          {/* Data particles */}
          <motion.circle cx="15%" cy="30%" r="4" className="fill-blue-500"
            animate={{ cx: ["15%", "30%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.circle cx="38%" cy="30%" r="4" className="fill-blue-500"
            animate={{ cx: ["38%", "52%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
          />
          <motion.circle cx="60%" cy="30%" r="4" className="fill-blue-500"
            animate={{ cx: ["60%", "75%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
          />
          <motion.circle cx="83%" cy="30%" r="4" className="fill-blue-500"
            animate={{ cx: ["83%", "95%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1.5 }}
          />
       </svg>

       {/* Render nodes visually using absolute positioning for simplicity in this demo */}
       <NodeCard node={nodes[0]} style={{ top: '25%', left: '5%' }} />
       <NodeCard node={nodes[1]} style={{ top: '25%', left: '28%' }} />
       <NodeCard node={nodes[2]} style={{ top: '25%', left: '51%' }} />
       <NodeCard node={nodes[3]} style={{ top: '25%', left: '74%' }} />
       <NodeCard node={nodes[4]} style={{ top: '25%', left: '90%' }} />
       <NodeCard node={nodes[5]} style={{ top: '65%', left: '74%' }} />
    </motion.div>
  );
}

function SystemLayersDiagram() {
  const layers = [
    { id: 'l1', label: 'Presentation Layer', desc: 'React, Tailwind, Zustand, Framer Motion', icon: Globe },
    { id: 'l2', label: 'API & Orchestration Layer', desc: 'FastAPI, LangGraph, WebSockets', icon: Server },
    { id: 'l3', label: 'Agentic Intelligence Layer', desc: 'LLMs, Extraction Agent, Taxonomy Agent', icon: Cpu },
    { id: 'l4', label: 'Data & Knowledge Layer', desc: 'PostgreSQL, Neo4j, Vector DB', icon: Database },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl h-full flex flex-col justify-center gap-6"
    >
       {layers.map((layer, index) => (
         <motion.div
           key={layer.id}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: index * 0.15 }}
           className="relative group p-6 rounded-2xl bg-white dark:bg-slate-900 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 dark:border-slate-700 shadow-sm hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-md transition-all cursor-default overflow-hidden"
         >
            {/* Glowing left edge on hover */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <layer.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-slate-900 dark:text-white dark:text-white text-lg">{layer.label}</h3>
                <p className="font-mono text-sm text-slate-500 dark:text-slate-400 dark:text-slate-400 mt-1">{layer.desc}</p>
              </div>
            </div>
         </motion.div>
       ))}
    </motion.div>
  );
}

function NodeCard({ node, style }) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 group" style={style}>
      <div className="w-32 p-3 bg-white dark:bg-slate-900 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer z-10 relative">
         <node.icon className="w-6 h-6 text-slate-600 dark:text-slate-300 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
         <span className="text-[10px] font-semibold text-center leading-tight text-slate-800 dark:text-slate-100 dark:text-slate-200 font-display">
            {node.label}
         </span>
      </div>

      {/* Tooltip */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-3 rounded-lg bg-slate-900/95 dark:bg-black/95 text-white shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none z-50 backdrop-blur border border-slate-700">
         <p className="text-xs font-mono">{node.desc}</p>
      </div>
    </div>
  );
}
