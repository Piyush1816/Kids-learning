import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Check,
  Search,
  LayoutGrid,
  CreditCard,
  X,
  RotateCcw,
  HelpCircle,
  Award,
  Layers,
  Compass,
  Trophy,
  ArrowRight,
  BookOpen,
  PartyPopper
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '../services/mockData';

export default function ExploreLearn({ stars, setStars, initialCategory = 'alphabets' }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [lessons, setLessons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [categoriesWithProgress, setCategoriesWithProgress] = useState(INITIAL_CATEGORIES);

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');
  const [viewMode, setViewMode] = useState('card'); // 'card' | 'grid' | 'categories'

  // Completion & Celebration Modal
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Interactive Activity State for current card
  const [activitySelected, setActivitySelected] = useState(null);
  const [activityFeedback, setActivityFeedback] = useState(null);

  // Category Interactive Playgrounds
  const [abacusCount, setAbacusCount] = useState(5);
  const [mixColorA, setMixColorA] = useState('Red');
  const [mixColorB, setMixColorB] = useState('Yellow');

  // Refs to always access freshest state during cleanup/unmount
  const activeCategoryRef = useRef(activeCategory);
  const lessonsRef = useRef(lessons);
  const currentIndexRef = useRef(currentIndex);
  const filteredLessonsRef = useRef([]);

  useEffect(() => {
    activeCategoryRef.current = activeCategory;
  }, [activeCategory]);

  useEffect(() => {
    lessonsRef.current = lessons;
  }, [lessons]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Sync initialCategory prop if changed externally (e.g. from Dashboard or Navbar)
  useEffect(() => {
    if (initialCategory && initialCategory !== activeCategory) {
      saveCurrentPosition();
      setActiveCategory(initialCategory);
      setViewMode('card');
    }
  }, [initialCategory]);

  // Save position on component unmount
  useEffect(() => {
    return () => {
      saveCurrentPosition();
    };
  }, []);

  // Helper to persist current card position to localStorage safely
  const saveCurrentPosition = () => {
    const catId = activeCategoryRef.current;
    const all = lessonsRef.current;
    const curIdx = currentIndexRef.current;
    const filtered = filteredLessonsRef.current;

    if (!catId || !all || all.length === 0) return;

    const curLesson = filtered && filtered[curIdx] ? filtered[curIdx] : all[curIdx];
    if (curLesson) {
      const fullIdx = all.findIndex((l) => l.id === curLesson.id);
      const targetIdx = fullIdx !== -1 ? fullIdx : curIdx;
      api.saveCategoryPosition(catId, targetIdx, curLesson.id);
    }
  };

  // Helper to save a specific position immediately
  const persistPosition = (catId, indexInFiltered) => {
    const all = lessonsRef.current;
    const filtered = filteredLessonsRef.current;
    if (!catId || !filtered || filtered.length === 0) return;

    const curLesson = filtered[indexInFiltered];
    if (curLesson) {
      const fullIdx = all.findIndex((l) => l.id === curLesson.id);
      const targetIdx = fullIdx !== -1 ? fullIdx : indexInFiltered;
      api.saveCategoryPosition(catId, targetIdx, curLesson.id);
    }
  };

  // Load category lessons and restore exact saved position
  useEffect(() => {
    loadCategoryLessons(activeCategory);
    refreshCompletedLessons();
  }, [activeCategory]);

  const loadCategoryLessons = async (catId) => {
    const data = await api.getLessons(catId);
    setLessons(data);
    lessonsRef.current = data;

    // Retrieve saved progress for this specific category
    const savedProg = api.getCategoryProgress(catId);
    let targetIdx = 0;
    if (savedProg) {
      if (savedProg.lastVisitedLessonId) {
        const foundIdx = data.findIndex((l) => l.id === savedProg.lastVisitedLessonId);
        if (foundIdx !== -1) {
          targetIdx = foundIdx;
        } else if (typeof savedProg.lastVisitedIndex === 'number') {
          targetIdx = savedProg.lastVisitedIndex;
        }
      } else if (typeof savedProg.lastVisitedIndex === 'number') {
        targetIdx = savedProg.lastVisitedIndex;
      }
    }

    // Safety boundary validation
    if (targetIdx < 0 || targetIdx >= data.length) {
      targetIdx = 0;
    }

    setCurrentIndex(targetIdx);
    currentIndexRef.current = targetIdx;
    setSelectedStage('all');
    setSearchQuery('');
    setActivitySelected(null);
    setActivityFeedback(null);
  };

  const refreshCompletedLessons = () => {
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem('ll_completed_lessons') || '[]');
      if (!Array.isArray(saved)) saved = [];
    } catch {
      saved = [];
    }
    setCompletedLessons(saved);
    setCategoriesWithProgress(api.getCategoriesSync());
  };

  // Switch category cleanly while preserving the outgoing category's position
  const handleSwitchCategory = (newCatId) => {
    if (newCatId === activeCategory) {
      setViewMode('card');
      return;
    }
    sound.playPop();
    saveCurrentPosition();
    setActiveCategory(newCatId);
    setViewMode('card');
    setShowCompletionModal(false);
  };

  // Distinct stages/difficulty levels available in current category
  const availableStages = useMemo(() => {
    const stages = new Set();
    lessons.forEach((l) => {
      if (l.stage) stages.add(l.stage);
      else if (l.difficulty) stages.add(l.difficulty);
    });
    return Array.from(stages);
  }, [lessons]);

  // Filtered lessons based on stage and search query
  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesStage = 
        selectedStage === 'all' || 
        lesson.stage === selectedStage || 
        lesson.difficulty === selectedStage;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesStage;

      const titleMatch = (lesson.title || lesson.name || '').toLowerCase().includes(q);
      const letterMatch = (lesson.letter || '').toLowerCase() === q;
      const numMatch = lesson.num !== undefined && String(lesson.num).includes(q);
      const descMatch = (lesson.desc || lesson.explanation || '').toLowerCase().includes(q);
      const examplesMatch = Array.isArray(lesson.examples) && lesson.examples.some((ex) => ex.toLowerCase().includes(q));

      return matchesStage && (titleMatch || letterMatch || numMatch || descMatch || examplesMatch);
    });
  }, [lessons, selectedStage, searchQuery]);

  // Keep filtered lessons ref in sync
  useEffect(() => {
    filteredLessonsRef.current = filteredLessons;
  }, [filteredLessons]);

  // Keep index within bounds if filters change, but preserve current card if it matches filter
  useEffect(() => {
    if (filteredLessons.length === 0) {
      setCurrentIndex(0);
      return;
    }
    const curLessonId = lessonsRef.current[currentIndex]?.id;
    if (curLessonId) {
      const foundIdx = filteredLessons.findIndex((l) => l.id === curLessonId);
      if (foundIdx !== -1) {
        setCurrentIndex(foundIdx);
        return;
      }
    }
    if (currentIndex >= filteredLessons.length) {
      setCurrentIndex(0);
    }
    setActivitySelected(null);
    setActivityFeedback(null);
  }, [filteredLessons.length, selectedStage, searchQuery]);

  const currentLesson = filteredLessons[currentIndex] || lessons[0] || {};
  const currentLessonId = currentLesson.id || `${activeCategory}-${currentIndex}`;
  const isCurrentCompleted = completedLessons.includes(currentLessonId);

  // Active Category Meta
  const activeCategoryMeta = useMemo(() => {
    return categoriesWithProgress.find((c) => c.id === activeCategory) || INITIAL_CATEGORIES[0];
  }, [categoriesWithProgress, activeCategory]);

  // Live count of genuinely completed unique lessons in current category
  const catCompletedCount = useMemo(() => {
    return lessons.filter((l) => completedLessons.includes(l.id)).length;
  }, [lessons, completedLessons]);

  const isCategoryFullyMastered = lessons.length > 0 && catCompletedCount >= lessons.length;

  // Next category helper
  const nextCategoryMeta = useMemo(() => {
    const idx = INITIAL_CATEGORIES.findIndex((c) => c.id === activeCategory);
    const nextIdx = (idx + 1) % INITIAL_CATEGORIES.length;
    return INITIAL_CATEGORIES[nextIdx];
  }, [activeCategory]);

  // Navigation Handlers across full category — Saves position on every step!
  const handleNext = () => {
    sound.playPop();
    setActivitySelected(null);
    setActivityFeedback(null);

    if (filteredLessons.length <= 1) return;

    if (currentIndex < filteredLessons.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      currentIndexRef.current = nextIdx;
      persistPosition(activeCategory, nextIdx);
    } else {
      // Reached the end card of the category!
      // Show celebratory completion state and offer options to review or explore next!
      setShowCompletionModal(true);
      sound.playSuccess();
      setTriggerConfetti(true);
      setTimeout(() => setTriggerConfetti(false), 2000);
    }
  };

  const handlePrev = () => {
    sound.playPop();
    setActivitySelected(null);
    setActivityFeedback(null);

    if (filteredLessons.length <= 1) return;

    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      currentIndexRef.current = prevIdx;
      persistPosition(activeCategory, prevIdx);
    } else {
      // Stay at card 1 (do not loop unexpectedly)
      sound.playPop();
    }
  };

  const handleSelectLessonFromGrid = (indexInFiltered) => {
    sound.playPop();
    setCurrentIndex(indexInFiltered);
    currentIndexRef.current = indexInFiltered;
    setViewMode('card');
    setActivitySelected(null);
    setActivityFeedback(null);
    persistPosition(activeCategory, indexInFiltered);
  };

  const handleRestartCategoryReview = () => {
    sound.playSuccess();
    api.resetCategoryReview(activeCategory);
    setCurrentIndex(0);
    currentIndexRef.current = 0;
    setShowCompletionModal(false);
    setViewMode('card');
    setActivitySelected(null);
    setActivityFeedback(null);
  };

  const handleSpeak = (text) => {
    if (!text) return;
    sound.playPop();
    sound.speak(text);
  };

  // Mark Completed — Strictly prevents duplicate stars
  const handleCompleteCurrentLesson = () => {
    if (isCurrentCompleted) {
      sound.playPop();
      return;
    }

    sound.playSuccess();
    setTriggerConfetti(true);
    const isNew = api.markLessonComplete(currentLessonId, activeCategory);
    if (isNew) {
      const updatedStars = parseInt(localStorage.getItem('ll_stars') || '24', 10);
      setStars(updatedStars);
      refreshCompletedLessons();

      // Check if this was the last uncompleted lesson in the category
      const remainingUncompleted = lessons.filter((l) => !completedLessons.includes(l.id) && l.id !== currentLessonId);
      if (remainingUncompleted.length === 0) {
        setTimeout(() => {
          setShowCompletionModal(true);
        }, 800);
      }
    }
    setTimeout(() => setTriggerConfetti(false), 1500);
  };

  // Interactive Question Answer Handler
  const handleAnswerActivity = (optionIdx) => {
    if (activitySelected !== null) return; // Already answered

    setActivitySelected(optionIdx);
    const correctIdx = currentLesson.activityAnswerIndex !== undefined ? currentLesson.activityAnswerIndex : 0;
    const isRight = optionIdx === correctIdx;

    if (isRight) {
      sound.playSuccess();
      setActivityFeedback({
        isCorrect: true,
        text: 'Awesome job! That is completely correct! ⭐'
      });
      // Automatically award lesson completion if not yet earned
      if (!isCurrentCompleted) {
        handleCompleteCurrentLesson();
      }
    } else {
      sound.playPop();
      setActivityFeedback({
        isCorrect: false,
        text: `Nice try! Hint: ${currentLesson.activityHint || 'Look closely at the pictures and colors!'}`
      });
    }
  };

  // Color mixing calculation
  const getMixedColor = (a, b) => {
    if ((a === 'Red' && b === 'Yellow') || (a === 'Yellow' && b === 'Red')) return { name: 'Vibrant Orange', hex: '#FB923C' };
    if ((a === 'Yellow' && b === 'Blue') || (a === 'Blue' && b === 'Yellow')) return { name: 'Fresh Meadow Green', hex: '#10B981' };
    if ((a === 'Red' && b === 'Blue') || (a === 'Blue' && b === 'Red')) return { name: 'Royal Purple', hex: '#A855F7' };
    if ((a === 'Red' && b === 'White') || (a === 'White' && b === 'Red')) return { name: 'Blossom Pink', hex: '#F472B6' };
    if ((a === 'Blue' && b === 'White') || (a === 'White' && b === 'Blue')) return { name: 'Sky Cyan', hex: '#38BDF8' };
    if ((a === 'Black' && b === 'White') || (a === 'White' && b === 'Black')) return { name: 'Gentle Gray', hex: '#64748B' };
    if (a === b) {
      const hexMap = { Red: '#EF4444', Yellow: '#FACC15', Blue: '#3B82F6', White: '#F8FAFC', Black: '#0F172A' };
      return { name: a, hex: hexMap[a] || '#3B82F6' };
    }
    return { name: 'Earthy Brown', hex: '#78350F' };
  };

  return (
    <div className="space-y-6 py-4">
      <ConfettiCanvas trigger={triggerConfetti} />

      {/* Header with Mascot message and Return to Categories */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-800">
              Explore &amp; Learn Safari
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
              <Compass className="w-3 h-3 text-amber-700" />
              <span>Auto-Resume Active</span>
            </span>
          </div>
          <p className="text-slate-500 font-medium text-xs sm:text-sm">
            Complete curriculum across all 8 learning pathways. Your position is always saved automatically!
          </p>
        </div>
        <LumiMascot 
          size="sm" 
          message="I remember exactly where you left off! Flip flashcards or practice questions."
        />
      </div>

      {/* 8 Category Pills with Live Completion Progress Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categoriesWithProgress.map((cat) => {
          const isActive = activeCategory === cat.id && viewMode !== 'categories';
          const isDone = cat.completed >= cat.count && cat.count > 0;
          return (
            <button
              key={cat.id}
              onClick={() => handleSwitchCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl font-display font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-amber-400 text-amber-950 shadow-md scale-105 border-2 border-amber-500'
                  : 'bg-white/90 text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
                isActive 
                  ? 'bg-amber-950/20 text-amber-950' 
                  : isDone
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-500'
              }`}>
                {cat.completed || 0}/{cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category Banner with Search, Filters & View Mode Toggle */}
      <div className="card-soft p-4 sm:p-5 bg-white border border-slate-200/90 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 rounded-2xl bg-amber-50 border border-amber-200 shrink-0">
              {activeCategoryMeta.icon}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-bold text-xl text-slate-800">
                  {activeCategoryMeta.title || activeCategoryMeta.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900">
                  {lessons.length} Total Lessons
                </span>
                {isCategoryFullyMastered && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-emerald-600" />
                    <span>Mastered!</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {activeCategoryMeta.desc} • Mastered {catCompletedCount} of {lessons.length} ({lessons.length > 0 ? Math.round((catCompletedCount / lessons.length) * 100) : 0}%)
              </p>
            </div>
          </div>

          {/* View Mode Toggle: All Categories Overview vs Flashcard vs Grid Overview */}
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end flex-wrap">
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => { sound.playPop(); saveCurrentPosition(); setViewMode('categories'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-display font-bold transition-all ${
                  viewMode === 'categories'
                    ? 'bg-white text-amber-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View all 8 Learning Pathways"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>All Pathways</span>
              </button>
              <button
                onClick={() => { sound.playPop(); setViewMode('card'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-display font-bold transition-all ${
                  viewMode === 'card'
                    ? 'bg-white text-amber-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Single Card Interactive View"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Card View</span>
              </button>
              <button
                onClick={() => { sound.playPop(); setViewMode('grid'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-display font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-amber-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View all cards in a grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>All {lessons.length} Cards</span>
              </button>
            </div>
          </div>

        </div>

        {/* Filter Controls Row: Stages / Difficulty + Search Bar (when in card or grid view) */}
        {viewMode !== 'categories' && (
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            
            {/* Stage / Progression Tabs */}
            {availableStages.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => { sound.playPop(); setSelectedStage('all'); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold whitespace-nowrap transition-colors ${
                    selectedStage === 'all'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Stages ({lessons.length})
                </button>
                {availableStages.map((stg) => {
                  const countInStg = lessons.filter((l) => l.stage === stg || l.difficulty === stg).length;
                  return (
                    <button
                      key={stg}
                      onClick={() => { sound.playPop(); setSelectedStage(stg); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold whitespace-nowrap transition-colors ${
                        selectedStage === stg
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {stg} ({countInStg})
                    </button>
                  );
                })}
              </div>
            )}

            {/* Quick Search Input */}
            <div className="relative min-w-[220px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${activeCategoryMeta.name}...`}
                className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all font-medium text-slate-700"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        )}

      </div>

      {/* VIEW MODE 1: ALL CATEGORIES OVERVIEW (Clear return to all categories hub) */}
      {viewMode === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-800">
                All 8 Learning Pathways Overview
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Select any pathway to resume learning right where you left off!
              </p>
            </div>
            <button
              onClick={() => { sound.playPop(); setViewMode('card'); }}
              className="btn-bubbly px-4 py-2 rounded-xl bg-amber-400 text-amber-950 font-display font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Resume Current Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoriesWithProgress.map((cat) => {
              const isSelected = cat.id === activeCategory;
              const isDone = cat.completed >= cat.count && cat.count > 0;
              const pct = cat.count > 0 ? Math.round((cat.completed / cat.count) * 100) : 0;
              const resumeCardNum = (cat.lastVisitedIndex !== undefined ? cat.lastVisitedIndex : 0) + 1;

              return (
                <div
                  key={cat.id}
                  onClick={() => handleSwitchCategory(cat.id)}
                  className={`card-soft p-5 bg-white border-2 transition-all cursor-pointer hover:scale-102 flex flex-col justify-between group ${
                    isSelected 
                      ? 'border-amber-400 shadow-md ring-2 ring-amber-300/50' 
                      : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-4xl p-2.5 rounded-2xl bg-amber-50 border border-amber-200 group-hover:scale-110 transition-transform">
                        {cat.icon}
                      </span>
                      {isDone ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                          <span>Mastered</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                          Card {resumeCardNum} of {cat.count}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-base text-slate-800 group-hover:text-amber-800 transition-colors">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                        {cat.desc}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-400">Mastery</span>
                        <span className="text-amber-900 font-mono">{cat.completed} / {cat.count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
                          style={{ width: `${Math.max(5, pct)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-display font-bold text-amber-800">
                    <span>{isDone ? 'Review Pathway' : `Resume Card ${resumeCardNum}`}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: GRID OVERVIEW (Shows all cards in current category) */}
      {viewMode === 'grid' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">
              Showing {filteredLessons.length} cards {selectedStage !== 'all' ? `in "${selectedStage}"` : ''} — Tap any card to open interactive view!
            </p>
            <button
              onClick={() => setViewMode('card')}
              className="text-amber-700 hover:text-amber-800 text-xs font-display font-bold flex items-center gap-1"
            >
              <span>Back to Flashcard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredLessons.map((lesson, idx) => {
              const isDone = completedLessons.includes(lesson.id);
              const isSelected = lesson.id === currentLessonId;
              return (
                <div
                  key={lesson.id}
                  onClick={() => handleSelectLessonFromGrid(idx)}
                  className={`card-soft p-3.5 flex flex-col items-center justify-between text-center cursor-pointer transition-all hover:scale-105 border-2 group relative ${
                    isSelected
                      ? 'border-amber-400 bg-amber-50/70 shadow-md ring-2 ring-amber-300'
                      : isDone
                        ? 'border-emerald-200 bg-emerald-50/30 hover:border-emerald-300'
                        : 'border-slate-200 bg-white hover:border-amber-200'
                  }`}
                >
                  {isDone && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px] shadow-sm">
                      ✓
                    </span>
                  )}
                  
                  <span className="text-xs font-mono font-bold text-slate-400 mb-1">
                    #{lesson.orderIndex || idx + 1}
                  </span>

                  <span className="text-4xl sm:text-5xl my-2 filter drop-shadow-sm group-hover:scale-110 transition-transform">
                    {lesson.illustration || lesson.icon || '🌟'}
                  </span>

                  {lesson.letter && (
                    <span className="font-display font-black text-xl text-amber-800">
                      {lesson.letter}
                    </span>
                  )}
                  {lesson.num !== undefined && (
                    <span className="font-display font-black text-xl text-emerald-800">
                      {lesson.num}
                    </span>
                  )}

                  <h4 className="font-display font-bold text-xs text-slate-800 line-clamp-1 mt-1 group-hover:text-amber-700">
                    {lesson.title || lesson.name}
                  </h4>

                  <span className="text-[10px] font-bold text-slate-400 mt-1">
                    {lesson.stage || lesson.difficulty}
                  </span>
                </div>
              );
            })}
          </div>

          {filteredLessons.length === 0 && (
            <div className="card-soft p-12 text-center space-y-3 bg-white">
              <span className="text-4xl">🔍</span>
              <h3 className="font-display font-bold text-lg text-slate-700">No cards match your filter</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search query or selecting "All Stages" above to view all lessons.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedStage('all'); }}
                className="btn-bubbly px-4 py-2 rounded-xl bg-amber-400 text-amber-950 font-bold text-xs"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 3: MAIN INTERACTIVE FLASHCARD VIEW */}
      {viewMode === 'card' && filteredLessons.length > 0 && currentLesson && (
        <div className="card-soft p-5 sm:p-8 bg-white border-2 border-amber-200 relative overflow-hidden shadow-lg space-y-6">
          
          {/* Top Card Bar: Counter, Stage Badge, Mastered Status & Review CTA */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
                Card {currentIndex + 1} of {filteredLessons.length}
              </span>
              {currentLesson.stage && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900">
                  {currentLesson.stage}
                </span>
              )}
              {currentLesson.difficulty && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-900">
                  {currentLesson.difficulty}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isCategoryFullyMastered && (
                <button
                  onClick={handleRestartCategoryReview}
                  className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 flex items-center gap-1 transition-colors"
                  title="Start reviewing from Card 1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Review From Card 1</span>
                </button>
              )}

              {isCurrentCompleted ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5 border border-emerald-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span>Mastered (+3 ⭐ Earned)</span>
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Ready to Learn (+3 ⭐)
                </span>
              )}
            </div>
          </div>

          {/* Main Visual & Content Grid */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            
            {/* Visual Portrait & Audio CTA */}
            <div className="flex flex-col items-center gap-3 text-center shrink-0">
              <div 
                onClick={() => handleSpeak(currentLesson.soundKey || currentLesson.letter || currentLesson.name || currentLesson.word || currentLesson.title)}
                className="w-44 h-44 sm:w-52 sm:h-52 rounded-4xl bg-gradient-to-tr from-amber-100 via-orange-50 to-pink-100 border-4 border-amber-200 flex flex-col items-center justify-center p-4 cursor-pointer shadow-md hover:scale-105 transition-transform group"
                title="Tap to listen to speech!"
              >
                <span className="text-7xl sm:text-8xl filter drop-shadow-md group-hover:scale-110 transition-transform">
                  {currentLesson.illustration || currentLesson.icon || '🌟'}
                </span>
                {currentLesson.letter && (
                  <span className="font-display font-black text-3xl sm:text-4xl text-amber-800 mt-1">
                    {currentLesson.letter}
                  </span>
                )}
                {currentLesson.num !== undefined && (
                  <span className="font-display font-black text-3xl sm:text-4xl text-emerald-800 mt-1">
                    {currentLesson.num}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleSpeak(currentLesson.soundKey || currentLesson.name || currentLesson.word || currentLesson.title || currentLesson.phonics)}
                className="btn-bubbly flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-display font-bold text-xs sm:text-sm shadow-sm"
              >
                <Volume2 className="w-4 h-4 text-amber-700" />
                <span>Listen Audio 🔊</span>
              </button>
            </div>

            {/* Lesson Details & Examples */}
            <div className="flex-1 space-y-4 text-center lg:text-left">
              <div>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-1">
                  {currentLesson.phonics && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-100 text-sky-800">
                      /{currentLesson.phonics}/
                    </span>
                  )}
                  {currentLesson.realm && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      {currentLesson.realm} Transport
                    </span>
                  )}
                  {currentLesson.role && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                      {currentLesson.role}
                    </span>
                  )}
                  {currentLesson.habitat && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      Habitat: {currentLesson.habitat}
                    </span>
                  )}
                </div>

                <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-800">
                  {currentLesson.title || currentLesson.name || currentLesson.word}
                </h2>
              </div>

              <p className="text-sm sm:text-base font-medium text-slate-600 leading-relaxed">
                {currentLesson.explanation || currentLesson.desc || currentLesson.benefit || currentLesson.function}
              </p>

              {/* Examples Pills */}
              {currentLesson.examples && currentLesson.examples.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Word Examples &amp; Associations:
                  </h4>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5">
                    {currentLesson.examples.map((ex, i) => (
                      <span 
                        key={i}
                        onClick={() => handleSpeak(ex)}
                        className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                        title="Tap to pronounce"
                      >
                        {ex} 🔊
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Real World Matching for Shapes */}
              {currentLesson.realWorld && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Found in Real Life:
                  </h4>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5">
                    {currentLesson.realWorld.map((rw, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl bg-purple-50 text-purple-800 font-bold text-xs border border-purple-200">
                        {rw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Fun Fact Callout */}
              {(currentLesson.funFact || currentLesson.fact) && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-left">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                      Lumi's Fun Fact:
                    </span>
                    <p className="text-xs font-medium text-amber-950 mt-0.5">
                      {currentLesson.funFact || currentLesson.fact}
                    </p>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Interactive Practice Activity Section on the Card */}
          {currentLesson.activityQuestion && (
            <div className="card-soft p-4 sm:p-5 bg-gradient-to-r from-sky-50 via-indigo-50/60 to-purple-50 border border-sky-200 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <h4 className="font-display font-bold text-sm sm:text-base text-indigo-950">
                  Quick Practice Challenge:
                </h4>
              </div>

              <p className="text-xs sm:text-sm font-bold text-slate-700">
                {currentLesson.activityQuestion}
              </p>

              {/* Option Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {(currentLesson.activityOptions || []).map((opt, oIdx) => {
                  const isChosen = activitySelected === oIdx;
                  const correctIdx = currentLesson.activityAnswerIndex !== undefined ? currentLesson.activityAnswerIndex : 0;
                  const isCorrectAnswer = oIdx === correctIdx;

                  let btnStyle = "bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50";
                  if (activitySelected !== null) {
                    if (isCorrectAnswer) {
                      btnStyle = "bg-emerald-500 text-white border-emerald-600 font-extrabold shadow-sm";
                    } else if (isChosen && !isCorrectAnswer) {
                      btnStyle = "bg-rose-100 text-rose-800 border-rose-300 line-through";
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleAnswerActivity(oIdx)}
                      disabled={activitySelected !== null}
                      className={`btn-bubbly px-4 py-2.5 rounded-2xl border-2 font-display font-bold text-xs sm:text-sm transition-all text-center ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Instant Activity Feedback */}
              {activityFeedback && (
                <div className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between gap-2 ${
                  activityFeedback.isCorrect 
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  <span>{activityFeedback.text}</span>
                  {!activityFeedback.isCorrect && (
                    <button
                      onClick={() => { setActivitySelected(null); setActivityFeedback(null); }}
                      className="text-xs underline font-extrabold text-amber-950 shrink-0"
                    >
                      Try Again
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mark Complete CTA - Prevents Duplicate Stars */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div>
              {isCurrentCompleted ? (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 font-display font-bold text-xs sm:text-sm shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>✓ Mastered This Lesson (+3 ⭐ Earned)</span>
                </div>
              ) : (
                <button
                  onClick={handleCompleteCurrentLesson}
                  className="btn-bubbly flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-display font-bold text-xs sm:text-sm shadow-md hover:brightness-105"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I Learned This! (+3 ⭐)</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className="btn-bubbly flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-bold text-xs"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>All {filteredLessons.length} Cards</span>
              </button>
            </div>
          </div>

          {/* Card Navigation Controls: Previous / Dot Scrubber / Next */}
          <div className="border-t border-slate-100 pt-5 mt-4 space-y-3">
            <div className="flex items-center justify-between">
              
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`btn-bubbly flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-2xl font-display font-bold text-xs sm:text-sm ${
                  currentIndex === 0
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Card {currentIndex + 1} of {filteredLessons.length}
              </span>

              <button
                onClick={handleNext}
                className="btn-bubbly flex items-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-display font-bold text-xs sm:text-sm shadow-sm"
              >
                <span>{currentIndex < filteredLessons.length - 1 ? 'Next Card' : 'Finish Category 🎉'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>

            {/* Quick-Jump Card Dot Strip */}
            <div className="flex items-center justify-center gap-1 flex-wrap pt-1 max-h-16 overflow-y-auto px-2">
              {filteredLessons.map((l, dotIdx) => {
                const isCur = dotIdx === currentIndex;
                const isDone = completedLessons.includes(l.id);
                return (
                  <button
                    key={l.id || dotIdx}
                    onClick={() => {
                      sound.playPop();
                      setCurrentIndex(dotIdx);
                      currentIndexRef.current = dotIdx;
                      setActivitySelected(null);
                      setActivityFeedback(null);
                      persistPosition(activeCategory, dotIdx);
                    }}
                    title={`Card ${dotIdx + 1}: ${l.title || l.name}`}
                    className={`h-2.5 rounded-full transition-all ${
                      isCur
                        ? 'w-7 bg-amber-500 shadow-sm'
                        : isDone
                          ? 'w-2.5 bg-emerald-400 hover:bg-emerald-500'
                          : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                );
              })}
            </div>

          </div>

        </div>
      )}

      {/* Category Completion Dialog / Celebration Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="card-soft max-w-md w-full bg-white p-6 sm:p-8 space-y-6 border-4 border-amber-300 shadow-2xl relative text-center">
            
            <button
              onClick={() => setShowCompletionModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-6xl inline-block animate-bounce">
                {activeCategoryMeta.icon || '🎉'}
              </span>
              <h3 className="font-display font-extrabold text-2xl text-slate-800">
                Pathway Completed!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xs mx-auto">
                You explored every card in <span className="font-bold text-amber-800">{activeCategoryMeta.name}</span>!
              </p>
            </div>

            {/* Pathway Summary Badges */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-left">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mastered Cards</span>
                <p className="font-display font-extrabold text-lg text-emerald-800">
                  {catCompletedCount} of {lessons.length}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Stars Earned</span>
                <p className="font-display font-extrabold text-lg text-amber-800">
                  +{catCompletedCount * 3} ⭐
                </p>
              </div>
            </div>

            {/* Actions for Review or Progression */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleRestartCategoryReview}
                className="w-full btn-bubbly py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-display font-bold text-sm shadow-md flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Review Pathway From Card 1</span>
              </button>

              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  handleSwitchCategory(nextCategoryMeta.id);
                }}
                className="w-full btn-bubbly py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <span>Explore Next: {nextCategoryMeta.name} {nextCategoryMeta.icon}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowCompletionModal(false)}
                className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Keep Viewing Last Card
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Interactive Hands-on Playground for Numbers (Abacus & Quick Math) */}
      {activeCategory === 'numbers' && viewMode !== 'categories' && (
        <div className="card-soft p-5 sm:p-6 bg-emerald-50/70 border-emerald-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧮</span>
              <div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-emerald-950">
                  Interactive Abacus Bead Counter (1–20)
                </h3>
                <p className="text-xs text-emerald-800 font-medium">
                  Tap beads to slide and count numbers on your abacus, or listen to the voice!
                </p>
              </div>
            </div>
            <span className="font-display font-extrabold text-xl text-emerald-700 bg-white px-3.5 py-1.5 rounded-full border border-emerald-300 shadow-sm">
              Beads: {abacusCount}
            </span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 bg-white p-4 rounded-2xl border border-emerald-200">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => {
                  sound.playPop();
                  setAbacusCount(num);
                  sound.speak(`${num}`);
                }}
                className={`h-11 rounded-2xl font-display font-bold text-sm transition-transform ${
                  num <= abacusCount
                    ? 'bg-gradient-to-tr from-emerald-400 to-teal-400 text-white shadow-sm scale-105'
                    : 'bg-slate-100 text-slate-400 hover:bg-emerald-100'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Color Studio */}
      {activeCategory === 'colors' && viewMode !== 'categories' && (
        <div className="card-soft p-5 sm:p-6 bg-pink-50/70 border-pink-200 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            <div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-pink-950">
                Magic Color Mixing Studio
              </h3>
              <p className="text-xs text-pink-800 font-medium">
                Select two colors to discover their magic secondary blend!
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 bg-white p-5 rounded-2xl border border-pink-200 text-center">
            
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">First Color</span>
              <div className="flex gap-1.5 flex-wrap justify-center">
                {['Red', 'Yellow', 'Blue', 'White', 'Black'].map((c) => (
                  <button
                    key={c}
                    onClick={() => { sound.playPop(); setMixColorA(c); }}
                    className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${
                      mixColorA === c ? 'border-slate-800 bg-slate-100 scale-105' : 'border-transparent bg-slate-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xl font-bold text-slate-300">+</span>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Second Color</span>
              <div className="flex gap-1.5 flex-wrap justify-center">
                {['Red', 'Yellow', 'Blue', 'White', 'Black'].map((c) => (
                  <button
                    key={c}
                    onClick={() => { sound.playPop(); setMixColorB(c); }}
                    className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${
                      mixColorB === c ? 'border-slate-800 bg-slate-100 scale-105' : 'border-transparent bg-slate-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xl font-bold text-slate-300">=</span>

            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Magic Blend</span>
              <div 
                className="w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center text-white font-bold transition-colors duration-300 border border-slate-200"
                style={{ backgroundColor: getMixedColor(mixColorA, mixColorB).hex }}
              />
              <span className="font-display font-bold text-xs text-slate-800">
                {getMixedColor(mixColorA, mixColorB).name}
              </span>
            </div>

          </div>
        </div>
      )}

      {/* Interactive Animal Sound Board */}
      {activeCategory === 'animals' && viewMode !== 'categories' && (
        <div className="card-soft p-5 sm:p-6 bg-amber-50/70 border-amber-200 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦁</span>
            <div>
              <h3 className="font-display font-bold text-lg text-amber-950">
                Wild Safari Sound Board
              </h3>
              <p className="text-xs text-amber-800 font-medium">
                Tap any creature below to hear its call or name spoken aloud!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-white p-3.5 rounded-2xl border border-amber-200">
            {lessons.slice(0, 12).map((a) => (
              <button
                key={a.id}
                onClick={() => handleSpeak(`${a.title}! ${a.sound || ''}`)}
                className="p-2.5 rounded-xl bg-amber-50/50 hover:bg-amber-100 flex flex-col items-center gap-1 transition-all hover:scale-105 group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{a.illustration}</span>
                <span className="text-[11px] font-display font-bold text-slate-700 line-clamp-1">{a.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
