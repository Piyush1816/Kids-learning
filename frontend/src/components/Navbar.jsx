import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { sound } from '../services/audioService';
import { 
  Sparkles, 
  Award, 
  BookOpen, 
  Gamepad2, 
  HelpCircle, 
  Palette, 
  Settings, 
  RefreshCw, 
  Menu, 
  X,
  Home,
  Sun,
  Moon
} from 'lucide-react';

export default function Navbar({ currentTab, setTab, stars, badgesCount, darkMode, toggleDarkMode }) {
  const [backendStatus, setBackendStatus] = useState({ isOnline: false, checked: false });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const unsub = api.subscribe((status) => {
      setBackendStatus(status);
    });
    return unsub;
  }, []);

  const handleRefreshConnection = async () => {
    setIsRefreshing(true);
    try {
      sound.playPop();
    } catch (e) {
      // ignore
    }
    await api.checkBackendHealth();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home, color: 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800' },
    { id: 'learn', label: 'Learn', icon: BookOpen, color: 'text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800' },
    { id: 'play', label: 'Play', icon: Gamepad2, color: 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800' },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle, color: 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-slate-800' },
    { id: 'rewards', label: 'Rewards', icon: Award, color: 'text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-slate-800' },
    { id: 'draw', label: 'Draw', icon: Palette, color: 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-300 select-none">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2 xl:gap-4">
          
          {/* LEFT: Brand Logo & Mascot Avatar */}
          <div 
            onClick={() => { 
              setTab('dashboard'); 
              try { sound.playPop(); } catch (e) {} 
            }}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-lg sm:text-2xl shadow-sm group-hover:scale-105 transition-transform duration-200">
              🦊
            </div>
            <div>
              <span className="font-display font-bold text-base sm:text-xl xl:text-2xl tracking-wide bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Little Learners
              </span>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase -mt-1 hidden xl:block">
                Explore, Play &amp; Grow
              </p>
            </div>
          </div>

          {/* MAIN NAVIGATION: Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink min-w-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTab(item.id);
                    try { sound.playPop(); } catch (e) {}
                  }}
                  className={`flex items-center gap-1 xl:gap-1.5 px-2 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-display font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 shadow-sm border border-amber-300 dark:border-amber-700' 
                      : `text-slate-600 dark:text-slate-300 ${item.color}`
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${isActive ? 'text-amber-600 dark:text-amber-400' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* RIGHT-SIDE CONTROLS: Theme Toggle, Stars, Badges, Backend Status */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Functional Light/Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer select-none shrink-0"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-display font-bold hidden sm:inline text-amber-300">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                  <span className="text-xs font-display font-bold hidden sm:inline text-slate-600">Dark</span>
                </>
              )}
            </button>

            {/* Stars Balance Pill */}
            <div 
              onClick={() => { 
                setTab('rewards'); 
                try { sound.playPop(); } catch (e) {} 
              }}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 font-display font-bold text-xs sm:text-sm shadow-sm cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors shrink-0"
              title="Your stars! Tap to view Rewards"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-400 animate-pulse" />
              <span>{stars}</span>
            </div>

            {/* Badges Count Pill */}
            <div 
              onClick={() => { 
                setTab('rewards'); 
                try { sound.playPop(); } catch (e) {} 
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300 font-display font-bold text-xs shadow-sm cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors shrink-0"
              title="Your earned badges!"
            >
              <Award className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>{badgesCount} Badges</span>
            </div>

            {/* Backend Connection Status Indicator */}
            <div 
              onClick={handleRefreshConnection}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-full text-[11px] font-bold cursor-pointer transition-all border shrink-0 ${
                backendStatus.isOnline
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 hover:bg-amber-100'
              }`}
              title={
                backendStatus.isOnline 
                  ? 'Connected to Spring Boot REST Backend' 
                  : 'Standalone Demo Mode (Local Storage)'
              }
            >
              <span className={`w-2 h-2 rounded-full ${backendStatus.isOnline ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
              <span className="hidden xl:inline font-mono text-[10px]">
                {backendStatus.isOnline ? 'Spring Boot: Live' : 'Demo Mode'}
              </span>
              <RefreshCw className={`w-3 h-3 text-slate-400 hover:text-slate-600 dark:text-slate-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            </div>

            {/* Mobile / Tablet Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 min-w-[38px] min-h-[38px] flex items-center justify-center shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-2 shadow-xl animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTab(item.id);
                  setMobileMenuOpen(false);
                  try { sound.playPop(); } catch (e) {}
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-display font-bold transition-colors ${
                  isActive 
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
