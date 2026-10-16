import React, { useState } from 'react';
import { sound } from '../services/audioService';

export default function LumiMascot({ message = "Hi friend! I'm Lumi! Let's learn something fun today!", mood = 'happy', size = 'md' }) {
  const [bouncing, setBouncing] = useState(false);

  const handleTap = () => {
    setBouncing(true);
    sound.playPop();
    sound.speak("Hi there! You are doing awesome!");
    setTimeout(() => setBouncing(false), 800);
  };

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 md:w-28 md:h-28',
    lg: 'w-36 h-36 md:w-44 md:h-44'
  };

  return (
    <div className="flex items-center gap-3 sm:gap-4 select-none">
      {/* Animated Lumi SVG Mascot */}
      <div 
        onClick={handleTap}
        className={`relative cursor-pointer transition-transform duration-300 hover:scale-110 ${bouncing ? 'animate-bounce' : 'animate-float'} ${sizeClasses[size] || sizeClasses.md}`}
        title="Tap Lumi for a cheerful hello!"
      >
        <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
          {/* Fox Ears */}
          <polygon points="35,65 15,10 65,35" fill="#FB923C" stroke="#EA580C" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="30,55 22,25 55,38" fill="#FFEDD5" />
          <polygon points="125,65 145,10 95,35" fill="#FB923C" stroke="#EA580C" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="130,55 138,25 105,38" fill="#FFEDD5" />

          {/* Fox Head */}
          <ellipse cx="80" cy="85" rx="55" ry="48" fill="#FB923C" stroke="#EA580C" strokeWidth="3" />
          
          {/* White Cheeks */}
          <path d="M 28 85 C 28 120, 60 128, 80 128 C 100 128, 132 120, 132 85 C 120 105, 100 115, 80 115 C 60 115, 40 105, 28 85 Z" fill="#FFFBEB" />

          {/* Eyes */}
          {mood === 'celebrate' ? (
            <>
              {/* Happy squint eyes */}
              <path d="M 52 75 Q 60 65 68 75" fill="none" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
              <path d="M 92 75 Q 100 65 108 75" fill="none" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Big friendly curious eyes */}
              <circle cx="60" cy="74" r="8" fill="#1E293B" />
              <circle cx="58" cy="71" r="2.5" fill="#FFFFFF" />
              <circle cx="100" cy="74" r="8" fill="#1E293B" />
              <circle cx="98" cy="71" r="2.5" fill="#FFFFFF" />
            </>
          )}

          {/* Cute Rosy Cheeks */}
          <circle cx="44" cy="90" r="7" fill="#FDA4AF" opacity="0.6" />
          <circle cx="116" cy="90" r="7" fill="#FDA4AF" opacity="0.6" />

          {/* Nose */}
          <polygon points="74,93 86,93 80,101" fill="#1E293B" />

          {/* Smile */}
          <path d="M 74 105 Q 80 112 86 105" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />

          {/* Cute Tuft of Forehead Hair */}
          <path d="M 75 42 Q 80 32 85 42 Q 80 38 75 42" fill="#EA580C" />
        </svg>

        {/* Tap me indicator badge */}
        <span className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
          Tap Me!
        </span>
      </div>

      {/* Lumi's Speech Bubble */}
      {message && (
        <div className="relative bg-white dark:bg-slate-800 border-2 border-amber-200 dark:border-amber-700 text-slate-800 dark:text-slate-100 rounded-2xl px-4 py-2.5 shadow-sm max-w-xs sm:max-w-md animate-fade-in">
          {/* Bubble pointer */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white dark:border-r-slate-800 z-10" />
          <div className="absolute -left-[11px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[9px] border-t-transparent border-b-[9px] border-b-transparent border-r-[9px] border-r-amber-200 dark:border-r-amber-700" />
          
          <div className="flex items-center gap-1.5 font-bold text-xs text-amber-600 dark:text-amber-400 mb-0.5">
            <span>🦊 Lumi says:</span>
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-snug">
            {message}
          </p>
        </div>
      )}
    </div>
  );
}
