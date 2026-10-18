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
  Play,
  Flame,
  CheckCircle2
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
    { targetName: 'Monkey', targetSound: 'Ooh-Ooh Aah-Aah!', options: ['🦁', '🐧', '🐒', '🐘'], correctIdx: 2 },
    { targetName: 'Elephant', targetSound: 'Pawoo-Trumpet!', options: ['🐘', '🦁', '🐬', '🐨'], correctIdx: 0 }
  ];
  const [animalRound, setAnimalRound] = useState(0);
  const [animalFeedback, setAnimalFeedback] = useState(null);
  const [animalLock, setAnimalLock] = useState(false);

  // --- GAME 2: Memory Matrix Flip State ---
  const memoryIcons = ['🍎', '🍌', '🍓', '🍇', '🦁', '🐬'];
  const [memoryDeck, setMemoryDeck] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isMemoryEvaluating, setIsMemoryEvaluating] = useState(false);

  // --- GAME 3: Mystery Shadow Silhouette State ---
  const mysteryItems = [
    { clue: 'I have a golden mane and love to roar loudly across the savannah!', options: ['Tiger', 'Lion', 'Bear', 'Dog'], answer: 'Lion', icon: '🦁' },
    { clue: 'I curve upwards towards the sun and give you sweet potassium energy!', options: ['Apple', 'Carrot', 'Banana', 'Orange'], answer: 'Banana', icon: '🍌' },
    { clue: 'I blast fiery rocket engines to soar past Earth into the stars!', options: ['Submarine', 'Rocket', 'Train', 'Car'], answer: 'Rocket', icon: '🚀' },
    { clue: 'I pump fresh blood across your entire body with every single beat!', options: ['Brain', 'Lungs', 'Heart', 'Stomach'], answer: 'Heart', icon: '❤️' },
    { clue: 'I slide across icy snow on my belly and love swimming in cold waters!', options: ['Penguin', 'Eagle', 'Owl', 'Koala'], answer: 'Penguin', icon: '🐧' }
  ];
  const [mysteryRound, setMysteryRound] = useState(0);
  const [mysteryRevealed, setMysteryRevealed] = useState(false);
  const [mysteryFeedback, setMysteryFeedback] = useState(null);
  const [mysteryLock, setMysteryLock] = useState(false);

  // --- GAME 4: Category Sorter Basket State ---
  const sortItems = [
    { name: 'Apple', icon: '🍎', basket: 'Healthy Foods' },
    { name: 'Lollipop', icon: '🍭', basket: 'Sweet Treats' },
    { name: 'Broccoli', icon: '🥦', basket: 'Healthy Foods' },
    { name: 'Ice Cream', icon: '🍦', basket: 'Sweet Treats' },
    { name: 'Carrot', icon: '🥕', basket: 'Healthy Foods' },
    { name: 'Chocolate Bar', icon: '🍫', basket: 'Sweet Treats' },
    { name: 'Strawberry', icon: '🍓', basket: 'Healthy Foods' },
    { name: 'Cupcake', icon: '🧁', basket: 'Sweet Treats' }
  ];
  const [sortIndex, setSortIndex] = useState(0);
  const [sortedCount, setSortedCount] = useState(0);
  const [sortFeedback, setSortFeedback] = useState(null);
  const [sortLock, setSortLock] = useState(false);

  // --- GAME 5: Counting Safari State ---
  const safariItems = [
    { count: 4, itemIcon: '🦁', prompt: 'Count how many brave lions are resting!' },
    { count: 7, itemIcon: '⭐', prompt: 'Count how many twinkling stars shine in the sky!' },
    { count: 5, itemIcon: '🍎', prompt: 'Count how many delicious apples fell from the tree!' },
    { count: 6, itemIcon: '🐬', prompt: 'Count how many playful dolphins are leaping!' },
    { count: 3, itemIcon: '🚀', prompt: 'Count how many space rockets are on the launch pad!' }
  ];
  const [safariRound, setSafariRound] = useState(0);
  const [safariFeedback, setSafariFeedback] = useState(null);
  const [safariLock, setSafariLock] = useState(false);

  // Completed states for all 6 mini-games
  const [animalCompleted, setAnimalCompleted] = useState(false);
  const [memoryCompleted, setMemoryCompleted] = useState(false);
  const [mysteryCompleted, setMysteryCompleted] = useState(false);
  const [sortCompleted, setSortCompleted] = useState(false);
  const [safariCompleted, setSafariCompleted] = useState(false);
  const [blitzCompleted, setBlitzCompleted] = useState(false);
  const [blitzLock, setBlitzLock] = useState(false);

  // --- GAME 6: Color & Shape Blitz State ---
  const blitzItems = [
    { 
      prompt: 'Tap the RED CIRCLE!', 
      options: [
        { icon: '🔴', label: 'Red Circle', isCorrect: true }, 
        { icon: '🟦', label: 'Blue Square', isCorrect: false }, 
        { icon: '🔺', label: 'Red Triangle', isCorrect: false }
      ] 
    },
    { 
      prompt: 'Tap the YELLOW STAR!', 
      options: [
        { icon: '🟣', label: 'Purple Circle', isCorrect: false }, 
        { icon: '⭐', label: 'Yellow Star', isCorrect: true }, 
        { icon: '🟢', label: 'Green Circle', isCorrect: false }
      ] 
    },
    { 
      prompt: 'Tap the BLUE SQUARE!', 
      options: [
        { icon: '🟦', label: 'Blue Square', isCorrect: true }, 
        { icon: '❤️', label: 'Red Heart', isCorrect: false }, 
        { icon: '🟨', label: 'Yellow Square', isCorrect: false }
      ] 
    },
    { 
      prompt: 'Tap the GREEN CIRCLE!', 
      options: [
        { icon: '🔺', label: 'Red Triangle', isCorrect: false }, 
        { icon: '🟢', label: 'Green Circle', isCorrect: true }, 
        { icon: '🟨', label: 'Yellow Square', isCorrect: false }
      ] 
    }
  ];
  const [blitzRound, setBlitzRound] = useState(0);
  const [blitzFeedback, setBlitzFeedback] = useState(null);
  const [blitzTimeLeft, setBlitzTimeLeft] = useState(10);
  const [blitzActive, setBlitzActive] = useState(true);

  // Initialize Memory Game Deck
  useEffect(() => {
    resetMemoryGame();
  }, []);

  // Blitz Timer
  useEffect(() => {
    let timer;
    if (activeGame === 'color-shape-blitz' && blitzActive && !blitzCompleted && blitzTimeLeft > 0) {
      timer = setInterval(() => {
        setBlitzTimeLeft((prev) => {
          if (prev <= 1) {
            setBlitzActive(false);
            sound.playGentleOops();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeGame, blitzActive, blitzCompleted, blitzTimeLeft]);

  const resetMemoryGame = () => {
    const doubled = [...memoryIcons, ...memoryIcons];
    const shuffled = doubled
      .sort(() => Math.random() - 0.5)
      .map((icon, idx) => ({ id: idx, icon, isMatched: false }));
    setMemoryDeck(shuffled);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setMemoryCompleted(false);
    setIsMemoryEvaluating(false);
  };

  const resetAnimalGame = () => {
    setAnimalRound(0);
    setAnimalCompleted(false);
    setAnimalFeedback(null);
    setAnimalLock(false);
  };

  const resetMysteryGame = () => {
    setMysteryRound(0);
    setMysteryCompleted(false);
    setMysteryRevealed(false);
    setMysteryFeedback(null);
    setMysteryLock(false);
  };

  const resetSortGame = () => {
    setSortIndex(0);
    setSortedCount(0);
    setSortCompleted(false);
    setSortFeedback(null);
    setSortLock(false);
  };

  const resetSafariGame = () => {
    setSafariRound(0);
    setSafariCompleted(false);
    setSafariFeedback(null);
    setSafariLock(false);
  };

  const resetBlitzGame = () => {
    setBlitzRound(0);
    setBlitzCompleted(false);
    setBlitzFeedback(null);
    setBlitzTimeLeft(10);
    setBlitzActive(true);
    setBlitzLock(false);
  };

  // Helper to add stars
  const addEarnedStars = (amount) => {
    const updated = stars + amount;
    setStars(updated);
    api.saveProfile({ totalStars: updated });
    setTriggerConfetti(true);
    setTimeout(() => setTriggerConfetti(false), 2000);
  };

  // Memory Matrix Card Handler
  const handleCardClick = (index) => {
    if (
      isMemoryEvaluating ||
      flippedIndices.includes(index) ||
      matchedPairs.includes(index) ||
      flippedIndices.length >= 2
    ) {
      return;
    }

    sound.playPop();
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setIsMemoryEvaluating(true);

      const [firstIdx, secondIdx] = newFlipped;
      if (memoryDeck[firstIdx].icon === memoryDeck[secondIdx].icon) {
        sound.playSuccess();
        const newMatched = [...matchedPairs, firstIdx, secondIdx];
        setMatchedPairs(newMatched);
        setFlippedIndices([]);
        setIsMemoryEvaluating(false);

        if (newMatched.length === memoryDeck.length) {
          setMemoryCompleted(true);
          addEarnedStars(4);
        }
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
          setIsMemoryEvaluating(false);
        }, 800);
      }
    }
  };

  // Animal Game Option Picker
  const handleAnimalPick = (idx) => {
    if (animalLock || animalCompleted) return;
    setAnimalLock(true);

    const q = animalQuestions[animalRound];
    if (idx === q.correctIdx) {
      sound.playSuccess();
      setAnimalFeedback('correct');

      setTimeout(() => {
        setAnimalFeedback(null);
        setAnimalLock(false);

        if (animalRound < animalQuestions.length - 1) {
          setAnimalRound((r) => r + 1);
        } else {
          setAnimalCompleted(true);
          addEarnedStars(3);
        }
      }, 1000);
    } else {
      sound.playGentleOops();
      setAnimalFeedback('wrong');
      setTimeout(() => {
        setAnimalFeedback(null);
        setAnimalLock(false);
      }, 800);
    }
  };

  // Mystery Silhouette Option Picker
  const handleMysteryPick = (optionName) => {
    if (mysteryLock || mysteryCompleted) return;
    setMysteryLock(true);

    const item = mysteryItems[mysteryRound];
    if (optionName === item.answer) {
      sound.playSuccess();
      setMysteryRevealed(true);
      setMysteryFeedback('correct');

      setTimeout(() => {
        setMysteryFeedback(null);
        setMysteryRevealed(false);
        setMysteryLock(false);

        if (mysteryRound < mysteryItems.length - 1) {
          setMysteryRound((r) => r + 1);
        } else {
          setMysteryCompleted(true);
          addEarnedStars(3);
        }
      }, 1200);
    } else {
      sound.playGentleOops();
      setMysteryFeedback('wrong');
      setTimeout(() => {
        setMysteryFeedback(null);
        setMysteryLock(false);
      }, 800);
    }
  };

  // Category Sorter Handler
  const handleSortItem = (targetBasket) => {
    if (sortLock || sortCompleted) return;
    setSortLock(true);

    const item = sortItems[sortIndex];
    if (targetBasket === item.basket) {
      sound.playSuccess();
      setSortFeedback('correct');
      setSortedCount((s) => s + 1);

      setTimeout(() => {
        setSortFeedback(null);
        setSortLock(false);

        if (sortIndex < sortItems.length - 1) {
          setSortIndex((i) => i + 1);
        } else {
          setSortCompleted(true);
          addEarnedStars(3);
        }
      }, 900);
    } else {
      sound.playGentleOops();
      setSortFeedback('wrong');
      setTimeout(() => {
        setSortFeedback(null);
        setSortLock(false);
      }, 800);
    }
  };

  // Counting Safari Handler
  const handleSafariPick = (chosenNum) => {
    if (safariLock || safariCompleted) return;
    setSafariLock(true);

    const q = safariItems[safariRound];
    if (chosenNum === q.count) {
      sound.playSuccess();
      setSafariFeedback('correct');

      setTimeout(() => {
        setSafariFeedback(null);
        setSafariLock(false);

        if (safariRound < safariItems.length - 1) {
          setSafariRound((r) => r + 1);
        } else {
          setSafariCompleted(true);
          addEarnedStars(3);
        }
      }, 1000);
    } else {
      sound.playGentleOops();
      setSafariFeedback('wrong');
      setTimeout(() => {
        setSafariFeedback(null);
        setSafariLock(false);
      }, 800);
    }
  };

  // Color & Shape Blitz Handler
  const handleBlitzPick = (isCorrect) => {
    if (blitzLock || blitzCompleted) return;
    setBlitzLock(true);

    if (isCorrect) {
      sound.playSuccess();
      setBlitzFeedback('correct');

      setTimeout(() => {
        setBlitzFeedback(null);
        setBlitzLock(false);

        if (blitzRound < blitzItems.length - 1) {
          setBlitzRound((r) => r + 1);
          setBlitzTimeLeft(10);
        } else {
          setBlitzCompleted(true);
          addEarnedStars(4);
        }
      }, 800);
    } else {
      sound.playGentleOops();
      setBlitzFeedback('wrong');
      setTimeout(() => {
        setBlitzFeedback(null);
        setBlitzLock(false);
      }, 800);
    }
  };

  // Games Sequence Array
  const gamesList = [
    { id: 'memory-cards', name: 'Memory Matrix', icon: '🃏', color: 'border-amber-400 text-amber-900 dark:text-amber-300' },
    { id: 'animal-match', name: 'Animal Match', icon: '🦁', color: 'border-pink-400 text-pink-900 dark:text-pink-300' },
    { id: 'silhouette-guess', name: 'Shadow Riddle', icon: '🔍', color: 'border-purple-400 text-purple-900 dark:text-purple-300' },
    { id: 'category-sort', name: 'Basket Sorter', icon: '🧺', color: 'border-emerald-400 text-emerald-900 dark:text-emerald-300' },
    { id: 'counting-safari', name: 'Counting Safari', icon: '🧮', color: 'border-sky-400 text-sky-900 dark:text-sky-300' },
    { id: 'color-shape-blitz', name: 'Speed Blitz', icon: '⚡', color: 'border-orange-400 text-orange-900 dark:text-orange-300' }
  ];

  const nextGameSequence = () => {
    const curIdx = gamesList.findIndex((g) => g.id === activeGame);
    const nextIdx = (curIdx + 1) % gamesList.length;
    setActiveGame(gamesList[nextIdx].id);
  };

  return (
    <div className="space-y-6 pt-4 sm:pt-6 animate-fade-in pb-12">
      
      <ConfettiCanvas trigger={triggerConfetti} />

      {/* Header Banner & Mascot */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 card-soft p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-800 dark:text-slate-100">
              Play Zone &amp; Skill Arcade
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>6 Interactive Games</span>
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm">
            Interactive puzzles and skill mini-games designed to strengthen memory, counting, logic, and motor skills!
          </p>
        </div>
        <LumiMascot 
          size="sm" 
          message="Pick any game below to play! Win stars for every completed puzzle."
        />
      </div>

      {/* Game Selector Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {gamesList.map((g) => {
          const isActive = activeGame === g.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => {
                sound.playPop();
                setActiveGame(g.id);
              }}
              className={`btn-bubbly p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 font-display font-bold text-xs sm:text-sm transition-all min-h-[58px] ${
                isActive 
                  ? 'bg-white dark:bg-slate-800 border-amber-400 text-amber-950 dark:text-amber-300 shadow-md scale-105'
                  : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-2xl sm:text-3xl">{g.icon}</span>
              <span className="truncate w-full text-center">{g.name}</span>
            </button>
          );
        })}
      </div>

      {/* GAME 1: MEMORY MATRIX */}
      {activeGame === 'memory-cards' && (
        <div className="card-soft p-5 sm:p-8 bg-white dark:bg-slate-800 border-2 border-amber-200 dark:border-slate-700 shadow-md space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-800 dark:text-slate-100">
                Memory Matrix Flip Game
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Flip two cards at a time to find matching pairs! Moves: {moves} | Matched: {matchedPairs.length / 2} / 6
              </p>
            </div>
            <button
              type="button"
              onClick={() => { sound.playPop(); resetMemoryGame(); }}
              className="btn-bubbly flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Cards</span>
            </button>
          </div>

          {memoryCompleted ? (
            <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-700 text-center space-y-4 animate-fade-in max-w-md mx-auto">
              <span className="text-6xl block animate-bounce">🃏🎉</span>
              <h3 className="font-display font-black text-2xl text-slate-800 dark:text-slate-100">
                Memory Matrix Solved!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                Incredible memory! You matched all pairs in only {moves} moves and earned +4 ⭐ stars!
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => { sound.playPop(); resetMemoryGame(); }}
                  className="btn-bubbly px-6 py-2.5 rounded-2xl bg-amber-400 font-display font-bold text-xs text-amber-950"
                >
                  Play Again
                </button>
                <button
                  type="button"
                  onClick={() => { sound.playPop(); nextGameSequence(); }}
                  className="btn-bubbly px-6 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 font-display font-bold text-xs text-slate-700 dark:text-slate-200"
                >
                  Next Game ➔
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3 max-w-md mx-auto">
              {memoryDeck.map((card, idx) => {
                const isFlipped = flippedIndices.includes(idx) || matchedPairs.includes(idx);
                const isMatched = matchedPairs.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => handleCardClick(idx)}
                    className={`h-22 sm:h-26 rounded-3xl flex items-center justify-center text-3xl sm:text-4xl cursor-pointer select-none transition-all duration-300 transform ${
                      isMatched
                        ? 'bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-300 dark:border-emerald-700 shadow-sm opacity-90'
                        : isFlipped
                        ? 'bg-amber-100 dark:bg-amber-950 border-2 border-amber-300 dark:border-amber-700 shadow-md'
                        : 'bg-gradient-to-tr from-sky-400 to-indigo-500 text-white font-display font-extrabold shadow hover:scale-105'
                    }`}
                  >
                    {isFlipped ? card.icon : '❓'}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* GAME 2: ANIMAL MATCH */}
      {activeGame === 'animal-match' && (
        <div className="card-soft p-5 sm:p-8 bg-white dark:bg-slate-800 border-2 border-pink-200 dark:border-slate-700 shadow-md space-y-5 text-center">
          <div className="flex items-center justify-between pb-2 border-b border-pink-100 dark:border-slate-700">
            <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
              Animal Match • Round {animalRound + 1} of {animalQuestions.length}
            </span>
            <button
              type="button"
              onClick={() => { sound.playPop(); resetAnimalGame(); }}
              className="btn-bubbly flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/60 hover:bg-pink-100 text-pink-800 dark:text-pink-300 font-bold text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {animalCompleted ? (
            <div className="p-8 rounded-3xl bg-pink-50 dark:bg-pink-950/50 border-2 border-pink-300 dark:border-pink-700 text-center space-y-4 animate-fade-in max-w-md mx-auto">
              <span className="text-6xl block animate-bounce">🦁🎉</span>
              <h3 className="font-display font-black text-2xl text-slate-800 dark:text-slate-100">
                Animal Safari Complete!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                You know all the wild animal calls like a true safari ranger! (+3 ⭐ earned)
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => { sound.playPop(); resetAnimalGame(); }}
                  className="btn-bubbly px-6 py-2.5 rounded-2xl bg-pink-500 text-white font-display font-bold text-xs"
                >
                  Play Again
                </button>
                <button
                  type="button"
                  onClick={() => { sound.playPop(); nextGameSequence(); }}
                  className="btn-bubbly px-6 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-display font-bold text-xs"
                >
                  Next Game ➔
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-800 dark:text-slate-100">
                  Who Makes This Wild Call?
                </h2>
                <div className="inline-block px-5 py-2 rounded-full bg-pink-100 dark:bg-pink-950 border border-pink-300 dark:border-pink-800 text-pink-900 dark:text-pink-300 font-display font-extrabold text-lg sm:text-xl mt-1">
                  "{animalQuestions[animalRound].targetSound}"
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  Tap the animal that roars or calls with this sound:
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
                {animalQuestions[animalRound].options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAnimalPick(i)}
                    disabled={animalLock}
                    className="btn-bubbly h-24 sm:h-28 rounded-3xl bg-slate-50 dark:bg-slate-900 hover:bg-pink-50 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 hover:border-pink-300 text-4xl sm:text-5xl flex items-center justify-center shadow-sm disabled:opacity-50"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {animalFeedback && (
                <div className={`text-sm sm:text-base font-bold font-display ${animalFeedback === 'correct' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                  {animalFeedback === 'correct' ? '✨ Wow! That is correct!' : 'Oops! Try again!'}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* GAME 3: SHADOW RIDDLE */}
      {activeGame === 'silhouette-guess' && (
        <div className="card-soft p-5 sm:p-8 bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-slate-700 shadow-md space-y-5 text-center">
          <div className="flex items-center justify-between pb-2 border-b border-purple-100 dark:border-slate-700">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Shadow Riddle • Clue {mysteryRound + 1} of {mysteryItems.length}
            </span>
            <button
              type="button"
              onClick={() => { sound.playPop(); resetMysteryGame(); }}
              className="btn-bubbly flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-800 dark:text-purple-300 font-bold text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {mysteryCompleted ? (
            <div className="p-8 rounded-3xl bg-purple-50 dark:bg-purple-950/50 border-2 border-purple-300 dark:border-purple-700 text-center space-y-4 animate-fade-in max-w-md mx-auto">
              <span className="text-6xl block animate-bounce">🔍✨</span>
              <h3 className="font-display font-black text-2xl text-slate-800 dark:text-slate-100">
                All Riddles Cracked!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                You solved every shadow mystery with sharp detective eyes! (+3 ⭐ earned)
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => { sound.playPop(); resetMysteryGame(); }}
                  className="btn-bubbly px-6 py-2.5 rounded-2xl bg-purple-600 text-white font-display font-bold text-xs"
                >
                  Play Again
                </button>
                <button
                  type="button"
                  onClick={() => { sound.playPop(); nextGameSequence(); }}
                  className="btn-bubbly px-6 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-display font-bold text-xs"
                >
                  Next Game ➔
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-800 dark:text-slate-100">
                Who Am I? Mystery Silhouette
              </h2>

              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-4xl bg-purple-100 dark:bg-purple-950 border-2 border-purple-300 dark:border-purple-800 mx-auto flex items-center justify-center text-6xl shadow-inner transition-all duration-500">
                <span 
                  className={`transition-all duration-500 transform ${
                    mysteryRevealed 
                      ? 'scale-110 filter-none animate-bounce-gentle' 
                      : 'filter brightness-0 contrast-200 opacity-80'
                  }`}
                >
                  {mysteryItems[mysteryRound].icon}
                </span>
              </div>

              <p className="font-display font-bold text-base sm:text-lg text-purple-950 dark:text-purple-200 max-w-md mx-auto">
                "{mysteryItems[mysteryRound].clue}"
              </p>

              <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto">
                {mysteryItems[mysteryRound].options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleMysteryPick(opt)}
                    disabled={mysteryLock}
                    className="btn-bubbly p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-purple-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-display font-bold text-xs sm:text-sm border-2 border-slate-200 dark:border-slate-700 hover:border-purple-300 disabled:opacity-50 min-h-[48px]"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {mysteryFeedback && (
                <div className={`text-sm sm:text-base font-bold font-display ${mysteryFeedback === 'correct' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                  {mysteryFeedback === 'correct' ? '🎉 You cracked the riddle!' : 'Not quite! Try another choice!'}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* GAME 4: CATEGORY SORTER BASKET */}
      {activeGame === 'category-sort' && (
        <div className="card-soft p-5 sm:p-8 bg-white dark:bg-slate-800 border-2 border-emerald-200 dark:border-slate-700 shadow-md space-y-5 text-center">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-100 dark:border-slate-700">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Basket Sorter • {sortedCount} / {sortItems.length}
            </span>
            <button
              type="button"
              onClick={() => { sound.playPop(); resetSortGame(); }}
              className="btn-bubbly flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 font-bold text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {sortCompleted ? (
            <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-300 dark:border-emerald-700 text-center space-y-4 animate-fade-in max-w-md mx-auto">
              <span className="text-6xl block animate-bounce">🧺🥗</span>
              <h3 className="font-display font-black text-2xl text-slate-800 dark:text-slate-100">
                Basket Sorting Champion!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                You correctly sorted healthy foods and sweet treats into their baskets! (+3 ⭐ earned)
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => { sound.playPop(); resetSortGame(); }}
                  className="btn-bubbly px-6 py-2.5 rounded-2xl bg-emerald-600 text-white font-display font-bold text-xs"
                >
                  Play Again
                </button>
                <button
                  type="button"
                  onClick={() => { sound.playPop(); nextGameSequence(); }}
                  className="btn-bubbly px-6 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-display font-bold text-xs"
                >
                  Next Game ➔
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-800 dark:text-slate-100">
                  Healthy Basket Sorter
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Sort each delicious item into the correct basket!
                </p>
              </div>

              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-300 dark:border-amber-700 mx-auto flex flex-col items-center justify-center shadow-md animate-bounce-gentle">
                <span className="text-5xl">{sortItems[sortIndex].icon}</span>
                <span className="font-display font-bold text-xs sm:text-sm text-amber-900 dark:text-amber-300 mt-1">
                  {sortItems[sortIndex].name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => handleSortItem('Healthy Foods')}
                  disabled={sortLock}
                  className="btn-bubbly p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border-2 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 flex flex-col items-center gap-1.5 disabled:opacity-50 min-h-[48px]"
                >
                  <span className="text-3xl">🥗</span>
                  <span className="font-display font-bold text-sm sm:text-base">Healthy Foods</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400">Fruits &amp; Veggies</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSortItem('Sweet Treats')}
                  disabled={sortLock}
                  className="btn-bubbly p-4 rounded-3xl bg-pink-50 dark:bg-pink-950/60 hover:bg-pink-100 border-2 border-pink-300 dark:border-pink-700 text-pink-950 dark:text-pink-200 flex flex-col items-center gap-1.5 disabled:opacity-50 min-h-[48px]"
                >
                  <span className="text-3xl">🧁</span>
                  <span className="font-display font-bold text-sm sm:text-base">Sweet Treats</span>
                  <span className="text-[10px] text-pink-700 dark:text-pink-400">Desserts &amp; Candy</span>
                </button>
              </div>

              {sortFeedback && (
                <div className={`text-sm sm:text-base font-bold font-display ${sortFeedback === 'correct' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                  {sortFeedback === 'correct' ? '🥬 Great choice! Placed into the right basket!' : 'Oops, that belongs in the other basket!'}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* GAME 5: COUNTING SAFARI */}
      {activeGame === 'counting-safari' && (
        <div className="card-soft p-5 sm:p-8 bg-white dark:bg-slate-800 border-2 border-sky-200 dark:border-slate-700 shadow-md space-y-5 text-center">
          <div className="flex items-center justify-between pb-2 border-b border-sky-100 dark:border-slate-700">
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              Counting Safari • Quest {safariRound + 1} of {safariItems.length}
            </span>
            <button
              type="button"
              onClick={() => { sound.playPop(); resetSafariGame(); }}
              className="btn-bubbly flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 text-sky-800 dark:text-sky-300 font-bold text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {safariCompleted ? (
            <div className="p-8 rounded-3xl bg-sky-50 dark:bg-sky-950/50 border-2 border-sky-300 dark:border-sky-700 text-center space-y-4 animate-fade-in max-w-md mx-auto">
              <span className="text-6xl block animate-bounce">🧮🦁</span>
              <h3 className="font-display font-black text-2xl text-slate-800 dark:text-slate-100">
                Counting Safari Master!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                You accurately counted all the safari animals and items! (+3 ⭐ earned)
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => { sound.playPop(); resetSafariGame(); }}
                  className="btn-bubbly px-6 py-2.5 rounded-2xl bg-sky-600 text-white font-display font-bold text-xs"
                >
                  Play Again
                </button>
                <button
                  type="button"
                  onClick={() => { sound.playPop(); nextGameSequence(); }}
                  className="btn-bubbly px-6 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-display font-bold text-xs"
                >
                  Next Game ➔
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-800 dark:text-slate-100">
                  Counting Safari
                </h2>
                <p className="font-display font-bold text-sm sm:text-base text-sky-900 dark:text-sky-300">
                  {safariItems[safariRound].prompt}
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 max-w-md mx-auto flex flex-wrap items-center justify-center gap-3">
                {Array.from({ length: safariItems[safariRound].count }).map((_, i) => (
                  <span key={i} className="text-3xl sm:text-4xl animate-float" style={{ animationDelay: `${i * 0.15}s` }}>
                    {safariItems[safariRound].itemIcon}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSafariPick(num)}
                    disabled={safariLock}
                    className="btn-bubbly w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-sky-300 dark:border-sky-700 hover:bg-sky-100 text-sky-900 dark:text-sky-300 font-display font-black text-lg shadow-sm disabled:opacity-50 min-w-[48px] min-h-[48px]"
                  >
                    {num}
                  </button>
                ))}
              </div>

              {safariFeedback && (
                <div className={`text-sm sm:text-base font-bold font-display ${safariFeedback === 'correct' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                  {safariFeedback === 'correct' ? '🦁 Correct count! You counted like a pro!' : 'Count carefully and try once more!'}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* GAME 6: LIGHTNING BLITZ */}
      {activeGame === 'color-shape-blitz' && (
        <div className="card-soft p-5 sm:p-8 bg-white dark:bg-slate-800 border-2 border-amber-300 dark:border-slate-700 shadow-md space-y-5 text-center">
          <div className="flex items-center justify-between pb-2 border-b border-amber-100 dark:border-slate-700">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Speed Reflex • Round {blitzRound + 1} of {blitzItems.length}
            </span>
            <button
              type="button"
              onClick={() => { sound.playPop(); resetBlitzGame(); }}
              className="btn-bubbly flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-800 dark:text-amber-300 font-bold text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {blitzCompleted ? (
            <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-700 text-center space-y-4 animate-fade-in max-w-md mx-auto">
              <span className="text-6xl block animate-bounce">⚡🏆</span>
              <h3 className="font-display font-black text-2xl text-slate-800 dark:text-slate-100">
                Lightning Blitz Champion!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                Incredible speed reflexes! You correctly identified colors and shapes with lightning accuracy! (+4 ⭐ earned)
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => { sound.playPop(); resetBlitzGame(); }}
                  className="btn-bubbly px-6 py-2.5 rounded-2xl bg-amber-400 font-display font-bold text-xs text-amber-950"
                >
                  Play Again
                </button>
                <button
                  type="button"
                  onClick={() => { sound.playPop(); nextGameSequence(); }}
                  className="btn-bubbly px-6 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 font-display font-bold text-xs text-slate-700 dark:text-slate-200"
                >
                  Next Game ➔
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between max-w-md mx-auto text-xs font-bold text-slate-400 dark:text-slate-500">
                <span>Reflex Timer</span>
                <span className={`font-mono font-bold ${blitzTimeLeft <= 3 ? 'text-rose-600 dark:text-rose-400 animate-pulse' : 'text-amber-600 dark:text-amber-400'}`}>
                  ⏳ {blitzTimeLeft}s left
                </span>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden max-w-md mx-auto">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-1000"
                  style={{ width: `${(blitzTimeLeft / 10) * 100}%` }}
                />
              </div>

              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-amber-900 dark:text-amber-300">
                {blitzItems[blitzRound].prompt}
              </h2>

              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                {blitzItems[blitzRound].options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleBlitzPick(opt.isCorrect)}
                    disabled={blitzLock || !blitzActive}
                    className="btn-bubbly h-24 sm:h-28 rounded-3xl bg-slate-50 dark:bg-slate-900 hover:bg-amber-100 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 hover:border-amber-400 text-4xl sm:text-5xl flex flex-col items-center justify-center shadow-sm disabled:opacity-50"
                  >
                    <span>{opt.icon}</span>
                    <span className="text-[10px] font-display font-bold text-slate-600 dark:text-slate-400 mt-1">{opt.label}</span>
                  </button>
                ))}
              </div>

              {blitzFeedback && (
                <div className={`text-sm sm:text-base font-bold font-display ${blitzFeedback === 'correct' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                  {blitzFeedback === 'correct' ? '⚡ Lightning fast! Correct!' : 'Oops! Blitz again!'}
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
