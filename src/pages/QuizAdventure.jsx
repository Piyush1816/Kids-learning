import React, { useState, useEffect, useRef } from 'react';
import { api, normalizeQuizQuestion } from '../services/api';
import { sound } from '../services/audioService';
import ConfettiCanvas from '../components/ConfettiCanvas';
import LumiMascot from '../components/LumiMascot';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '../services/mockData';

const QUIZ_CORRECT_STAR_REWARD = 2;

export default function QuizAdventure({ stars, setStars }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Easy');
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Explicit answer feedback state machine: 'unanswered' | 'correct' | 'incorrect'
  const [feedbackState, setFeedbackState] = useState('unanswered');
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(null);

  const [quizFinished, setQuizFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [awardedQuestionIds, setAwardedQuestionIds] = useState(new Set());
  const [sessionStarsEarned, setSessionStarsEarned] = useState(0);
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);

  const autoAdvanceTimerRef = useRef(null);
  const confettiTimerRef = useRef(null);

  // Clean up pending timers on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      if (confettiTimerRef.current) clearTimeout(confettiTimerRef.current);
    };
  }, []);

  // Load unique questions for session ONLY when category or difficulty changes or explicit restart
  useEffect(() => {
    let isCancelled = false;

    async function initQuizSession() {
      try {
        const rawList = await api.getQuizQuestions(selectedCategory, selectedDifficulty);
        const normalizedList = (Array.isArray(rawList) ? rawList : [])
          .map(normalizeQuizQuestion)
          .filter((q) => q !== null);

        // Deduplicate strictly by stable question ID
        const uniqueMap = new Map();
        normalizedList.forEach((q) => {
          if (q.id && !uniqueMap.has(q.id)) {
            uniqueMap.set(q.id, q);
          }
        });
        const uniqueQuestions = Array.from(uniqueMap.values());

        // Shuffle unique question list once for session
        const shuffled = [...uniqueQuestions].sort(() => Math.random() - 0.5);

        if (!isCancelled) {
          if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
          setQuestions(shuffled);
          setCurrentQIndex(0);
          setFeedbackState('unanswered');
          setSelectedOptionIdx(null);
          setQuizFinished(false);
          setUserAnswers({});
          setQuizResult(null);
          setAwardedQuestionIds(new Set());
          setSessionStarsEarned(0);
          setSessionCorrectCount(0);
        }
      } catch (err) {
        console.error('[QuizAdventure] Error initializing quiz session:', err);
        if (!isCancelled) setQuestions([]);
      }
    }

    initQuizSession();

    return () => {
      isCancelled = true;
    };
  }, [selectedCategory, selectedDifficulty]);

  const currentQ = questions[currentQIndex];

  const handleSelectOption = (idx) => {
    if (feedbackState !== 'unanswered' || !currentQ) return;

    setSelectedOptionIdx(idx);
    const isCorrect = idx === currentQ.answerIndex;

    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: idx
    }));

    if (isCorrect) {
      setFeedbackState('correct');
      try { sound.playSuccess(); } catch (e) {}

      // Award +2 stars exactly once per question ID in session
      if (!awardedQuestionIds.has(currentQ.id)) {
        setAwardedQuestionIds((prev) => new Set(prev).add(currentQ.id));
        setSessionStarsEarned((prev) => prev + QUIZ_CORRECT_STAR_REWARD);
        setSessionCorrectCount((prev) => prev + 1);

        api.addStars(
          QUIZ_CORRECT_STAR_REWARD,
          `Quiz: Correct answer for "${currentQ.questionText.substring(0, 20)}..."`
        );
        if (setStars) {
          setStars(api.getProfile().totalStars);
        }
      }

      setTriggerConfetti(true);
      if (confettiTimerRef.current) clearTimeout(confettiTimerRef.current);
      confettiTimerRef.current = setTimeout(() => setTriggerConfetti(false), 1500);

      // Auto-advance after 1200ms feedback delay or allow user to click Next Question
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = setTimeout(() => {
        advanceToNextQuestion();
      }, 1200);

    } else {
      setFeedbackState('incorrect');
      try { sound.playGentleOops(); } catch (e) {}
    }
  };

  const advanceToNextQuestion = async () => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setFeedbackState('unanswered');
      setSelectedOptionIdx(null);
    } else {
      // Completed final question - compute final submission
      const totalQ = questions.length;
      const finalCorrect = sessionCorrectCount + (feedbackState === 'correct' && !awardedQuestionIds.has(currentQ?.id) ? 1 : 0);
      const pct = totalQ > 0 ? Math.round((finalCorrect / totalQ) * 100) : 0;

      const submission = {
        categoryId: selectedCategory,
        difficulty: selectedDifficulty,
        questions,
        answers: userAnswers,
        correctAnswers: finalCorrect,
        totalQuestions: totalQ,
        scorePercentage: pct,
        sessionStarsEarned
      };

      const result = await api.submitQuiz(submission);
      setQuizResult(result || {
        correctAnswers: finalCorrect,
        totalQuestions: totalQ,
        scorePercentage: pct,
        starsEarned: sessionStarsEarned,
        feedbackMessage: pct >= 80 ? '🌟 Outstanding Quiz Master!' : '👍 Great effort! Keep exploring!'
      });
      setQuizFinished(true);

      if (pct >= 70) {
        setTriggerConfetti(true);
        try { sound.playFanfare(); } catch (e) {}
        if (confettiTimerRef.current) clearTimeout(confettiTimerRef.current);
        confettiTimerRef.current = setTimeout(() => setTriggerConfetti(false), 2500);
      }
    }
  };

  const handleRetryQuestion = () => {
    try { sound.playPop(); } catch (e) {}
    setFeedbackState('unanswered');
    setSelectedOptionIdx(null);
  };

  const handleRestartQuizSession = () => {
    try { sound.playPop(); } catch (e) {}
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    
    // Reshuffle and start clean
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentQIndex(0);
    setFeedbackState('unanswered');
    setSelectedOptionIdx(null);
    setQuizFinished(false);
    setUserAnswers({});
    setQuizResult(null);
    setAwardedQuestionIds(new Set());
    setSessionStarsEarned(0);
    setSessionCorrectCount(0);
  };

  return (
    <div className="space-y-8 py-4 text-slate-800 dark:text-slate-100">
      <ConfettiCanvas trigger={triggerConfetti} />

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>Quiz Adventure</span>
            <span className="text-2xl">🧩</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
            Answer questions, unlock explanations, and earn stars for Lumi's trophy room!
          </p>
        </div>
        <LumiMascot 
          size="sm"
          mood={quizFinished && quizResult?.scorePercentage >= 70 ? 'celebrate' : feedbackState === 'correct' ? 'happy' : 'curious'}
          message={
            quizFinished 
              ? "Look at your amazing quiz score!" 
              : feedbackState === 'correct' 
                ? "✨ Correct! You're brilliant!" 
                : feedbackState === 'incorrect' 
                  ? "Don't worry! Try again or check the hint!" 
                  : "Take your time! You've got this!"
          } 
        />
      </div>

      {/* Filter Toolbar: Category & Difficulty */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 card-soft p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => { try { sound.playPop(); } catch (e) {} setSelectedCategory('all'); }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-colors ${
              selectedCategory === 'all' 
                ? 'bg-amber-400 text-amber-950 font-extrabold shadow-sm' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            All Categories
          </button>
          {INITIAL_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => { try { sound.playPop(); } catch (e) {} setSelectedCategory(c.id); }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-colors ${
                selectedCategory === c.id 
                  ? 'bg-amber-400 text-amber-950 font-extrabold shadow-sm' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl shrink-0">
          {['Easy', 'Medium', 'Challenge'].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => { try { sound.playPop(); } catch (e) {} setSelectedDifficulty(lvl); }}
              className={`px-3 py-1.5 rounded-xl font-display font-bold text-xs transition-all ${
                selectedDifficulty === lvl
                  ? 'bg-white dark:bg-slate-800 text-amber-950 dark:text-amber-300 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

      </div>

      {/* QUIZ INTERACTIVE QUESTION CARD */}
      {!quizFinished && currentQ && (
        <div className="card-soft p-6 sm:p-10 bg-white dark:bg-slate-800 border-2 border-amber-200 dark:border-amber-800/80 shadow-md space-y-6">
          
          {/* Progress Bar & Counter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span>Question {currentQIndex + 1} of {questions.length}</span>
              <div className="flex items-center gap-2">
                <span className="text-amber-600 dark:text-amber-400 font-bold">Level: {currentQ.difficulty}</span>
                {sessionStarsEarned > 0 && (
                  <span className="bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2.5 py-0.5 rounded-full font-extrabold text-[11px] border border-amber-300 dark:border-amber-700">
                    +{sessionStarsEarned} ⭐
                  </span>
                )}
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-300"
                style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Icon & Question Text */}
          <div className="text-center space-y-3 py-2">
            {currentQ.icon && (
              <span className={`text-6xl sm:text-7xl block filter drop-shadow-sm transition-transform duration-300 ${
                feedbackState === 'correct' ? 'scale-110 animate-bounce' : 'animate-bounce-gentle'
              }`}>
                {currentQ.icon}
              </span>
            )}
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-800 dark:text-slate-100 max-w-xl mx-auto leading-relaxed">
              {currentQ.questionText}
            </h2>
          </div>

          {/* Multiple Choice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOptionIdx === idx;
              const isCorrectAnswer = idx === currentQ.answerIndex;

              let style = 'bg-slate-50 dark:bg-slate-900/60 hover:bg-amber-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100';

              if (feedbackState === 'correct') {
                if (isCorrectAnswer) {
                  style = 'bg-emerald-100 dark:bg-emerald-950/90 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-extrabold shadow-md scale-[1.02] transition-transform';
                } else {
                  style = 'bg-slate-50 dark:bg-slate-900/40 opacity-50 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500';
                }
              } else if (feedbackState === 'incorrect') {
                if (isSelected && !isCorrectAnswer) {
                  style = 'bg-rose-100 dark:bg-rose-950/90 border-rose-500 text-rose-950 dark:text-rose-100 font-extrabold shadow-sm';
                } else if (isCorrectAnswer) {
                  style = 'bg-emerald-100 dark:bg-emerald-950/90 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold';
                } else {
                  style = 'bg-slate-50 dark:bg-slate-900/40 opacity-50 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  disabled={feedbackState !== 'unanswered'}
                  className={`btn-bubbly p-4 rounded-2xl border-2 font-display text-base font-bold text-left flex items-center justify-between gap-3 transition-all ${style}`}
                >
                  <span>{opt}</span>
                  {feedbackState === 'correct' && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[3]" />
                  )}
                  {feedbackState === 'incorrect' && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0 stroke-[3]" />
                  )}
                  {feedbackState === 'incorrect' && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout */}
          {feedbackState !== 'unanswered' && (
            <div className={`p-4 rounded-2xl border max-w-xl mx-auto flex items-start gap-3 animate-fade-in ${
              feedbackState === 'correct'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800'
            }`}>
              {feedbackState === 'correct' ? (
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Lightbulb className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 flex-1">
                <span className={`font-display font-bold text-xs uppercase tracking-wide block ${
                  feedbackState === 'correct' ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'
                }`}>
                  {feedbackState === 'correct' ? `Correct! Amazing job! 🎉 (+${QUIZ_CORRECT_STAR_REWARD} ⭐)` : 'Not quite! Try again!'}
                </span>
                <p className={`text-xs sm:text-sm font-medium ${
                  feedbackState === 'correct' ? 'text-emerald-950 dark:text-emerald-100' : 'text-rose-950 dark:text-rose-100'
                }`}>
                  {currentQ.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons: Next / Retry */}
          {feedbackState !== 'unanswered' && (
            <div className="flex items-center justify-center gap-3 pt-2">
              {feedbackState === 'incorrect' && (
                <button
                  type="button"
                  onClick={handleRetryQuestion}
                  className="btn-bubbly px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-display font-bold text-sm border border-slate-300 dark:border-slate-600"
                >
                  Try Question Again
                </button>
              )}
              <button
                type="button"
                onClick={advanceToNextQuestion}
                className="btn-bubbly flex items-center gap-2 px-8 py-3.5 rounded-3xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-display font-bold text-base shadow-lg shadow-orange-300/40"
              >
                <span>{currentQIndex < questions.length - 1 ? 'Next Question' : 'Finish Adventure'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* EMPTY FILTER FALLBACK */}
      {!quizFinished && questions.length === 0 && (
        <div className="card-soft p-8 bg-white dark:bg-slate-800 border-2 border-amber-200 dark:border-amber-800 text-center space-y-4 max-w-md mx-auto">
          <span className="text-5xl block animate-bounce-gentle">🔍</span>
          <h3 className="font-display font-bold text-xl text-slate-800 dark:text-slate-100">
            No questions found for this filter
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Try switching back to All Categories or choose Easy difficulty to find fun questions!
          </p>
          <button
            type="button"
            onClick={() => {
              try { sound.playPop(); } catch (e) {}
              setSelectedCategory('all');
              setSelectedDifficulty('Easy');
            }}
            className="btn-bubbly px-6 py-2.5 rounded-2xl bg-amber-400 font-display font-bold text-xs text-amber-950"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* QUIZ FINISHED CELEBRATION SUMMARY */}
      {quizFinished && quizResult && (
        <div className="card-soft p-8 sm:p-12 bg-white dark:bg-slate-800 border-2 border-amber-200 dark:border-amber-800 shadow-xl max-w-xl mx-auto text-center space-y-6">
          <span className="text-7xl block animate-bounce">
            {quizResult.scorePercentage >= 80 ? '🏆' : '🌟'}
          </span>

          <div className="space-y-2">
            <h2 className="font-display font-black text-3xl text-slate-800 dark:text-slate-100">
              Quiz Adventure Complete!
            </h2>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-sm">
              {quizResult.feedbackMessage}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-amber-50 dark:bg-amber-950/40 p-4 rounded-3xl border border-amber-200 dark:border-amber-800">
            <div>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase">Correct</p>
              <p className="font-display font-bold text-xl text-emerald-600 dark:text-emerald-400">
                {quizResult.correctAnswers} / {quizResult.totalQuestions}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase">Accuracy</p>
              <p className="font-display font-bold text-xl text-amber-600 dark:text-amber-400">
                {quizResult.scorePercentage}%
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase">Stars Earned</p>
              <p className="font-display font-bold text-xl text-amber-500 dark:text-amber-300">
                +{quizResult.starsEarned} ⭐
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRestartQuizSession}
            className="btn-bubbly inline-flex items-center gap-2 px-8 py-3.5 rounded-3xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-display font-bold text-base shadow-md"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Play Quiz Again</span>
          </button>
        </div>
      )}

    </div>
  );
}
