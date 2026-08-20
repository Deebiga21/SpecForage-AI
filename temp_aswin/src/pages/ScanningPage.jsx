import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AGENT_PIPELINE_STEPS } from '../mock/mockData';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Cpu, 
  Zap, 
  Network, 
  Sliders, 
  ShieldCheck, 
  FileSearch,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Code,
  Check,
  Image as ImageIcon,
  FileCode,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ScanningPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [showJson, setShowJson] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Icon lookup for pipeline rail
  const getAgentIcon = (id) => {
    switch (id) {
      case 'doc-agent': return FileSearch;
      case 'extract-agent': return Cpu;
      case 'enrich-agent': return Zap;
      case 'norm-agent': return Sliders;
      case 'tax-agent': return Network;
      case 'val-agent': return ShieldCheck;
      default: return CheckCircle2;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '2.4 MB';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const processFileObject = (file) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type.includes('pdf');

    const fileMeta = {
      name: file.name,
      size: formatFileSize(file.size),
      type: isImage ? 'Image' : isPdf ? 'PDF Document' : 'Technical Spec',
      rawFile: file,
      isImage,
      isPdf
    };

    setUploadedFile(fileMeta);
    setIsProcessing(true);
    setIsCompleted(false);
    setActiveStepIndex(0);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFileObject(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFileObject(e.dataTransfer.files[0]);
    }
  };

  // Staggered 10-15s animation sequence across 6 agents
  useEffect(() => {
    if (!isProcessing || activeStepIndex < 0) return;

    if (activeStepIndex < AGENT_PIPELINE_STEPS.length) {
      const timer = setTimeout(() => {
        setActiveStepIndex(prev => prev + 1);
      }, 2000); // ~12 seconds total for 6 agents
      return () => clearTimeout(timer);
    } else {
      // Completed all 6 steps
      setIsProcessing(false);
      setIsCompleted(true);
      
      const fileNameBase = uploadedFile ? uploadedFile.name.split('.')[0].toUpperCase() : 'SPEC_7000';
      const cleanSku = `SF-${fileNameBase.substring(0, 8).replace(/[^A-Z0-9]/g, '')}-X`;

      setExtractedData({
        sku: cleanSku,
        name: uploadedFile ? `Enriched Record: ${uploadedFile.name}` : "Titan Industrial Spec 7000X",
        confidence: 97.8,
        category: uploadedFile?.isImage ? "Optical Schematic / CAD Render" : "Power Generation / Engineering Spec",
        fieldsCount: 28,
        verifiedFields: 28,
        taxonomyCode: "UNSPSC 26101602",
        processedTimestamp: new Date().toLocaleTimeString()
      });
    }
  }, [isProcessing, activeStepIndex, uploadedFile]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*,.pdf,.dwg,.dxf,.txt,.csv,.json"
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-content-primary">
            Multi-Agent Document Scanner
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Upload images, PDFs or schematics for 6-agent extraction & verification.
          </p>
        </div>

        {isCompleted && (
          <button
            onClick={() => {
              setActiveStepIndex(-1);
              setIsProcessing(false);
              setIsCompleted(false);
              setUploadedFile(null);
              setPreviewUrl(null);
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium font-mono flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Upload Another File</span>
          </button>
        )}
      </div>

      {/* DROPZONE / SCANNER MAIN LAYOUT */}
      {!uploadedFile ? (
        /* Drag & Drop Zone */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer p-12 rounded-3xl glass-panel-glow border-2 border-dashed transition-all duration-300 text-center flex flex-col items-center justify-center min-h-[400px] ${
            isDragging
              ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
              : 'border-indigo-500/40 hover:border-indigo-500'
          }`}
        >
          <div className="w-20 h-20 rounded-3xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-indigo-500/10">
            <UploadCloud className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold font-display text-content-primary mb-1">
            Drag & Drop Images, PDFs, or Spec Sheets here
          </h3>
          <p className="text-xs text-slate-400 font-mono mb-4 max-w-md leading-relaxed">
            Upload PNG, JPG, WEBP, PDF, CAD drawings or spec sheets. Auto-detected by Document Agent OCR.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all"
            >
              Browse Files from Computer
            </button>
          </div>
        </motion.div>
      ) : (
        /* ACTIVE SCANNING WORKSPACE WITH LIVE PREVIEW (SECTION 6) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Document/Image Preview with Laser Scan Effect */}
          <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-white/10 dark:border-white/10 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                {uploadedFile.isImage ? (
                  <ImageIcon className="w-4 h-4 text-indigo-400 shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                )}
                <span className="font-mono text-xs font-semibold text-slate-200 truncate">
                  {uploadedFile.name}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">{uploadedFile.size}</span>
            </div>

            {/* Document / Image Visual Live Preview with Laser Beam */}
            <div className="relative aspect-[3/4] rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-center items-center font-mono text-xs text-slate-500 select-none">
              {uploadedFile.isImage && previewUrl ? (
                /* Live Uploaded Image Preview */
                <img
                  src={previewUrl}
                  alt="Uploaded document preview"
                  className="w-full h-full object-contain p-2"
                />
              ) : uploadedFile.isPdf && previewUrl ? (
                /* Live PDF Preview */
                <iframe
                  src={previewUrl}
                  title="PDF Preview"
                  className="w-full h-full border-none"
                />
              ) : (
                /* Fallback Graphic Preview */
                <div className="p-4 w-full h-full flex flex-col justify-center items-center text-center space-y-2">
                  <FileCode className="w-12 h-12 text-indigo-400/60" />
                  <span className="text-slate-300 font-bold text-xs">{uploadedFile.name}</span>
                  <span className="text-[10px] text-indigo-300 font-mono">Parsed by Document Agent</span>
                </div>
              )}

              {/* Animated Scanning Laser Beam Sweep */}
              {isProcessing && (
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_15px_#818cf8] animate-laser" />
              )}
            </div>
          </div>

          {/* Right Column: 6-Agent Pipeline Rail & Product Record */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pipeline Rail Header */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 dark:border-white/10 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-display font-semibold text-sm text-slate-200">
                    LangGraph 6-Agent Execution Rail
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-indigo-400">
                  {isProcessing ? `Active Step ${Math.min(activeStepIndex + 1, 6)}/6` : isCompleted ? 'Completed' : 'Ready'}
                </span>
              </div>

              {/* 6-Agent Connected Chain Nodes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AGENT_PIPELINE_STEPS.map((step, idx) => {
                  const Icon = getAgentIcon(step.id);
                  const isActive = isProcessing && activeStepIndex === idx;
                  const isDone = activeStepIndex > idx || isCompleted;

                  return (
                    <div
                      key={step.id}
                      className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                        isActive
                          ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500'
                          : isDone
                          ? 'bg-slate-900/60 border-emerald-500/40 text-slate-300'
                          : 'bg-slate-950/40 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : isDone
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-display font-semibold text-xs text-slate-200 truncate">
                            {step.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{step.duration}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{step.role}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Completion Result Card / Product Intelligence Record */}
            <AnimatePresence>
              {isCompleted && extractedData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel-glow p-6 rounded-2xl border border-emerald-500/40 shadow-2xl space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-display font-bold text-base text-slate-100">
                        Product Intelligence Record Generated
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowJson(!showJson)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>{showJson ? 'View UI Card' : 'View JSON'}</span>
                    </button>
                  </div>

                  {!showJson ? (
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-lg font-bold font-mono text-indigo-400">{extractedData.sku}</span>
                          <h4 className="text-sm font-semibold text-slate-200 mt-0.5">{extractedData.name}</h4>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-2xl font-extrabold text-emerald-400">{extractedData.confidence}%</span>
                          <div className="text-[10px] text-slate-400">Confidence Score</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                          <span className="text-slate-500 text-[10px] uppercase block">Category</span>
                          <span className="text-slate-200">{extractedData.category}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                          <span className="text-slate-500 text-[10px] uppercase block">Taxonomy Mapping</span>
                          <span className="text-indigo-300">{extractedData.taxonomyCode}</span>
                        </div>
                      </div>

                      <div className="pt-3 flex items-center gap-3">
                        <button
                          onClick={() => navigate('/app/review')}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs font-display flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                        >
                          <span>Inspect Extracted Fields</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <pre className="p-4 rounded-xl bg-slate-950 font-mono text-[11px] text-emerald-400 overflow-x-auto border border-slate-800">
                      {JSON.stringify(extractedData, null, 2)}
                    </pre>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
