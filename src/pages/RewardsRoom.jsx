import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { sound } from '../services/audioService';
import ConfettiCanvas from '../components/ConfettiCanvas';
import LumiMascot from '../components/LumiMascot';
import { 
  Crown, 
  Lock, 
  CheckCircle2, 
  Award,
  Loader2,
  Trophy
} from 'lucide-react';
import { BADGES_DATA } from '../services/mockData';

export default function RewardsRoom({ stars = 24 }) {
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [triggerConfetti, setTriggerConfetti] = useState(false);

  useEffect(() => {
    let isMounted = true;

    console.log('[RewardsRoom] Component mounted with stars:', stars);

    async function loadRewardsData() {
      try {
        setLoading(true);

        // Load Badges safely
        const rawBadges = api.getBadges();
        const safeBadges = Array.isArray(rawBadges) ? rawBadges : (BADGES_DATA || []);
        if (isMounted) setBadges(safeBadges);

        // Await async getLeaderboard call!
        const rawLeaderboard = await api.getLeaderboard();
        const safeLeaderboard = Array.isArray(rawLeaderboard) ? rawLeaderboard : [];
        if (isMounted) {
          setLeaderboard(safeLeaderboard);
          console.log('[RewardsRoom] Loaded badges:', safeBadges.length, 'leaderboard:', safeLeaderboard.length);
        }
      } catch (err) {
        console.error('[RewardsRoom] Error loading rewards data:', err);
        if (isMounted) {
          setBadges(BADGES_DATA || []);
          setLeaderboard([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadRewardsData();

    const unsub = api.subscribe(() => {
      loadRewardsData();
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, [stars]);

  const handleInspectBadge = (b) => {
    if (!b) return;
    try { sound.playPop(); } catch (e) {}
    setSelectedBadge(b);
    if (b.unlocked) {
      setTriggerConfetti(true);
      try { sound.playSuccess(); } catch (e) {}
      setTimeout(() => setTriggerConfetti(false), 1200);
    }
  };

  const safeBadgesList = Array.isArray(badges) ? badges : [];
  const safeLeaderboardList = Array.isArray(leaderboard) ? leaderboard : [];
  const unlockedCount = safeBadgesList.filter((b) => Boolean(b && b.unlocked)).length;

  return (
    <div className="space-y-8 py-4 text-slate-800 dark:text-slate-100">
      <ConfettiCanvas trigger={triggerConfetti} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>Rewards Room &amp; Trophies</span>
            <span className="text-2xl">⭐</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
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
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
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
          <h2 className="font-display font-bold text-2xl text-slate-800 dark:text-slate-100">
            Explorer Badges ({unlockedCount} / {safeBadgesList.length})
          </h2>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-400">
            Tap a badge to view unlock requirements
          </span>
        </div>

        {safeBadgesList.length === 0 ? (
          <div className="card-soft p-8 text-center text-slate-400 dark:text-slate-500">
            <Award className="w-12 h-12 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="font-bold text-sm">No badges available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {safeBadgesList.map((b) => {
              if (!b) return null;
              return (
                <div
                  key={b.id || b.title}
                  onClick={() => handleInspectBadge(b)}
                  className={`card-soft p-5 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 group ${
                    b.unlocked
                      ? 'bg-white dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-700 shadow-md'
                      : 'bg-slate-50/70 dark:bg-slate-800/40 border-2 border-slate-200 dark:border-slate-700 opacity-60'
                  }`}
                >
                  <div className="relative inline-block mb-3">
                    <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-md transition-transform group-hover:scale-110 ${
                      b.unlocked ? 'bg-gradient-to-tr from-amber-100 to-orange-100 dark:from-amber-950 dark:to-orange-950' : 'bg-slate-200 dark:bg-slate-700 grayscale'
                    }`}>
                      {b.icon || '🏆'}
                    </div>
                    <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white dark:bg-slate-800 shadow-sm">
                      {b.unlocked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-400" />
                      )}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-100">
                    {b.title || 'Explorer Badge'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mt-1">
                    {b.desc || 'Complete activities to unlock!'}
                  </p>

                  <div className="mt-3">
                    {b.unlocked ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Unlocked!
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        Needs {b.requiredStars || 5} ⭐
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Student Leaderboard Section */}
      <section className="card-soft p-6 sm:p-8 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-800 dark:text-slate-100">
                Learning Stars Leaderboard
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">
                Ranked in real-time
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 flex items-center justify-center gap-2 font-bold text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            <span>Loading leaderboard standings...</span>
          </div>
        ) : safeLeaderboardList.length === 0 ? (
          <div className="py-8 text-center text-slate-400 font-bold text-sm">
            <p>No leaderboard standings recorded yet. Complete activities to claim rank #1!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {safeLeaderboardList.map((user, idx) => {
              if (!user) return null;
              const isMe = Boolean(user.name && user.name.includes('(You)'));
              return (
                <div 
                  key={user.id || user.name || idx}
                  className={`flex items-center justify-between p-3.5 rounded-2xl transition-colors ${
                    isMe ? 'bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-display font-black text-xs ${
                      user.rank === 1 ? 'bg-amber-400 text-amber-950' : user.rank === 2 ? 'bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-slate-100' : user.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}>
                      {user.rank || idx + 1}
                    </span>
                    <span className="text-2xl">{user.avatar || '🦊'}</span>
                    <span className="text-sm text-slate-800 dark:text-slate-100 font-display">
                      {user.name || 'Anonymous Explorer'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-purple-700 dark:text-purple-300 font-semibold hidden sm:inline">
                      {user.badges || 0} Badges
                    </span>
                    <span className="font-display font-bold text-amber-600 dark:text-amber-400 text-sm">
                      {user.stars || 0} ⭐
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
