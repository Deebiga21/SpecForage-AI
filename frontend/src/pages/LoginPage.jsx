import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SplitText from '../components/SplitText';
import LightTunnel from '../components/LightTunnel';
import { Cpu, ArrowRight, Lock, Mail, Shield, CheckCircle2, Sun, Moon, FileText, Database, Layers, Search, Fingerprint, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

import { loginUser } from '../services/api';

export function LoginPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('alex.drake@specforge.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setErrorMsg('');

    try {
      setAuthStep('Validating credentials...');
      await loginUser(email, password);
      
      setAuthStep('Session authenticated.');
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 500);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-transparent flex flex-col font-sans transition-colors duration-300 overflow-y-auto overflow-x-hidden relative">
      
      {/* Light Tunnel Background */}
      <div className="fixed inset-0 bg-black -z-10">
        <LightTunnel
          cableColor="#a2a3b6"
          pulseColor="#4573de"
          tunnelColor="#5227FF"
          tunnelOpacity={0}
          speed={0.1}
          flowDirection="outward"
          pulseSpeed={2}
          pulseLength={0.28}
          pulseBlend={1}
          pulseWidth={1}
          cableCount={20}
          thickness={0.35}
          rimWidth={0.15}
          waviness={0.3}
          sway={0.5}
          size={1}
          centerX={0}
          centerY={0}
          glow={1}
          fadeNear={0.5}
          fadeFar={2}
          brightness={1}
          colorVariance
          grain
          grainIntensity={0.05}
          opacity={1}
          mouseInteraction
          mouseStrength={0.1}
        />
      </div>
      
      {/* The main container (Full bleed) */}
      <div className="w-full max-w-[1600px] mx-auto flex flex-col relative flex-1">
        
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 md:px-10 py-6 border-b border-black dark:border-slate-800/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 flex items-center justify-center">
               <img src="/logo.png" className="w-full h-full object-contain dark:invert dark:mix-blend-screen" alt="Logo" />
             </div>
             <span className="text-xl font-bold font-display tracking-tight text-white">
               SPECForge<span className="text-blue-500 dark:text-blue-300">.AI</span>
             </span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-blue-500 dark:hover:text-blue-300 transition-colors">Features</a>
            <a href="#workflow" className="hover:text-blue-500 dark:hover:text-blue-300 transition-colors">Workflow</a>
            <a href="#security" className="hover:text-blue-500 dark:hover:text-blue-300 transition-colors">Security</a>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-bold transition-colors shadow-lg shadow-slate-900/10 dark:shadow-white/10"
            >
              Sign In
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col lg:flex-row items-center p-6 md:p-10 lg:p-16 gap-12 lg:gap-20">
          
          {/* Left Content */}
          <div className="flex-1 space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fff9d2] dark:bg-[#8cc0eb]/10 border border-[#ffebcc] dark:border-[#8cc0eb]/20 text-blue-500 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8cc0eb]"></span>
              </span>
              Real-time Processing Visible to Users
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-bold text-white leading-[1.1] font-display tracking-tight">
              AI-powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8cc0eb] to-[#8cc0eb]">product attribute extraction</span> & ETIM taxonomy mapping
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
              Transform unstructured industrial datasheets and PDFs into a Trusted Product Intelligence Record. Every field is extracted with exact source evidence, validation, and compliance detection.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => setShowLoginModal(true)}
                className="px-8 py-4 rounded-xl bg-[#8cc0eb] hover:bg-[#7bb1df] text-slate-900 font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#8cc0eb]/40 hover:shadow-[#8cc0eb]/60"
              >
                Start Foraging <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-200 font-semibold text-lg flex items-center justify-center gap-2 transition-all">
                View Live Demo
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 text-sm font-semibold text-slate-400">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4.5 h-4.5 text-blue-400"/> Products matched & deduplicated</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4.5 h-4.5 text-blue-400"/> Errors & contradictions flagged</div>
            </div>
          </div>

          {/* Right Visual (Realistic Industrial/Document/AI representation) */}
          <div className="flex-1 w-full max-w-2xl lg:max-w-none relative z-10">
            <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] shadow-2xl p-6 sm:p-8 lg:p-10 flex flex-col gap-8">
              
              <div className="flex items-center justify-between border-b border-black/60 dark:border-slate-700/60 pb-5">
                 <div className="flex gap-2.5">
                   <div className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                   <div className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                   <div className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                 </div>
                 <div className="text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">Processing Pipeline</div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                 {/* PDF Document */}
                 <motion.div 
                   animate={{ y: [0, -6, 0] }}
                   transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                   className="w-full sm:flex-1 bg-slate-800/40 backdrop-blur-md rounded-2xl p-5 border border-slate-700/50 shadow-lg shadow-black/20"
                 >
                   <div className="flex items-center gap-3 mb-4">
                     <div className="p-2.5 bg-blue-500/20 rounded-lg">
                       <FileText className="w-6 h-6 text-blue-400" />
                     </div>
                     <div className="text-sm font-semibold text-slate-300">Datasheet.pdf</div>
                   </div>
                   <div className="space-y-2.5">
                     <div className="h-2.5 w-3/4 bg-slate-700 rounded-full" />
                     <div className="h-2.5 w-full bg-slate-700 rounded-full" />
                     <div className="h-2.5 w-5/6 bg-slate-700 rounded-full" />
                     <div className="h-2.5 w-4/5 bg-slate-700 rounded-full" />
                   </div>
                 </motion.div>

                 {/* AI Processing Node */}
                 <div className="relative">
                   <div className="absolute inset-0 bg-[#8cc0eb]/20 rounded-full blur-xl animate-pulse" />
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                     className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 flex items-center justify-center shadow-xl shadow-[#8cc0eb]/20"
                   >
                     <Cpu className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 dark:text-blue-300" />
                   </motion.div>
                 </div>

                 {/* Structured Data */}
                 <motion.div 
                   animate={{ y: [0, 6, 0] }}
                   transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                   className="w-full sm:flex-1 bg-slate-800/40 backdrop-blur-md rounded-2xl p-5 border border-slate-700/50 shadow-lg shadow-black/20"
                 >
                   <div className="flex items-center gap-3 mb-4">
                     <div className="p-2.5 bg-emerald-500/20 rounded-lg">
                       <Database className="w-6 h-6 text-emerald-400" />
                     </div>
                     <div className="text-sm font-semibold text-slate-300">JSON Record</div>
                   </div>
                   <div className="space-y-3">
                     <div className="flex items-center gap-2">
                       <div className="h-2.5 w-1/3 bg-[#ffebcc] dark:bg-indigo-900/50 rounded-full" />
                       <div className="h-2.5 w-1/2 bg-slate-700 rounded-full" />
                     </div>
                     <div className="flex items-center gap-2">
                       <div className="h-2.5 w-1/4 bg-[#ffebcc] dark:bg-indigo-900/50 rounded-full" />
                       <div className="h-2.5 w-2/3 bg-slate-700 rounded-full" />
                     </div>
                     <div className="flex items-center gap-2">
                       <div className="h-2.5 w-2/5 bg-amber-100 dark:bg-amber-900/50 rounded-full" />
                       <div className="h-2.5 w-1/3 bg-slate-700 rounded-full" />
                     </div>
                   </div>
                 </motion.div>
              </div>

              <div className="p-5 bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-lg shadow-black/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-200">Field-level source traceability</span>
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8cc0eb] dark:bg-[#8cc0eb]"></span>
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-400 mt-1.5 mt-1.5">Every field links directly to source evidence.</p>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Features Section */}
        <div className="bg-slate-900/40 backdrop-blur-md border-t border-black dark:border-slate-800 p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="flex gap-5">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/60 backdrop-blur-sm border border-black/60 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-md shadow-slate-200/50 dark:shadow-slate-900/50">
                <Search className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Human Review for Uncertain Info</h3>
                <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">Workflows designed to elevate low-confidence extractions for manual verification.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/60 backdrop-blur-sm border border-black/60 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-md shadow-slate-200/50 dark:shadow-slate-900/50">
                <Layers className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Products Matched & Deduplicated</h3>
                <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">Automatic resolution of duplicate entities across your entire catalog.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/60 backdrop-blur-sm border border-black/60 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-md shadow-slate-200/50 dark:shadow-slate-900/50">
                <Fingerprint className="w-7 h-7 text-blue-500 dark:text-blue-300" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Validation & Compliance Evidence</h3>
                <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">Every field links back to source evidence for full auditability.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal Overlay */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md p-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl"
            >
              {/* Close button */}
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Brand Header */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-14 h-14 flex items-center justify-center mb-3">
                  <img src="/logo.png" className="w-full h-full object-contain dark:invert dark:mix-blend-screen" alt="Logo" />
                </div>
                <SplitText
                  text={
                    <>
                      SpecForge<span className="text-blue-500 dark:text-blue-300">.AI</span>
                    </>
                  }
                  className="text-2xl font-bold font-display tracking-tight text-white"
                  delay={50}
                  duration={1.25}
                  tag="h2"
                />
                <p className="text-xs text-slate-500 dark:text-indigo-300/80 font-mono mt-1">
                  Product Intelligence, Verified.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-lg text-xs font-semibold text-center border border-rose-200">
                    {errorMsg}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-sm text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#8cc0eb] focus:ring-1 focus:ring-[#8cc0eb] transition-all font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-sm text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#8cc0eb] focus:ring-1 focus:ring-[#8cc0eb] transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Primary Sign In Button */}
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full relative group overflow-hidden py-3 rounded-xl bg-gradient-to-r from-[#8cc0eb] via-[#bfddf0] to-[#8cc0eb] text-slate-900 font-bold text-sm tracking-wide shadow-lg shadow-[#8cc0eb]/40 hover:shadow-[#8cc0eb]/60 transition-all duration-300 mt-2"
                >
                  <div className="flex items-center justify-center gap-2">
                    {isAuthenticating ? (
                      <div className="flex items-center gap-2 text-indigo-100">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="font-mono text-xs">{authStep}</span>
                      </div>
                    ) : (
                      <>
                        <span>Sign In to Workstation</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </form>

              {/* Mock SSO Option */}
              <div className="mt-6 pt-6 border-t border-black dark:border-slate-800/80">
                <button
                  onClick={() => handleLogin({ preventDefault: () => {} })}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/60 border border-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Shield className="w-4 h-4 text-blue-400 dark:text-blue-300" />
                  <span>Continue with Enterprise SSO</span>
                </button>
              </div>

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>SOC2 Type II & ISO 27001 Certified Environment</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

