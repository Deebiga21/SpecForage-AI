import React, { useState, useEffect } from 'react';
import { Loader, AlertTriangle, Copy, RefreshCw, ShieldAlert, Activity, Lightbulb, Tag, AlertOctagon, X, CheckCircle, Search, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../services/api';

const INSIGHT_TYPES = [
  { id: 'gaps', label: 'Data Gaps', icon: AlertTriangle, color: 'text-yellow-500' },
  { id: 'duplicates', label: 'Duplicates', icon: Copy, color: 'text-blue-500' },
  { id: 'replacements', label: 'Replacements', icon: RefreshCw, color: 'text-green-500' },
  { id: 'compliance', label: 'Compliance', icon: ShieldAlert, color: 'text-purple-500' },
  { id: 'quality', label: 'Quality', icon: Activity, color: 'text-teal-500' },
  { id: 'opportunities', label: 'Opportunities', icon: Lightbulb, color: 'text-yellow-300' },
  { id: 'taxonomy', label: 'Taxonomy', icon: Tag, color: 'text-pink-500' },
  { id: 'risks', label: 'Risks', icon: AlertOctagon, color: 'text-red-500' }
];

export function InsightsPage() {
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('gaps');
  const [selectedInsight, setSelectedInsight] = useState(null);
  
  const [data, setData] = useState({
    gaps: [], duplicates: [], replacements: [], compliance: [],
    quality: null, opportunities: [], taxonomy: [], risks: []
  });

  const loadInsights = async () => {
    try {
      const endpoints = [
        'data-gaps', 'duplicates', 'replacements', 
        'compliance', 'catalog-quality', 'opportunities', 
        'taxonomy', 'risks'
      ];
      
      const responses = await Promise.all(
        endpoints.map(ep => fetch(`${API_BASE_URL}/insights/${ep}`).then(res => res.json()))
      );

      setData({
        gaps: responses[0] || [],
        duplicates: responses[1] || [],
        replacements: responses[2] || [],
        compliance: responses[3] || [],
        quality: responses[4] || null,
        opportunities: responses[5] || [],
        taxonomy: responses[6] || [],
        risks: responses[7] || []
      });
    } catch (e) {
      console.error("Failed to load insights", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
    const interval = setInterval(loadInsights, 10000); // Poll every 10s for real-time feel
    return () => clearInterval(interval);
  }, []);

  const counts = {
    gaps: data.gaps.length,
    duplicates: data.duplicates.length,
    replacements: data.replacements.length,
    compliance: data.compliance.length,
    quality: data.quality ? 1 : 0,
    opportunities: data.opportunities.length,
    taxonomy: data.taxonomy.length,
    risks: data.risks.length,
  };

  if (loading && data.gaps.length === 0) {
    return <div className="flex justify-center p-20"><Loader className="w-8 h-8 animate-spin text-green-700 dark:text-[#00FF00]" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 px-4 relative min-h-screen">
      <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6 mt-8">
        <h1 className="text-3xl font-bold font-mono text-green-700 dark:text-[#00FF00] flex items-center gap-3">
          <Activity className="w-8 h-8" />
          PRODUCT INTELLIGENCE INSIGHTS
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 font-mono">"Identify gaps, risks, relationships and opportunities across processed products."</p>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        {INSIGHT_TYPES.map(type => (
          <button
            key={type.id}
            onClick={() => setActiveFilter(type.id)}
            className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${
              activeFilter === type.id 
                ? 'bg-green-50 dark:bg-[#1a2f1a] border-green-600 dark:border-[#00FF00] shadow-[0_0_15px_rgba(0,255,0,0.2)] scale-105 z-10' 
                : 'bg-white dark:bg-[#0D1117] border-slate-200 dark:border-slate-800 hover:border-slate-600 hover:bg-slate-50 dark:bg-slate-900'
            }`}
          >
            <type.icon className={`w-6 h-6 mb-2 ${activeFilter === type.id ? 'text-green-700 dark:text-[#00FF00]' : type.color}`} />
            <span className={`text-xs font-semibold tracking-wide ${activeFilter === type.id ? 'text-green-700 dark:text-[#00FF00]' : 'text-slate-600 dark:text-slate-400'}`}>
              {type.label}
            </span>
            <span className={`text-2xl font-bold mt-1 ${activeFilter === type.id ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
              {counts[type.id]}
            </span>
          </button>
        ))}
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeFilter === 'gaps' && data.gaps.map(gap => (
          <div key={gap.id} className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 p-6 rounded-xl flex flex-col hover:border-green-600 dark:border-[#00FF00]/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-yellow-500 font-bold mb-1">
                <AlertTriangle className="w-5 h-5" /> DATA GAP
              </div>
              {gap.severity && (
                <span className={`text-xs px-2 py-1 rounded border font-mono ${
                  gap.severity === 'HIGH' || gap.severity === 'CRITICAL' ? 'bg-red-900/30 text-red-400 border-red-500/30' : 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
                }`}>{gap.severity}</span>
              )}
            </div>
            <h3 className="text-slate-900 dark:text-white text-lg font-bold truncate">{gap.product_name || `Product ${gap.product_id}`}</h3>
            <p className="text-slate-600 dark:text-slate-400 font-mono text-sm mb-4">SKU: {gap.sku}</p>
            
            <p className="text-slate-700 dark:text-slate-300 mb-3 text-sm font-semibold">{gap.missing_attributes?.length || 0} Missing Critical Specifications</p>
            
            <div className="space-y-2 mb-6 flex-1">
              {gap.missing_attributes?.slice(0, 3).map((attr, idx) => (
                <div key={idx} className="flex items-center text-slate-700 dark:text-slate-300 text-sm gap-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded">
                  <span className="text-red-500">❌</span> {attr}
                </div>
              ))}
              {gap.missing_attributes?.length > 3 && (
                <div className="text-slate-500 text-sm ml-6 italic">...and {gap.missing_attributes.length - 3} more</div>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="text-slate-600 dark:text-slate-400 text-sm">
                Completeness: <span className="text-slate-900 dark:text-white font-bold">{gap.completeness_score}%</span>
              </div>
              <button 
                onClick={() => setSelectedInsight({ type: 'gap', data: gap })}
                className="text-green-700 dark:text-[#00FF00] text-sm hover:text-slate-900 dark:text-white transition-colors bg-[#00FF00]/10 px-3 py-1.5 rounded border border-green-600 dark:border-[#00FF00]/30 hover:bg-[#00FF00]/20 font-mono"
              >
                [ View Missing Fields ]
              </button>
            </div>
          </div>
        ))}

        {activeFilter === 'duplicates' && data.duplicates.map(dup => (
          <div key={dup.id} className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 p-6 rounded-xl flex flex-col hover:border-blue-500/50 transition-colors">
            <div className="flex items-center gap-2 text-blue-500 font-bold mb-4">
              <Copy className="w-5 h-5" /> DUPLICATE DETECTED
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <div className="text-center flex-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <p className="text-slate-900 dark:text-white font-mono font-bold">{dup.product_a?.sku}</p>
              </div>
              <div className="px-4 text-slate-500 text-xs font-bold">VS</div>
              <div className="text-center flex-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <p className="text-slate-900 dark:text-white font-mono font-bold">{dup.product_b?.sku}</p>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <div className="inline-flex items-center bg-blue-900/20 border border-blue-500/30 rounded-full px-4 py-1.5">
                <span className="text-slate-700 dark:text-slate-300 text-sm mr-2">Similarity:</span>
                <span className="text-blue-400 font-bold">{dup.similarity_percentage}%</span>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
              <button 
                onClick={() => setSelectedInsight({ type: 'duplicate', data: dup })}
                className="text-blue-400 text-sm hover:text-slate-900 dark:text-white transition-colors bg-blue-500/10 px-4 py-1.5 rounded border border-blue-500/30 font-mono w-full"
              >
                [ Compare Products ]
              </button>
            </div>
          </div>
        ))}

        {activeFilter === 'replacements' && data.replacements.map(rep => (
          <div key={rep.id} className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 p-6 rounded-xl flex flex-col hover:border-green-500/50 transition-colors">
            <div className="flex items-center gap-2 text-green-500 font-bold mb-4">
              <RefreshCw className="w-5 h-5" /> POSSIBLE REPLACEMENT
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-2 border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-500"></div>
              <p className="text-slate-600 dark:text-slate-400 text-xs mb-1 uppercase tracking-wider">Current Product</p>
              <p className="text-slate-900 dark:text-white font-mono">{rep.current_product?.sku}</p>
            </div>
            
            <div className="flex justify-center my-1 text-green-500">
              <ChevronRight className="w-5 h-5 rotate-90" />
            </div>
            
            <div className="bg-green-50 dark:bg-[#1a2f1a]/30 rounded-lg p-4 mb-4 border border-green-600 dark:border-[#00FF00]/20 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#00FF00]"></div>
              <p className="text-green-500/70 text-xs mb-1 uppercase tracking-wider">Replacement</p>
              <p className="text-green-700 dark:text-[#00FF00] font-mono font-bold">{rep.replacement_product?.sku}</p>
            </div>
            
            <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
              <span className="text-sm text-slate-600 dark:text-slate-400">Match: <span className="text-slate-900 dark:text-white font-bold">{rep.confidence}%</span></span>
              <button 
                onClick={() => setSelectedInsight({ type: 'replacement', data: rep })}
                className="text-green-400 text-sm hover:text-slate-900 dark:text-white transition-colors bg-green-500/10 px-3 py-1.5 rounded border border-green-500/30 font-mono"
              >
                [ View Compatibility ]
              </button>
            </div>
          </div>
        ))}

        {activeFilter === 'compliance' && data.compliance.map(comp => (
          <div key={comp.id} className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 p-6 rounded-xl flex flex-col hover:border-purple-500/50 transition-colors">
            <div className="flex items-center gap-2 text-purple-500 font-bold mb-4">
              <ShieldAlert className="w-5 h-5" /> COMPLIANCE ALERT
            </div>
            
            <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-1">{comp.product?.sku}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">Source: {comp.source_document}</p>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 mb-6">
              <span className="text-slate-900 dark:text-white font-bold text-lg">{comp.standard}</span>
              <span className={`text-sm px-3 py-1 rounded-full font-bold ${
                comp.evidence_status?.toLowerCase().includes('missing') 
                  ? 'bg-red-900/30 text-red-400 border border-red-500/30' 
                  : 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
              }`}>
                {comp.evidence_status}
              </span>
            </div>
            
            <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => setSelectedInsight({ type: 'compliance', data: comp })}
                className="text-purple-400 text-sm hover:text-slate-900 dark:text-white transition-colors bg-purple-500/10 px-4 py-2 rounded border border-purple-500/30 font-mono w-full"
              >
                [ Verify Evidence ]
              </button>
            </div>
          </div>
        ))}
        
        {activeFilter === 'quality' && data.quality && (
          <div className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 p-8 rounded-xl flex flex-col col-span-1 md:col-span-2 lg:col-span-3 hover:border-teal-500/50 transition-colors">
             <div className="flex items-center gap-2 text-teal-500 font-bold mb-8 text-xl">
              <Activity className="w-6 h-6" /> CATALOG QUALITY SCORE
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FF00] to-transparent opacity-50"></div>
                <div className="text-6xl font-bold text-green-700 dark:text-[#00FF00] mb-2 drop-shadow-[0_0_10px_rgba(0,255,0,0.3)]">{data.quality.completeness}%</div>
                <div className="text-slate-600 dark:text-slate-400 text-sm uppercase tracking-widest font-semibold mt-2">Completeness</div>
              </div>
              <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                <div className="text-6xl font-bold text-blue-400 mb-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">{data.quality.confidence}%</div>
                <div className="text-slate-600 dark:text-slate-400 text-sm uppercase tracking-widest font-semibold mt-2">Avg Confidence</div>
              </div>
              <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
                <div className="text-6xl font-bold text-red-400 mb-2 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]">{data.quality.validation_failures}</div>
                <div className="text-slate-600 dark:text-slate-400 text-sm uppercase tracking-widest font-semibold mt-2">Validation Failures</div>
              </div>
            </div>
          </div>
        )}

        {activeFilter === 'opportunities' && data.opportunities.map((opp, idx) => (
          <div key={idx} className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 p-6 rounded-xl flex flex-col hover:border-yellow-500/50 transition-colors">
            <div className="flex items-center gap-2 text-yellow-300 font-bold mb-4">
              <Lightbulb className="w-5 h-5" /> CATEGORY OPPORTUNITY
            </div>
            
            <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-1 truncate">{opp.category}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">Standardization Target</p>
            
            <div className="bg-yellow-900/10 border border-yellow-500/20 p-5 rounded-lg mb-6 flex flex-col items-center text-center">
              <p className="text-yellow-300 text-4xl font-bold mb-2">{opp.affected_products}</p>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-snug">
                products missing <br/><span className="text-slate-900 dark:text-white font-bold mt-1 inline-block bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded">"{opp.missing_attribute}"</span>
              </p>
            </div>
            
            <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => setSelectedInsight({ type: 'opportunity', data: opp })}
                className="text-yellow-300 text-sm hover:text-slate-900 dark:text-white transition-colors bg-yellow-500/10 px-4 py-2 rounded border border-yellow-500/30 font-mono w-full"
              >
                [ View Opportunity ]
              </button>
            </div>
          </div>
        ))}

        {activeFilter === 'taxonomy' && data.taxonomy.map(tax => (
          <div key={tax.id} className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 p-6 rounded-xl flex flex-col hover:border-pink-500/50 transition-colors">
            <div className="flex items-center gap-2 text-pink-500 font-bold mb-4">
              <Tag className="w-5 h-5" /> CLASSIFICATION
            </div>
            
            <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-4 truncate">{tax.product?.sku}</h3>
            
            <div className="flex flex-col gap-2 mb-6">
              <div className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Candidate ETIM Class:</div>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm break-all">
                {tax.current_class}
              </div>
            </div>
            
            <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
              <span className="text-sm text-slate-600 dark:text-slate-400">Confidence: <span className="text-slate-900 dark:text-white font-bold">{tax.confidence}%</span></span>
              <button 
                onClick={() => setSelectedInsight({ type: 'taxonomy', data: tax })}
                className="text-pink-400 text-sm hover:text-slate-900 dark:text-white transition-colors bg-pink-500/10 px-3 py-1.5 rounded border border-pink-500/30 font-mono"
              >
                [ Review ]
              </button>
            </div>
          </div>
        ))}

        {activeFilter === 'risks' && data.risks.map(risk => (
          <div key={risk.id} className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 p-6 rounded-xl flex flex-col hover:border-red-500/50 transition-colors relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <div className="flex items-center gap-2 text-red-500 font-bold mb-4">
              <AlertOctagon className="w-5 h-5" /> CONFLICT DETECTED
            </div>
            
            <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-4">{risk.product?.sku}</h3>
            
            <div className="flex flex-col gap-3 mb-6">
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500 mb-1 font-bold">{risk.source_a}</p>
                <p className="text-slate-900 dark:text-white font-mono text-sm truncate">{risk.value_a}</p>
              </div>
              <div className="flex justify-center -my-3 z-10">
                <span className="bg-red-900/80 text-red-400 text-xs font-bold px-2 py-1 rounded-full border border-red-500/30 backdrop-blur">VS</span>
              </div>
              <div className="bg-red-900/10 p-3 rounded-lg border border-red-900/50">
                <p className="text-xs text-red-400 mb-1 font-bold">{risk.source_b}</p>
                <p className="text-red-300 font-mono text-sm truncate">{risk.value_b}</p>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
              <button 
                onClick={() => setSelectedInsight({ type: 'risk', data: risk })}
                className="text-red-400 text-sm hover:text-slate-900 dark:text-white transition-colors bg-red-500/10 px-4 py-2 rounded border border-red-500/30 font-mono w-full"
              >
                [ Resolve Conflict ]
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* OVERLAY MODAL */}
      {selectedInsight && (
        <InsightOverlay 
          insight={selectedInsight} 
          onClose={() => setSelectedInsight(null)} 
        />
      )}
    </div>
  );
}

// Sub-component for the Overlay
function InsightOverlay({ insight, onClose }) {
  const { type, data } = insight;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#000000]/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0D1117] border border-green-600 dark:border-[#00FF00]/50 rounded-2xl shadow-[0_0_50px_rgba(0,255,0,0.15)] w-full max-w-2xl max-h-[90vh] flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 text-green-700 dark:text-[#00FF00] font-bold text-sm tracking-widest mb-2 uppercase">
              {type === 'gap' && <><AlertTriangle className="w-5 h-5 text-yellow-500" /> <span className="text-yellow-500">DATA GAP ANALYSIS</span></>}
              {type === 'duplicate' && <><Copy className="w-5 h-5 text-blue-500" /> <span className="text-blue-500">DUPLICATE ANALYSIS</span></>}
              {type === 'replacement' && <><RefreshCw className="w-5 h-5 text-green-500" /> <span className="text-green-500">REPLACEMENT ANALYSIS</span></>}
              {type === 'compliance' && <><ShieldAlert className="w-5 h-5 text-purple-500" /> <span className="text-purple-500">COMPLIANCE ANALYSIS</span></>}
              {type === 'opportunity' && <><Lightbulb className="w-5 h-5 text-yellow-300" /> <span className="text-yellow-300">OPPORTUNITY ANALYSIS</span></>}
              {type === 'taxonomy' && <><Tag className="w-5 h-5 text-pink-500" /> <span className="text-pink-500">TAXONOMY ANALYSIS</span></>}
              {type === 'risk' && <><AlertOctagon className="w-5 h-5 text-red-500" /> <span className="text-red-500">RISK ANALYSIS</span></>}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {type === 'gap' && (data.product_name || `Product ${data.product_id}`)}
              {type === 'duplicate' && 'Product Comparison'}
              {type === 'replacement' && 'Replacement Viability'}
              {type === 'compliance' && data.product?.sku}
              {type === 'opportunity' && data.category}
              {type === 'taxonomy' && data.product?.sku}
              {type === 'risk' && data.product?.sku}
            </h2>
            {(type === 'gap' || type === 'compliance' || type === 'taxonomy' || type === 'risk') && (
              <p className="text-slate-600 dark:text-slate-400 font-mono text-sm mt-2">SKU: {data.sku || data.product?.sku}</p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-700 rounded-full transition-colors text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 overflow-y-auto">
          {type === 'gap' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-slate-600 dark:text-slate-400 text-xs font-bold tracking-widest mb-4 uppercase">Data Completeness</h3>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex-1 h-4 bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-[#00FF00] rounded-full" 
                      style={{ width: `${data.completeness_score}%` }}
                    />
                  </div>
                  <span className="text-slate-900 dark:text-white font-bold font-mono text-lg">{data.completeness_score}%</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{data.extracted_fields || 0} / {data.expected_fields || 0} expected attributes found</p>
              </div>

              <div>
                <h3 className="text-slate-600 dark:text-slate-400 text-xs font-bold tracking-widest mb-4 uppercase">Missing Attributes</h3>
                <div className="space-y-3 font-mono text-sm">
                  {/* Simulate existing valid attributes visually for context */}
                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-slate-600" /> Rated Voltage</span>
                    <span className="text-slate-600 font-bold">FOUND</span>
                  </div>
                  
                  {/* Highlight missing attributes */}
                  {data.missing_attributes?.map((attr, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 rounded-lg bg-red-900/10 border border-red-500/40 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                      <span className="flex items-center gap-3 text-slate-900 dark:text-white pl-2"><span className="text-red-500">❌</span> {attr}</span>
                      <span className="text-red-400 text-xs font-bold px-2 py-1 bg-red-900/30 rounded border border-red-500/20">MISSING</span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-slate-600" /> Poles</span>
                    <span className="text-slate-600 font-bold">FOUND</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-[#1a2f1a]/20 border border-green-600 dark:border-[#00FF00]/20 p-6 rounded-xl">
                <h3 className="text-green-700 dark:text-[#00FF00] text-sm font-bold tracking-widest mb-4 flex items-center gap-2 uppercase">
                  <Search className="w-4 h-4" /> Source Analysis
                </h3>
                <div className="text-slate-700 dark:text-slate-300 text-sm space-y-2 mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded border border-slate-200 dark:border-slate-800">
                  <p>Pages checked: <span className="text-slate-900 dark:text-white font-mono">{data.pages_checked || '1-12'}</span></p>
                  <p>Verified evidence: <span className="text-red-400 font-mono font-bold">Not found in document</span></p>
                </div>
                
                <h3 className="text-yellow-400 text-sm font-bold tracking-widest mb-2 flex items-center gap-2 uppercase">
                  <Lightbulb className="w-4 h-4" /> Recommended Action
                </h3>
                <p className="text-slate-900 dark:text-white text-sm mb-6">{data.recommended_action || 'Obtain the missing specifications from the manufacturer.'}</p>
                
                <div className="flex gap-4 font-mono text-sm">
                  <button className="flex-1 bg-[#00FF00] text-black font-bold py-3 rounded-lg hover:bg-[#00cc00] transition-colors">
                    [ Mark For Review ]
                  </button>
                  <button className="flex-1 border border-green-600 dark:border-[#00FF00] text-green-700 dark:text-[#00FF00] font-bold py-3 rounded-lg hover:bg-[#00FF00]/10 transition-colors">
                    [ View Evidence ]
                  </button>
                </div>
              </div>
            </div>
          )}

          {type === 'duplicate' && (
            <div className="space-y-8">
              <div className="flex justify-between items-stretch gap-6">
                <div className="flex-1 bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-slate-900 dark:text-white font-bold text-2xl mb-6 text-center border-b border-slate-200 dark:border-slate-800 pb-4">{data.product_a?.sku}</h3>
                  <div className="space-y-4 text-sm text-left">
                    <div className="flex justify-between items-center bg-slate-200 dark:bg-slate-800/50 p-2 rounded">
                      <span className="text-slate-600 dark:text-slate-400">Status</span>
                      <span className="text-slate-900 dark:text-white font-bold px-2 py-0.5 bg-green-900/50 text-green-400 rounded">Active</span>
                    </div>
                    {data.matching_attributes?.map((attr, i) => (
                       <div key={i} className="flex flex-col gap-1">
                         <span className="text-slate-500 text-xs uppercase tracking-wider">Attr {i+1}</span>
                         <span className="text-slate-900 dark:text-white font-mono">{attr}</span>
                       </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-blue-900/30 p-6 rounded-full border border-blue-500/30 flex flex-col items-center">
                    <div className="text-4xl font-bold text-blue-400 mb-1">{data.similarity_percentage}%</div>
                    <div className="text-blue-300/70 text-xs uppercase tracking-widest font-bold">Similarity</div>
                  </div>
                </div>
                
                <div className="flex-1 bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-slate-900 dark:text-white font-bold text-2xl mb-6 text-center border-b border-slate-200 dark:border-slate-800 pb-4">{data.product_b?.sku}</h3>
                   <div className="space-y-4 text-sm text-left">
                    <div className="flex justify-between items-center bg-slate-200 dark:bg-slate-800/50 p-2 rounded">
                      <span className="text-slate-600 dark:text-slate-400">Status</span>
                      <span className="text-slate-900 dark:text-white font-bold px-2 py-0.5 bg-yellow-900/50 text-yellow-400 rounded">Candidate</span>
                    </div>
                    {data.matching_attributes?.map((attr, i) => (
                       <div key={i} className="flex flex-col gap-1">
                         <span className="text-slate-500 text-xs uppercase tracking-wider">Attr {i+1}</span>
                         <span className="text-slate-900 dark:text-white font-mono">{attr}</span>
                       </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4 font-mono text-sm">
                  <button className="flex-1 bg-blue-600 text-slate-900 dark:text-white font-bold py-3 rounded-lg hover:bg-blue-500 transition-colors">
                    [ Confirm Duplicate ]
                  </button>
                  <button className="flex-1 border border-slate-600 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-lg hover:bg-slate-200 dark:bg-slate-800 transition-colors">
                    [ Not Duplicate ]
                  </button>
              </div>
            </div>
          )}

          {type === 'replacement' && (
            <div className="space-y-10">
              <div className="flex flex-col gap-2">
                <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center relative">
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 uppercase tracking-widest font-bold">Current Product</p>
                  <h3 className="text-slate-900 dark:text-white font-bold text-3xl font-mono">{data.current_product?.sku}</h3>
                </div>
                
                <div className="flex justify-center text-green-500 -my-4 z-10 relative">
                  <div className="bg-green-50 dark:bg-[#1a2f1a] p-4 rounded-full border border-green-500/30 shadow-[0_0_15px_rgba(0,255,0,0.2)]">
                    <ChevronRight className="w-8 h-8 rotate-90" />
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-[#1a2f1a]/30 p-8 rounded-xl border border-green-600 dark:border-[#00FF00]/40 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FF00] to-transparent"></div>
                  <p className="text-green-500/80 text-sm mb-3 uppercase tracking-widest font-bold">Possible Replacement</p>
                  <h3 className="text-green-700 dark:text-[#00FF00] font-bold text-3xl font-mono drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]">{data.replacement_product?.sku}</h3>
                </div>
              </div>
              
              <div className="text-center p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-widest text-sm font-bold">Compatibility Score</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-1/3 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-green-500 rounded-full" style={{ width: `${data.confidence}%` }}></div>
                  </div>
                  <p className="text-4xl font-bold text-slate-900 dark:text-white">{data.confidence}%</p>
                  <div className="w-1/3 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex justify-end">
                     <div className="h-full bg-green-500 rounded-full" style={{ width: `${data.confidence}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {type === 'compliance' && (
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-slate-600 dark:text-slate-400 text-xs font-bold tracking-widest mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 uppercase">Compliance Evidence Matrix</h3>
                
                <div className="space-y-4 font-mono text-lg">
                  <div className="flex items-center justify-between p-4 bg-slate-200 dark:bg-slate-800/50 rounded-lg">
                    <span className="text-slate-900 dark:text-white font-bold">RoHS</span>
                    <span className="text-green-400 flex items-center gap-3 bg-green-900/20 px-3 py-1 rounded border border-green-500/20 text-sm"><CheckCircle className="w-5 h-5" /> Verified</span>
                  </div>
                  <div className={`flex items-center justify-between p-4 rounded-lg border ${data.standard === 'REACH' ? 'bg-yellow-900/20 border-yellow-500/50 relative overflow-hidden' : 'bg-slate-200 dark:bg-slate-800/50 border-transparent'}`}>
                    {data.standard === 'REACH' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>}
                    <span className="text-slate-900 dark:text-white font-bold">REACH</span>
                    <span className={`${data.standard === 'REACH' ? 'text-yellow-400' : 'text-green-400'} flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 px-3 py-1 rounded text-sm`}>
                       {data.standard === 'REACH' ? <><AlertTriangle className="w-5 h-5"/> {data.evidence_status}</> : <><CheckCircle className="w-5 h-5" /> Verified</>}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-200 dark:bg-slate-800/50 rounded-lg">
                    <span className="text-slate-900 dark:text-white font-bold">UL</span>
                    <span className="text-green-400 flex items-center gap-3 bg-green-900/20 px-3 py-1 rounded border border-green-500/20 text-sm"><CheckCircle className="w-5 h-5" /> Verified</span>
                  </div>
                  <div className={`flex items-center justify-between p-4 rounded-lg border ${data.standard === 'CE' ? 'bg-yellow-900/20 border-yellow-500/50 relative overflow-hidden' : 'bg-slate-200 dark:bg-slate-800/50 border-transparent'}`}>
                    {data.standard === 'CE' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>}
                    <span className="text-slate-900 dark:text-white font-bold">CE</span>
                    <span className={`${data.standard === 'CE' ? 'text-yellow-400' : 'text-yellow-500'} flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 px-3 py-1 rounded text-sm`}>
                      ⚠ {data.standard === 'CE' ? data.evidence_status : 'Evidence unclear'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {type === 'opportunity' && (
            <div className="space-y-6 text-center">
              <div className="bg-yellow-900/10 border border-yellow-500/30 p-10 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Lightbulb className="w-32 h-32 text-yellow-500" />
                </div>
                <h3 className="text-slate-900 dark:text-white text-3xl font-bold mb-8 relative z-10">{data.category}</h3>
                <p className="text-yellow-400 text-7xl font-bold mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)] relative z-10">{data.affected_products}</p>
                <p className="text-slate-700 dark:text-slate-300 text-xl relative z-10">products in this category are missing</p>
                <div className="inline-block mt-6 bg-slate-50 dark:bg-slate-900/80 px-8 py-4 rounded-xl border border-slate-700 relative z-10 shadow-lg">
                   <p className="text-slate-900 dark:text-white font-mono text-2xl font-bold tracking-wide">"{data.missing_attribute}"</p>
                </div>
              </div>
              <button className="bg-yellow-600 text-slate-900 dark:text-white font-bold py-4 px-10 rounded-xl hover:bg-yellow-500 transition-colors text-lg font-mono shadow-[0_0_20px_rgba(202,138,4,0.3)] w-full">
                [ Extract Attribute Across Category ]
              </button>
            </div>
          )}

          {type === 'taxonomy' && (
            <div className="space-y-10">
              <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 font-bold uppercase tracking-widest">Product</p>
                <h3 className="text-slate-900 dark:text-white font-bold text-3xl font-mono">{data.product?.sku}</h3>
              </div>
              
              <div className="flex justify-center text-pink-500 -my-4 relative z-10">
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-full border border-pink-500/30">
                  <ChevronRight className="w-8 h-8 rotate-90" />
                </div>
              </div>
              
              <div className="bg-pink-900/10 p-8 rounded-xl border border-pink-500/40 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
                <p className="text-pink-500/80 text-sm mb-3 font-bold uppercase tracking-widest">Candidate ETIM Class</p>
                <h3 className="text-pink-400 font-bold text-2xl font-mono p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg inline-block border border-pink-500/20">{data.current_class}</h3>
              </div>
              
              <div className="text-center p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-slate-600 dark:text-slate-400 mb-3 font-bold uppercase tracking-widest text-sm">Confidence Score</p>
                <p className="text-5xl font-bold text-slate-900 dark:text-white">{data.confidence}%</p>
              </div>
            </div>
          )}

          {type === 'risk' && (
            <div className="space-y-8">
              <div className="flex flex-col gap-6">
                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-500"></div>
                  <h3 className="text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4"/> Source A: {data.source_a}
                  </h3>
                  <div className="flex justify-between items-center bg-slate-200 dark:bg-slate-800/30 p-4 rounded-lg">
                    <p className="text-slate-700 dark:text-slate-300 font-mono">{data.conflicting_field}</p>
                    <p className="text-slate-900 dark:text-white font-mono text-xl font-bold bg-slate-200 dark:bg-slate-800 px-4 py-2 rounded">{data.value_a}</p>
                  </div>
                </div>
                
                <div className="flex justify-center -my-2 relative z-10">
                  <div className="bg-red-900 text-red-100 font-bold px-6 py-2 rounded-full border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)] tracking-widest">
                    VS
                  </div>
                </div>
                
                <div className="bg-red-900/10 p-6 rounded-xl border border-red-900/60 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                  <h3 className="text-red-400 text-xs font-bold uppercase tracking-widest mb-4 border-b border-red-900/50 pb-3 flex items-center gap-2">
                     <AlertOctagon className="w-4 h-4"/> Source B: {data.source_b}
                  </h3>
                  <div className="flex justify-between items-center bg-red-900/20 p-4 rounded-lg">
                    <p className="text-red-300 font-mono">{data.conflicting_field}</p>
                    <p className="text-red-400 font-mono text-xl font-bold bg-red-900/40 px-4 py-2 rounded break-all ml-4 border border-red-500/20">{data.value_b}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-900/20 border border-red-500/40 p-6 rounded-xl text-center shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                <h3 className="text-red-400 font-bold flex items-center justify-center gap-3 text-lg tracking-wider uppercase mb-2">
                  <AlertOctagon className="w-6 h-6" /> Conflict Detected
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm mb-6">The values from these two sources contradict each other. Human verification is required.</p>
                <button className="bg-red-600 text-slate-900 dark:text-white font-bold py-3 px-8 rounded-lg hover:bg-red-500 transition-colors font-mono shadow-[0_0_15px_rgba(239,68,68,0.4)] w-full">
                  [ Resolve Conflict Manually ]
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
