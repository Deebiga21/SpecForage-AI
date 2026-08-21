import React from 'react';

export function InsightDetailPanel({ insight, onClose, onReview, onDismiss }) {
  if (!insight) return null;

  // The insight object might have different structure depending on how it was passed from InsightsPage
  // The type can be 'gap', 'duplicate', 'replacement', 'compliance', 'opportunity', 'taxonomy', 'risk'
  const type = insight.insight_type || insight.type; // Fallback to raw insight type if available
  
  // Extract common data
  const productName = insight.product_name || insight.meta_payload?.product_name || insight.meta_payload?.product || insight.meta_payload?.product_a || 'Unknown Product';
  const sku = insight.sku || insight.meta_payload?.sku || 'Unknown SKU';

  const renderContent = () => {
    switch (type) {
      case 'gap':
        return `│ Data Completeness: ${insight.completeness_score || 0}%
│ Missing Critical Fields: ${insight.missing_attributes ? insight.missing_attributes.length : 0}
│
${insight.missing_attributes && insight.missing_attributes.length > 0 ? 
  `│ ❌ Missing Specifications\n│\n` +
  insight.missing_attributes.map(attr => `│ • ${attr}\n│   Status: Not Found\n│   Importance: High`).join('\n│\n') + '\n│\n'
: ''}│ 📌 WHY IT MATTERS
│ These fields are required for a complete
│ product record.
│
│ 🎯 RECOMMENDED ACTION
│ ${insight.recommendation || 'Obtain the missing specifications from the manufacturer.'}
│
│ 📄 SOURCE CHECK
│ Pages checked: ${insight.pages_checked || 'All'}
│ Evidence found: No`;

      case 'duplicate':
        return `│ Similarity Score: ${insight.confidence ? (insight.confidence * 100).toFixed(0) : (insight.meta_payload?.similarity * 100 || 85)}%
│
│ 🔍 COMPARISON
│ Product A: ${insight.meta_payload?.product_a}
│ Product B: ${insight.meta_payload?.product_b}
│
│ 📌 WHY IT MATTERS
│ Duplicate entries cause inventory confusion
│ and inflate the catalog size artificially.
│
│ 🎯 RECOMMENDED ACTION
│ Merge records or mark one as primary.`;

      case 'replacement':
        return `│ Match Confidence: ${insight.confidence ? (insight.confidence * 100).toFixed(0) : (insight.meta_payload?.similarity * 100 || 75)}%
│
│ 🔄 REPLACEMENT ANALYSIS
│ Current: ${insight.meta_payload?.current}
│ Potential Replacement: ${insight.meta_payload?.replacement}
│
│ 📌 WHY IT MATTERS
│ Identifying compatible replacements helps
│ manage supply chain shortages.
│
│ 🎯 RECOMMENDED ACTION
│ Verify physical dimensions and electrical specs.`;

      case 'compliance':
        return `│ Standard: ${insight.meta_payload?.standard}
│ Status: ${insight.meta_payload?.status}
│
│ 🛡️ COMPLIANCE EVIDENCE
│ Evidence of compliance could not be verified
│ in the primary datasheet.
│
│ 📌 WHY IT MATTERS
│ Non-compliant products cannot be sold in
│ regulated markets.
│
│ 🎯 RECOMMENDED ACTION
│ Request official certificate from manufacturer.`;

      case 'opportunity':
        return `│ Missing Attribute: ${insight.meta_payload?.missing_attribute}
│ Affected Products: ${insight.meta_payload?.affected}
│ Category: ${insight.meta_payload?.category}
│
│ 💰 CATALOG OPPORTUNITY
│ Standardizing this field across the category
│ will drastically improve search indexing.
│
│ 🎯 RECOMMENDED ACTION
│ Run a batch extraction to fill this gap.`;

      case 'taxonomy':
        return `│ Current Class: ${insight.meta_payload?.current_class}
│ Confidence: ${insight.confidence ? (insight.confidence * 100).toFixed(0) : 70}%
│
│ 🏷️ TAXONOMY ANALYSIS
│ The product description does not strongly
│ align with the assigned ETIM category.
│
│ 🎯 RECOMMENDED ACTION
│ Review the classification manually.`;

      case 'risk':
        return `│ Conflicting Field: ${insight.meta_payload?.conflicting_field}
│ Extracted Value: ${insight.meta_payload?.value_a}
│
│ 🚨 CONFLICT DETECTED
│ The value extracted from the datasheet conflicts
│ with standard validation rules or another source.
│
│ 🎯 RECOMMENDED ACTION
│ Verify the value against the source PDF.`;

      default:
        return `│ ℹ️ INSIGHT DETAILS
│ Review the data associated with this product.
│
│ 🎯 RECOMMENDED ACTION
│ Investigate further.`;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#0D1117] text-[#00FF00] border-l border-[#00FF00] shadow-2xl p-6 overflow-y-auto flex flex-col z-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-mono font-bold tracking-tight">System Insight Panel</h2>
        <button onClick={onClose} className="text-[#00FF00] hover:text-white hover:bg-slate-800 p-1 rounded font-mono">
          [X] CLOSE
        </button>
      </div>

      <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
{`┌─────────────────────────────────────────────┐
│ ⚠️ ${type ? type.toUpperCase() : 'GENERAL'} INSIGHT DETAILS
├─────────────────────────────────────────────┤
│ Product: ${productName}
│ SKU: ${sku}
│
${renderContent()}
└─────────────────────────────────────────────┘`}
      </pre>

      <div className="mt-8 flex flex-col gap-3 font-mono">
        <button 
          className="bg-[#00FF00] text-[#0D1117] py-2 px-4 hover:bg-[#00CC00] font-bold"
          onClick={() => {
            alert('Source evidence preview would appear here showing PDF pages and extracted text.');
          }}
        >
          [View Source Evidence]
        </button>
        <button 
          className="border border-[#00FF00] text-[#00FF00] py-2 px-4 hover:bg-[#1a2f1a]"
          onClick={() => onReview(insight)}
        >
          [Mark For Review]
        </button>
        <button 
          className="border border-red-500 text-red-500 py-2 px-4 hover:bg-[#2f1a1a]"
          onClick={() => onDismiss(insight)}
        >
          [Dismiss Insight]
        </button>
      </div>
    </div>
  );
}
