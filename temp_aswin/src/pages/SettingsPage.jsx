import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Settings, Key, Sliders, Sun, Moon, Copy, Check, Shield } from 'lucide-react';

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [apiKey, setApiKey] = useState('sf_live_99482810a7b4f2c91837e');
  const [copied, setCopied] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight text-content-primary">
          System & Pipeline Settings
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Configure multi-agent confidence parameters, API keys, and workspace preferences.
        </p>
      </div>

      {/* Theme Settings */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-display font-semibold text-sm text-slate-200">Interface Appearance</h3>
            <p className="text-xs text-slate-400 font-mono">Dual-theme configuration</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-2 border border-slate-700 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            <span>Current: {theme === 'dark' ? 'Soft Dark Theme' : 'Light Theme'}</span>
          </button>
        </div>
      </div>

      {/* Agent Confidence Threshold Rules */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 dark:border-white/10 space-y-4">
        <div className="pb-3 border-b border-slate-800">
          <h3 className="font-display font-semibold text-sm text-slate-200">
            Validation Agent Threshold Rules
          </h3>
          <p className="text-xs text-slate-400 font-mono">Automated approval vs human review trigger boundary</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-300">Minimum Automated Approval Score:</span>
            <span className="text-indigo-400 font-bold text-sm">{confidenceThreshold}%</span>
          </div>
          <input
            type="range"
            min="60"
            max="95"
            value={confidenceThreshold}
            onChange={e => setConfidenceThreshold(Number(e.target.value))}
            className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer"
          />
          <p className="text-[11px] text-slate-400 font-mono">
            Fields extracted below {confidenceThreshold}% confidence will automatically trigger the Human-in-the-Loop review queue.
          </p>
        </div>
      </div>

      {/* API Key Management */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 dark:border-white/10 space-y-4">
        <div className="pb-3 border-b border-slate-800">
          <h3 className="font-display font-semibold text-sm text-slate-200">
            API Keys & Integration Webhooks
          </h3>
          <p className="text-xs text-slate-400 font-mono">Secret keys for REST API & SDK connectivity</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400">Active Secret Key</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={apiKey}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-400 focus:outline-none"
            />
            <button
              onClick={handleCopyKey}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Key'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
