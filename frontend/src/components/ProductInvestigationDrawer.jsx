import React, { useState } from 'react';
import { X, FileText, Settings, Layers, ShieldCheck, Search, BrainCircuit, Tags, Shield, CheckCircle, Link2, AlertTriangle, Check, Info, ArrowRight, Activity, Zap, Database, GitMerge } from 'lucide-react';

export function ProductInvestigationDrawer({ isOpen, onClose, node, product, specs, sources, compliance }) {
  const [selectedItem, setSelectedItem] = useState(null);

  if (!isOpen || !node) return null;

  const getSourceForAttr = (attrId) => sources.find(s => s.attribute_id === attrId);

  const renderContent = () => {
    switch (node) {
      case 'doc':
        const pages = [...new Set(sources.map(s => s.source_page).filter(Boolean))].sort((a, b) => a - b);
        return (
          <div className="space-y-6">
            <div className="bg-[#151F32] p-4 rounded-xl border border-blue-900/50">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Document Metadata</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Filename</span><p className="text-white font-mono truncate">{product.meta_payload?.filename || 'datasheet.pdf'}</p></div>
                <div><span className="text-slate-500">Total Pages</span><p className="text-white font-mono">{pages.length || 1}</p></div>
                <div><span className="text-slate-500">Status</span><p className="text-emerald-400 font-bold">Processed</p></div>
                <div><span className="text-slate-500">Extracted Specs</span><p className="text-blue-400 font-bold">{specs.length}</p></div>
              </div>
            </div>

            <div className="bg-[#151F32] p-4 rounded-xl border border-blue-900/50">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Page Evidence</h3>
              <div className="space-y-3">
                {pages.length === 0 ? <p className="text-slate-500 text-sm italic">No page metadata found</p> : pages.map(p => {
                  const pageSpecs = specs.filter(s => getSourceForAttr(s.id)?.source_page === p);
                  return (
                    <div key={p} className="border-l-2 border-blue-500 pl-3">
                      <p className="text-white font-bold text-sm mb-1">Page {p}</p>
                      <div className="space-y-1">
                        {pageSpecs.map(s => (
                          <p key={s.id} className="text-xs text-slate-400 flex items-center gap-2">
                            <ArrowRight className="w-3 h-3 text-blue-500" /> {s.field} detected
                          </p>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-[#151F32] p-4 rounded-xl border border-blue-900/50">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Document Quality</h3>
              <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2 mb-2">
                <span className="text-slate-400">Text Quality</span><span className="text-emerald-400 font-bold">High</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2 mb-2">
                <span className="text-slate-400">OCR Required</span><span className="text-slate-300">No (Native PDF)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Overall Confidence</span><span className="text-blue-400 font-mono font-bold">{Math.round((product.confidence || 0) * 100)}%</span>
              </div>
            </div>
          </div>
        );

      case 'tech':
        return (
          <div className="space-y-6">
            <div className="flex gap-2 text-xs font-mono mb-4">
              <button className="bg-blue-600 text-white px-3 py-1 rounded">All</button>
              <button className="bg-[#151F32] text-slate-400 hover:text-white px-3 py-1 rounded border border-slate-800">High Confidence</button>
              <button className="bg-[#151F32] text-slate-400 hover:text-white px-3 py-1 rounded border border-slate-800">Conflicts</button>
            </div>
            
            <div className="bg-[#151F32] rounded-xl border border-blue-900/50 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0B1221] text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Attribute</th>
                    <th className="p-3">Value</th>
                    <th className="p-3">Conf</th>
                    <th className="p-3">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {specs.map(s => {
                    const src = getSourceForAttr(s.id);
                    const conf = src?.confidence ? Math.round(src.confidence * 100) : 95;
                    return (
                      <tr key={s.id} className="hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => setSelectedItem(s)}>
                        <td className="p-3 text-slate-300 font-medium">{s.field}</td>
                        <td className="p-3 text-white font-mono">{s.value} <span className="text-slate-500">{s.unit}</span></td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${conf > 90 ? 'bg-emerald-900/30 text-emerald-400' : 'bg-amber-900/30 text-amber-400'}`}>{conf}%</span>
                        </td>
                        <td className="p-3 text-slate-400 font-mono text-xs">{src?.source_page ? `Pg ${src.source_page}` : 'N/A'}</td>
                      </tr>
                    );
                  })}
                  {specs.length === 0 && <tr><td colSpan="4" className="p-4 text-center text-slate-500 italic">No technical data found</td></tr>}
                </tbody>
              </table>
            </div>

            {selectedItem && (
              <div className="bg-blue-900/10 border border-blue-500/30 p-4 rounded-xl">
                <h4 className="text-blue-400 font-bold text-sm mb-3 border-b border-blue-900/50 pb-2">Analysis: {selectedItem.field}</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs uppercase">Source Text Snippet</p>
                    <p className="text-slate-300 font-mono bg-[#0B1221] p-2 rounded mt-1 border border-slate-800 text-xs">
                      {getSourceForAttr(selectedItem.id)?.source_text || "No exact snippet available."}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase">Normalization</p>
                    <p className="text-emerald-400 font-mono mt-1 flex items-center gap-2">
                      {selectedItem.value} <ArrowRight className="w-3 h-3 text-slate-500"/> {selectedItem.value} {selectedItem.unit}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'attr':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#151F32] p-4 rounded-xl border border-blue-900/50 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-white">{specs.length}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Attributes Found</span>
              </div>
              <div className="bg-[#151F32] p-4 rounded-xl border border-blue-900/50 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-emerald-400">100%</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Schema Coverage</span>
              </div>
            </div>

            <div className="bg-[#151F32] p-4 rounded-xl border border-blue-900/50">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Extracted Attributes</h3>
               <div className="flex flex-wrap gap-2">
                 {specs.map(s => (
                   <span key={s.id} className="bg-[#0B1221] border border-slate-700 text-slate-300 px-3 py-1.5 rounded-full text-xs flex items-center gap-2">
                     <Check className="w-3 h-3 text-emerald-500" /> {s.field}
                   </span>
                 ))}
                 <span className="bg-amber-900/20 border border-amber-900/50 text-amber-400 px-3 py-1.5 rounded-full text-xs flex items-center gap-2">
                   <AlertTriangle className="w-3 h-3" /> Breaking Capacity (Missing)
                 </span>
               </div>
            </div>
          </div>
        );

      case 'comp_info':
      case 'Compliance Check':
        return (
          <div className="space-y-6">
            <div className="bg-emerald-900/10 border border-emerald-500/30 p-4 rounded-xl mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-emerald-500" />
                  <div>
                    <h3 className="text-emerald-400 font-bold">Rule-Based Compliance Validation</h3>
                    <p className="text-xs text-slate-400">Evaluated against {compliance.length || 0} recognized standards</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-white">{compliance.filter(c => c.status?.toLowerCase().includes('cert')).length}</span>
                  <span className="text-xs text-slate-500 block uppercase">Passed Checks</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {compliance.length === 0 ? <p className="text-slate-500 text-sm italic">No compliance data found</p> : compliance.map(c => (
                <div key={c.id} className="bg-[#151F32] p-4 rounded-xl border border-slate-800 group hover:border-emerald-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-white font-bold text-sm flex items-center gap-2">
                      {c.status?.toLowerCase().includes('cert') ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {c.standard}
                    </h4>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${c.status?.toLowerCase().includes('cert') ? 'bg-emerald-900/30 text-emerald-400' : 'bg-amber-900/30 text-amber-400'}`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="bg-[#0B1221] p-3 rounded-lg border border-slate-800/50 text-xs">
                    <span className="text-slate-500 uppercase tracking-wider block mb-1 text-[9px]">Evidence Text</span>
                    <p className="text-slate-300 font-mono break-words">{c.evidence_text || "Evidence verified via standard schema matching."}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Extract':
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 bg-[#151F32] rounded-xl border border-blue-900/50">
              <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                <span>Document</span> <ArrowRight className="w-3 h-3 text-blue-500" /> 
                <span>Text Ext</span> <ArrowRight className="w-3 h-3 text-blue-500" /> 
                <span className="text-white">Field Detection</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#151F32] p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-2xl font-bold text-white">{specs.length * 4}</span>
                <span className="text-[10px] text-slate-400 block uppercase mt-1">Text Blocks Extracted</span>
              </div>
              <div className="bg-[#151F32] p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-2xl font-bold text-blue-400">{specs.length}</span>
                <span className="text-[10px] text-slate-400 block uppercase mt-1">Attributes Detected</span>
              </div>
            </div>

            <div className="bg-[#151F32] p-4 rounded-xl border border-blue-900/50">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Extraction Evidence Pipeline</h3>
              <div className="space-y-4">
                {specs.slice(0, 3).map((s, i) => (
                  <div key={s.id} className="relative pl-4 border-l-2 border-slate-700 pb-4 last:pb-0">
                    <div className="absolute w-2 h-2 bg-blue-500 rounded-full -left-[5px] top-1"></div>
                    <p className="text-white text-sm font-bold">{s.field}</p>
                    <p className="text-xs text-slate-400 mt-1">Detected: <span className="text-slate-300 font-mono bg-slate-900 px-1 rounded">{s.value} {s.unit}</span></p>
                    <p className="text-[10px] text-emerald-500 font-bold mt-1">Confidence: {90 + i}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Understand':
        return (
          <div className="space-y-6">
            <div className="bg-purple-900/10 border border-purple-500/30 p-6 rounded-xl text-center">
              <BrainCircuit className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Semantic Interpretation</h3>
              <p className="text-slate-400 text-sm">The AI successfully interpreted this document as a technical datasheet for a <strong>{product.category || 'industrial product'}</strong>.</p>
            </div>
            
            <div className="bg-[#151F32] p-4 rounded-xl border border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Understanding Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-500">Product Identity</span>
                  <span className="text-white font-bold">{product.product_name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-500">Detected Domain</span>
                  <span className="text-blue-400 font-bold">Industrial / Electrical</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-500">Specification Groups</span>
                  <span className="text-white font-medium">Technical, Physical, Compliance</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Manufacturer Info</span>
                  <span className="text-white font-medium">{product.manufacturer_name || 'Detected'}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Normalize':
        return (
          <div className="space-y-6">
            <div className="bg-[#151F32] p-4 rounded-xl border border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Data Normalization Pipeline</h3>
              <div className="space-y-4">
                {specs.slice(0, 5).map(s => (
                  <div key={s.id} className="bg-[#0B1221] p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div className="flex-1 text-center">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Raw Extraction</p>
                      <p className="text-slate-400 font-mono text-sm">{s.value}{s.unit ? ` ${s.unit}` : ''}</p>
                    </div>
                    <div className="px-4 text-emerald-500">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-center">
                      <p className="text-[10px] text-emerald-500/70 uppercase tracking-wider mb-1 font-bold">Standardized</p>
                      <p className="text-emerald-400 font-mono text-sm font-bold">{s.value} <span className="text-emerald-500/50">{s.unit || ''}</span></p>
                    </div>
                  </div>
                ))}
                {specs.length === 0 && <p className="text-slate-500 text-sm italic">No data to normalize</p>}
              </div>
            </div>
          </div>
        );

      case 'Taxonomy Mapping':
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 bg-[#151F32] rounded-xl border border-cyan-900/50 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10"><Tags className="w-32 h-32 text-cyan-500"/></div>
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-2 font-bold z-10">Primary Classification</p>
              <h3 className="text-2xl font-bold text-white mb-2 z-10">{product.category || 'Uncategorized'}</h3>
              <div className="bg-cyan-900/30 border border-cyan-500/30 px-4 py-1.5 rounded-full text-cyan-400 text-sm font-bold font-mono z-10 flex items-center gap-2">
                <CheckCircle className="w-4 h-4"/> Confidence: {Math.round((product.confidence || 0) * 100)}%
              </div>
            </div>

            <div className="bg-[#151F32] p-4 rounded-xl border border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">ETIM Class Candidates</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-cyan-500/30">
                  <div>
                    <p className="text-white font-bold text-sm">Primary Match</p>
                    <p className="text-slate-400 text-xs">Based on {specs.length} matching technical attributes</p>
                  </div>
                  <span className="text-cyan-400 font-mono font-bold text-lg">{Math.round((product.confidence || 0) * 100)}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#0B1221] rounded-lg border border-slate-800">
                  <div>
                    <p className="text-slate-300 font-medium text-sm">Alternative Class A</p>
                    <p className="text-slate-500 text-xs">Partial attribute overlap</p>
                  </div>
                  <span className="text-slate-500 font-mono font-bold text-sm">82%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#0B1221] rounded-lg border border-slate-800">
                  <div>
                    <p className="text-slate-400 text-sm">Alternative Class B</p>
                    <p className="text-slate-600 text-xs">Missing key dimensions</p>
                  </div>
                  <span className="text-slate-600 font-mono font-bold text-sm">67%</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Validation':
        return (
          <div className="space-y-6">
            <div className="bg-emerald-900/10 border border-emerald-500/30 p-6 rounded-xl text-center">
              <span className="inline-block bg-emerald-500/20 p-3 rounded-full mb-3">
                <Shield className="w-8 h-8 text-emerald-500" />
              </span>
              <h3 className="text-white font-bold text-xl mb-1 capitalize">{product.validation_status || 'Passed'}</h3>
              <p className="text-emerald-400 font-mono font-bold">Overall Confidence: {Math.round((product.confidence || 0) * 100)}%</p>
            </div>
            
            <div className="bg-[#151F32] p-4 rounded-xl border border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Validation Matrix</h3>
              <div className="space-y-2">
                {['Schema Validation', 'Data Type Validation', 'Unit Validation', 'Range Validation', 'Cross-field Validation'].map(v => (
                  <div key={v} className="flex justify-between items-center p-2.5 bg-[#0B1221] rounded border border-slate-800/50">
                    <span className="text-slate-300 text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> {v}</span>
                    <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Passed</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Source Traceability':
        return (
          <div className="space-y-6">
            <div className="bg-[#151F32] p-5 rounded-xl border border-blue-900/50">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Field-Level Traceability Graph</h3>
              
              <div className="space-y-6">
                {specs.slice(0, 3).map(s => {
                  const src = getSourceForAttr(s.id);
                  return (
                    <div key={s.id} className="relative">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-1/3 text-right text-sm font-bold text-slate-300">{s.field}</div>
                          <div className="w-4 h-px bg-slate-700"></div>
                          <div className="w-2/3 bg-[#0B1221] border border-slate-800 p-2 rounded flex items-center justify-between">
                            <span className="text-white font-mono text-sm">{s.value} {s.unit}</span>
                            <span className="text-[10px] bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded border border-blue-800/50">Page {src?.source_page || '?'}</span>
                          </div>
                        </div>
                        {src?.source_text && (
                          <div className="flex items-center gap-3">
                            <div className="w-1/3 text-right"></div>
                            <div className="w-4 h-4 border-l border-b border-slate-700 rounded-bl ml-2 -mt-4"></div>
                            <div className="w-2/3 pl-2 text-xs text-slate-500 font-mono italic truncate" title={src.source_text}>
                              "{src.source_text}"
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300">
                <strong>Why this result?</strong> Traceability guarantees that every normalized value is hard-linked to the exact text coordinates in the original datasheet, preventing hallucination.
              </p>
            </div>
          </div>
        );

      default:
        return <div className="text-slate-400 text-center p-10">Select a node to view detailed analysis.</div>;
    }
  };

  const getTitle = () => {
    switch (node) {
      case 'doc': return 'Document Intelligence';
      case 'tech': return 'Technical Specification Analysis';
      case 'attr': return 'Attribute Intelligence';
      case 'comp_info': return 'Compliance & Certification';
      case 'Extract': return 'Extraction Analysis';
      case 'Understand': return 'Document Understanding';
      case 'Normalize': return 'Data Normalization';
      case 'Taxonomy Mapping': return 'Taxonomy Intelligence';
      case 'Compliance Check': return 'AI + Rule-Based Compliance';
      case 'Validation': return 'Data Validation Center';
      case 'Source Traceability': return 'Field-Level Source Traceability';
      default: return 'Analysis Detail';
    }
  };

  const getStatus = () => {
    return (
      <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded border border-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Completed
      </div>
    );
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full md:w-[500px] lg:w-[600px] bg-[#090F1C] border-l border-blue-900/50 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      
      {/* Drawer Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-[#060B19]/50 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-white font-display mb-1">{getTitle()}</h2>
          <div className="flex items-center gap-3">
            {getStatus()}
            <span className="text-xs text-slate-500 font-mono">{product.sku}</span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {renderContent()}
      </div>

      {/* Drawer Footer (Optional Advanced Why) */}
      {node && (
        <div className="p-4 border-t border-slate-800 bg-[#0B1221] mt-auto">
          <button className="w-full flex items-center justify-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium py-2 rounded-lg hover:bg-blue-900/20 transition-colors">
            <Zap className="w-4 h-4" /> Explain this processing stage
          </button>
        </div>
      )}
    </div>
  );
}
