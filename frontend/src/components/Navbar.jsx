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
  Users, 
  Cpu, 
  Settings, 
  RefreshCw, 
  Menu, 
  X,
  Home
} from 'lucide-react';

export default function Navbar({ currentTab, setTab, stars, badgesCount }) {
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
    sound.playPop();
    await api.checkBackendHealth();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home, color: 'text-amber-500 hover:bg-amber-50' },
    { id: 'learn', label: 'Explore & Learn', icon: BookOpen, color: 'text-sky-500 hover:bg-sky-50' },
    { id: 'play', label: 'Play Zone', icon: Gamepad2, color: 'text-emerald-500 hover:bg-emerald-50' },
    { id: 'quiz', label: 'Quiz Adventure', icon: HelpCircle, color: 'text-purple-500 hover:bg-purple-50' },
    { id: 'rewards', label: 'Rewards Room', icon: Award, color: 'text-pink-500 hover:bg-pink-50' },
    { id: 'draw', label: 'Creative Corner', icon: Palette, color: 'text-rose-500 hover:bg-rose-50' },
    { id: 'dsa', label: 'DSA Lab (Viva)', icon: Cpu, color: 'text-indigo-600 hover:bg-indigo-50 font-bold' },
    { id: 'parents', label: 'Parents', icon: Users, color: 'text-blue-500 hover:bg-blue-50' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-slate-500 hover:bg-slate-50' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-2 border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Mascot Avatar */}
          <div 
            onClick={() => { setTab('dashboard'); sound.playPop(); }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-2xl shadow-md group-hover:scale-105 transition-transform duration-200">
              🦊
            </div>
            <div>
              <span className="font-display font-bold text-2xl tracking-wide bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Little Learners
              </span>
              <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase -mt-1 hidden sm:block">
                Explore, Play &amp; Grow
              </p>
            </div>
          </div>

          {/* Center Navigation for Desktop */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTab(item.id);
                    sound.playPop();
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-amber-100 text-amber-900 shadow-sm font-bold scale-105' 
                      : `text-slate-600 ${item.color}`
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Counters & Backend Status Pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Stars Pill */}
            <div 
              onClick={() => { setTab('rewards'); sound.playPop(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border-2 border-amber-200 text-amber-800 font-display font-bold text-sm shadow-sm cursor-pointer hover:bg-amber-100 transition-colors"
              title="Your shining stars! Tap to view Rewards"
            >
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400 animate-pulse" />
              <span>{stars}</span>
            </div>

            {/* Badges Pill */}
            <div 
              onClick={() => { setTab('rewards'); sound.playPop(); }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 border-2 border-purple-200 text-purple-800 font-display font-bold text-sm shadow-sm cursor-pointer hover:bg-purple-100 transition-colors"
              title="Your earned badges!"
            >
              <Award className="w-4 h-4 text-purple-500" />
              <span>{badgesCount} Badges</span>
            </div>

            {/* Backend Connection Indicator */}
            <div 
              onClick={handleRefreshConnection}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-all border ${
                backendStatus.isOnline
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
              title={
                backendStatus.isOnline 
                  ? 'Connected to Spring Boot (Java 21 DSA REST Backend)' 
                  : 'Running in Standalone Demo Mode (Local Storage). Start Spring Boot at port 8080 to connect live.'
              }
            >
              <span className={`w-2 h-2 rounded-full ${backendStatus.isOnline ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
              <span className="hidden md:inline font-mono text-[11px]">
                {backendStatus.isOnline ? 'Spring Boot: Live' : 'Demo Mode'}
              </span>
              <RefreshCw className={`w-3 h-3 text-slate-400 hover:text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white/95 backdrop-blur-md border-b-2 border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-lg">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTab(item.id);
                    setMobileMenuOpen(false);
                    sound.playPop();
                  }}
                  className={`flex items-center gap-2 p-3 rounded-2xl text-left font-semibold text-sm transition-all ${
                    isActive 
                      ? 'bg-amber-100 text-amber-900 font-bold border-2 border-amber-300' 
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5 text-amber-500 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
