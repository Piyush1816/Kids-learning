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
  Sparkles, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

export default function Settings({ 
  setStars, 
  darkMode, 
  toggleDarkMode,
  reducedMotion: propReducedMotion,
  toggleReducedMotion: propToggleReducedMotion,
  highContrast: propHighContrast,
  toggleHighContrast: propToggleHighContrast
}) {
  const [soundEnabled, setSoundEnabled] = useState(() => sound.soundEnabled);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Support standalone mounting or prop-driven application state
  const [localReducedMotion, setLocalReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ll_reduced_motion');
      if (saved !== null) return saved === 'true';
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const [localHighContrast, setLocalHighContrast] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ll_high_contrast');
      if (saved !== null) return saved === 'true';
    }
    return false;
  });

  const isReducedMotion = propReducedMotion !== undefined ? propReducedMotion : localReducedMotion;
  const isHighContrast = propHighContrast !== undefined ? propHighContrast : localHighContrast;

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setSoundEnabled(next);
    if (next) sound.playPop();
  };

  const handleToggleReducedMotion = () => {
    if (propToggleReducedMotion) {
      propToggleReducedMotion();
    } else {
      sound.playPop();
      const next = !localReducedMotion;
      setLocalReducedMotion(next);
      if (typeof window !== 'undefined') {
        const root = document.documentElement;
        if (next) {
          root.classList.add('reduced-motion');
          root.classList.remove('motion-allowed');
          localStorage.setItem('ll_reduced_motion', 'true');
        } else {
          root.classList.remove('reduced-motion');
          root.classList.add('motion-allowed');
          localStorage.setItem('ll_reduced_motion', 'false');
        }
      }
    }
  };

  const handleToggleHighContrast = () => {
    if (propToggleHighContrast) {
      propToggleHighContrast();
    } else {
      sound.playPop();
      const next = !localHighContrast;
      setLocalHighContrast(next);
      if (typeof window !== 'undefined') {
        const root = document.documentElement;
        if (next) {
          root.classList.add('high-contrast');
          localStorage.setItem('ll_high_contrast', 'true');
        } else {
          root.classList.remove('high-contrast');
          localStorage.setItem('ll_high_contrast', 'false');
        }
      }
    }
  };

  const handleResetProgress = () => {
    sound.playPop();
    // 1. Reset all demo data in localStorage and notify subscribers
    api.resetAllDemoData();
    // 2. Synchronize App-level stars state to initial default (24)
    if (typeof setStars === 'function') {
      setStars(24);
    }
    // 3. Close confirmation modal
    setShowResetModal(false);
    // 4. Display clear success message
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
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
        <div 
          role="status"
          aria-live="polite"
          className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border-2 border-emerald-300 dark:border-emerald-700 font-bold text-sm text-center shadow-sm flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Demo progress, completed lessons, challenges, stars (24 ⭐), and badges have been reset to their initial defaults!</span>
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
              <Moon className="w-6 h-6 text-indigo-400 shrink-0" />
            ) : (
              <Sun className="w-6 h-6 text-amber-500 shrink-0" />
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
            type="button"
            onClick={toggleDarkMode}
            className={`btn-bubbly px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              darkMode ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' : 'bg-amber-400 text-amber-950 font-extrabold shadow-sm hover:bg-amber-300'
            }`}
            aria-pressed={darkMode}
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
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
              <Volume2 className="w-6 h-6 text-amber-500 shrink-0" />
            ) : (
              <VolumeX className="w-6 h-6 text-slate-400 shrink-0" />
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
            type="button"
            onClick={handleToggleSound}
            className={`btn-bubbly px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              soundEnabled ? 'bg-amber-400 text-amber-950 font-extrabold hover:bg-amber-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
            aria-pressed={soundEnabled}
            aria-label="Toggle Sound Effects"
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
          
          {/* 1. Reduced Motion */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700">
            <div>
              <p className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">Reduced Motion</p>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">Minimize animations, bounces, and celebratory motion for vestibular comfort</p>
            </div>
            <button
              type="button"
              onClick={handleToggleReducedMotion}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                isReducedMotion ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
              aria-pressed={isReducedMotion}
              aria-label="Toggle Reduced Motion"
            >
              {isReducedMotion ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* 2. High Contrast Text */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700">
            <div>
              <p className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">High Contrast Text</p>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">Extra sharp border contrast and high-legibility text across all modes</p>
            </div>
            <button
              type="button"
              onClick={handleToggleHighContrast}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                isHighContrast ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
              aria-pressed={isHighContrast}
              aria-label="Toggle High Contrast Text"
            >
              {isHighContrast ? 'ON' : 'OFF'}
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
            Reset stars (24 ⭐), unlocked badges, completed lessons, and daily challenges back to initial defaults.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { sound.playPop(); setShowResetModal(true); }}
          className="btn-bubbly px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-sm hover:bg-rose-700 shrink-0 cursor-pointer"
        >
          Reset Data
        </button>
      </div>

      {/* Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-soft p-6 bg-white dark:bg-slate-800 max-w-sm w-full space-y-4 shadow-2xl text-center border-2 border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-800 dark:text-slate-100">
              Reset Demo Progress?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              This will reset your completed lessons, quiz scores, daily challenges, and activity history. Stars (24 ⭐) and badges will return to their documented initial defaults.
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-400">
              Your theme and accessibility options will remain unchanged.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetProgress}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-sm transition-colors cursor-pointer"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
