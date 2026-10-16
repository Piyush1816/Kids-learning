import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { sound } from '../services/audioService';
import ConfettiCanvas from '../components/ConfettiCanvas';
import LumiMascot from '../components/LumiMascot';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  Award, 
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '../services/mockData';

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

  useEffect(() => {
    loadQuestions(selectedCategory, selectedDifficulty);
  }, [selectedCategory, selectedDifficulty]);

  const loadQuestions = async (cat, diff) => {
    const list = await api.getQuizQuestions(cat, diff);
    // Shuffle questions
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setShowAnswerResult(false);
    setQuizFinished(false);
    setUserAnswers({});
    setQuizResult(null);
  };

  const currentQ = questions[currentQIndex];

  const handleSelectOption = (idx) => {
    if (showAnswerResult) return;
    sound.playPop();
    setSelectedAnswer(idx);
    setShowAnswerResult(true);

    const isCorrect = idx === currentQ.answerIndex;
    if (isCorrect) {
      sound.playSuccess();
    } else {
      sound.playGentleOops();
    }

    setUserAnswers({
      ...userAnswers,
      [currentQ.id]: idx
    });
  };

  const handleNextQuestion = async () => {
    sound.playPop();
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedAnswer(null);
      setShowAnswerResult(false);
    } else {
      // Finished quiz!
      const finalSubmission = {
        categoryId: selectedCategory,
        difficulty: selectedDifficulty,
        answers: { ...userAnswers, [currentQ.id]: selectedAnswer }
      };
      const result = await api.submitQuiz(finalSubmission);
      setQuizResult(result);
      setQuizFinished(true);

      if (result.scorePercentage >= 70) {
        setTriggerConfetti(true);
        sound.playFanfare();
        setStars(parseInt(localStorage.getItem('ll_stars') || '24', 10));
        setTimeout(() => setTriggerConfetti(false), 2500);
      }
    }
  };

  const handleRetryQuiz = () => {
    sound.playPop();
    loadQuestions(selectedCategory, selectedDifficulty);
  };

  return (
    <div className="space-y-8 py-4">
      <ConfettiCanvas trigger={triggerConfetti} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-800 flex items-center gap-2">
            <span>Quiz Adventure</span>
            <span className="text-2xl">🧩</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm">
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 card-soft p-4 bg-white">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => { sound.playPop(); setSelectedCategory('all'); }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-colors ${
              selectedCategory === 'all' ? 'bg-amber-400 text-amber-950 font-extrabold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {INITIAL_CATEGORIES.slice(0, 5).map((c) => (
            <button
              key={c.id}
              onClick={() => { sound.playPop(); setSelectedCategory(c.id); }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-colors ${
                selectedCategory === c.id ? 'bg-amber-400 text-amber-950 font-extrabold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shrink-0">
          {['Easy', 'Medium', 'Challenge'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => { sound.playPop(); setSelectedDifficulty(lvl); }}
              className={`px-3 py-1.5 rounded-xl font-display font-bold text-xs transition-all ${
                selectedDifficulty === lvl
                  ? 'bg-white text-amber-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

      </div>

      {/* QUIZ INTERACTIVE QUESTION CARD */}
      {!quizFinished && currentQ && (
        <div className="card-soft p-6 sm:p-10 bg-white border-2 border-amber-200 shadow-md space-y-6">
          
          {/* Progress Bar & Counter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Question {currentQIndex + 1} of {questions.length}</span>
              <span className="text-amber-600">Level: {currentQ.difficulty}</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-300"
                style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Icon & Text */}
          <div className="text-center space-y-3 py-2">
            {currentQ.icon && (
              <span className="text-6xl sm:text-7xl block filter drop-shadow-sm animate-bounce-gentle">
                {currentQ.icon}
              </span>
            )}
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-800 max-w-xl mx-auto">
              {currentQ.question}
            </h2>
          </div>

          {/* Multiple Choice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQ.answerIndex;

              let style = 'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-700';
              if (showAnswerResult) {
                if (isCorrect) {
                  style = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                } else if (isSelected && !isCorrect) {
                  style = 'bg-rose-100 border-rose-400 text-rose-950';
                } else {
                  style = 'bg-slate-50 opacity-60 border-slate-200';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={showAnswerResult}
                  className={`btn-bubbly p-4 rounded-2xl border-2 font-display text-base font-bold text-left flex items-center justify-between gap-3 ${style}`}
                >
                  <span>{opt}</span>
                  {showAnswerResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {showAnswerResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout (Revealed upon answering) */}
          {showAnswerResult && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 max-w-xl mx-auto flex items-start gap-3 animate-fade-in">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-display font-bold text-xs uppercase tracking-wide text-amber-800">
                  {selectedAnswer === currentQ.answerIndex ? '✨ Fantastic!' : '💡 Friendly Explanation:'}
                </span>
                <p className="text-xs sm:text-sm font-medium text-amber-950">
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

      {/* QUIZ FINISHED CELEBRATION SUMMARY */}
      {quizFinished && quizResult && (
        <div className="card-soft p-8 sm:p-12 bg-white border-2 border-amber-200 shadow-xl max-w-xl mx-auto text-center space-y-6">
          <span className="text-7xl block animate-bounce">
            {quizResult.scorePercentage >= 80 ? '🏆' : '🌟'}
          </span>

          <div className="space-y-2">
            <h2 className="font-display font-black text-3xl text-slate-800">
              Quiz Adventure Complete!
            </h2>
            <p className="text-slate-600 font-medium text-sm">
              {quizResult.feedbackMessage}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-amber-50 p-4 rounded-3xl border border-amber-200">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Correct</p>
              <p className="font-display font-bold text-xl text-emerald-600">
                {quizResult.correctAnswers} / {quizResult.totalQuestions}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Accuracy</p>
              <p className="font-display font-bold text-xl text-amber-600">
                {quizResult.scorePercentage}%
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Stars Earned</p>
              <p className="font-display font-bold text-xl text-amber-500">
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
