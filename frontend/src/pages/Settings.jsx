import React, { useState } from 'react';
import { api } from '../services/api';
import { sound } from '../services/audioService';
import LumiMascot from '../components/LumiMascot';
import { 
  Settings as SettingsIcon, 
  Volume2, 
  VolumeX, 
  Eye, 
  RotateCcw, 
  Sparkles, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

export default function Settings({ setStars }) {
  const [soundEnabled, setSoundEnabled] = useState(sound.soundEnabled);
  const [selectedTheme, setSelectedTheme] = useState('Sunny Day');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setSoundEnabled(next);
    if (next) sound.playPop();
  };

  const handleResetProgress = () => {
    sound.playPop();
    api.resetAllDemoData();
    setStars(24);
    setShowResetModal(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2000);
  };

  const themes = [
    { name: 'Sunny Day', bg: 'bg-amber-100 border-amber-300' },
    { name: 'Sweet Lavender', bg: 'bg-purple-100 border-purple-300' },
    { name: 'Mint Meadow', bg: 'bg-emerald-100 border-emerald-300' },
    { name: 'Ocean Blue', bg: 'bg-sky-100 border-sky-300' }
  ];

  return (
    <div className="space-y-8 py-4 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-800 flex items-center gap-2">
            <span>Settings &amp; Accessibility</span>
            <span className="text-2xl">⚙️</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Customize sound effects, visual themes, and accessibility options.
          </p>
        </div>
        <LumiMascot size="sm" message="Customize your learning environment just the way you like!" />
      </div>

      {resetSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-sm text-center animate-fade-in">
          ✨ Progress and demo stars have been refreshed to initial state!
        </div>
      )}

      {/* Sound Settings Card */}
      <div className="card-soft p-6 bg-white border border-slate-200 space-y-4">
        <h2 className="font-display font-bold text-xl text-slate-800">
          Sound &amp; Voice Settings
        </h2>
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-3">
            {soundEnabled ? (
              <Volume2 className="w-6 h-6 text-amber-500" />
            ) : (
              <VolumeX className="w-6 h-6 text-slate-400" />
            )}
            <div>
              <p className="font-display font-bold text-sm text-slate-800">
                Sound Effects &amp; Phonics Audio
              </p>
              <p className="text-xs text-slate-400 font-medium">
                Play celebratory chimes and spoken letter sounds
              </p>
            </div>
          </div>
          <button
            onClick={toggleSound}
            className={`btn-bubbly px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              soundEnabled ? 'bg-amber-400 text-amber-950 font-extrabold' : 'bg-slate-200 text-slate-600'
            }`}
          >
            {soundEnabled ? 'Enabled' : 'Muted'}
          </button>
        </div>
      </div>

      {/* Theme Selection Card */}
      <div className="card-soft p-6 bg-white border border-slate-200 space-y-4">
        <h2 className="font-display font-bold text-xl text-slate-800">
          Visual Color Theme
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {themes.map((t) => (
            <button
              key={t.name}
              onClick={() => { sound.playPop(); setSelectedTheme(t.name); }}
              className={`p-4 rounded-2xl border-2 font-display font-bold text-xs flex flex-col items-center gap-2 transition-all ${t.bg} ${
                selectedTheme === t.name ? 'ring-2 ring-slate-800 scale-105' : 'opacity-80'
              }`}
            >
              <span>🎨</span>
              <span>{t.name}</span>
              {selectedTheme === t.name && <Check className="w-4 h-4 text-slate-800" />}
            </button>
          ))}
        </div>
      </div>

      {/* Accessibility Card */}
      <div className="card-soft p-6 bg-white border border-slate-200 space-y-4">
        <h2 className="font-display font-bold text-xl text-slate-800">
          Accessibility Options
        </h2>
        <div className="space-y-3">
          
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <p className="font-display font-bold text-sm text-slate-800">Reduced Motion</p>
              <p className="text-xs text-slate-400 font-medium">Minimize animations for vestibular comfort</p>
            </div>
            <button
              onClick={() => { sound.playPop(); setReducedMotion(!reducedMotion); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                reducedMotion ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {reducedMotion ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <p className="font-display font-bold text-sm text-slate-800">High Contrast Text</p>
              <p className="text-xs text-slate-400 font-medium">Extra sharp border contrast for clear viewing</p>
            </div>
            <button
              onClick={() => { sound.playPop(); setHighContrast(!highContrast); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                highContrast ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {highContrast ? 'ON' : 'OFF'}
            </button>
          </div>

        </div>
      </div>

      {/* Reset Progress Card */}
      <div className="card-soft p-6 bg-rose-50/70 border border-rose-200 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-base text-rose-950">
            Reset Demo Progress
          </h3>
          <p className="text-xs text-rose-700 font-medium mt-0.5">
            Reset stars, unlocked badges, and daily challenges back to initial defaults.
          </p>
        </div>
        <button
          onClick={() => { sound.playPop(); setShowResetModal(true); }}
          className="btn-bubbly px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-sm hover:bg-rose-700 shrink-0"
        >
          Reset Data
        </button>
      </div>

      {/* Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-soft p-6 bg-white max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-800">
              Are you sure?
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              This will reset your earned stars, badges, and learning history back to initial test data.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleResetProgress}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
