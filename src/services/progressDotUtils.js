/**
 * Utility for Lesson Progress Dot Visual States
 * 
 * Correct colour rules:
 * 1. Not completed and not the current lesson:
 *    - Grey filled dot
 *    - No orange outline
 * 2. Completed lesson and not the current lesson:
 *    - Green filled dot
 *    - No orange outline
 * 3. Current lesson and not completed:
 *    - Orange filled dot
 *    - Clearly visible orange outline or ring
 *    - Do not allow outline to cover or distort the dot
 * 4. Current lesson that is already completed:
 *    - Green filled dot with a clearly visible orange outline or ring
 *    - Communicates both completion and current selection
 */

export function getProgressDotState(isCur, isDone) {
  const baseClasses = 'w-3.5 h-3.5 rounded-full shrink-0 transition-all duration-200 cursor-pointer';

  if (isCur && isDone) {
    // Rule 4: Current lesson that is already completed
    return {
      state: 'CURRENT_COMPLETED',
      fillColor: 'green',
      hasOrangeRing: true,
      isCompleted: true,
      isCurrent: true,
      classes: `${baseClasses} bg-emerald-500 ring-2 ring-amber-500 dark:ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 shadow-sm`
    };
  }

  if (isCur && !isDone) {
    // Rule 3: Current lesson and not completed
    return {
      state: 'CURRENT_UNCOMPLETED',
      fillColor: 'orange',
      hasOrangeRing: true,
      isCompleted: false,
      isCurrent: true,
      classes: `${baseClasses} bg-amber-500 ring-2 ring-amber-500 dark:ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 shadow-sm`
    };
  }

  if (!isCur && isDone) {
    // Rule 2: Completed lesson and not the current lesson
    return {
      state: 'NON_CURRENT_COMPLETED',
      fillColor: 'green',
      hasOrangeRing: false,
      isCompleted: true,
      isCurrent: false,
      classes: `${baseClasses} bg-emerald-500 hover:bg-emerald-600`
    };
  }

  // Rule 1: Not completed and not the current lesson
  return {
    state: 'NON_CURRENT_UNCOMPLETED',
    fillColor: 'grey',
    hasOrangeRing: false,
    isCompleted: false,
    isCurrent: false,
    classes: `${baseClasses} bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500`
  };
}
