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
  PartyPopper,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '../services/mockData';
import { getProgressDotState } from '../services/progressDotUtils';

export default function ExploreLearn({ stars, setStars, initialCategory = 'alphabets' }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [lessons, setLessons] = useState([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);
  const [lessonsError, setLessonsError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(() => api.getCompletedLessons() || []);
  const [completedPractices, setCompletedPractices] = useState(() => api.getCompletedPractices() || []);
  const [categoriesWithProgress, setCategoriesWithProgress] = useState(INITIAL_CATEGORIES);

  // Search & View State
  const [searchQuery, setSearchQuery] = useState('');
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

  // Sync initialCategory prop if changed externally
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

    if (!catId || !Array.isArray(all) || all.length === 0) return;

    const curLesson = filtered && filtered[curIdx] ? filtered[curIdx] : all[curIdx];
    if (curLesson) {
      const fullIdx = all.findIndex((l) => l.id === curLesson.id);
      if (fullIdx !== -1) {
        api.saveCategoryPosition(catId, fullIdx);
      }
    }
  };

  // Helper to update progress summary badges across all categories
  const refreshProgressSummary = () => {
    const freshCats = api.getCategoriesSync();
    setCategoriesWithProgress(freshCats);
  };

  // Load Lessons Async and Restore Saved Card Index when category switches
  useEffect(() => {
    let isCancelled = false;
    saveCurrentPosition();

    async function fetchCategoryLessons() {
      setIsLoadingLessons(true);
      setLessonsError(null);

      try {
        const userProgress = api.getCompletedLessons() || [];
        const userPractices = api.getCompletedPractices() || [];
        if (!isCancelled) {
          setCompletedLessons(userProgress);
          setCompletedPractices(userPractices);
        }

        // Await async getLessons
        let rawLessons = await api.getLessons(activeCategory);

        // Fallback to sync data if async return is empty/invalid
        if (!Array.isArray(rawLessons) || rawLessons.length === 0) {
          rawLessons = api.getLessonsSync(activeCategory);
        }

        if (!isCancelled) {
          if (Array.isArray(rawLessons) && rawLessons.length > 0) {
            setLessons(rawLessons);
            lessonsRef.current = rawLessons;

            const savedIndex = api.getCategoryPosition(activeCategory);
            const validIdx = (typeof savedIndex === 'number' && savedIndex >= 0 && savedIndex < rawLessons.length) 
              ? savedIndex 
              : 0;
            setCurrentIndex(validIdx);
            currentIndexRef.current = validIdx;
          } else {
            setLessons([]);
            setLessonsError('No lesson cards found for this category.');
          }

          setSearchQuery('');
          setActivitySelected(null);
          setActivityFeedback(null);
          setShowCompletionModal(false);

          refreshProgressSummary(userProgress);
        }
      } catch (err) {
        console.error('[ExploreLearn] Error fetching lessons:', err);
        if (!isCancelled) {
          const fallback = api.getLessonsSync(activeCategory);
          if (Array.isArray(fallback) && fallback.length > 0) {
            setLessons(fallback);
            lessonsRef.current = fallback;
            setCurrentIndex(0);
            currentIndexRef.current = 0;
          } else {
            setLessonsError('Failed to load category lessons. Please tap Retry.');
          }
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingLessons(false);
        }
      }
    }

    fetchCategoryLessons();

    return () => {
      isCancelled = true;
    };
  }, [activeCategory]);

  // Extract metadata for active category
  const activeCategoryMeta = useMemo(() => {
    return INITIAL_CATEGORIES.find((c) => c.id === activeCategory) || INITIAL_CATEGORIES[0];
  }, [activeCategory]);

  // Apply search filter to lessons list
  const filteredLessons = useMemo(() => {
    let result = Array.isArray(lessons) ? lessons : [];

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (l) =>
          (l.title && l.title.toLowerCase().includes(q)) ||
          (l.name && l.name.toLowerCase().includes(q)) ||
          (l.letter && l.letter.toLowerCase().includes(q)) ||
          (l.word && l.word.toLowerCase().includes(q)) ||
          (l.explanation && l.explanation.toLowerCase().includes(q)) ||
          (l.desc && l.desc.toLowerCase().includes(q)) ||
          (l.examples && l.examples.some((ex) => ex.toLowerCase().includes(q)))
      );
    }

    filteredLessonsRef.current = result;
    return result;
  }, [lessons, searchQuery]);

  // Handle auto-clamping index if filter changes
  useEffect(() => {
    if (currentIndex >= filteredLessons.length && filteredLessons.length > 0) {
      setCurrentIndex(0);
      currentIndexRef.current = 0;
    }
  }, [filteredLessons]);

  const currentLesson = filteredLessons[currentIndex] || filteredLessons[0];
  const currentLessonId = currentLesson ? currentLesson.id : null;
  const isCurrentCompleted = currentLessonId && Array.isArray(completedLessons) 
    ? completedLessons.includes(currentLessonId) 
    : false;
  const isPracticeDone = currentLessonId ? (
    (Array.isArray(completedPractices) && completedPractices.includes(currentLessonId)) ||
    api.isPracticeCompleted(currentLessonId)
  ) : false;

  const catCompletedCount = useMemo(() => {
    if (!Array.isArray(lessons)) return 0;
    const safeCompleted = Array.isArray(completedLessons) ? completedLessons : [];
    return lessons.filter((l) => safeCompleted.includes(l.id)).length;
  }, [lessons, completedLessons]);

  const isCategoryFullyMastered = Array.isArray(lessons) && lessons.length > 0 && catCompletedCount === lessons.length;

  // Speak aloud via Text-to-Speech
  const handleSpeak = (textToSay) => {
    sound.speak(textToSay);
  };

  // Helper to persist updated card index
  const persistPosition = (catId, newIdx) => {
    api.saveCategoryPosition(catId, newIdx);
    refreshProgressSummary();
  };

  // Switch category
  const handleSwitchCategory = (catId) => {
    if (catId === activeCategory) {
      setViewMode('card');
      return;
    }
    sound.playPop();
    saveCurrentPosition();
    setActiveCategory(catId);
    setViewMode('card');
  };

  // Navigate to Next Card
  const handleNext = () => {
    sound.playPop();
    setActivitySelected(null);
    setActivityFeedback(null);

    if (currentIndex < filteredLessons.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      currentIndexRef.current = nextIdx;
      persistPosition(activeCategory, nextIdx);
    } else {
      setShowCompletionModal(true);
      setTriggerConfetti(true);
      setTimeout(() => setTriggerConfetti(false), 2500);
    }
  };

  // Navigate to Previous Card
  const handlePrev = () => {
    sound.playPop();
    setActivitySelected(null);
    setActivityFeedback(null);

    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      currentIndexRef.current = prevIdx;
      persistPosition(activeCategory, prevIdx);
    }
  };

  // Select card directly from grid view
  const handleSelectLessonFromGrid = (gridIndex) => {
    sound.playPop();
    setCurrentIndex(gridIndex);
    currentIndexRef.current = gridIndex;
    setActivitySelected(null);
    setActivityFeedback(null);
    setViewMode('card');
    persistPosition(activeCategory, gridIndex);
  };

  // Subscribe to API updates (e.g. reset progress or background updates)
  useEffect(() => {
    const unsub = api.subscribe(() => {
      const freshCompleted = api.getCompletedLessons() || [];
      const freshPractices = api.getCompletedPractices() || [];
      setCompletedLessons(freshCompleted);
      setCompletedPractices(freshPractices);
      refreshProgressSummary(freshCompleted);

      // Only perform full layout & feedback reset if all data was reset to demo defaults
      if (freshCompleted.length === 0 && api.getProfile().totalStars === 24) {
        const savedIndex = api.getCategoryPosition(activeCategoryRef.current);
        const safeIndex = (typeof savedIndex === 'number' && savedIndex >= 0 && savedIndex < (lessonsRef.current?.length || 1)) ? savedIndex : 0;
        setCurrentIndex(safeIndex);
        currentIndexRef.current = safeIndex;
        setShowCompletionModal(false);
        setActivitySelected(null);
        setActivityFeedback(null);
      }
    });
    return unsub;
  }, []);

  // Mark Current Lesson Complete - Earns +3 Stars exactly once per lesson ID
  const handleCompleteCurrentLesson = () => {
    if (!currentLessonId) return;

    sound.playStar();
    console.log('[DIAGNOSTIC] 4. Clicked "I Learned This!" -> lesson ID:', currentLessonId, 'category ID:', activeCategory);

    const newlyCompleted = api.markLessonComplete(currentLessonId, activeCategory);
    console.log('[DIAGNOSTIC] 5. Return value from api.markLessonComplete():', newlyCompleted);

    const updatedCompleted = api.getCompletedLessons() || [];
    console.log('[DIAGNOSTIC] 6. Completed lesson IDs immediately after saving:', updatedCompleted);

    setCompletedLessons(updatedCompleted);

    if (newlyCompleted) {
      setTriggerConfetti(true);
      setTimeout(() => setTriggerConfetti(false), 2000);

      refreshProgressSummary(updatedCompleted);

      // Immediately synchronize Navbar stars balance
      if (setStars) {
        setStars(api.getProfile().totalStars);
      }

      if (updatedCompleted.filter((id) => lessons.some((l) => l.id === id)).length === lessons.length) {
        setShowCompletionModal(true);
      }
    }
  };

  // Restart category review from Card 1
  const handleRestartCategoryReview = () => {
    sound.playPop();
    setShowCompletionModal(false);
    setCurrentIndex(0);
    currentIndexRef.current = 0;
    setViewMode('card');
    persistPosition(activeCategory, 0);
  };

  // Answer quick interactive practice activity on card - Earns +2 Stars exactly once per question attempt
  const handleAnswerActivity = (optionIndex) => {
    if (activitySelected !== null || !currentLesson) return;

    setActivitySelected(optionIndex);
    const correctIdx = currentLesson.activityAnswerIndex !== undefined ? currentLesson.activityAnswerIndex : 0;

    if (optionIndex === correctIdx) {
      sound.playSuccess();
      
      // Award +2 stars quiz/practice reward exactly once for this lesson's challenge
      const rewardResult = api.recordPracticeReward(
        currentLesson.id,
        activeCategory,
        currentLesson.title || currentLesson.name || currentLesson.word || currentLesson.id
      );

      // Immediately update local state
      setCompletedPractices(api.getCompletedPractices() || []);

      if (rewardResult.awarded) {
        setTriggerConfetti(true);
        setTimeout(() => setTriggerConfetti(false), 2000);
        setActivityFeedback({ 
          isCorrect: true, 
          text: '✨ Correct! Wonderful job! (+2 ⭐ Earned!)' 
        });
      } else {
        setActivityFeedback({ 
          isCorrect: true, 
          text: '✨ Correct! Wonderful job! (+2 ⭐ already earned)' 
        });
      }

      // Immediately synchronize Navbar star balance
      if (setStars) {
        setStars(api.getProfile().totalStars);
      }
    } else {
      sound.playPop();
      setActivityFeedback({ isCorrect: false, text: '💡 Not quite! Give it another try!' });
    }
  };

  const handleRetryActivity = () => {
    sound.playPop();
    setActivitySelected(null);
    setActivityFeedback(null);
  };

  // Next category metadata for modal CTA
  const nextCategoryMeta = useMemo(() => {
    const curIdx = INITIAL_CATEGORIES.findIndex((c) => c.id === activeCategory);
    const nextIdx = (curIdx + 1) % INITIAL_CATEGORIES.length;
    return INITIAL_CATEGORIES[nextIdx];
  }, [activeCategory]);

  // Simple Color Mixing Logic
  const getMixedColor = (c1, c2) => {
    const pair = [c1, c2].sort().join('+');
    switch (pair) {
      case 'Red+Yellow': return { name: 'Orange 🍊', hex: '#FB923C' };
      case 'Blue+Yellow': return { name: 'Green 🌿', hex: '#34D399' };
      case 'Blue+Red': return { name: 'Purple 🔮', hex: '#A78BFA' };
      case 'Red+White': return { name: 'Pink 🌸', hex: '#F472B6' };
      case 'Black+White': return { name: 'Gray 🩶', hex: '#94A3B8' };
      default: return { name: `${c1} & ${c2} Blend ✨`, hex: '#CBD5E1' };
    }
  };

  return (
    <div className="space-y-6 pt-4 sm:pt-6 animate-fade-in pb-12">
      
      {/* Confetti Animation trigger */}
      <ConfettiCanvas trigger={triggerConfetti} />

      {/* Header Banner & Mascot Greeting */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 card-soft p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-800 dark:text-slate-100">
              Explore &amp; Learn Safari
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <Compass className="w-3 h-3 text-amber-700 dark:text-amber-400" />
              <span>Auto-Resume Active</span>
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm">
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
              type="button"
              onClick={() => handleSwitchCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl font-display font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-amber-950 shadow-md scale-105 border-2 border-amber-500'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
                isActive 
                  ? 'bg-amber-950/20 text-amber-950' 
                  : isDone
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
              }`}>
                {cat.completed || 0}/{cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category Banner with Search, Filters & View Mode Toggle */}
      <div className="card-soft p-4 sm:p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 shrink-0">
              {activeCategoryMeta.icon}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-bold text-xl text-slate-800 dark:text-slate-100">
                  {activeCategoryMeta.title || activeCategoryMeta.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  {lessons.length} Total Lessons
                </span>
                {isCategoryFullyMastered && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Mastered!</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {activeCategoryMeta.desc} • Mastered {catCompletedCount} of {lessons.length} ({lessons.length > 0 ? Math.round((catCompletedCount / lessons.length) * 100) : 0}%)
              </p>
              {/* Category Mastery Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-1.5 max-w-sm">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
                  style={{ width: `${lessons.length > 0 ? Math.min(100, Math.round((catCompletedCount / lessons.length) * 100)) : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end flex-wrap">
            <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-1 rounded-2xl border border-slate-200 dark:border-slate-600">
              <button
                type="button"
                onClick={() => { sound.playPop(); saveCurrentPosition(); setViewMode('categories'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-display font-bold transition-all ${
                  viewMode === 'categories'
                    ? 'bg-white dark:bg-slate-800 text-amber-950 dark:text-amber-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="View all 8 Learning Pathways"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>All Pathways</span>
              </button>
              <button
                type="button"
                onClick={() => { sound.playPop(); setViewMode('card'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-display font-bold transition-all ${
                  viewMode === 'card'
                    ? 'bg-white dark:bg-slate-800 text-amber-950 dark:text-amber-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Single Card Interactive View"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Card View</span>
              </button>
              <button
                type="button"
                onClick={() => { sound.playPop(); setViewMode('grid'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-display font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-800 text-amber-950 dark:text-amber-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Grid Overview of all cards in this category"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid View</span>
              </button>
            </div>
          </div>

        </div>

        {/* Quick Search */}
        {viewMode !== 'categories' && (
          <div className="flex items-center justify-end pt-2 border-t border-slate-100 dark:border-slate-700">
            {/* Quick Search Input */}
            <div className="relative w-full sm:w-auto min-w-[220px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${activeCategoryMeta.name}...`}
                className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all font-medium text-slate-700 dark:text-slate-200"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Loading & Error Indicators */}
      {isLoadingLessons ? (
        <div className="card-soft p-12 text-center space-y-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
          <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">
            Loading {activeCategoryMeta.name} Cards...
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto font-medium">
            Lumi is getting your interactive safari ready!
          </p>
        </div>
      ) : lessonsError ? (
        <div className="card-soft p-12 text-center space-y-4 bg-white dark:bg-slate-800 border-2 border-rose-300 dark:border-rose-800 shadow-md">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">
            Unable to Load Category Cards
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
            {lessonsError}
          </p>
          <button
            type="button"
            onClick={() => setActiveCategory((c) => c)}
            className="btn-bubbly px-6 py-2.5 rounded-2xl bg-amber-400 text-amber-950 font-display font-bold text-xs shadow-md"
          >
            Retry Loading
          </button>
        </div>
      ) : (
        <>
          {/* VIEW MODE 1: ALL CATEGORIES OVERVIEW */}
          {viewMode === 'categories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">
                    All 8 Learning Pathways Overview
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Select any pathway to resume learning right where you left off!
                  </p>
                </div>
                <button
                  type="button"
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
                      className={`card-soft p-5 bg-white dark:bg-slate-800 border-2 transition-all cursor-pointer hover:scale-102 flex flex-col justify-between group ${
                        isSelected 
                          ? 'border-amber-400 shadow-md ring-2 ring-amber-300/50' 
                          : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <span className="text-4xl p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 group-hover:scale-110 transition-transform">
                            {cat.icon}
                          </span>
                          {isDone ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                              <span>Mastered</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              Card {resumeCardNum} of {cat.count}
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="font-display font-bold text-base text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            {cat.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                            {cat.desc}
                          </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-slate-400 dark:text-slate-500">Mastery</span>
                            <span className="text-amber-800 dark:text-amber-300 font-mono">{cat.completed} / {cat.count} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
                              style={{ width: `${Math.max(5, pct)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-display font-bold text-amber-700 dark:text-amber-400">
                        <span>{isDone ? 'Review Pathway' : `Resume Card ${resumeCardNum}`}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW MODE 2: GRID OVERVIEW */}
          {viewMode === 'grid' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Showing all {filteredLessons.length} cards — Tap any card to open interactive view!
                </p>
                <button
                  type="button"
                  onClick={() => setViewMode('card')}
                  className="text-amber-600 dark:text-amber-400 hover:underline text-xs font-display font-bold flex items-center gap-1"
                >
                  <span>Back to Flashcard</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {filteredLessons.map((lesson, idx) => {
                  const isDone = Array.isArray(completedLessons) && completedLessons.includes(lesson.id);
                  const isSelected = lesson.id === currentLessonId;
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleSelectLessonFromGrid(idx)}
                      className={`card-soft p-3.5 flex flex-col items-center justify-between text-center cursor-pointer transition-all hover:scale-105 border-2 group relative ${
                        isSelected
                          ? 'border-amber-400 bg-amber-50/70 dark:bg-amber-950/50 shadow-md ring-2 ring-amber-300'
                          : isDone
                            ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/30 hover:border-emerald-300'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-200'
                      }`}
                    >
                      {isDone && (
                        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px] shadow-sm">
                          ✓
                        </span>
                      )}
                      
                      <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 mb-1">
                        #{lesson.orderIndex || idx + 1}
                      </span>

                      <span className="text-4xl sm:text-5xl my-2 filter drop-shadow-sm group-hover:scale-110 transition-transform">
                        {lesson.illustration || lesson.icon || '🌟'}
                      </span>

                      {lesson.letter && (
                        <span className="font-display font-black text-xl text-amber-800 dark:text-amber-300">
                          {lesson.letter}
                        </span>
                      )}
                      {lesson.num !== undefined && (
                        <span className="font-display font-black text-xl text-emerald-800 dark:text-emerald-300">
                          {lesson.num}
                        </span>
                      )}

                      <h4 className="font-display font-bold text-xs text-slate-800 dark:text-slate-100 line-clamp-1 mt-1 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                        {lesson.title || lesson.name}
                      </h4>

                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1">
                        {lesson.stage || lesson.difficulty}
                      </span>
                    </div>
                  );
                })}
              </div>

              {filteredLessons.length === 0 && (
                <div className="card-soft p-12 text-center space-y-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-4xl">🔍</span>
                  <h3 className="font-display font-bold text-lg text-slate-700 dark:text-slate-200">No cards match your filter</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Try clearing your search query or selecting "All Stages" above to view all lessons.
                  </p>
                  <button
                    type="button"
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
            <div className="card-soft p-5 sm:p-8 bg-white dark:bg-slate-800 border-2 border-amber-200 dark:border-slate-700 relative overflow-hidden shadow-lg space-y-6">
              
              {/* Top Card Bar: Counter, Stage Badge, Mastered Status & Review CTA */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    Card {currentIndex + 1} of {filteredLessons.length}
                  </span>
                  {currentLesson.stage && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300">
                      {currentLesson.stage}
                    </span>
                  )}
                  {currentLesson.difficulty && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950 text-sky-900 dark:text-sky-300">
                      {currentLesson.difficulty}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isCategoryFullyMastered && (
                    <button
                      type="button"
                      onClick={handleRestartCategoryReview}
                      className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 hover:bg-purple-100 border border-purple-200 dark:border-purple-800 flex items-center gap-1 transition-colors"
                      title="Start reviewing from Card 1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Review From Card 1</span>
                    </button>
                  )}

                  {isCurrentCompleted ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                      <span>Mastered (+3 ⭐ Earned)</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
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
                    className="w-44 h-44 sm:w-52 sm:h-52 rounded-4xl bg-gradient-to-tr from-amber-100 via-orange-50 to-pink-100 dark:from-slate-700 dark:via-slate-800 dark:to-slate-750 border-4 border-amber-200 dark:border-slate-600 flex flex-col items-center justify-center p-4 cursor-pointer shadow-md hover:scale-105 transition-transform group"
                    title="Tap to listen to speech!"
                  >
                    <span className="text-7xl sm:text-8xl filter drop-shadow-md group-hover:scale-110 transition-transform">
                      {currentLesson.illustration || currentLesson.icon || '🌟'}
                    </span>
                    {currentLesson.letter && (
                      <span className="font-display font-black text-3xl sm:text-4xl text-amber-800 dark:text-amber-300 mt-1">
                        {currentLesson.letter}
                      </span>
                    )}
                    {currentLesson.num !== undefined && (
                      <span className="font-display font-black text-3xl sm:text-4xl text-emerald-800 dark:text-emerald-300 mt-1">
                        {currentLesson.num}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSpeak(currentLesson.soundKey || currentLesson.name || currentLesson.word || currentLesson.title || currentLesson.phonics)}
                    className="btn-bubbly flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-300 font-display font-bold text-xs sm:text-sm shadow-sm"
                  >
                    <Volume2 className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    <span>Listen Audio 🔊</span>
                  </button>
                </div>

                {/* Lesson Details & Examples */}
                <div className="flex-1 space-y-4 text-center lg:text-left">
                  <div>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-1">
                      {currentLesson.phonics && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                          /{currentLesson.phonics}/
                        </span>
                      )}
                      {currentLesson.realm && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                          {currentLesson.realm} Transport
                        </span>
                      )}
                      {currentLesson.role && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                          {currentLesson.role}
                        </span>
                      )}
                      {currentLesson.habitat && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          Habitat: {currentLesson.habitat}
                        </span>
                      )}
                    </div>

                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-800 dark:text-slate-100">
                      {currentLesson.title || currentLesson.name || currentLesson.word}
                    </h2>
                  </div>

                  <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                    {currentLesson.explanation || currentLesson.desc || currentLesson.benefit || currentLesson.function}
                  </p>

                  {/* Examples Pills */}
                  {currentLesson.examples && currentLesson.examples.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                        Word Examples &amp; Associations:
                      </h4>
                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5">
                        {currentLesson.examples.map((ex, i) => (
                          <span 
                            key={i}
                            onClick={() => handleSpeak(ex)}
                            className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-amber-950 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer transition-colors"
                            title="Tap to pronounce"
                          >
                            {ex} 🔊
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fun Fact Callout */}
                  {(currentLesson.funFact || currentLesson.fact) && (
                    <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-left">
                      <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                          Lumi's Fun Fact:
                        </span>
                        <p className="text-xs font-medium text-amber-950 dark:text-amber-100 mt-0.5">
                          {currentLesson.funFact || currentLesson.fact}
                        </p>
                      </div>
                    </div>
                  )}

                </div>

              </div>

              {/* Interactive Practice Activity Section on the Card */}
              {currentLesson.activityQuestion && (
                <div className="card-soft p-4 sm:p-5 bg-gradient-to-r from-sky-50 via-indigo-50/60 to-purple-50 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-sky-200 dark:border-sky-800 space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🎯</span>
                      <h4 className="font-display font-bold text-sm sm:text-base text-indigo-950 dark:text-indigo-200">
                        Quick Practice Challenge:
                      </h4>
                    </div>
                    {isPracticeDone ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 shrink-0">
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                        <span>Challenge Completed (+2 ⭐ Earned)</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100/70 dark:bg-indigo-900/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 shrink-0">
                        Earn +2 ⭐
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                    {currentLesson.activityQuestion}
                  </p>

                  {/* Option Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    {(currentLesson.activityOptions || []).map((opt, oIdx) => {
                      const isChosen = activitySelected === oIdx;
                      const correctIdx = currentLesson.activityAnswerIndex !== undefined ? currentLesson.activityAnswerIndex : 0;
                      const isCorrectAnswer = oIdx === correctIdx;

                      let btnStyle = "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-slate-700";
                      if (activitySelected !== null) {
                        if (isCorrectAnswer) {
                          btnStyle = "bg-emerald-500 text-white border-emerald-600 font-extrabold shadow-sm";
                        } else if (isChosen && !isCorrectAnswer) {
                          btnStyle = "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-300 line-through";
                        }
                      } else if (isPracticeDone && isCorrectAnswer) {
                        btnStyle = "bg-emerald-500 text-white border-emerald-600 font-extrabold shadow-sm";
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleAnswerActivity(oIdx)}
                          disabled={activitySelected !== null || isPracticeDone}
                          className={`btn-bubbly px-4 py-2.5 rounded-2xl border-2 font-display font-bold text-xs sm:text-sm transition-all text-center ${
                            isPracticeDone ? 'cursor-default' : 'cursor-pointer'
                          } ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Instant Activity Feedback / Persistent Completion State */}
                  {(activityFeedback || isPracticeDone) && (
                    <div className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between gap-2 ${
                      (activityFeedback ? activityFeedback.isCorrect : isPracticeDone)
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800' 
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[3] shrink-0" />
                        <span>
                          {activityFeedback 
                            ? activityFeedback.text 
                            : '✨ Challenge Completed! (+2 ⭐ Earned)'}
                        </span>
                      </div>
                      {activityFeedback && !activityFeedback.isCorrect && (
                        <button
                          type="button"
                          onClick={handleRetryActivity}
                          className="text-xs underline font-extrabold text-amber-950 dark:text-amber-200 shrink-0 cursor-pointer"
                        >
                          Try Again
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Mark Complete CTA */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div>
                  {isCurrentCompleted ? (
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-display font-bold text-xs sm:text-sm shadow-sm cursor-default select-none"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>✓ Mastered This Lesson (+3 ⭐ Earned)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCompleteCurrentLesson}
                      className="btn-bubbly flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-display font-bold text-xs sm:text-sm shadow-md hover:brightness-105 cursor-pointer active:scale-95 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>I Learned This! (+3 ⭐)</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className="btn-bubbly flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-display font-bold text-xs"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>All {filteredLessons.length} Cards</span>
                  </button>
                </div>
              </div>

              {/* Card Navigation Controls */}
              <div className="border-t border-slate-100 dark:border-slate-700 pt-5 mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={`btn-bubbly flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-2xl font-display font-bold text-xs sm:text-sm ${
                      currentIndex === 0
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                        : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                    Card {currentIndex + 1} of {filteredLessons.length}
                  </span>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-bubbly flex items-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-display font-bold text-xs sm:text-sm shadow-sm"
                  >
                    <span>{currentIndex < filteredLessons.length - 1 ? 'Next Card' : 'Finish Category 🎉'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                </div>

                {/* Quick-Jump Card Dot Strip */}
                <div className="flex items-center justify-center gap-2 flex-wrap pt-2 max-h-24 overflow-y-auto px-3 py-1.5" role="tablist" aria-label="Lesson card progress dots">
                  {filteredLessons.map((l, dotIdx) => {
                    const isCur = dotIdx === currentIndex;
                    const isDone = Array.isArray(completedLessons) && completedLessons.includes(l.id);
                    const isChallengeDone = Array.isArray(completedPractices) && completedPractices.includes(l.id);

                    const dotState = getProgressDotState(isCur, isDone);

                    return (
                      <button
                        key={l.id || dotIdx}
                        type="button"
                        role="tab"
                        aria-selected={isCur}
                        onClick={() => {
                          sound.playPop();
                          setCurrentIndex(dotIdx);
                          currentIndexRef.current = dotIdx;
                          setActivitySelected(null);
                          setActivityFeedback(null);
                          persistPosition(activeCategory, dotIdx);
                        }}
                        title={`Card ${dotIdx + 1}: ${l.title || l.name || l.letter || l.word}${isDone ? ' • Mastered (+3 ⭐)' : ' • Not Completed'}${isChallengeDone ? ' • Practice Completed (+2 ⭐)' : ''}`}
                        aria-label={`Card ${dotIdx + 1}: ${l.title || l.name || l.letter || l.word}${isDone ? ' (Mastered)' : ' (Not Completed)'}${isCur ? ' (Current Lesson)' : ''}`}
                        className={dotState.classes}
                      />
                    );
                  })}
                </div>

                {/* Progress Dot Legend */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 pt-2 select-none flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-300 dark:bg-slate-600 inline-block shrink-0" />
                    <span>Not Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                    <span>Mastered (+3 ⭐)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-500 ring-2 ring-amber-500 dark:ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 inline-block shrink-0" />
                    <span>Current Lesson</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-amber-500 dark:ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 inline-block shrink-0" />
                    <span>Current (Mastered)</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Category Completion Dialog */}
          {showCompletionModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
              <div className="card-soft max-w-md w-full bg-white dark:bg-slate-800 p-6 sm:p-8 space-y-6 border-4 border-amber-300 dark:border-amber-600 shadow-2xl relative text-center">
                
                <button
                  type="button"
                  onClick={() => setShowCompletionModal(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-2">
                  <span className="text-6xl inline-block animate-bounce">
                    {activeCategoryMeta.icon || '🎉'}
                  </span>
                  <h3 className="font-display font-extrabold text-2xl text-slate-800 dark:text-slate-100">
                    Pathway Completed!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-xs mx-auto">
                    You explored every card in <span className="font-bold text-amber-800 dark:text-amber-300">{activeCategoryMeta.name}</span>!
                  </p>
                </div>

                {/* Pathway Summary Badges */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-left">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Mastered Cards</span>
                    <p className="font-display font-extrabold text-lg text-emerald-800 dark:text-emerald-300">
                      {catCompletedCount} of {lessons.length}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total Stars Earned</span>
                    <p className="font-display font-extrabold text-lg text-amber-800 dark:text-amber-300">
                      +{catCompletedCount * 3} ⭐
                    </p>
                  </div>
                </div>

                {/* Actions for Review or Progression */}
                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleRestartCategoryReview}
                    className="w-full btn-bubbly py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-display font-bold text-sm shadow-md flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Review Pathway From Card 1</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowCompletionModal(false);
                      handleSwitchCategory(nextCategoryMeta.id);
                    }}
                    className="w-full btn-bubbly py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800 font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    <span>Explore Next: {nextCategoryMeta.name} {nextCategoryMeta.icon}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCompletionModal(false)}
                    className="w-full py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    Keep Viewing Last Card
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Interactive Hands-on Playground for Numbers */}
          {activeCategory === 'numbers' && viewMode !== 'categories' && (
            <div className="card-soft p-5 sm:p-6 bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧮</span>
                  <div>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-emerald-950 dark:text-emerald-200">
                      Interactive Abacus Bead Counter (1–20)
                    </h3>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                      Tap beads to slide and count numbers on your abacus, or listen to the voice!
                    </p>
                  </div>
                </div>
                <span className="font-display font-extrabold text-xl text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-800 px-3.5 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-700 shadow-sm">
                  Beads: {abacusCount}
                </span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setAbacusCount(num);
                      sound.speak(`${num}`);
                    }}
                    className={`h-11 rounded-2xl font-display font-bold text-sm transition-transform ${
                      num <= abacusCount
                        ? 'bg-gradient-to-tr from-emerald-400 to-teal-400 text-white shadow-sm scale-105'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-400 hover:bg-emerald-100'
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
            <div className="card-soft p-5 sm:p-6 bg-pink-50/70 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎨</span>
                <div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-pink-950 dark:text-pink-200">
                    Magic Color Mixing Studio
                  </h3>
                  <p className="text-xs text-pink-800 dark:text-pink-300 font-medium">
                    Select two colors to discover their magic secondary blend!
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-pink-200 dark:border-pink-800 text-center">
                
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">First Color</span>
                  <div className="flex gap-1.5 flex-wrap justify-center">
                    {['Red', 'Yellow', 'Blue', 'White', 'Black'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => { sound.playPop(); setMixColorA(c); }}
                        className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${
                          mixColorA === c ? 'border-slate-800 dark:border-slate-200 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 scale-105' : 'border-transparent bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <span className="text-xl font-bold text-slate-300 dark:text-slate-600">+</span>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Second Color</span>
                  <div className="flex gap-1.5 flex-wrap justify-center">
                    {['Red', 'Yellow', 'Blue', 'White', 'Black'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => { sound.playPop(); setMixColorB(c); }}
                        className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${
                          mixColorB === c ? 'border-slate-800 dark:border-slate-200 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 scale-105' : 'border-transparent bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <span className="text-xl font-bold text-slate-300 dark:text-slate-600">=</span>

                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Magic Blend</span>
                  <div 
                    className="w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center text-white font-bold transition-colors duration-300 border border-slate-200 dark:border-slate-700"
                    style={{ backgroundColor: getMixedColor(mixColorA, mixColorB).hex }}
                  />
                  <span className="font-display font-bold text-xs text-slate-800 dark:text-slate-100">
                    {getMixedColor(mixColorA, mixColorB).name}
                  </span>
                </div>

              </div>
            </div>
          )}

          {/* Interactive Animal Sound Board */}
          {activeCategory === 'animals' && viewMode !== 'categories' && (
            <div className="card-soft p-5 sm:p-6 bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🦁</span>
                <div>
                  <h3 className="font-display font-bold text-lg text-amber-950 dark:text-amber-200">
                    Wild Safari Sound Board
                  </h3>
                  <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                    Tap any creature below to hear its call or name spoken aloud!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-800">
                {Array.isArray(lessons) && lessons.slice(0, 12).map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => handleSpeak(`${a.title || a.name}! ${a.sound || ''}`)}
                    className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 flex flex-col items-center gap-1 transition-all hover:scale-105 group"
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform">{a.illustration || '🌟'}</span>
                    <span className="text-[11px] font-display font-bold text-slate-700 dark:text-slate-200 line-clamp-1">{a.name || a.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
