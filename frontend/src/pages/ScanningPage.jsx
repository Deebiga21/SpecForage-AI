import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRealtimeUpdates, uploadDocument } from '../services/api';
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
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ScanningPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showJson, setShowJson] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [jobState, setJobState] = useState(null);

  const { lastMessage, connected } = useRealtimeUpdates(jobId);

  useEffect(() => {
    if (lastMessage && lastMessage.job_id === jobId) {
      setJobState(lastMessage);
      if (['completed', 'error', 'review_required'].includes(lastMessage.status)) {
        setIsProcessing(false);
        setIsCompleted(true);
      }
    }
  }, [lastMessage, jobId]);

  const getAgentIcon = (name) => {
    if (name.includes('Read')) return FileSearch;
    if (name.includes('AI Extraction')) return Cpu;
    if (name.includes('Attribute')) return Zap;
    if (name.includes('Normalize')) return Sliders;
    if (name.includes('Taxonomy')) return Network;
    if (name.includes('Validation') || name.includes('Compliance')) return ShieldCheck;
    return CheckCircle2;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const processFileObject = async (file) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type.includes('pdf');

    setUploadedFile({
      name: file.name,
      size: formatFileSize(file.size),
      type: isImage ? 'Image' : isPdf ? 'PDF Document' : 'Document',
      isImage,
      isPdf
    });
    
    setIsProcessing(true);
    setIsCompleted(false);
    setJobId(null);
    setJobState(null);

    try {
      const result = await uploadDocument(file);
      setJobId(result.job_id);
    } catch (err) {
      console.error("Upload failed", err);
      setIsProcessing(false);
      alert("Upload failed. Check console.");
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFileObject(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*,.pdf,.dwg,.dxf,.txt,.csv,.json"
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">
            Processing Observatory
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Real-time multi-agent document extraction & verification pipeline.
          </p>
        </div>

        {isCompleted && (
          <button
            onClick={() => {
              setIsProcessing(false);
              setIsCompleted(false);
              setUploadedFile(null);
              setPreviewUrl(null);
              setJobId(null);
              setJobState(null);
            }}
            className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium font-mono flex items-center gap-2 border border-slate-200 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Upload Another</span>
          </button>
        )}
      </div>

      {!uploadedFile ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if(e.dataTransfer.files[0]) processFileObject(e.dataTransfer.files[0]); }}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer p-12 rounded-3xl border-2 border-dashed transition-all duration-300 text-center flex flex-col items-center justify-center min-h-[400px] bg-white ${
            isDragging ? 'border-blue-400 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50 shadow-sm'
          }`}
        >
          <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-blue-100">
            <UploadCloud className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold font-display text-slate-900 mb-1">
            Drag & Drop Images or PDFs here
          </h3>
          <p className="text-xs text-slate-500 font-mono mb-4 max-w-md leading-relaxed">
            Upload spec sheets or product data.
          </p>
          <button type="button" className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold text-xs shadow-sm">
            Browse Files
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Document Preview */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 min-w-0">
                {uploadedFile.isImage ? <ImageIcon className="w-4 h-4 text-blue-600 shrink-0" /> : <FileText className="w-4 h-4 text-blue-600 shrink-0" />}
                <span className="font-mono text-xs font-semibold text-slate-800 truncate">{uploadedFile.name}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">{uploadedFile.size}</span>
            </div>

            <div className="relative aspect-[3/4] rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex flex-col justify-center items-center font-mono text-xs text-slate-500 select-none shadow-inner">
              {uploadedFile.isImage && previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-2" />
              ) : uploadedFile.isPdf && previewUrl ? (
                <iframe src={previewUrl} title="PDF Preview" className="w-full h-full border-none" />
              ) : (
                <div className="p-4 w-full h-full flex flex-col justify-center items-center text-center space-y-2">
                  <FileCode className="w-12 h-12 text-blue-200" />
                  <span className="text-slate-400 font-bold text-xs">{uploadedFile.name}</span>
                </div>
              )}

              {isProcessing && (
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_#3b82f6] animate-laser" />
              )}
            </div>
          </div>

          {/* Right Column: Pipeline Rail & Product Record */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-600" />
                  <h3 className="font-display font-semibold text-sm text-slate-900">Processing Status {connected ? '🟢' : '🔴'}</h3>
                </div>
                <span className="text-[11px] font-mono text-blue-700">
                  {jobState?.progress || 0}%
                </span>
              </div>

              {jobState?.error_message && (
                 <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-mono shadow-sm">
                    ERROR: {jobState.error_message}
                 </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {jobState?.steps?.map((step) => {
                  const Icon = getAgentIcon(step.name);
                  const isActive = step.status === 'processing';
                  const isDone = ['completed', 'skipped', 'review_required'].includes(step.status);
                  const isErr = step.status === 'failed';

                  return (
                    <div key={step.id} className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 shadow-sm ${
                        isActive ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500'
                        : isDone ? 'bg-white border-slate-200 text-slate-700'
                        : isErr ? 'bg-rose-50 border-rose-200 text-rose-700'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-70'
                    }`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
                        isActive ? 'bg-blue-600 text-white animate-pulse'
                        : isDone ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : isErr ? 'bg-rose-100 text-rose-600 border border-rose-200'
                        : 'bg-white text-slate-400 border border-slate-200'
                      }`}>
                        {isDone ? <Check className="w-4 h-4" /> : isErr ? <AlertTriangle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`font-display font-semibold text-xs truncate ${isActive || isDone ? 'text-slate-900' : ''}`}>
                            {step.name}
                          </span>
                          <span className="text-[10px] font-mono opacity-70">{(step.duration_ms / 1000).toFixed(1)}s</span>
                        </div>
                        <p className="text-[11px] opacity-70 truncate mt-0.5">{step.message || step.status}</p>
                        {step.total_items > 0 && (
                            <div className="text-[9px] font-mono text-blue-700 mt-1">Processed: {step.items_processed} / {step.total_items}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <AnimatePresence>
              {isCompleted && jobState?.result_product_id && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border-2 border-emerald-400 shadow-md space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-500" />
                      <h3 className="font-display font-bold text-base text-slate-900">
                        {jobState.status === 'review_required' ? 'Review Required' : 'Intelligence Record Generated'}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="pt-3 flex items-center gap-3">
                      <button onClick={() => navigate(`/app/products/${jobState.result_product_id}`)} className="flex-1 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors shadow-sm">
                        View Product Record
                      </button>
                      <button onClick={() => navigate('/app/review')} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm">
                        <span>Go to Reviews</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
