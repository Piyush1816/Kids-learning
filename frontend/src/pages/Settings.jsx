import React, { useState } from 'react';
import { api } from '../services/api';
import { sound } from '../services/audioService';
import LumiMascot from '../components/LumiMascot';
import { 
  Settings as SettingsIcon, 
  Volume2, 
  VolumeX, 
  Sun,
  Moon,
  RotateCcw, 
  Sparkles, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

export default function Settings({ setStars, darkMode, toggleDarkMode }) {
  const [soundEnabled, setSoundEnabled] = useState(sound.soundEnabled);
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

  return (
    <div className="space-y-8 py-4 max-w-3xl mx-auto text-slate-800 dark:text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>Settings &amp; Accessibility</span>
            <span className="text-2xl">⚙️</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
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

      {/* Dark Mode & Theme Toggle Card */}
      <div className="card-soft p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
        <h2 className="font-display font-bold text-xl text-slate-800 dark:text-slate-100">
          Appearance &amp; Dark Mode
        </h2>
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Moon className="w-6 h-6 text-indigo-400" />
            ) : (
              <Sun className="w-6 h-6 text-amber-500" />
            )}
            <div>
              <p className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">
                {darkMode ? 'Dark Mode Enabled' : 'Light Mode Enabled'}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">
                Switch between cozy pastel light mode and comfortable dark mode
              </p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`btn-bubbly px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              darkMode ? 'bg-indigo-600 text-white shadow-md' : 'bg-amber-400 text-amber-950 font-extrabold shadow-sm'
            }`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{darkMode ? 'Switch to Light' : 'Switch to Dark'}</span>
          </button>
        </div>
      </div>

      {/* Sound Settings Card */}
      <div className="card-soft p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
        <h2 className="font-display font-bold text-xl text-slate-800 dark:text-slate-100">
          Sound &amp; Voice Settings
        </h2>
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            {soundEnabled ? (
              <Volume2 className="w-6 h-6 text-amber-500" />
            ) : (
              <VolumeX className="w-6 h-6 text-slate-400" />
            )}
            <div>
              <p className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">
                Sound Effects &amp; Phonics Audio
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">
                Play celebratory chimes and spoken letter sounds
              </p>
            </div>
          </div>
          <button
            onClick={toggleSound}
            className={`btn-bubbly px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              soundEnabled ? 'bg-amber-400 text-amber-950 font-extrabold' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {soundEnabled ? 'Enabled' : 'Muted'}
          </button>
        </div>
      </div>

      {/* Accessibility Card */}
      <div className="card-soft p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
        <h2 className="font-display font-bold text-xl text-slate-800 dark:text-slate-100">
          Accessibility Options
        </h2>
        <div className="space-y-3">
          
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700">
            <div>
              <p className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">Reduced Motion</p>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">Minimize animations for vestibular comfort</p>
            </div>
            <button
              onClick={() => { sound.playPop(); setReducedMotion(!reducedMotion); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                reducedMotion ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {reducedMotion ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700">
            <div>
              <p className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">High Contrast Text</p>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">Extra sharp border contrast for clear viewing</p>
            </div>
            <button
              onClick={() => { sound.playPop(); setHighContrast(!highContrast); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                highContrast ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {highContrast ? 'ON' : 'OFF'}
            </button>
          </div>

        </div>
      </div>

      {/* Reset Progress Card */}
      <div className="card-soft p-6 bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-base text-rose-950 dark:text-rose-200">
            Reset Demo Progress
          </h3>
          <p className="text-xs text-rose-700 dark:text-rose-400 font-medium mt-0.5">
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
          <div className="card-soft p-6 bg-white dark:bg-slate-800 max-w-sm w-full space-y-4 shadow-2xl text-center border dark:border-slate-700">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-800 dark:text-slate-100">
              Are you sure?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              This will reset your earned stars, badges, and learning history back to initial test data.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-600"
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
