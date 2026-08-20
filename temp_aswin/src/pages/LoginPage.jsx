import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroCrystalScene } from '../components/3d/HeroCrystalScene';
import { Cpu, ArrowRight, Lock, Mail, Shield, CheckCircle2, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export function LoginPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('alex.drake@specforge.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsAuthenticating(true);

    // Staggered authentication sequence
    setAuthStep('Validating credentials...');
    setTimeout(() => {
      setAuthStep('Connecting to LangGraph agent node...');
      setTimeout(() => {
        setAuthStep('Session authenticated.');
        setTimeout(() => {
          navigate('/app/dashboard');
        }, 500);
      }, 700);
    }, 800);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex items-center justify-center font-sans">
      {/* 3D Background Canvas */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-auto">
        <HeroCrystalScene />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Top Header Controls */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl glass-panel text-slate-300 hover:text-white border border-white/10 transition-all"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>
      </div>

      {/* Floating Glass Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 rounded-3xl glass-panel-glow border border-indigo-500/30 shadow-2xl backdrop-blur-2xl"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30 mb-3">
            <Cpu className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-white">
            SpecForge<span className="text-indigo-400">.AI</span>
          </h1>
          <p className="text-xs text-indigo-300/80 font-mono mt-1">
            Product Intelligence, Verified.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
              />
            </div>
          </div>

          {/* Primary Sign In Button */}
          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full relative group overflow-hidden py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white font-semibold text-xs tracking-wide shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 mt-2"
          >
            <div className="flex items-center justify-center gap-2">
              {isAuthenticating ? (
                <div className="flex items-center gap-2 text-indigo-200">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <button
            onClick={() => handleLogin({ preventDefault: () => {} })}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900/50 hover:bg-slate-800/60 border border-slate-800 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>Continue with Enterprise SSO</span>
          </button>
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-500">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>SOC2 Type II & ISO 27001 Certified Environment</span>
        </div>
      </motion.div>
    </div>
  );
}
