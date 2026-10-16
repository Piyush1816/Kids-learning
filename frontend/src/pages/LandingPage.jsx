import React from 'react';
import LumiMascot from '../components/LumiMascot';
import { sound } from '../services/audioService';
import { Sparkles, Play, BookOpen, ArrowRight, Star, Heart, CheckCircle2 } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../services/mockData';

export default function LandingPage({ setTab }) {
  const handleStart = () => {
    sound.playSuccess();
    setTab('dashboard');
  };

  const handleGames = () => {
    sound.playPop();
    setTab('play');
  };

  return (
    <div className="space-y-12 py-6">
      
      {/* Whimsical Hero Section */}
      <section className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-amber-100/80 via-sky-100/70 to-pink-100/80 p-8 sm:p-12 border-4 border-white shadow-xl">
        
        {/* Floating background decorative shapes */}
        <div className="absolute top-4 left-6 text-2xl animate-float opacity-70">☁️</div>
        <div className="absolute top-10 right-12 text-3xl animate-bounce-gentle opacity-80">🌈</div>
        <div className="absolute bottom-6 left-1/4 text-2xl animate-float opacity-60">✨</div>
        <div className="absolute bottom-10 right-1/3 text-2xl animate-float opacity-70">🎈</div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          
          <div className="space-y-5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border-2 border-amber-300 text-amber-800 text-sm font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Welcoming Kids Ages 4 to 10</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-800 leading-tight">
              Big Discoveries Start with <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">Little Steps!</span>
            </h1>

            <p className="text-lg sm:text-xl font-medium text-slate-600 leading-relaxed">
              Learn, play, explore and shine every day. Join Lumi on an exciting adventure full of alphabets, numbers, colors, mini-games, and quizzes!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <button
                onClick={handleStart}
                className="btn-bubbly flex items-center gap-2 px-8 py-4 rounded-3xl bg-gradient-to-r from-orange-400 to-amber-500 text-white font-display text-lg font-bold shadow-lg shadow-orange-300/50 hover:brightness-105"
              >
                <BookOpen className="w-5 h-5" />
                <span>Start Learning</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>

              <button
                onClick={handleGames}
                className="btn-bubbly flex items-center gap-2 px-7 py-4 rounded-3xl bg-white/90 border-2 border-purple-200 text-purple-700 font-display text-lg font-bold shadow-md hover:bg-purple-50"
              >
                <Play className="w-5 h-5 text-purple-600 fill-purple-600" />
                <span>Explore Games</span>
              </button>
            </div>

            {/* Value checklist */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4 text-xs sm:text-sm font-semibold text-slate-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Free &amp; Ad-Free</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No Sign-Up Needed</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> College DSA in Java</span>
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
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-800">
              Explore 8 Fun Learning Worlds
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Tap any category to dive into interactive flashcards, sounds, and quizzes.
            </p>
          </div>
          <button
            onClick={() => setTab('learn')}
            className="text-amber-600 hover:text-amber-700 font-bold text-sm flex items-center gap-1 hidden sm:flex"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {INITIAL_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                sound.playPop();
                setTab('learn');
              }}
              className="card-soft p-5 cursor-pointer hover:-translate-y-1 group border-2 hover:border-amber-300"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl p-2 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                  {cat.count} Lessons
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-slate-800 group-hover:text-amber-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1">
                {cat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* College DSA viva showcase teaser banner */}
      <section className="rounded-3xl bg-indigo-50 border-2 border-indigo-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-200/60 text-indigo-900 font-bold text-xs uppercase tracking-wider">
            🎓 College Viva &amp; DSA Showcase
          </div>
          <h3 className="font-display font-bold text-2xl text-indigo-950">
            Powered by Java 21 Collections &amp; Custom Algorithms
          </h3>
          <p className="text-indigo-800 text-sm max-w-xl font-medium">
            Explore our real-time interactive visualizers for ArrayList dynamic resizing, HashMap chaining, Challenge Queue FIFO rotation, and Stack undo history.
          </p>
        </div>
        <button
          onClick={() => { sound.playPop(); setTab('dsa'); }}
          className="btn-bubbly px-6 py-3 rounded-2xl bg-indigo-600 text-white font-display font-bold text-sm shadow-md hover:bg-indigo-700 shrink-0"
        >
          Open DSA Lab
        </button>
      </section>

    </div>
  );
}
