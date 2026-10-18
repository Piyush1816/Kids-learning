import React, { useState, useEffect } from 'react';
import LumiMascot from '../components/LumiMascot';
import { api } from '../services/api';
import { sound } from '../services/audioService';
import ConfettiCanvas from '../components/ConfettiCanvas';
import { 
  Sparkles, 
  Award, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  BookOpen,
  Compass
} from 'lucide-react';
import { ALL_LESSONS } from '../services/mockData';

export default function Dashboard({ setTab, stars, setStars, badgesCount, onSelectCategory }) {
  const [profile, setProfile] = useState(api.getProfile());
  const [dailyQuest, setDailyQuest] = useState(api.getDailyChallenge());
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [questCompleted, setQuestCompleted] = useState(false);
  const [categories, setCategories] = useState(api.getCategoriesSync());
  const [completedLessonsList, setCompletedLessonsList] = useState(() => api.getCompletedLessons() || []);
  const [nextLesson, setNextLesson] = useState(null);

  useEffect(() => {
    const syncDashboard = () => {
      setProfile(api.getProfile());
      setDailyQuest(api.getDailyChallenge());
      const cats = api.getCategoriesSync();
      setCategories(cats);

      const completed = api.getCompletedLessons() || [];
      setCompletedLessonsList(completed);

      const next = ALL_LESSONS.find((l) => !completed.includes(l.id)) || ALL_LESSONS[0];
      setNextLesson(next);
    };

    syncDashboard();
    const unsub = api.subscribe(() => {
      syncDashboard();
    });

    const handleStorage = (e) => {
      if (!e.key || e.key.startsWith('ll_')) {
        syncDashboard();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      unsub();
      window.removeEventListener('storage', handleStorage);
    };
  }, [stars, badgesCount]);

  const handleCompleteQuest = () => {
    try { sound.playSuccess(); } catch (e) {}
    setTriggerConfetti(true);
    setQuestCompleted(true);
    api.completeDailyChallenge();
    setStars(parseInt(localStorage.getItem('ll_stars') || '24', 10));

    setTimeout(() => {
      setTriggerConfetti(false);
      setDailyQuest(api.getDailyChallenge());
      setQuestCompleted(false);
      setCategories(api.getCategoriesSync());
    }, 1500);
  };

  const handleCategoryClick = (catId) => {
    try { sound.playPop(); } catch (e) {}
    if (onSelectCategory) {
      onSelectCategory(catId);
    } else {
      setTab('learn');
    }
  };

  const totalCurriculumLessons = ALL_LESSONS.length;
  const totalMasteredLessons = completedLessonsList.length;
  const overallPercentage = totalCurriculumLessons > 0 
    ? Math.round((totalMasteredLessons / totalCurriculumLessons) * 100) 
    : 0;

  console.log('[DIAGNOSTIC] 7. Dashboard stats -> mastered:', totalMasteredLessons, '/', totalCurriculumLessons, 'overall:', overallPercentage + '%');

  return (
    <div className="space-y-8 py-4 text-slate-800 dark:text-slate-100">
      <ConfettiCanvas trigger={triggerConfetti} />

      {/* Top Welcome Bar with Lumi Greeting */}
      <section className="card-soft p-6 sm:p-8 bg-gradient-to-r from-amber-50 via-orange-50 to-pink-50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border-amber-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold text-xs uppercase tracking-wide border border-amber-300 dark:border-amber-700">
              Level 2 Explorer • {totalMasteredLessons}/{totalCurriculumLessons} Lessons Mastered
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-800 dark:text-slate-100">
              Good day, <span className="text-orange-500 dark:text-orange-400">{profile.name}!</span> 🌟
            </h1>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-sm sm:text-base max-w-lg">
              You are exploring all 8 learning pathways! Over {totalCurriculumLessons} lessons with phonics, numbers, animals, and interactive tasks are ready for you.
            </p>
          </div>

          <div className="shrink-0">
            <LumiMascot 
              size="md"
              mood={triggerConfetti ? 'celebrate' : 'happy'}
              message="Let's complete today's quest and earn shiny stars!" 
            />
          </div>
        </div>
      </section>

      {/* Continue Learning Fast-Action Card */}
      {nextLesson && (
        <section className="card-soft p-5 sm:p-6 bg-gradient-to-r from-sky-50 via-indigo-50 to-amber-50 dark:from-sky-950/40 dark:via-indigo-950/40 dark:to-slate-800 border-sky-200 dark:border-sky-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <span className="text-4xl sm:text-5xl p-2.5 rounded-3xl bg-white dark:bg-slate-800 border border-sky-200 dark:border-sky-700 shadow-sm shrink-0">
              {nextLesson.illustration || nextLesson.icon || '🚀'}
            </span>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1 justify-center sm:justify-start">
                <Compass className="w-3.5 h-3.5" /> Continue Your Learning Pathway
              </span>
              <h3 className="font-display font-bold text-lg sm:text-xl text-slate-800 dark:text-slate-100">
                Next Up: {nextLesson.title || nextLesson.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                {nextLesson.explanation || nextLesson.desc}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleCategoryClick(nextLesson.categoryId || 'alphabets')}
            className="btn-bubbly px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-display font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 shrink-0"
          >
            <Play className="w-4 h-4 fill-amber-950" />
            <span>Continue Learning ➔</span>
          </button>
        </section>
      )}

      {/* 4 Core Quick Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="card-soft p-5 bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-md shrink-0">
            <Sparkles className="w-6 h-6 fill-amber-950" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Total Stars</p>
            <p className="font-display font-extrabold text-2xl text-amber-950 dark:text-amber-200">{stars} ⭐</p>
          </div>
        </div>

        <div className="card-soft p-5 bg-purple-50/80 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-400 text-white flex items-center justify-center shadow-md shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">Badges Earned</p>
            <p className="font-display font-extrabold text-2xl text-purple-950 dark:text-purple-200">{badgesCount} / 8</p>
          </div>
        </div>

        <div className="card-soft p-5 bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-400 text-white flex items-center justify-center shadow-md shrink-0">
            <BookOpen className="w-6 h-6 fill-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Mastered Lessons</p>
            <p className="font-display font-extrabold text-2xl text-emerald-950 dark:text-emerald-200">{totalMasteredLessons} / {totalCurriculumLessons}</p>
          </div>
        </div>

        <div className="card-soft p-5 bg-sky-50/80 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-400 text-white flex items-center justify-center shadow-md shrink-0">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">Overall Progress</p>
            <p className="font-display font-extrabold text-2xl text-sky-950 dark:text-sky-200">{overallPercentage}%</p>
          </div>
        </div>

      </section>

      {/* Daily Challenge Card */}
      <section className="card-soft p-6 sm:p-8 bg-gradient-to-r from-purple-100/70 via-indigo-50 to-sky-100/70 dark:from-indigo-950/60 dark:via-slate-800 dark:to-purple-950/60 border-indigo-200 dark:border-indigo-800/80 relative overflow-hidden">

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="text-2xl">🎯</span>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-indigo-950 dark:text-indigo-200">
                Today's Learning Quest
              </h2>
            </div>
            <h3 className="font-display font-extrabold text-2xl text-indigo-600 dark:text-indigo-400">
              {dailyQuest.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-sm max-w-lg">
              {dailyQuest.desc}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold text-xs border border-amber-300 dark:border-amber-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>Reward: +{dailyQuest.reward || 3} Stars</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => {
                try { sound.playPop(); } catch (e) {}
                if (dailyQuest.category) {
                  handleCategoryClick(dailyQuest.category);
                } else {
                  setTab('learn');
                }
              }}
              className="btn-bubbly px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-display font-bold text-sm shadow-sm hover:bg-indigo-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-indigo-600 dark:fill-indigo-300" />
              <span>Go to Activity</span>
            </button>

            <button
              onClick={handleCompleteQuest}
              disabled={questCompleted}
              className="btn-bubbly px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-display font-bold text-sm shadow-md hover:brightness-105 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{questCompleted ? 'Great Job!' : 'Mark Quest Complete'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Categories Progress Breakdown */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-slate-800 dark:text-slate-100">
              Learning Pathways Progress
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Click any category card to open its complete curriculum flashcards and activities.
            </p>
          </div>
          <button
            onClick={() => setTab('learn')}
            className="text-amber-600 dark:text-amber-400 hover:text-amber-700 font-bold text-sm flex items-center gap-1"
          >
            <span>Explore All Pathways</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const completedCount = cat.completedCount ?? cat.completed ?? 0;
            const totalCount = cat.count ?? cat.lessonCount ?? cat.totalLessons ?? 20;
            const pct = cat.pct ?? cat.percentage ?? (totalCount > 0 ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 0);
            return (
              <div 
                key={cat.id} 
                onClick={() => handleCategoryClick(cat.id)}
                className="card-soft p-5 cursor-pointer hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition-all group border-2 border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2 rounded-2xl bg-slate-50 dark:bg-slate-700 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">
                    {completedCount} / {totalCount}
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {cat.desc}
                </p>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 mt-3 overflow-hidden">
                  <div 
                    className="h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-1.5">
                  <span>{pct}% mastered</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">➔</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
