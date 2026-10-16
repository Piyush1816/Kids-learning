import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ExploreLearn from './pages/ExploreLearn';
import PlayZone from './pages/PlayZone';
import QuizAdventure from './pages/QuizAdventure';
import RewardsRoom from './pages/RewardsRoom';
import CreativeCorner from './pages/CreativeCorner';
import ParentCorner from './pages/ParentCorner';
import Settings from './pages/Settings';
import DsaLab from './pages/DsaLab';
import { api } from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('landing');
  const [stars, setStars] = useState(24);
  const [badgesCount, setBadgesCount] = useState(3);
  const [activeLearnCategory, setActiveLearnCategory] = useState('alphabets');

  useEffect(() => {
    const profile = api.getProfile();
    setStars(profile.totalStars);
    setBadgesCount(profile.badgesEarned);
  }, []);

  const navigateToLearnCategory = (catId) => {
    setActiveLearnCategory(catId);
    setCurrentTab('learn');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 via-white to-amber-50/30 text-slate-800">
      
      {/* Top Child-Friendly Navbar */}
      <Navbar 
        currentTab={currentTab} 
        setTab={setCurrentTab} 
        stars={stars} 
        badgesCount={badgesCount} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {currentTab === 'landing' && (
          <LandingPage 
            setTab={setCurrentTab} 
            onSelectCategory={navigateToLearnCategory} 
          />
        )}
        {currentTab === 'dashboard' && (
          <Dashboard 
            setTab={setCurrentTab} 
            stars={stars} 
            setStars={setStars} 
            badgesCount={badgesCount} 
            onSelectCategory={navigateToLearnCategory} 
          />
        )}
        {currentTab === 'learn' && (
          <ExploreLearn 
            stars={stars} 
            setStars={setStars} 
            initialCategory={activeLearnCategory} 
          />
        )}
        {currentTab === 'play' && <PlayZone stars={stars} setStars={setStars} />}
        {currentTab === 'quiz' && <QuizAdventure stars={stars} setStars={setStars} />}
        {currentTab === 'rewards' && <RewardsRoom stars={stars} />}
        {currentTab === 'draw' && <CreativeCorner />}
        {currentTab === 'parents' && <ParentCorner stars={stars} onSelectCategory={navigateToLearnCategory} />}
        {currentTab === 'dsa' && <DsaLab />}
        {currentTab === 'settings' && <Settings setStars={setStars} />}
      </main>

      {/* Playful Educational Footer */}
      <footer className="border-t-2 border-slate-100 bg-white/80 backdrop-blur-sm py-6 text-center text-xs font-medium text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>🦊</span>
            <span className="font-display font-bold text-slate-700">Little Learners — Explore, Play &amp; Grow</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>College DSA in Java 21 Project</span>
            <span>•</span>
            <button 
              onClick={() => setCurrentTab('dsa')}
              className="text-indigo-600 font-bold hover:underline"
            >
              DSA Visualizer Lab
            </button>
            <span>•</span>
            <span>Child-Safe &amp; Ad-Free</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
