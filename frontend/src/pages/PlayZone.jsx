import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { sound } from '../services/audioService';
import ConfettiCanvas from '../components/ConfettiCanvas';
import LumiMascot from '../components/LumiMascot';
import { 
  Gamepad2, 
  RotateCcw, 
  Sparkles, 
  Trophy, 
  Check, 
  X, 
  HelpCircle,
  Clock,
  Play
} from 'lucide-react';

export default function PlayZone({ stars, setStars }) {
  const [activeGame, setActiveGame] = useState('memory-cards');
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [score, setScore] = useState(0);

  // --- GAME 1: Animal Match State ---
  const animalQuestions = [
    { targetName: 'Lion', targetSound: 'Roaaar!', options: ['🦁', '🐬', '🐘', '🐒'], correctIdx: 0 },
    { targetName: 'Dolphin', targetSound: 'Click-Whistle!', options: ['🐧', '🐬', '🦁', '🦉'], correctIdx: 1 },
    { targetName: 'Owl', targetSound: 'Hoo-Hoo!', options: ['🦉', '🐘', '🐒', '🐬'], correctIdx: 0 },
    { targetName: 'Monkey', targetSound: 'Ooh-Ooh Aah-Aah!', options: ['🦁', '🐧', '🐒', '🐘'], correctIdx: 2 }
  ];
  const [animalRound, setAnimalRound] = useState(0);
  const [animalFeedback, setAnimalFeedback] = useState(null);

  // --- GAME 2: Memory Matrix Flip State ---
  const memoryIcons = ['🍎', '🍌', '🍓', '🍇', '🦁', '🐬'];
  const [memoryDeck, setMemoryDeck] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);

  // --- GAME 3: Mystery Shadow Silhouette State ---
  const mysteryItems = [
    { clue: 'I have a golden mane and love to roar loudly in the savannah!', options: ['Tiger', 'Lion', 'Bear', 'Dog'], answer: 'Lion', revealIcon: '🦁' },
    { clue: 'I curve towards the bright sun and give you potassium energy!', options: ['Apple', 'Carrot', 'Banana', 'Orange'], answer: 'Banana', revealIcon: '🍌' },
    { clue: 'I blast powerful rocket engines to soar past Earth into space!', options: ['Submarine', 'Rocket', 'Train', 'Car'], answer: 'Rocket', revealIcon: '🚀' },
    { clue: 'I pump fresh blood across your entire body every single heartbeat!', options: ['Brain', 'Lungs', 'Heart', 'Stomach'], answer: 'Heart', revealIcon: '❤️' }
  ];
  const [mysteryRound, setMysteryRound] = useState(0);
  const [mysteryRevealed, setMysteryRevealed] = useState(false);
  const [mysteryFeedback, setMysteryFeedback] = useState(null);

  // --- GAME 4: Category Sorter Basket State ---
  const sortItems = [
    { name: 'Apple', icon: '🍎', basket: 'Healthy Foods' },
    { name: 'Lollipop', icon: '🍭', basket: 'Sweet Treats' },
    { name: 'Broccoli', icon: '🥦', basket: 'Healthy Foods' },
    { name: 'Ice Cream', icon: '🍦', basket: 'Sweet Treats' },
    { name: 'Carrot', icon: '🥕', basket: 'Healthy Foods' },
    { name: 'Chocolate Bar', icon: '🍫', basket: 'Sweet Treats' }
  ];
  const [sortIndex, setSortIndex] = useState(0);
  const [sortedCount, setSortedCount] = useState(0);
  const [sortFeedback, setSortFeedback] = useState(null);

  // --- GAME 5: Counting Safari State ---
  const safariItems = [
    { count: 4, itemIcon: '🦁', prompt: 'Count how many brave lions are resting!' },
    { count: 7, itemIcon: '⭐', prompt: 'Count how many twinkling stars shine in the sky!' },
    { count: 5, itemIcon: '🍎', prompt: 'Count how many delicious apples fell from the tree!' },
    { count: 6, itemIcon: '🐬', prompt: 'Count how many playful dolphins are swimming!' }
  ];
  const [safariRound, setSafariRound] = useState(0);
  const [safariFeedback, setSafariFeedback] = useState(null);

  // --- GAME 6: Color & Shape Blitz State ---
  const blitzItems = [
    { prompt: 'Tap the RED CIRCLE!', options: [{ icon: '⭕', label: 'Red Circle', isCorrect: true }, { icon: '⬛', label: 'Blue Square', isCorrect: false }, { icon: '🔺', label: 'Yellow Triangle', isCorrect: false }] },
    { prompt: 'Tap the YELLOW STAR!', options: [{ icon: '🔷', label: 'Purple Diamond', isCorrect: false }, { icon: '⭐', label: 'Yellow Star', isCorrect: true }, { icon: '⭕', label: 'Green Circle', isCorrect: false }] },
    { prompt: 'Tap the BLUE SQUARE!', options: [{ icon: '⬛', label: 'Blue Square', isCorrect: true }, { icon: '❤️', label: 'Red Heart', isCorrect: false }, { icon: '⭐', label: 'Yellow Star', isCorrect: false }] }
  ];
  const [blitzRound, setBlitzRound] = useState(0);
  const [blitzFeedback, setBlitzFeedback] = useState(null);

  // Initialize Memory Game Deck
  useEffect(() => {
    resetMemoryGame();
  }, []);

  const resetMemoryGame = () => {
    const doubled = [...memoryIcons, ...memoryIcons];
    const shuffled = doubled
      .sort(() => Math.random() - 0.5)
      .map((icon, idx) => ({ id: idx, icon, isMatched: false }));
    setMemoryDeck(shuffled);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
  };

  const handleCardClick = (idx) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(idx) || matchedPairs.includes(idx)) return;
    sound.playPop();

    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [firstIdx, secondIdx] = newFlipped;
      if (memoryDeck[firstIdx].icon === memoryDeck[secondIdx].icon) {
        sound.playSuccess();
        const newMatched = [...matchedPairs, firstIdx, secondIdx];
        setMatchedPairs(newMatched);
        setFlippedIndices([]);
        setScore(score + 15);

        if (newMatched.length === memoryDeck.length) {
          setTriggerConfetti(true);
          sound.playFanfare();
          api.addStars(4, 'Solved Memory Matrix game');
          setStars(parseInt(localStorage.getItem('ll_stars') || '24', 10));
          setTimeout(() => setTriggerConfetti(false), 2000);
        }
      } else {
        sound.playGentleOops();
        setTimeout(() => setFlippedIndices([]), 900);
      }
    }
  };

  // Animal Match handler
  const handleAnimalPick = (idx) => {
    const current = animalQuestions[animalRound];
    if (idx === current.correctIdx) {
      sound.playSuccess();
      setAnimalFeedback('correct');
      setScore(score + 10);
      setTimeout(() => {
        setAnimalFeedback(null);
        if (animalRound < animalQuestions.length - 1) {
          setAnimalRound(animalRound + 1);
        } else {
          setTriggerConfetti(true);
          sound.playFanfare();
          api.addStars(3, 'Completed Animal Matcher game');
          setStars(parseInt(localStorage.getItem('ll_stars') || '24', 10));
          setTimeout(() => {
            setTriggerConfetti(false);
            setAnimalRound(0);
          }, 2000);
        }
      }, 1000);
    } else {
      sound.playGentleOops();
      setAnimalFeedback('incorrect');
      setTimeout(() => setAnimalFeedback(null), 1000);
    }
  };

  // Silhouette Guess handler
  const handleMysteryPick = (selected) => {
    const current = mysteryItems[mysteryRound];
    setMysteryRevealed(true);
    if (selected === current.answer) {
      sound.playSuccess();
      setMysteryFeedback('correct');
      setScore(score + 15);
      setTimeout(() => {
        setMysteryFeedback(null);
        setMysteryRevealed(false);
        if (mysteryRound < mysteryItems.length - 1) {
          setMysteryRound(mysteryRound + 1);
        } else {
          setTriggerConfetti(true);
          sound.playFanfare();
          api.addStars(3, 'Completed Mystery Shadow game');
          setStars(parseInt(localStorage.getItem('ll_stars') || '24', 10));
          setTimeout(() => {
            setTriggerConfetti(false);
            setMysteryRound(0);
          }, 2000);
        }
      }, 1500);
    } else {
      sound.playGentleOops();
      setMysteryFeedback('incorrect');
      setTimeout(() => {
        setMysteryFeedback(null);
        setMysteryRevealed(false);
      }, 1200);
    }
  };

  // Category Sorter handler
  const handleSortItem = (basket) => {
    const current = sortItems[sortIndex];
    if (basket === current.basket) {
      sound.playSuccess();
      setSortFeedback('correct');
      setSortedCount(sortedCount + 1);
      setScore(score + 10);

      setTimeout(() => {
        setSortFeedback(null);
        if (sortIndex < sortItems.length - 1) {
          setSortIndex(sortIndex + 1);
        } else {
          setTriggerConfetti(true);
          sound.playFanfare();
          api.addStars(3, 'Completed Basket Sorter game');
          setStars(parseInt(localStorage.getItem('ll_stars') || '24', 10));
          setTimeout(() => {
            setTriggerConfetti(false);
            setSortIndex(0);
            setSortedCount(0);
          }, 2000);
        }
      }, 800);
    } else {
      sound.playGentleOops();
      setSortFeedback('incorrect');
      setTimeout(() => setSortFeedback(null), 800);
    }
  };

  // Safari Counting handler
  const handleSafariPick = (picked) => {
    const current = safariItems[safariRound];
    if (picked === current.count) {
      sound.playSuccess();
      setSafariFeedback('correct');
      setScore(score + 10);
      setTimeout(() => {
        setSafariFeedback(null);
        if (safariRound < safariItems.length - 1) {
          setSafariRound(safariRound + 1);
        } else {
          setTriggerConfetti(true);
          sound.playFanfare();
          api.addStars(3, 'Completed Counting Safari game');
          setStars(parseInt(localStorage.getItem('ll_stars') || '24', 10));
          setTimeout(() => {
            setTriggerConfetti(false);
            setSafariRound(0);
          }, 2000);
        }
      }, 1000);
    } else {
      sound.playGentleOops();
      setSafariFeedback('incorrect');
      setTimeout(() => setSafariFeedback(null), 800);
    }
  };

  // Blitz handler
  const handleBlitzPick = (isCorrect) => {
    if (isCorrect) {
      sound.playSuccess();
      setBlitzFeedback('correct');
      setScore(score + 15);
      setTimeout(() => {
        setBlitzFeedback(null);
        if (blitzRound < blitzItems.length - 1) {
          setBlitzRound(blitzRound + 1);
        } else {
          setTriggerConfetti(true);
          sound.playFanfare();
          api.addStars(4, 'Completed Color & Shape Blitz');
          setStars(parseInt(localStorage.getItem('ll_stars') || '24', 10));
          setTimeout(() => {
            setTriggerConfetti(false);
            setBlitzRound(0);
          }, 2000);
        }
      }, 1000);
    } else {
      sound.playGentleOops();
      setBlitzFeedback('incorrect');
      setTimeout(() => setBlitzFeedback(null), 800);
    }
  };

  const games = [
    { id: 'memory-cards', name: 'Memory Matrix', icon: '🃏', color: 'from-amber-400 to-orange-400' },
    { id: 'animal-match', name: 'Animal Match', icon: '🦁', color: 'from-pink-400 to-rose-400' },
    { id: 'silhouette-guess', name: 'Shadow Riddle', icon: '🔍', color: 'from-purple-400 to-indigo-400' },
    { id: 'category-sort', name: 'Basket Sorter', icon: '🧺', color: 'from-emerald-400 to-teal-400' },
    { id: 'counting-safari', name: 'Counting Safari', icon: '🧮', color: 'from-sky-400 to-blue-400' },
    { id: 'color-shape-blitz', name: 'Lightning Blitz', icon: '⚡', color: 'from-yellow-400 to-amber-500' }
  ];

  return (
    <div className="space-y-8 py-4">
      <ConfettiCanvas trigger={triggerConfetti} />

      {/* Play Zone Header & Score Vault */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-800 flex items-center gap-2">
            <span>Play Zone Adventure</span>
            <span className="text-2xl">🎮</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            6 fully functional educational games with real scoring, sounds, and replay!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-100 text-amber-900 font-display font-bold text-sm shadow-sm">
            <Trophy className="w-5 h-5 text-amber-600" />
            <span>Score: {score} pts</span>
          </div>
          <LumiMascot size="sm" message="Play games to earn more shiny stars!" />
        </div>
      </div>

      {/* 6 Mini Game Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {games.map((g) => {
          const isActive = activeGame === g.id;
          return (
            <button
              key={g.id}
              onClick={() => {
                sound.playPop();
                setActiveGame(g.id);
              }}
              className={`p-3 rounded-2xl font-display font-bold text-xs sm:text-sm flex flex-col items-center gap-1.5 transition-all duration-200 border-2 ${
                isActive
                  ? 'bg-white border-amber-400 text-amber-900 shadow-md scale-105'
                  : 'bg-white/70 border-slate-200 text-slate-600 hover:bg-white'
              }`}
            >
              <span className="text-3xl">{g.icon}</span>
              <span>{g.name}</span>
            </button>
          );
        })}
      </div>

      {/* GAME 1: MEMORY MATRIX */}
      {activeGame === 'memory-cards' && (
        <div className="card-soft p-6 sm:p-8 bg-white border-2 border-amber-200 shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-2xl text-slate-800">
                Memory Matrix Flip Game
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Flip two cards at a time to find matching pairs! Moves: {moves} | Matched: {matchedPairs.length / 2} / 6
              </p>
            </div>
            <button
              onClick={() => { sound.playPop(); resetMemoryGame(); }}
              className="btn-bubbly flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Cards</span>
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto">
            {memoryDeck.map((card, idx) => {
              const isFlipped = flippedIndices.includes(idx) || matchedPairs.includes(idx);
              const isMatched = matchedPairs.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => handleCardClick(idx)}
                  className={`h-24 sm:h-28 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl cursor-pointer select-none transition-all duration-300 transform ${
                    isMatched
                      ? 'bg-emerald-100 border-2 border-emerald-300 shadow-sm opacity-90'
                      : isFlipped
                      ? 'bg-amber-100 border-2 border-amber-300 shadow-md rotate-y-180'
                      : 'bg-gradient-to-tr from-sky-400 to-indigo-500 text-white font-display font-extrabold shadow hover:scale-105'
                  }`}
                >
                  {isFlipped ? card.icon : '❓'}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* GAME 2: ANIMAL SOUND & PICTURE MATCH */}
      {activeGame === 'animal-match' && (
        <div className="card-soft p-6 sm:p-8 bg-white border-2 border-pink-200 shadow-md space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
              Round {animalRound + 1} of {animalQuestions.length}
            </span>
            <h2 className="font-display font-bold text-2xl text-slate-800">
              Who Makes This Wild Call?
            </h2>
            <div className="inline-block px-5 py-2 rounded-full bg-pink-100 border border-pink-300 text-pink-900 font-display font-extrabold text-xl mt-2">
              "{animalQuestions[animalRound].targetSound}"
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Tap the animal that roars or calls with this sound:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
            {animalQuestions[animalRound].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnimalPick(i)}
                className="btn-bubbly h-28 rounded-3xl bg-slate-50 hover:bg-pink-50 border-2 border-slate-200 hover:border-pink-300 text-5xl flex items-center justify-center shadow-sm"
              >
                {opt}
              </button>
            ))}
          </div>

          {animalFeedback && (
            <div className={`text-base font-bold font-display ${animalFeedback === 'correct' ? 'text-emerald-600' : 'text-rose-500'}`}>
              {animalFeedback === 'correct' ? '✨ Wow! That is correct!' : 'Oops! Try again!'}
            </div>
          )}
        </div>
      )}

      {/* GAME 3: MYSTERY SHADOW RIDDLE */}
      {activeGame === 'silhouette-guess' && (
        <div className="card-soft p-6 sm:p-8 bg-white border-2 border-purple-200 shadow-md space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
              Riddle {mysteryRound + 1} of {mysteryItems.length}
            </span>
            <h2 className="font-display font-bold text-2xl text-slate-800">
              Who Am I? Mystery Clue
            </h2>
          </div>

          <div className="w-36 h-36 rounded-4xl bg-purple-100 border-2 border-purple-300 mx-auto flex items-center justify-center text-6xl shadow-inner">
            {mysteryRevealed ? mysteryItems[mysteryRound].revealIcon : '🕵️'}
          </div>

          <p className="font-display font-bold text-lg sm:text-xl text-purple-950 max-w-md mx-auto">
            "{mysteryItems[mysteryRound].clue}"
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {mysteryItems[mysteryRound].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleMysteryPick(opt)}
                className="btn-bubbly p-3.5 rounded-2xl bg-slate-50 hover:bg-purple-100 text-slate-800 font-display font-bold text-sm border-2 border-slate-200 hover:border-purple-300"
              >
                {opt}
              </button>
            ))}
          </div>

          {mysteryFeedback && (
            <div className={`text-base font-bold font-display ${mysteryFeedback === 'correct' ? 'text-emerald-600' : 'text-rose-500'}`}>
              {mysteryFeedback === 'correct' ? '🎉 You cracked the riddle!' : 'Not quite! Try again!'}
            </div>
          )}
        </div>
      )}

      {/* GAME 4: CATEGORY SORTER BASKET */}
      {activeGame === 'category-sort' && (
        <div className="card-soft p-6 sm:p-8 bg-white border-2 border-emerald-200 shadow-md space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Sorted: {sortedCount} / {sortItems.length}
            </span>
            <h2 className="font-display font-bold text-2xl text-slate-800">
              Healthy Basket Sorter
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Sort each delicious item into the correct basket!
            </p>
          </div>

          {/* Current Item to Sort */}
          <div className="w-32 h-32 rounded-3xl bg-amber-50 border-2 border-amber-300 mx-auto flex flex-col items-center justify-center shadow-md animate-bounce-gentle">
            <span className="text-6xl">{sortItems[sortIndex].icon}</span>
            <span className="font-display font-bold text-sm text-amber-900 mt-1">
              {sortItems[sortIndex].name}
            </span>
          </div>

          {/* Target Baskets */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <button
              onClick={() => handleSortItem('Healthy Foods')}
              className="btn-bubbly p-5 rounded-3xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-950 flex flex-col items-center gap-2"
            >
              <span className="text-3xl">🥗</span>
              <span className="font-display font-bold text-base">Healthy Foods</span>
              <span className="text-[11px] text-emerald-700">Fruits &amp; Veggies</span>
            </button>

            <button
              onClick={() => handleSortItem('Sweet Treats')}
              className="btn-bubbly p-5 rounded-3xl bg-pink-50 hover:bg-pink-100 border-2 border-pink-300 text-pink-950 flex flex-col items-center gap-2"
            >
              <span className="text-3xl">🧁</span>
              <span className="font-display font-bold text-base">Sweet Treats</span>
              <span className="text-[11px] text-pink-700">Special Snacks</span>
            </button>
          </div>

          {sortFeedback && (
            <div className={`text-base font-bold font-display ${sortFeedback === 'correct' ? 'text-emerald-600' : 'text-rose-500'}`}>
              {sortFeedback === 'correct' ? '🥬 Great choice! Placed into the right basket!' : 'Oops, that belongs in the other basket!'}
            </div>
          )}
        </div>
      )}

      {/* GAME 5: COUNTING SAFARI */}
      {activeGame === 'counting-safari' && (
        <div className="card-soft p-6 sm:p-8 bg-white border-2 border-sky-200 shadow-md space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
              Quest {safariRound + 1} of {safariItems.length}
            </span>
            <h2 className="font-display font-bold text-2xl text-slate-800">
              Counting Safari
            </h2>
            <p className="font-display font-bold text-base text-sky-900">
              {safariItems[safariRound].prompt}
            </p>
          </div>

          {/* Items Canvas */}
          <div className="p-6 rounded-3xl bg-sky-50 border border-sky-200 max-w-md mx-auto flex flex-wrap items-center justify-center gap-4">
            {Array.from({ length: safariItems[safariRound].count }).map((_, i) => (
              <span key={i} className="text-4xl animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                {safariItems[safariRound].itemIcon}
              </span>
            ))}
          </div>

          {/* Number Choices */}
          <div className="flex items-center justify-center gap-3">
            {[2, 3, 4, 5, 6, 7, 8].map((num) => (
              <button
                key={num}
                onClick={() => handleSafariPick(num)}
                className="btn-bubbly w-12 h-12 rounded-2xl bg-white border-2 border-sky-300 hover:bg-sky-100 text-sky-900 font-display font-black text-lg shadow-sm"
              >
                {num}
              </button>
            ))}
          </div>

          {safariFeedback && (
            <div className={`text-base font-bold font-display ${safariFeedback === 'correct' ? 'text-emerald-600' : 'text-rose-500'}`}>
              {safariFeedback === 'correct' ? '🦁 Correct count! You counted like a pro!' : 'Count carefully and try once more!'}
            </div>
          )}
        </div>
      )}

      {/* GAME 6: LIGHTNING BLITZ */}
      {activeGame === 'color-shape-blitz' && (
        <div className="card-soft p-6 sm:p-8 bg-white border-2 border-amber-300 shadow-md space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Speed Reflex • Round {blitzRound + 1} of {blitzItems.length}
            </span>
            <h2 className="font-display font-bold text-2xl text-slate-800">
              Color &amp; Shape Lightning Blitz
            </h2>
            <div className="inline-block px-5 py-2 rounded-full bg-amber-400 text-amber-950 font-display font-extrabold text-xl mt-2 animate-pulse">
              {blitzItems[blitzRound].prompt}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            {blitzItems[blitzRound].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleBlitzPick(opt.isCorrect)}
                className="btn-bubbly p-6 rounded-3xl bg-slate-50 hover:bg-amber-100 border-2 border-slate-200 hover:border-amber-400 flex flex-col items-center gap-2"
              >
                <span className="text-6xl">{opt.icon}</span>
                <span className="font-display font-bold text-sm text-slate-800">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>

          {blitzFeedback && (
            <div className={`text-base font-bold font-display ${blitzFeedback === 'correct' ? 'text-emerald-600' : 'text-rose-500'}`}>
              {blitzFeedback === 'correct' ? '⚡ Lightning fast! Spot on!' : 'Not this one! Try another!'}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
