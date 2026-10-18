import React from 'react';
import LumiMascot from '../components/LumiMascot';
import { sound } from '../services/audioService';
import { Sparkles, Play, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../services/mockData';

export default function LandingPage({ setTab, onSelectCategory }) {
  const handleStart = () => {
    try { sound.playSuccess(); } catch (e) {}
    setTab('dashboard');
  };

  const handleCategoryClick = (catId) => {
    try { sound.playPop(); } catch (e) {}
    if (onSelectCategory) {
      onSelectCategory(catId);
    } else {
      setTab('learn');
    }
  };

  const handleGames = () => {
    try { sound.playPop(); } catch (e) {}
    setTab('play');
  };

  return (
    <div className="space-y-12 py-6 text-slate-800 dark:text-slate-100">
      
      {/* Whimsical Hero Section */}
      <section className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-amber-100/80 via-sky-100/70 to-pink-100/80 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 p-8 sm:p-12 border-4 border-white dark:border-slate-700 shadow-xl">
        
        {/* Floating background decorative shapes */}
        <div className="absolute top-4 left-6 text-2xl animate-float opacity-70">☁️</div>
        <div className="absolute top-10 right-12 text-3xl animate-bounce-gentle opacity-80">🌈</div>
        <div className="absolute bottom-6 left-1/4 text-2xl animate-float opacity-60">✨</div>
        <div className="absolute bottom-10 right-1/3 text-2xl animate-float opacity-70">🎈</div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          
          <div className="space-y-5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-sm font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Welcoming Kids Ages 4 to 10</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-800 dark:text-slate-100 leading-tight">
              Big Discoveries Start with <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">Little Steps!</span>
            </h1>

            <p className="text-lg sm:text-xl font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
              Learn, play, explore and shine every day. Join Lumi on an exciting adventure full of alphabets, numbers, colors, mini-games, and quizzes!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <button
                onClick={handleStart}
                className="btn-bubbly flex items-center gap-2 px-8 py-4 rounded-3xl bg-gradient-to-r from-orange-400 to-amber-500 text-white font-display text-lg font-bold shadow-lg shadow-orange-300/50 dark:shadow-none hover:brightness-105"
              >
                <BookOpen className="w-5 h-5" />
                <span>Start Learning</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>

              <button
                onClick={handleGames}
                className="btn-bubbly flex items-center gap-2 px-7 py-4 rounded-3xl bg-white/90 dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-display text-lg font-bold shadow-md hover:bg-purple-50 dark:hover:bg-slate-700"
              >
                <Play className="w-5 h-5 text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-purple-400" />
                <span>Explore Games</span>
              </button>
            </div>

            {/* Value checklist */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Free &amp; Ad-Free</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No Sign-Up Needed</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 8 Interactive Worlds</span>
            </div>
          </div>

          {/* Lumi Mascot Hero Portrait */}
          <div className="shrink-0 flex flex-col items-center">
            <LumiMascot 
              size="lg" 
              mood="celebrate"
              message="Welcome to Little Learners! Are you ready to collect stars today?" 
            />
          </div>

        </div>
      </section>

      {/* Preview Learning Categories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-800 dark:text-slate-100">
              Explore 8 Fun Learning Worlds
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
              Tap any category to dive into interactive flashcards, sounds, and quizzes.
            </p>
          </div>
          <button
            onClick={() => setTab('learn')}
            className="text-amber-600 dark:text-amber-400 hover:text-amber-700 font-bold text-sm flex items-center gap-1 hidden sm:flex"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {INITIAL_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="card-soft p-5 cursor-pointer hover:-translate-y-1 group border-2 hover:border-amber-300 dark:hover:border-amber-600"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl p-2 rounded-2xl bg-slate-50 dark:bg-slate-700/80 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  {cat.count} Lessons
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mt-1">
                {cat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
