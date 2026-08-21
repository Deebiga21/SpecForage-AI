import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, getProductSpecs, getProductSources, getProductCompliance, getProductRelationships } from '../services/api';
import { 
  ArrowLeft, FileText, ShieldCheck, Check, Search, 
  Cpu, Database, BrainCircuit, Activity, Tags, Shield, CheckCircle, Link2, 
  Settings, Layers, ChevronRight, Share2, Package
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductInvestigationDrawer } from '../components/ProductInvestigationDrawer';

export function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [specs, setSpecs] = useState([]);
  const [sources, setSources] = useState([]);
  const [compliance, setCompliance] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    Promise.all([
      getProduct(id), getProductSpecs(id), getProductSources(id), getProductCompliance(id), getProductRelationships(id)
    ]).then(([p, s, src, c, r]) => {
      setProduct(p); setSpecs(s); setSources(src); setCompliance(c); setRelationships(r);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-20 text-center text-blue-400 font-mono flex items-center justify-center min-h-screen"><Activity className="w-8 h-8 animate-spin mr-3"/> Loading Product Data...</div>;
  if (!product) return <div className="p-20 text-center text-rose-600 font-mono min-h-screen">Product not found</div>;

  const getSourceForAttr = (attrId) => sources.find(s => s.attribute_id === attrId);

  // Nodes for the center AI engine
  const aiStages = [
    { label: 'Extract', icon: Search },
    { label: 'Understand', icon: BrainCircuit },
    { label: 'Normalize', icon: Settings },
    { label: 'Taxonomy Mapping', icon: Tags },
    { label: 'Compliance Check', icon: Shield },
    { label: 'Validation', icon: CheckCircle },
    { label: 'Source Traceability', icon: Link2 }
  ];

  return (
    <div className="min-h-screen bg-[#060B19] text-slate-300 font-sans p-4 sm:p-6 overflow-hidden relative">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 relative z-10 flex items-center justify-between">
        <div>
          <button onClick={() => navigate('/app/products')} className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-2 text-sm font-mono uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
          </button>
          <h1 className="text-3xl font-bold font-display text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-500" />
            PRODUCT INTELLIGENCE RECORD
          </h1>
          <p className="text-slate-400 font-mono mt-1 text-sm tracking-wide">"From Industrial Datasheet → Verified Product Intelligence"</p>
        </div>
      </div>

      {/* Main Diagram Layout */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr_400px] gap-8 relative z-10 items-stretch">
        
        {/* ==========================================
            LEFT SIDE - INPUT
            ========================================== */}
        <div className="flex flex-col gap-6 h-full">
          <div className="bg-[#0D1527] border border-blue-900/50 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-blue-700/50 transition-colors flex-1 flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-400"></div>
            
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <FileText className="w-4 h-4" /> SOURCE PRODUCT DATA
            </h2>
            
            <div className="space-y-4 mb-8">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Product</p>
                <p className="text-white font-bold text-lg leading-tight">{product.product_name || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">SKU</p>
                  <p className="text-blue-300 font-mono text-sm break-all">{product.sku}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Manufacturer</p>
                  <p className="text-slate-300 font-mono text-sm truncate" title={product.manufacturer_name}>{product.manufacturer_name || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Stacked Input Cards */}
            <div className="space-y-3 relative mt-auto">
              {/* Connecting line to center */}
              <div className="hidden lg:block absolute top-1/2 -right-12 w-12 h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent z-0"></div>
              
              <button onClick={() => setSelectedNode('doc')} className="w-full bg-[#151F32] border border-slate-700/50 p-3 rounded-lg flex items-center gap-3 text-sm font-medium text-slate-200 shadow-lg relative z-10 hover:bg-[#1A263D] transition-colors cursor-pointer">
                <FileText className="w-4 h-4 text-slate-400" /> Product Document
              </button>
              <button onClick={() => setSelectedNode('tech')} className="w-full bg-[#151F32] border border-slate-700/50 p-3 rounded-lg flex items-center gap-3 text-sm font-medium text-slate-200 shadow-lg relative z-10 hover:bg-[#1A263D] transition-colors cursor-pointer">
                <Settings className="w-4 h-4 text-slate-400" /> Technical Data
              </button>
              <button onClick={() => setSelectedNode('attr')} className="w-full bg-[#151F32] border border-slate-700/50 p-3 rounded-lg flex items-center gap-3 text-sm font-medium text-slate-200 shadow-lg relative z-10 hover:bg-[#1A263D] transition-colors cursor-pointer">
                <Layers className="w-4 h-4 text-slate-400" /> Product Attributes
              </button>
              <button onClick={() => setSelectedNode('comp_info')} className="w-full bg-[#151F32] border border-slate-700/50 p-3 rounded-lg flex items-center gap-3 text-sm font-medium text-slate-200 shadow-lg relative z-10 hover:bg-[#1A263D] transition-colors cursor-pointer">
                <ShieldCheck className="w-4 h-4 text-slate-400" /> Compliance Information
              </button>
            </div>
          </div>
        </div>

        {/* ==========================================
            CENTER - AI PROCESSING
            ========================================== */}
        <div className="relative flex flex-col items-center justify-center py-12 lg:py-0 min-h-[400px] h-full">
          {/* Main flow arrows from Left and to Right */}
          <div className="hidden lg:flex absolute top-1/2 left-0 -translate-y-1/2 -translate-x-4 items-center text-blue-500/50 animate-pulse">
            <ChevronRight className="w-12 h-12" />
          </div>
          <div className="hidden lg:flex absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 items-center text-emerald-500/50 animate-pulse">
            <ChevronRight className="w-12 h-12" />
          </div>

          {/* Central Orbit System */}
          <div className="relative w-[340px] h-[340px] flex items-center justify-center scale-90 sm:scale-100">
            {/* Outer rings */}
            <div className="absolute inset-0 rounded-full border border-blue-900/40 animate-[spin_60s_linear_infinite]"></div>
            <div className="absolute inset-4 rounded-full border border-dashed border-blue-500/20 animate-[spin_40s_linear_infinite_reverse]"></div>
            
            {/* Central Engine */}
            <div className="absolute z-20 w-32 h-32 rounded-full bg-[#0B1426] border-2 border-blue-500 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)]">
              <Cpu className="w-10 h-10 text-blue-400 mb-1" />
              <span className="font-bold text-white font-display text-sm text-center leading-tight">SPECForge<br/>AI</span>
            </div>

            {/* Surrounding Nodes */}
            {aiStages.map((stage, index) => {
              const angle = (index * (360 / aiStages.length)) - 90;
              const radius = 170; // Distance from center
              const x = Math.cos(angle * Math.PI / 180) * radius;
              const y = Math.sin(angle * Math.PI / 180) * radius;
              
              return (
                <div 
                  key={stage.label} 
                  onClick={() => setSelectedNode(stage.label)}
                  className="cursor-pointer absolute z-30 flex flex-col items-center justify-center p-3 rounded-xl bg-[#0D1527]/90 border border-blue-800/60 w-28 h-24 backdrop-blur-md shadow-lg shadow-blue-900/20 transition-transform hover:scale-110 hover:border-blue-400"
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                >
                  <stage.icon className="w-6 h-6 text-cyan-400 mb-2" />
                  <span className="text-[10px] text-slate-200 font-bold text-center uppercase tracking-wider leading-tight">{stage.label}</span>
                </div>
              );
            })}
            
            {/* Connection Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none" viewBox="0 0 340 340">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(59,130,246,0.5)" />
                  <stop offset="100%" stopColor="rgba(6,182,212,0.5)" />
                </linearGradient>
              </defs>
              {aiStages.map((_, index) => {
                const angle = (index * (360 / aiStages.length)) - 90;
                const radius = 140;
                const x = 170 + Math.cos(angle * Math.PI / 180) * radius;
                const y = 170 + Math.sin(angle * Math.PI / 180) * radius;
                return <line key={index} x1="170" y1="170" x2={x} y2={y} stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4" />;
              })}
            </svg>
          </div>
        </div>

        {/* ==========================================
            RIGHT SIDE - OUTPUT
            ========================================== */}
        <div className="flex flex-col gap-6 h-full max-h-[800px]">
          <div className="bg-[#0D1527] border border-emerald-900/50 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-emerald-700/50 transition-colors h-full flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
            
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2 flex-shrink-0">
              <Database className="w-4 h-4" /> VERIFIED PRODUCT INTELLIGENCE
            </h2>
            
            <div className="overflow-y-auto pr-2 space-y-6 flex-1 custom-scrollbar">
              
              {/* 1. PRODUCT */}
              <div>
                <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5"><Package className="w-3 h-3"/> 1. PRODUCT</h3>
                <div className="bg-[#151F32] p-3 rounded-lg border border-slate-800">
                  <p className="text-white font-bold text-sm">{product.product_name || 'N/A'}</p>
                </div>
              </div>

              {/* 2. SPECIFICATIONS */}
              <div>
                <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5"><Settings className="w-3 h-3"/> 2. SPECIFICATIONS</h3>
                <div className="bg-[#151F32] p-3 rounded-lg border border-slate-800 space-y-1.5">
                  {specs.length === 0 ? (
                    <p className="text-slate-400 text-xs italic">No specifications found</p>
                  ) : (
                    specs.map(s => (
                      <div key={s.id} className="flex justify-between items-center text-xs border-b border-slate-800/50 last:border-0 pb-1.5 last:pb-0">
                        <span className="text-slate-400">{s.field}</span>
                        <span className="text-white font-mono font-medium text-right max-w-[60%] break-words">{s.value} <span className="text-slate-500">{s.unit || ''}</span></span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 3. TAXONOMY */}
              <div>
                <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5"><Tags className="w-3 h-3"/> 3. TAXONOMY</h3>
                <div className="bg-[#151F32] p-3 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">• Category:</span>
                    <span className="text-white font-medium text-right">{product.category || 'Uncategorized'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">• Confidence:</span>
                    <span className="text-emerald-400 font-mono font-bold">{Math.round((product.confidence || 0) * 100)}%</span>
                  </div>
                </div>
              </div>

              {/* 4. COMPLIANCE */}
              <div>
                <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5"><ShieldCheck className="w-3 h-3"/> 4. COMPLIANCE</h3>
                <div className="bg-[#151F32] p-3 rounded-lg border border-slate-800 space-y-1.5">
                  {compliance.length === 0 ? (
                    <p className="text-slate-400 text-xs italic">No compliance data found</p>
                  ) : (
                    compliance.map(c => (
                      <div key={c.id} className="flex justify-between items-center text-xs border-b border-slate-800/50 last:border-0 pb-1.5 last:pb-0">
                        <span className="text-slate-400">• {c.standard}:</span>
                        <span className={`font-mono font-bold ${c.status?.toLowerCase() === 'certified' || c.status?.toLowerCase() === 'compliant' ? 'text-emerald-400' : 'text-amber-400'}`}>{c.status}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 5. VALIDATION */}
              <div>
                <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5"><CheckCircle className="w-3 h-3"/> 5. VALIDATION</h3>
                <div className="bg-[#151F32] p-3 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">• Overall Confidence:</span>
                    <span className="text-emerald-400 font-mono font-bold">{Math.round((product.confidence || 0) * 100)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">• Validation Status:</span>
                    <span className="text-white font-medium capitalize">{product.validation_status || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* 6. SOURCE TRACEABILITY */}
              {specs.length > 0 && (
                <div>
                  <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5"><Link2 className="w-3 h-3"/> 6. SOURCE TRACEABILITY</h3>
                  <div className="bg-[#151F32] p-3 rounded-lg border border-slate-800 space-y-1.5">
                    {specs.map(s => {
                      const src = getSourceForAttr(s.id);
                      return (
                        <div key={s.id} className="flex justify-between items-center text-xs border-b border-slate-800/50 last:border-0 pb-1.5 last:pb-0">
                          <span className="text-slate-400 truncate mr-2 flex-1">• {s.field}</span>
                          <span className="text-blue-300 font-mono flex-shrink-0 bg-blue-900/30 px-1.5 py-0.5 rounded text-[10px] border border-blue-800/50">
                            {src ? `Page ${src.source_page || '?'}` : 'No evidence'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
      
      {/* Investigation Drawer */}
      <ProductInvestigationDrawer 
        isOpen={!!selectedNode} 
        onClose={() => setSelectedNode(null)} 
        node={selectedNode}
        product={product}
        specs={specs}
        sources={sources}
        compliance={compliance}
      />

      {/* Global styles for custom scrollbar scoped here for ease */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(51, 65, 85, 0.8);
          border-radius: 4px;
        }
      `}} />
    </div>
  );
}
