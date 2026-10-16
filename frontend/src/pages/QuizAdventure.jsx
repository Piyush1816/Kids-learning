import React, { useState, useEffect } from 'react';
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
  Filter
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '../services/mockData';

const QUIZ_CORRECT_STAR_REWARD = 2;

export default function QuizAdventure({ stars, setStars }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Easy');
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswerResult, setShowAnswerResult] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [awardedQuestionIds, setAwardedQuestionIds] = useState(new Set());
  const [sessionStarsEarned, setSessionStarsEarned] = useState(0);

  useEffect(() => {
    loadQuestions(selectedCategory, selectedDifficulty);
  }, [selectedCategory, selectedDifficulty]);

  const loadQuestions = async (cat, diff) => {
    try {
      const rawList = await api.getQuizQuestions(cat, diff);
      const normalizedList = (Array.isArray(rawList) ? rawList : [])
        .map(normalizeQuizQuestion)
        .filter((q) => q !== null);

      // Shuffle questions
      const shuffled = [...normalizedList].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setCurrentQIndex(0);
      setSelectedAnswer(null);
      setShowAnswerResult(false);
      setQuizFinished(false);
      setUserAnswers({});
      setQuizResult(null);
      setAwardedQuestionIds(new Set());
      setSessionStarsEarned(0);
    } catch (err) {
      console.error('[QuizAdventure] Error loading quiz questions:', err);
      setQuestions([]);
    }
  };

  const currentQ = questions[currentQIndex];

  const handleSelectOption = (idx) => {
    if (showAnswerResult || !currentQ) return;
    try { sound.playPop(); } catch (e) {}
    setSelectedAnswer(idx);
    setShowAnswerResult(true);

    const isCorrect = idx === currentQ.answerIndex;
    if (isCorrect) {
      try { sound.playSuccess(); } catch (e) {}
      // Prevent duplicate rewards for the same question within the session
      if (!awardedQuestionIds.has(currentQ.id)) {
        setAwardedQuestionIds((prev) => new Set(prev).add(currentQ.id));
        setSessionStarsEarned((prev) => prev + QUIZ_CORRECT_STAR_REWARD);
        api.addStars(
          QUIZ_CORRECT_STAR_REWARD, 
          `Quiz: Correct answer for "${currentQ.questionText.substring(0, 20)}..."`
        );
      }
    } else {
      try { sound.playGentleOops(); } catch (e) {}
    }

    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: idx
    }));
  };

  const handleNextQuestion = async () => {
    try { sound.playPop(); } catch (e) {}
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowAnswerResult(false);
    } else {
      // Finished quiz!
      const finalAnswers = { ...userAnswers, [currentQ.id]: selectedAnswer };
      const finalSubmission = {
        categoryId: selectedCategory,
        difficulty: selectedDifficulty,
        questions: questions,
        answers: finalAnswers,
        sessionStarsEarned
      };
      const result = await api.submitQuiz(finalSubmission);
      setQuizResult(result);
      setQuizFinished(true);

      if (result && result.scorePercentage >= 70) {
        setTriggerConfetti(true);
        try { sound.playFanfare(); } catch (e) {}
        setTimeout(() => setTriggerConfetti(false), 2500);
      }
    }
  };

  const handleRetryQuiz = () => {
    try { sound.playPop(); } catch (e) {}
    loadQuestions(selectedCategory, selectedDifficulty);
  };

  return (
    <div className="space-y-8 py-4 text-slate-800 dark:text-slate-100">
      <ConfettiCanvas trigger={triggerConfetti} />

      {/* Header */}
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
          mood={quizFinished && quizResult?.scorePercentage >= 70 ? 'celebrate' : 'happy'}
          message={quizFinished ? "Look at your amazing quiz score!" : "Take your time! You've got this!"} 
        />
      </div>

      {/* Filter Toolbar: Category & Difficulty */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 card-soft p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => { try { sound.playPop(); } catch (e) {} setSelectedCategory('all'); }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-colors ${
              selectedCategory === 'all' 
                ? 'bg-amber-400 text-amber-950 font-extrabold' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            All Categories
          </button>
          {INITIAL_CATEGORIES.map((c) => (
            <button
              key={c.id}
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
              <span className="text-amber-600 dark:text-amber-400 font-bold">Level: {currentQ.difficulty}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-300"
                style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Icon & Explicit Statement Text */}
          <div className="text-center space-y-3 py-2">
            {currentQ.icon && (
              <span className="text-6xl sm:text-7xl block filter drop-shadow-sm animate-bounce-gentle">
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
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQ.answerIndex;

              let style = 'bg-slate-50 dark:bg-slate-900/60 hover:bg-amber-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100';
              if (showAnswerResult) {
                if (isCorrect) {
                  style = 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-400 dark:border-emerald-600 text-emerald-950 dark:text-emerald-200 font-bold';
                } else if (isSelected && !isCorrect) {
                  style = 'bg-rose-100 dark:bg-rose-950/80 border-rose-400 dark:border-rose-600 text-rose-950 dark:text-rose-200 font-bold';
                } else {
                  style = 'bg-slate-50 dark:bg-slate-900/40 opacity-60 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={showAnswerResult}
                  className={`btn-bubbly p-4 rounded-2xl border-2 font-display text-base font-bold text-left flex items-center justify-between gap-3 transition-all ${style}`}
                >
                  <span>{opt}</span>
                  {showAnswerResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                  {showAnswerResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout (Revealed upon answering) */}
          {showAnswerResult && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 max-w-xl mx-auto flex items-start gap-3 animate-fade-in">
              <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-display font-bold text-xs uppercase tracking-wide text-amber-800 dark:text-amber-300">
                  {selectedAnswer === currentQ.answerIndex ? `✨ Fantastic! (+${QUIZ_CORRECT_STAR_REWARD} ⭐ Earned)` : '💡 Friendly Explanation:'}
                </span>
                <p className="text-xs sm:text-sm font-medium text-amber-950 dark:text-amber-100">
                  {currentQ.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Bottom Action: Next Button */}
          {showAnswerResult && (
            <div className="flex justify-center pt-2">
              <button
                onClick={handleNextQuestion}
                className="btn-bubbly flex items-center gap-2 px-8 py-3.5 rounded-3xl bg-gradient-to-r from-amber-400 to-orange-400 text-white font-display font-bold text-base shadow-lg shadow-orange-300/40"
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
            onClick={handleRetryQuiz}
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
