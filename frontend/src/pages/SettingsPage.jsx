import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getSettings, updateSettings } from '../services/api';
import { Settings, User, Bell, Key, Database, Users, ShieldCheck, Paintbrush, Loader, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SETTING_SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Paintbrush },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'api', label: 'API & Integrations', icon: Key },
  { id: 'data', label: 'Data & Export', icon: Database },
  { id: 'team', label: 'Team & Access', icon: Users },
  { id: 'security', label: 'Security', icon: ShieldCheck },
];

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState({});
  const [originalSettings, setOriginalSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const { theme, toggleTheme, setTheme, density, setDensity } = useTheme();

  useEffect(() => {
    getSettings().then(data => {
      // Flatten or structure the settings for local form state
      const flat = {};
      if (data) {
        Object.values(data).flat().forEach(s => {
          flat[s.key] = s.value;
        });
      }
      // Merge with global contexts
      flat.theme = theme;
      flat.density = density;
      
      setSettings(flat);
      setOriginalSettings(flat);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Check for changes
    if (Object.keys(settings).length > 0) {
      const isChanged = Object.keys(settings).some(key => settings[key] !== originalSettings[key]);
      setHasChanges(isChanged);
    }
  }, [settings, originalSettings]);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(settings).catch(() => {}); // Mocking API
      setOriginalSettings(settings);
      setHasChanges(false);
      
      if (settings.theme) {
        setTheme(settings.theme);
      }
      if (settings.density) {
        setDensity(settings.density);
      }
    } catch (e) {
      alert("Failed to save: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setSettings(originalSettings);
    setTheme(originalSettings.theme);
    setDensity(originalSettings.density);
    setHasChanges(false);
  };

  if (loading) return <div className="flex justify-center p-20"><Loader className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex gap-8">
      {/* Left Column: Sub-nav */}
      <div className="w-64 shrink-0 flex flex-col gap-2">
        <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white dark:text-white mb-4 px-3">
          Settings
        </h1>
        {SETTING_SECTIONS.map(section => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-white dark:bg-slate-900 dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-700' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <section.icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Right Column: Content Area */}
      <div className="flex-1 relative bg-white dark:bg-slate-900 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-800 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl space-y-8 pb-24" // padding bottom for save bar
            >
              {activeSection === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-white dark:text-white">Profile</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-400">Manage your personal information.</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-display font-bold text-2xl text-white shadow-md">AD</div>
                    <button className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 dark:text-slate-300 transition-colors">Upload Avatar</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-300">Full Name</label>
                      <input type="text" defaultValue="Alex Drake" className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 dark:border-slate-800 text-sm focus:outline-none focus:border-blue-500 dark:text-white" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-300">Email Address</label>
                      <input type="email" defaultValue="alex@specforge.ai" className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 dark:border-slate-800 text-sm focus:outline-none focus:border-blue-500 dark:text-white" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-300">Bio</label>
                    <textarea rows={3} defaultValue="Lead AI Engineer working on multi-agent extraction pipelines." className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 dark:border-slate-800 text-sm focus:outline-none focus:border-blue-500 dark:text-white resize-none" />
                  </div>
                </div>
              )}

              {activeSection === 'appearance' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-white dark:text-white">Appearance</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-400">Customize how SpecForge AI looks on your device.</p>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-300">Theme</label>
                    <div className="grid grid-cols-4 gap-4">
                      {['Light', 'Dark', 'Mixed', 'System'].map(t => {
                        const val = t.toLowerCase();
                        return (
                          <button key={t} onClick={() => {
                            handleChange('theme', val);
                            setTheme(val);
                          }} className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${settings.theme === val ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                            <div className={`w-full h-16 rounded-md ${t==='Light' ? 'bg-slate-100 border border-slate-200 dark:border-slate-700' : t==='Dark' ? 'bg-slate-900 border border-slate-700' : t==='Mixed' ? 'bg-gradient-to-b from-slate-900 to-slate-100 border border-slate-400' : 'bg-gradient-to-r from-slate-100 to-slate-900 border border-slate-400'}`} />
                            <span className="text-sm font-medium text-slate-900 dark:text-white dark:text-white">{t}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-300">Density</label>
                    <div className="flex gap-4">
                       <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="density" checked={settings.density === 'comfortable'} onChange={() => {
                            handleChange('density', 'comfortable');
                            setDensity('comfortable');
                          }} className="w-4 h-4 accent-blue-600" />
                          <span className="text-sm text-slate-700 dark:text-slate-200 dark:text-slate-300">Comfortable</span>
                       </label>
                       <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="density" checked={settings.density === 'compact'} onChange={() => {
                            handleChange('density', 'compact');
                            setDensity('compact');
                          }} className="w-4 h-4 accent-blue-600" />
                          <span className="text-sm text-slate-700 dark:text-slate-200 dark:text-slate-300">Compact</span>
                       </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Other sections mocked with toggles */}
              {(activeSection === 'notifications' || activeSection === 'api' || activeSection === 'data' || activeSection === 'team' || activeSection === 'security') && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-white dark:text-white capitalize">{activeSection.replace('-', ' ')}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-400">Manage settings and preferences for {activeSection}.</p>
                  </div>
                  
                  {[
                    { key: 'notifications_email', name: 'Email Notifications', desc: 'Receive daily summary emails' },
                    { key: 'notifications_push', name: 'Push Notifications', desc: 'Real-time alerts in browser' },
                    { key: 'features_advanced', name: 'Enable Advanced Features', desc: 'Early access to beta features' }
                  ].map((setting, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 dark:border-slate-800 last:border-0">
                      <div>
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-100 dark:text-slate-200">{setting.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">{setting.desc}</div>
                      </div>
                      {/* Custom Switch */}
                      <button 
                        onClick={() => handleChange(setting.key, !settings[setting.key])}
                        className={`w-10 h-6 rounded-full p-1 transition-colors ${settings[setting.key] ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white dark:bg-slate-900 transition-transform ${settings[setting.key] ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  ))}
                  
                  {activeSection === 'api' && (
                     <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-800">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white dark:text-white mb-2">API Key</div>
                        <div className="flex gap-2">
                           <input type="password" value="sk_live_1234567890abcdef" readOnly className="flex-1 bg-white dark:bg-slate-900 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono text-slate-600 dark:text-slate-300 dark:text-slate-400" />
                           <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700 text-sm font-medium hover:bg-white dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 dark:text-slate-300">Reveal</button>
                        </div>
                     </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Save Bar */}
        <AnimatePresence>
          {hasChanges && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 rounded-2xl shadow-2xl flex items-center justify-between z-50 border border-slate-700 dark:border-slate-200"
            >
              <span className="text-sm font-medium pl-2">Unsaved changes</span>
              <div className="flex gap-3">
                <button 
                  onClick={handleDiscard}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white dark:text-slate-600 dark:hover:text-slate-900 dark:text-white transition-colors"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:bg-blue-600 dark:text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  {saving ? <Loader className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />}
                  Save Settings
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
