import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { sound } from '../services/audioService';
import ConfettiCanvas from '../components/ConfettiCanvas';
import LumiMascot from '../components/LumiMascot';
import { 
  Volume2, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  Lightbulb, 
  Shuffle, 
  Search 
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '../services/mockData';

export default function ExploreLearn({ stars, setStars }) {
  const [activeCategory, setActiveCategory] = useState('alphabets');
  const [lessons, setLessons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive state for specific category activities
  const [abacusCount, setAbacusCount] = useState(3);
  const [mixColorA, setMixColorA] = useState('Red');
  const [mixColorB, setMixColorB] = useState('Yellow');

  useEffect(() => {
    loadLessons(activeCategory);
    const saved = JSON.parse(localStorage.getItem('ll_completed_lessons') || '[]');
    setCompletedLessons(saved);
  }, [activeCategory]);

  const loadLessons = async (cat) => {
    const data = await api.getLessons(cat);
    setLessons(data);
    setCurrentIndex(0);
  };

  const currentLesson = lessons[currentIndex] || {};

  const handleNext = () => {
    sound.playPop();
    if (currentIndex < lessons.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // loop
    }
  };

  const handlePrev = () => {
    sound.playPop();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(lessons.length - 1);
    }
  };

  const handleSpeak = (text) => {
    sound.playPop();
    sound.speak(text);
  };

  const handleCompleteCurrentLesson = () => {
    const lessonId = currentLesson.id || `${activeCategory}-${currentIndex}`;
    sound.playSuccess();
    setTriggerConfetti(true);
    api.markLessonComplete(lessonId);
    setStars(parseInt(localStorage.getItem('ll_stars') || '24', 10));
    setCompletedLessons([...completedLessons, lessonId]);
    setTimeout(() => setTriggerConfetti(false), 1500);
  };

  // Color mixing calculation
  const getMixedColor = (a, b) => {
    if ((a === 'Red' && b === 'Yellow') || (a === 'Yellow' && b === 'Red')) return { name: 'Orange', hex: '#FB923C' };
    if ((a === 'Yellow' && b === 'Blue') || (a === 'Blue' && b === 'Yellow')) return { name: 'Green', hex: '#10B981' };
    if ((a === 'Red' && b === 'Blue') || (a === 'Blue' && b === 'Red')) return { name: 'Purple', hex: '#A855F7' };
    if (a === b) return { name: a, hex: a === 'Red' ? '#EF4444' : a === 'Yellow' ? '#FACC15' : '#3B82F6' };
    return { name: 'Brown', hex: '#78350F' };
  };

  return (
    <div className="space-y-8 py-4">
      <ConfettiCanvas trigger={triggerConfetti} />

      {/* Header with Mascot message */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-800">
            Explore &amp; Learn Safari
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Flip through interactive flashcards, listen to pronunciations, and try the fun practice activities!
          </p>
        </div>
        <LumiMascot 
          size="sm" 
          message="Tap the speaker button to hear words spoken aloud!"
        />
      </div>

      {/* 8 Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {INITIAL_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                sound.playPop();
                setActiveCategory(cat.id);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-display font-bold text-sm whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-amber-400 text-amber-950 shadow-md scale-105'
                  : 'bg-white/80 text-slate-600 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Lesson Card */}
      {lessons.length > 0 && currentLesson && (
        <div className="card-soft p-6 sm:p-10 bg-white border-2 border-amber-200 relative overflow-hidden shadow-lg">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Visual Portrait & Audio CTA */}
            <div className="flex flex-col items-center gap-4 text-center">
              <div 
                onClick={() => handleSpeak(currentLesson.letter || currentLesson.name || currentLesson.word || currentLesson.title)}
                className="w-44 h-44 sm:w-52 sm:h-52 rounded-4xl bg-gradient-to-tr from-amber-100 to-orange-100 border-4 border-amber-200 flex flex-col items-center justify-center p-4 cursor-pointer shadow-md hover:scale-105 transition-transform group"
                title="Tap to listen"
              >
                <span className="text-7xl sm:text-8xl filter drop-shadow-md group-hover:scale-110 transition-transform">
                  {currentLesson.icon || currentLesson.illustration || '🌟'}
                </span>
                {currentLesson.letter && (
                  <span className="font-display font-black text-4xl text-amber-700 mt-2">
                    {currentLesson.letter}
                  </span>
                )}
                {currentLesson.num !== undefined && (
                  <span className="font-display font-black text-4xl text-emerald-700 mt-2">
                    {currentLesson.num}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleSpeak(currentLesson.name || currentLesson.word || currentLesson.title || currentLesson.phonics)}
                className="btn-bubbly flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-display font-bold text-sm"
              >
                <Volume2 className="w-4 h-4 text-amber-700" />
                <span>Listen Phonics</span>
              </button>
            </div>

            {/* Lesson Details & Examples */}
            <div className="flex-1 space-y-5 text-center lg:text-left">
              <div>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    Card {currentIndex + 1} of {lessons.length}
                  </span>
                  {currentLesson.phonics && (
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-100 text-sky-800">
                      /{currentLesson.phonics}/
                    </span>
                  )}
                  {currentLesson.role && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                      {currentLesson.role}
                    </span>
                  )}
                </div>

                <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-800">
                  {currentLesson.name || currentLesson.title || currentLesson.word}
                </h2>
              </div>

              <p className="text-base sm:text-lg font-medium text-slate-600 leading-relaxed">
                {currentLesson.desc || currentLesson.explanation}
              </p>

              {/* Examples Pills */}
              {currentLesson.examples && currentLesson.examples.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Word Examples:
                  </h4>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                    {currentLesson.examples.map((ex, i) => (
                      <span 
                        key={i}
                        onClick={() => handleSpeak(ex)}
                        className="px-3.5 py-1.5 rounded-2xl bg-slate-100 hover:bg-amber-100 text-slate-700 font-bold text-sm cursor-pointer transition-colors"
                      >
                        {ex} 🔊
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Fun Fact Callout */}
              {currentLesson.fact && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-left">
                  <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                      Lumi's Fun Fact:
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-amber-950 mt-0.5">
                      {currentLesson.fact}
                    </p>
                  </div>
                </div>
              )}

              {/* Mark Complete CTA */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={handleCompleteCurrentLesson}
                  className="btn-bubbly flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-display font-bold text-sm shadow-md"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>I Learned This! (+3 ⭐)</span>
                </button>
              </div>

            </div>

          </div>

          {/* Previous & Next Navigation Controls */}
          <div className="flex items-center justify-between border-t-2 border-slate-100 pt-6 mt-8">
            <button
              onClick={handlePrev}
              className="btn-bubbly flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-bold text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-bold text-slate-400">
              {currentIndex + 1} / {lessons.length}
            </span>

            <button
              onClick={handleNext}
              className="btn-bubbly flex items-center gap-1.5 px-5 py-2 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-display font-bold text-sm shadow-sm"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Interactive Hands-on Playground for Numbers (Abacus) & Colors (Color Mixer) */}
      {activeCategory === 'numbers' && (
        <div className="card-soft p-6 sm:p-8 bg-emerald-50/70 border-emerald-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧮</span>
              <h3 className="font-display font-bold text-xl text-emerald-950">
                Interactive Abacus Counter
              </h3>
            </div>
            <span className="font-display font-extrabold text-2xl text-emerald-700 bg-white px-4 py-1 rounded-full border border-emerald-300">
              Count: {abacusCount}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-800 font-medium">
            Tap beads below to add or remove items on your abacus!
          </p>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap bg-white p-4 rounded-3xl border border-emerald-200">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                onClick={() => {
                  sound.playPop();
                  setAbacusCount(num);
                  sound.speak(`${num}`);
                }}
                className={`w-12 h-12 rounded-2xl font-display font-bold text-lg transition-transform ${
                  num <= abacusCount
                    ? 'bg-gradient-to-tr from-emerald-400 to-teal-400 text-white shadow-md scale-105'
                    : 'bg-slate-100 text-slate-400 hover:bg-emerald-100'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeCategory === 'colors' && (
        <div className="card-soft p-6 sm:p-8 bg-pink-50/70 border-pink-200 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            <h3 className="font-display font-bold text-xl text-pink-950">
              Magic Color Mixing Studio
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-pink-800 font-medium">
            Choose two colors to discover what secondary color they create!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-white p-6 rounded-3xl border border-pink-200 text-center">
            
            {/* Color A selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Color 1</span>
              <div className="flex gap-2">
                {['Red', 'Yellow', 'Blue'].map((c) => (
                  <button
                    key={c}
                    onClick={() => { sound.playPop(); setMixColorA(c); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${
                      mixColorA === c ? 'border-slate-800 bg-slate-100' : 'border-transparent bg-slate-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-2xl font-bold text-slate-400">+</span>

            {/* Color B selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Color 2</span>
              <div className="flex gap-2">
                {['Red', 'Yellow', 'Blue'].map((c) => (
                  <button
                    key={c}
                    onClick={() => { sound.playPop(); setMixColorB(c); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${
                      mixColorB === c ? 'border-slate-800 bg-slate-100' : 'border-transparent bg-slate-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-2xl font-bold text-slate-400">=</span>

            {/* Resulting Mix */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase">Result!</span>
              <div 
                className="w-14 h-14 rounded-2xl shadow-md flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: getMixedColor(mixColorA, mixColorB).hex }}
              />
              <span className="font-display font-bold text-sm text-slate-800">
                {getMixedColor(mixColorA, mixColorB).name}
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
