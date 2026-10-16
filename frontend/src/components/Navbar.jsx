import React, { useState, useEffect, useRef } from 'react';
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
  Home,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ currentTab, setTab, stars, badgesCount }) {
  const [backendStatus, setBackendStatus] = useState({ isOnline: false, checked: false });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsub = api.subscribe((status) => {
      setBackendStatus(status);
    });
    return unsub;
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMoreDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRefreshConnection = async () => {
    setIsRefreshing(true);
    sound.playPop();
    await api.checkBackendHealth();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const primaryNavItems = [
    { id: 'dashboard', label: 'Home', icon: Home, color: 'text-amber-600 hover:bg-amber-50' },
    { id: 'learn', label: 'Learn', icon: BookOpen, color: 'text-sky-600 hover:bg-sky-50' },
    { id: 'play', label: 'Play', icon: Gamepad2, color: 'text-emerald-600 hover:bg-emerald-50' },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle, color: 'text-purple-600 hover:bg-purple-50' },
    { id: 'rewards', label: 'Rewards', icon: Award, color: 'text-pink-600 hover:bg-pink-50' },
    { id: 'draw', label: 'Draw', icon: Palette, color: 'text-rose-600 hover:bg-rose-50' },
  ];

  const secondaryNavItems = [
    { id: 'dsa', label: 'DSA Lab (Viva)', icon: Cpu, badge: 'Java 21', color: 'text-indigo-600 hover:bg-indigo-50 font-bold' },
    { id: 'parents', label: 'Parent Corner', icon: Users, color: 'text-blue-600 hover:bg-blue-50' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-slate-600 hover:bg-slate-50' },
  ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  const isSecondaryActive = secondaryNavItems.some((item) => item.id === currentTab);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo & Mascot Avatar */}
          <div 
            onClick={() => { setTab('dashboard'); sound.playPop(); }}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-xl sm:text-2xl shadow-sm group-hover:scale-105 transition-transform duration-200">
              🦊
            </div>
            <div>
              <span className="font-display font-bold text-xl sm:text-2xl tracking-wide bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Little Learners
              </span>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase -mt-1 hidden md:block">
                Explore, Play &amp; Grow
              </p>
            </div>
          </div>

          {/* Desktop & Laptop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 shrink min-w-0">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTab(item.id);
                    sound.playPop();
                  }}
                  className={`flex items-center gap-1 xl:gap-1.5 px-2 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-display font-bold whitespace-nowrap transition-all duration-200 ${
                    isActive 
                      ? 'bg-amber-100 text-amber-900 shadow-sm scale-102 border border-amber-300' 
                      : `text-slate-600 ${item.color}`
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${isActive ? 'text-amber-600' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Extra items for XL full width */}
            <div className="hidden xl:flex items-center gap-1 border-l border-slate-200 pl-2 ml-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setTab(item.id);
                      sound.playPop();
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-display font-bold whitespace-nowrap transition-all duration-200 ${
                      isActive 
                        ? 'bg-indigo-100 text-indigo-950 shadow-sm border border-indigo-300 scale-102' 
                        : `text-slate-600 ${item.color}`
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-200 text-indigo-800 font-mono">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Laptop dropdown for secondary items when screen is lg (1024-1279px) */}
            <div className="relative xl:hidden" ref={dropdownRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-display font-bold border transition-colors whitespace-nowrap ${
                  isSecondaryActive 
                    ? 'bg-indigo-100 text-indigo-900 border-indigo-300' 
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>Tools</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {moreDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setTab(item.id);
                          setMoreDropdownOpen(false);
                          sound.playPop();
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-display font-bold text-left hover:bg-slate-50 ${
                          isActive ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-indigo-600" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-mono">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Counters & Backend Status Pill */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Stars Pill */}
            <div 
              onClick={() => { setTab('rewards'); sound.playPop(); }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 font-display font-bold text-xs sm:text-sm shadow-sm cursor-pointer hover:bg-amber-100 transition-colors"
              title="Your stars! Tap to view Rewards"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-400 animate-pulse" />
              <span>{stars}</span>
            </div>

            {/* Badges Pill */}
            <div 
              onClick={() => { setTab('rewards'); sound.playPop(); }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-900 font-display font-bold text-xs shadow-sm cursor-pointer hover:bg-purple-100 transition-colors"
              title="Your earned badges!"
            >
              <Award className="w-3.5 h-3.5 text-purple-600" />
              <span>{badgesCount} Badges</span>
            </div>

            {/* Backend Connection Indicator */}
            <div 
              onClick={handleRefreshConnection}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all border ${
                backendStatus.isOnline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
              }`}
              title={
                backendStatus.isOnline 
                  ? 'Connected to Spring Boot (Java 21 DSA REST Backend via /api)' 
                  : 'Running in Standalone Demo Mode (Local Storage). Start Spring Boot backend to sync live!'
              }
            >
              <span className={`w-2 h-2 rounded-full ${backendStatus.isOnline ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
              <span className="hidden md:inline font-mono text-[10px]">
                {backendStatus.isOnline ? 'Spring Boot: Live' : 'Demo Mode'}
              </span>
              <RefreshCw className={`w-3 h-3 text-slate-400 hover:text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </div>

            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200 min-w-[48px] min-h-[48px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile / Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b-2 border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Navigation Menu
            </span>
            <span className="text-xs font-bold text-amber-600 font-display">
              {stars} Stars • {badgesCount} Badges
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {allNavItems.map((item) => {
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
                  className={`flex items-center gap-2 p-3 min-h-[48px] rounded-2xl text-left font-display font-bold text-xs sm:text-sm transition-all ${
                    isActive 
                      ? 'bg-amber-100 text-amber-950 border-2 border-amber-300 shadow-sm' 
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-500 shrink-0" />
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
