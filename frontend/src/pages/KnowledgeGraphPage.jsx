import React, { useState, useEffect } from 'react';
import { KnowledgeGraph3D } from '../components/3d/KnowledgeGraph3D';
import { getKnowledgeGraph, getProduct, getProductRelationships } from '../services/api';
import { Network, X, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function KnowledgeGraphPage() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [nodeDetails, setNodeDetails] = useState(null);
  const [nodeRels, setNodeRels] = useState([]);

  useEffect(() => {
    getKnowledgeGraph().then(data => {
      if (data) {
        setGraphData(data);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedNode && selectedNode.id.startsWith('p_')) {
       const pid = selectedNode.id.replace('p_', '');
       Promise.all([getProduct(pid), getProductRelationships(pid)]).then(([p, r]) => {
          setNodeDetails(p);
          setNodeRels(r);
       }).catch(console.error);
    } else {
       setNodeDetails(null);
       setNodeRels([]);
    }
  }, [selectedNode]);

  return (
    <div className="space-y-6 h-[calc(100vh-7rem)] flex flex-col max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-black">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">
            Knowledge Graph
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Visualizing relationships between products and manufacturers.
          </p>
        </div>
      </div>

      <div className="relative flex-1 bg-white rounded-3xl border border-black shadow-sm overflow-hidden">
        <div className="absolute inset-0 z-0 bg-slate-50">
          <KnowledgeGraph3D 
            onSelectNode={setSelectedNode} 
            selectedNode={selectedNode}
            filter={activeFilter}
            graphData={graphData}
          />
        </div>

        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-black shadow-sm text-xs font-mono space-y-1.5 pointer-events-auto">
          <div className="text-blue-700 font-bold flex items-center gap-1.5">
            <Network className="w-4 h-4" />
            <span>Graph Intelligence View</span>
          </div>
          <p className="text-[11px] text-slate-500">Drag to rotate • Scroll to zoom • Click node to inspect</p>
        </div>

        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="absolute top-4 right-4 bottom-4 w-96 bg-white/95 backdrop-blur-sm p-6 rounded-2xl border border-black shadow-xl z-20 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-black">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                    {selectedNode.type}
                  </span>
                  <button onClick={() => setSelectedNode(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold font-display text-slate-900">
                    {selectedNode.label}
                  </h3>
                </div>

                {nodeDetails ? (
                  <div className="space-y-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-50 border border-black space-y-1 text-xs">
                      <span className="text-slate-500 font-mono text-[10px]">SKU Identifier</span>
                      <div className="font-mono font-bold text-slate-900">{nodeDetails.sku || 'N/A'}</div>
                    </div>
                    
                    <div className="p-3 rounded-xl bg-slate-50 border border-black space-y-1 text-xs">
                      <span className="text-slate-500 font-mono text-[10px]">Manufacturer</span>
                      <div className="font-mono font-bold text-slate-900">{nodeDetails.manufacturer_name || 'N/A'}</div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-mono font-semibold text-slate-700">
                        Graph Relationships
                      </span>
                      {nodeRels.map((rel, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-black text-xs flex items-center justify-between">
                          <span className="text-blue-600 font-mono text-[11px] capitalize flex items-center gap-1"><Link className="w-3 h-3"/> {rel.type}</span>
                          <span className="text-slate-700 truncate max-w-[160px] font-medium">{rel.related_product.name}</span>
                        </div>
                      ))}
                      {nodeRels.length === 0 && <div className="text-xs text-slate-500 italic">No specific product relationships defined.</div>}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-black text-xs text-slate-500 italic">
                    Manufacturer node or external entity.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
