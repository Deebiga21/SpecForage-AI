import React, { useState } from 'react';
import { KnowledgeGraph3D } from '../components/3d/KnowledgeGraph3D';
import { MOCK_GRAPH_NODES, MOCK_PRODUCTS } from '../mock/mockData';
import { Network, Layers, ShieldCheck, ArrowRight, Filter, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function KnowledgeGraphPage() {
  const [selectedNode, setSelectedNode] = useState(MOCK_GRAPH_NODES[0]);
  const [activeFilter, setActiveFilter] = useState('All');

  // Match selected node with full product record if available
  const fullProduct = MOCK_PRODUCTS.find(p => p.id === selectedNode?.id);

  return (
    <div className="space-y-6 h-[calc(100vh-7rem)] flex flex-col">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-content-primary">
            3D Industrial Knowledge Graph
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Simulated Neo4j graph entity relationships, taxonomy hierarchy, and component lineage.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {['All', 'Turbine', 'Pump', 'Sub-component'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                activeFilter === filter
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 3D GRAPH CANVAS & FLOATING INSPECTOR OVERLAY */}
      <div className="relative flex-1 glass-panel rounded-3xl border border-white/10 dark:border-white/10 overflow-hidden">
        {/* 3D Scene */}
        <KnowledgeGraph3D selectedNode={selectedNode} onSelectNode={setSelectedNode} />

        {/* Floating Controls Overlay */}
        <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs font-mono space-y-1.5 pointer-events-auto">
          <div className="text-indigo-400 font-bold flex items-center gap-1.5">
            <Network className="w-4 h-4" />
            <span>Graph Intelligence View</span>
          </div>
          <p className="text-[11px] text-slate-400">Drag to rotate • Scroll to zoom • Click node to inspect</p>
        </div>

        {/* Floating Side Inspector Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="absolute top-4 right-4 bottom-4 w-96 glass-panel-glow p-6 rounded-2xl border border-indigo-500/30 shadow-2xl z-20 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                    Entity Inspector
                  </span>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold font-display text-slate-100">
                    {selectedNode.label}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 font-mono text-xs text-slate-400">
                    <span>Category: {selectedNode.category}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">{selectedNode.confidence}% Conf</span>
                  </div>
                </div>

                {fullProduct ? (
                  <div className="space-y-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 text-xs">
                      <span className="text-slate-500 font-mono text-[10px]">SKU Identifier</span>
                      <div className="font-mono font-bold text-slate-200">{fullProduct.sku}</div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-mono font-semibold text-slate-300">
                        Graph Relationships
                      </span>
                      {fullProduct.relationships.map((rel, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-900/40 border border-white/5 text-xs flex items-center justify-between">
                          <span className="text-indigo-400 font-mono text-[11px]">{rel.type}</span>
                          <span className="text-slate-300 truncate max-w-[160px]">{rel.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 text-xs text-slate-400">
                    Connected sub-component entity linked via UNSPSC taxonomy node hierarchy.
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button 
                  onClick={() => alert(`Exporting relationship subgraph for ${selectedNode.label}`)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs font-display transition-colors"
                >
                  Export Entity Subgraph
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
