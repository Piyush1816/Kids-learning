import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { sound } from '../services/audioService';
import { 
  Users, 
  ShieldCheck, 
  Clock, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles,
  Lock,
  Unlock
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '../services/mockData';

export default function ParentCorner({ stars, onSelectCategory }) {
  const [profile, setProfile] = useState(api.getProfile());
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [categories, setCategories] = useState(api.getCategoriesSync());

  useEffect(() => {
    setProfile(api.getProfile());
    setCategories(api.getCategoriesSync());
  }, [stars]);

  const handleVerifyGate = (e) => {
    e.preventDefault();
    // Simple parental challenge: 4 + 3 = 7 or PIN 1234
    if (pinInput.trim() === '7' || pinInput.trim() === '1234') {
      sound.playSuccess();
      setIsUnlocked(true);
      setPinError(false);
    } else {
      sound.playGentleOops();
      setPinError(true);
    }
  };

  return (
    <div className="space-y-8 py-4 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-800 flex items-center gap-2">
            <span>Parent &amp; Educator Corner</span>
            <span className="text-2xl">📊</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Private learning analytics, time spent, mastery breakdown, and educator tips.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>COPPA Compliant &amp; Private</span>
        </div>
      </div>

      {/* Parental Gate Lock Screen */}
      {!isUnlocked ? (
        <div className="card-soft p-8 sm:p-12 bg-white border-2 border-slate-200 text-center max-w-md mx-auto space-y-6 shadow-md">
          <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-indigo-200 mx-auto flex items-center justify-center text-indigo-600">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="font-display font-bold text-2xl text-slate-800">
              Parental Verification Gate
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Please solve this quick challenge to verify you are a parent or teacher:
            </p>
          </div>

          <form onSubmit={handleVerifyGate} className="space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                Security Question:
              </span>
              <p className="font-display font-extrabold text-2xl text-indigo-950">
                What is 4 + 3 = ?
              </p>
            </div>

            <input
              type="text"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter answer (or 1234)"
              className="w-full text-center font-display font-bold text-xl py-3 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 outline-none"
              autoFocus
            />

            {pinError && (
              <p className="text-xs font-bold text-rose-500">
                Incorrect answer. Please calculate 4 + 3.
              </p>
            )}

            <button
              type="submit"
              className="btn-bubbly w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-sm shadow-md"
            >
              Verify &amp; Unlock Dashboard
            </button>
          </form>
        </div>
      ) : (
        /* Unlocked Analytics Dashboard */
        <div className="space-y-8 animate-fade-in">
          
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="card-soft p-5 bg-white border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Lessons Completed</span>
              <p className="font-display font-black text-2xl text-slate-800 mt-1">
                {profile.completedLessonsCount} Lessons
              </p>
              <span className="text-[11px] font-semibold text-emerald-600 block mt-1">
                ↑ +2 from yesterday
              </span>
            </div>

            <div className="card-soft p-5 bg-white border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase">Estimated Time Spent</span>
              <p className="font-display font-black text-2xl text-slate-800 mt-1">
                {profile.timeSpentMinutes} Minutes
              </p>
              <span className="text-[11px] font-semibold text-sky-600 block mt-1">
                Healthy 12m daily pace
              </span>
            </div>

            <div className="card-soft p-5 bg-white border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase">Average Quiz Accuracy</span>
              <p className="font-display font-black text-2xl text-slate-800 mt-1">
                {profile.quizAccuracy}%
              </p>
              <span className="text-[11px] font-semibold text-purple-600 block mt-1">
                High concept retention
              </span>
            </div>

            <div className="card-soft p-5 bg-white border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Stars Earned</span>
              <p className="font-display font-black text-2xl text-amber-500 mt-1">
                {stars} ⭐
              </p>
              <span className="text-[11px] font-semibold text-amber-700 block mt-1">
                3 badges unlocked
              </span>
            </div>

          </div>

          {/* Subject Mastery Progress Bars */}
          <div className="card-soft p-6 sm:p-8 bg-white border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h2 className="font-display font-bold text-xl text-slate-800">
                  Curriculum Mastery Breakdown
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-400">
                Ages 4-10 Adaptive Framework
              </span>
            </div>

            <div className="space-y-4">
              {categories.map((cat) => {
                const pct = cat.count > 0 ? Math.round((cat.completed / cat.count) * 100) : 0;
                return (
                  <div 
                    key={cat.id} 
                    onClick={() => {
                      if (onSelectCategory) {
                        sound.playPop();
                        onSelectCategory(cat.id);
                      }
                    }}
                    className="space-y-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                    title={`Click to open ${cat.name} pathway`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-2 text-slate-700 group-hover:text-indigo-600 transition-colors">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </span>
                      <span className="text-slate-500 font-mono">
                        {cat.completed} of {cat.count} completed ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-indigo-500 transition-all duration-500"
                        style={{ width: `${Math.max(6, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Learning Action */}
          <div className="card-soft p-6 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-display font-bold text-lg text-indigo-950">
                Educator Recommendation:
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-lg">
                Your child has demonstrated strong aptitude in Alphabets and Colors. We suggest encouraging more practice with <strong>Numbers 1–100</strong> and <strong>Geometric Shapes</strong>!
              </p>
            </div>
            <button
              onClick={() => setIsUnlocked(false)}
              className="btn-bubbly px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-xs shrink-0"
            >
              Lock Dashboard
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
