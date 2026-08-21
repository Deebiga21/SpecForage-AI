import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, getProductSpecs, getProductSources, getProductCompliance, getProductRelationships } from '../services/api';
import { MOCK_PRODUCTS } from '../mock/mockData';
import { ArrowLeft, LayoutDashboard, FileText, SearchCode, ShieldCheck, Link, Check, AlertTriangle, Eye } from 'lucide-react';

export function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [specs, setSpecs] = useState([]);
  const [sources, setSources] = useState([]);
  const [compliance, setCompliance] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProduct(id).catch(() => null), getProductSpecs(id).catch(() => []), getProductSources(id).catch(() => []), getProductCompliance(id).catch(() => []), getProductRelationships(id).catch(() => [])
    ]).then(([p, s, src, c, r]) => {
      if (p) {
        setProduct(p); setSpecs(s || []); setSources(src || []); setCompliance(c || []); setRelationships(r || []);
      } else {
        const mockP = MOCK_PRODUCTS.find(mp => mp.id === id);
        if (mockP) {
          setProduct({
             product_name: mockP.name,
             sku: mockP.sku,
             manufacturer_name: "SpecForge Industrial",
             confidence: mockP.confidence,
             category: mockP.category,
             validation_status: "passed",
             ...mockP
          });
          setSpecs(mockP.extractedFields.map(f => ({
             id: f.id, field: f.name, value: f.value, unit: '', confidence: f.confidence
          })));
          setSources(mockP.extractedFields.map(f => ({
             attribute_id: f.id, source_page: f.boundingBox.page, source_text: f.value
          })));
          setCompliance([
             { id: 1, standard: 'RoHS', status: 'compliant' },
             { id: 2, standard: 'CE', status: 'compliant' }
          ]);
          setRelationships(mockP.relationships.map((rel, idx) => ({
             id: idx, type: rel.type, confidence: 0.95, related_product: { id: rel.targetId, name: rel.label, sku: 'N/A' }
          })));
        }
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-20 text-center text-blue-600 font-mono">Loading Product Data...</div>;
  if (!product) return <div className="p-20 text-center text-rose-600 font-mono">Product not found</div>;

  const getSourceForAttr = (attrId) => sources.find(s => s.attribute_id === attrId);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/app/products')} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">{product.product_name}</h1>
            <p className="text-sm font-mono text-blue-600">SKU: {product.sku} | Manufacturer: {product.manufacturer_name || 'N/A'}</p>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-lg border font-mono text-sm font-bold shadow-sm ${
           (product.confidence > 1 ? product.confidence : product.confidence * 100) >= 90 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}>
           Confidence: {Math.round(product.confidence > 1 ? product.confidence : product.confidence * 100)}%
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT / MAIN (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
               <FileText className="w-5 h-5 text-blue-600"/> Product Summary & Attributes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {specs.map(s => (
                <div key={s.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center hover:border-blue-200 transition-colors">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{s.field}</span>
                  <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-100">{s.value} {s.unit}</span>
                </div>
              ))}
              {specs.length === 0 && <div className="col-span-full text-slate-500 dark:text-slate-400 text-sm italic">No technical attributes extracted.</div>}
            </div>
          </div>
        </div>

        {/* RIGHT (1/3 width) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
               <LayoutDashboard className="w-5 h-5 text-indigo-600"/> Classification
            </h3>
            <div className="space-y-4">
               <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block mb-1">Category / Taxonomy</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{product.category || 'Uncategorized'}</span>
               </div>
               <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block mb-1">Validation Status</span>
                  <span className={`text-sm font-bold ${product.validation_status === 'passed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                     {product.validation_status.toUpperCase()}
                  </span>
               </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
               <ShieldCheck className="w-5 h-5 text-emerald-500"/> Compliance
            </h3>
            {compliance.length === 0 ? <p className="text-sm text-slate-500 dark:text-slate-400 italic">No compliance data.</p> : (
               <div className="space-y-3">
                  {compliance.map(c => (
                     <div key={c.id} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-mono text-slate-700 dark:text-slate-200">{c.standard}</span>
                        {c.status.includes('compliant') ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                     </div>
                  ))}
               </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Source Traceability */}
         <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
           <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
               <SearchCode className="w-5 h-5 text-purple-600"/> Source Traceability
           </h3>
           <div className="overflow-x-auto max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              <table className="w-full text-left text-xs">
                 <thead className="sticky top-0 bg-white dark:bg-slate-900">
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-mono">
                       <th className="pb-2 pr-2">Field</th>
                       <th className="pb-2 pr-2">Value</th>
                       <th className="pb-2 pr-2">Conf</th>
                       <th className="pb-2">Source Evidence</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {specs.map(s => {
                       const src = getSourceForAttr(s.id);
                       return (
                          <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800">
                             <td className="py-3 pr-2 font-mono text-slate-600 dark:text-slate-300">{s.field}</td>
                             <td className="py-3 pr-2 font-bold text-slate-900 dark:text-white">{s.value} {s.unit}</td>
                             <td className="py-3 pr-2">
                                <span className={`px-1.5 py-0.5 rounded font-mono ${(s.confidence > 1 ? s.confidence : s.confidence * 100) >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                   {Math.round(s.confidence > 1 ? s.confidence : s.confidence * 100)}%
                                </span>
                             </td>
                             <td className="py-3">
                                {src && src.source_text ? (
                                   <div className="bg-blue-50 p-2 rounded-lg border border-blue-100 text-[10px] font-mono text-blue-800 flex flex-col gap-1">
                                      <div className="flex items-center gap-1 opacity-70"><Eye className="w-3 h-3" /> Pg {src.source_page}</div>
                                      <span className="italic">"{src.source_text}"</span>
                                   </div>
                                ) : <span className="text-slate-400 italic">No evidence</span>}
                             </td>
                          </tr>
                       )
                    })}
                 </tbody>
              </table>
           </div>
         </div>

         {/* Product Matching & Relationships */}
         <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
           <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
               <Link className="w-5 h-5 text-indigo-500"/> Relationships & Matching
           </h3>
           {relationships.length === 0 ? <p className="text-sm text-slate-500 dark:text-slate-400 italic">No verified relationships found in Knowledge Graph.</p> : (
               <div className="space-y-3">
                  {relationships.map(r => (
                     <div key={r.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center cursor-pointer hover:border-blue-400 transition-colors shadow-sm" onClick={() => navigate(`/app/products/${r.related_product.id}`)}>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                                 r.type === 'duplicate' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 
                                 r.type === 'compatible' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                                 'bg-blue-100 text-blue-700 border border-blue-200'
                              }`}>{r.type}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Conf: {Math.round(r.confidence * 100)}%</span>
                           </div>
                           <span className="text-sm font-semibold text-slate-900 dark:text-white">{r.related_product.name} (SKU: {r.related_product.sku})</span>
                        </div>
                        <ArrowLeft className="w-4 h-4 text-slate-400 rotate-135" />
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
