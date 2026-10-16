import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { sound } from '../services/audioService';
import ConfettiCanvas from '../components/ConfettiCanvas';
import LumiMascot from '../components/LumiMascot';
import { 
  Award, 
  Sparkles, 
  Lock, 
  Unlock, 
  Trophy, 
  Crown, 
  Star,
  CheckCircle2
} from 'lucide-react';

export default function RewardsRoom({ stars }) {
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [triggerConfetti, setTriggerConfetti] = useState(false);

  useEffect(() => {
    setBadges(api.getBadges());
    setLeaderboard(api.getLeaderboard());
  }, [stars]);

  const handleInspectBadge = (b) => {
    sound.playPop();
    setSelectedBadge(b);
    if (b.unlocked) {
      setTriggerConfetti(true);
      sound.playSuccess();
      setTimeout(() => setTriggerConfetti(false), 1200);
    }
  };

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-8 py-4">
      <ConfettiCanvas trigger={triggerConfetti} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-800 flex items-center gap-2">
            <span>Rewards Room &amp; Trophies</span>
            <span className="text-2xl">⭐</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Earn stars across games, lessons, and quizzes to unlock awesome achievement badges!
          </p>
        </div>
        <LumiMascot 
          size="sm"
          mood="celebrate"
          message={`You have unlocked ${unlockedCount} badges so far! Keep shining!`}
        />
      </div>

      {/* Star Vault & Level Progress Card */}
      <section className="card-soft p-6 sm:p-8 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider">
              <Crown className="w-4 h-4 text-amber-200 fill-amber-200" />
              <span>Level 2: Junior Adventurer</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl">
              Star Vault: {stars} Shiny Stars!
            </h2>
            <p className="text-amber-100 text-sm max-w-md font-medium">
              Next Rank: Master Explorer at 50 Stars! Complete quizzes and daily quests to level up.
            </p>
            <div className="w-full max-w-md bg-white/30 h-3.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${Math.min(100, (stars / 50) * 100)}%` }}
              />
            </div>
          </div>

          <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/50 flex flex-col items-center justify-center text-center shrink-0 shadow-lg animate-bounce-gentle">
            <span className="text-4xl">⭐</span>
            <span className="font-display font-black text-xl text-white mt-0.5">{stars}</span>
          </div>
        </div>
      </section>

      {/* Badges Collection Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-2xl text-slate-800">
            Explorer Badges ({unlockedCount} / {badges.length})
          </h2>
          <span className="text-xs font-bold text-slate-400">
            Tap a badge to view unlock requirements
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              onClick={() => handleInspectBadge(b)}
              className={`card-soft p-5 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 group ${
                b.unlocked
                  ? 'bg-white border-2 border-amber-300 shadow-md'
                  : 'bg-slate-50/70 border-2 border-slate-200 opacity-60'
              }`}
            >
              <div className="relative inline-block mb-3">
                <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-md transition-transform group-hover:scale-110 ${
                  b.unlocked ? 'bg-gradient-to-tr from-amber-100 to-orange-100' : 'bg-slate-200 grayscale'
                }`}>
                  {b.icon}
                </div>
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white shadow-sm">
                  {b.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400" />
                  )}
                </span>
              </div>

              <h3 className="font-display font-bold text-base text-slate-800">
                {b.title}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mt-1">
                {b.desc}
              </p>

              <div className="mt-3">
                {b.unlocked ? (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Unlocked!
                  </span>
                ) : (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                    Needs {b.requiredStars} ⭐
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Student Leaderboard Section (Sorted by Merge Sort in Backend!) */}
      <section className="card-soft p-6 sm:p-8 bg-white border-2 border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-800">
                Learning Stars Leaderboard
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Ranked in real-time via Java Merge Sort O(n log n)
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {leaderboard.map((user) => {
            const isMe = user.name.includes('(You)');
            return (
              <div 
                key={user.id || user.name}
                className={`flex items-center justify-between p-3.5 rounded-2xl transition-colors ${
                  isMe ? 'bg-amber-50/80 border border-amber-200 font-bold' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center font-display font-black text-xs ${
                    user.rank === 1 ? 'bg-amber-400 text-amber-950' : user.rank === 2 ? 'bg-slate-300 text-slate-800' : user.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {user.rank}
                  </span>
                  <span className="text-2xl">{user.avatar}</span>
                  <span className="text-sm text-slate-800 font-display">
                    {user.name}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-purple-700 font-semibold hidden sm:inline">
                    {user.badges} Badges
                  </span>
                  <span className="font-display font-bold text-amber-600 text-sm">
                    {user.stars} ⭐
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
