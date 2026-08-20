import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getSettings, updateSettings } from '../services/api';
import { Settings, Sliders, Sun, Moon, Check, Save, Loader } from 'lucide-react';

export function SettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then(data => setSettings(data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleUpdate = (key, value) => {
    setSettings(prev => {
       const next = { ...prev };
       for (const cat in next) {
          const idx = next[cat].findIndex(s => s.key === key);
          if (idx !== -1) {
             next[cat][idx] = { ...next[cat][idx], value };
          }
       }
       return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const updates = {};
    for (const cat in settings) {
       for (const s of settings[cat]) {
          updates[s.key] = s.value;
       }
    }
    
    try {
      await updateSettings(updates);
      alert("Settings saved successfully!");
    } catch (e) {
      alert("Failed to save: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">
            System Settings
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Configure backend processing, AI models, and review thresholds.
          </p>
        </div>
        <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm">
           {saving ? <Loader className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />}
           Save Changes
        </button>
      </div>

      {Object.keys(settings).map(category => (
         <div key={category} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="pb-3 border-b border-slate-100">
               <h3 className="font-display font-semibold text-sm text-slate-900">{category} Configuration</h3>
            </div>
            
            <div className="space-y-4">
               {settings[category].map(setting => (
                  <div key={setting.key} className="flex justify-between items-center py-2">
                     <div className="flex-1">
                        <label className="text-sm font-medium text-slate-800">{setting.description || setting.key}</label>
                        <p className="text-xs text-slate-500 font-mono">{setting.key}</p>
                     </div>
                     <div className="w-1/3 text-right">
                        {setting.type === 'boolean' ? (
                           <input type="checkbox" checked={setting.value} onChange={e => handleUpdate(setting.key, e.target.checked)} className="w-4 h-4 accent-blue-600" />
                        ) : setting.type === 'integer' || setting.type === 'float' ? (
                           <input type="number" step={setting.type === 'float' ? '0.01' : '1'} value={setting.value} onChange={e => handleUpdate(setting.key, e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        ) : (
                           <input type="text" value={setting.value} onChange={e => handleUpdate(setting.key, e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      ))}
    </div>
  );
}
