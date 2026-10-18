import {
  INITIAL_CATEGORIES,
  ALPHABETS_DATA,
  NUMBERS_DATA,
  COLORS_DATA,
  SHAPES_DATA,
  ANIMALS_DATA,
  FRUITS_VEGGIES_DATA,
  VEHICLES_DATA,
  BODY_PARTS_DATA,
  QUIZ_QUESTIONS,
  BADGES_DATA,
  INITIAL_DAILY_CHALLENGES,
  ALL_LESSONS
} from './mockData.js';

const BASE_URL = '/api';

export function normalizeQuizQuestion(q) {
  if (!q || typeof q !== 'object') return null;

  const questionText = String(
    q.questionText ||
    q.question ||
    q.text ||
    q.prompt ||
    q.title ||
    q.statement ||
    ''
  ).trim();

  const icon = String(
    q.illustration ||
    q.icon ||
    q.emoji ||
    q.image ||
    ''
  ).trim();

  const category = String(
    q.categoryId ||
    q.category ||
    'all'
  ).trim();

  const difficulty = String(
    q.difficulty ||
    'Easy'
  ).trim();

  const options = Array.isArray(q.options)
    ? q.options.map((opt) => String(opt || '').trim()).filter((opt) => opt.length > 0)
    : [];

  let answerIndex = -1;
  if (typeof q.correctAnswerIndex === 'number') {
    answerIndex = q.correctAnswerIndex;
  } else if (typeof q.answerIndex === 'number') {
    answerIndex = q.answerIndex;
  } else if (typeof q.correctIndex === 'number') {
    answerIndex = q.correctIndex;
  }

  const explanation = String(q.explanation || q.desc || 'Great job answering!').trim();

  if (!questionText) {
    console.warn('[QuizValidation] Discarded question due to missing questionText:', q);
    return null;
  }
  if (!options || options.length < 2) {
    console.warn('[QuizValidation] Discarded question due to insufficient options:', q);
    return null;
  }
  if (answerIndex < 0 || answerIndex >= options.length) {
    console.warn('[QuizValidation] Discarded question due to out-of-bounds answerIndex:', q);
    return null;
  }

  return {
    id: String(q.id || `q-${Math.random().toString(36).substring(2, 9)}`),
    category,
    difficulty,
    questionText,
    icon,
    options,
    answerIndex,
    explanation,
    raw: q
  };
}

// Set of all canonical IDs for fast O(1) lookup
const CANONICAL_LESSON_IDS = new Set(ALL_LESSONS.map((l) => l.id));

// Map of lowercased IDs to canonical ID
const LOWERCASE_TO_CANONICAL = new Map(
  ALL_LESSONS.map((l) => [l.id.toLowerCase(), l.id])
);

export function parseRawCompletedList(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;

  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        return parseRawCompletedList(parsed);
      } catch {}
    }
    return trimmed.split(/[\s,]+/).filter(Boolean);
  }

  if (typeof raw === 'object' && raw !== null) {
    if (Array.isArray(raw.completedLessonIds)) {
      return parseRawCompletedList(raw.completedLessonIds);
    }
    const result = [];
    Object.entries(raw).forEach(([k, v]) => {
      if (v) result.push(k);
    });
    return result;
  }

  return [];
}

export function resolveCanonicalLessonId(rawInput) {
  if (!rawInput) return null;
  const rawStr = String(typeof rawInput === 'object' && rawInput !== null ? (rawInput.id || rawInput.lessonId || '') : rawInput).trim();
  if (!rawStr) return null;

  // 1. Direct match
  if (CANONICAL_LESSON_IDS.has(rawStr)) return rawStr;

  // 2. Case-insensitive match
  const lower = rawStr.toLowerCase();
  if (LOWERCASE_TO_CANONICAL.has(lower)) return LOWERCASE_TO_CANONICAL.get(lower);

  // 3. Category prefix migration patterns
  if (lower.startsWith('alpha') || lower.startsWith('alphabet') || lower.startsWith('letter')) {
    const letterMatch = lower.match(/([a-z])$/);
    if (letterMatch) {
      const candidate = `alpha-${letterMatch[1]}`;
      if (CANONICAL_LESSON_IDS.has(candidate)) return candidate;
    }
    const numMatch = lower.match(/\d+/);
    if (numMatch) {
      const idx = parseInt(numMatch[0], 10) - 1;
      const alphaLessons = ALL_LESSONS.filter((l) => l.categoryId === 'alphabets');
      if (idx >= 0 && idx < alphaLessons.length) return alphaLessons[idx].id;
    }
  }

  // Generic category index migration: {categoryId}-{1-indexed-number}
  const parts = lower.split(/[-_]/);
  if (parts.length >= 2) {
    const catPart = parts[0];
    const idxPart = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(idxPart)) {
      const matchedCat = INITIAL_CATEGORIES.find(
        (c) => c.id.toLowerCase().startsWith(catPart) || catPart.startsWith(c.id.toLowerCase())
      );
      if (matchedCat) {
        const catLessons = ALL_LESSONS.filter((l) => l.categoryId === matchedCat.id);
        const targetIdx = idxPart > 0 ? idxPart - 1 : 0;
        if (catLessons[targetIdx]) return catLessons[targetIdx].id;
      }
    }
  }

  // 4. Match title or name or letter
  const titleMatch = ALL_LESSONS.find(
    (l) =>
      (l.title && l.title.toLowerCase() === lower) ||
      (l.name && l.name.toLowerCase() === lower) ||
      (l.letter && l.letter.toLowerCase() === lower)
  );
  if (titleMatch) return titleMatch.id;

  return null;
}

class ApiService {
  constructor() {
    this.isBackendOnline = false;
    this.connectionChecked = false;
    this.listeners = new Set();
    this.initLocalStorage();
    this.checkBackendHealth();
  }

  initLocalStorage() {
    if (typeof localStorage === 'undefined') return;

    if (localStorage.getItem('ll_stars') === null) {
      localStorage.setItem('ll_stars', '24');
    }
    if (localStorage.getItem('ll_completed_lessons') === null) {
      localStorage.setItem('ll_completed_lessons', JSON.stringify(['alpha-a', 'alpha-b', 'num-1']));
    }
    if (localStorage.getItem('ll_badges') === null) {
      localStorage.setItem('ll_badges', JSON.stringify(BADGES_DATA));
    }
    if (localStorage.getItem('ll_challenges') === null) {
      localStorage.setItem('ll_challenges', JSON.stringify(INITIAL_DAILY_CHALLENGES));
    }
    if (localStorage.getItem('ll_history') === null) {
      localStorage.setItem('ll_history', JSON.stringify([
        'Learned letter A with Lumi',
        'Counted 5 stars on abacus',
        'Mixed Yellow and Blue into Green'
      ]));
    }
    this.initCategoryProgress();
  }

  subscribe(listener) {
    if (typeof listener === 'function') {
      this.listeners.add(listener);
    }
    return () => {
      if (typeof listener === 'function') {
        this.listeners.delete(listener);
      }
    };
  }

  notifyListeners() {
    this.listeners.forEach((fn) => {
      try {
        if (typeof fn === 'function') {
          fn({
            isOnline: this.isBackendOnline,
            checked: this.connectionChecked
          });
        }
      } catch (e) {
        console.error('Error notifying listener', e);
      }
    });
  }

  async checkBackendHealth() {
    try {
      const res = await fetch(`${BASE_URL}/health`, {
        method: 'GET',
        signal: typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function' 
          ? AbortSignal.timeout(1500) 
          : undefined
      });
      const contentType = res.headers.get('content-type') || '';
      this.isBackendOnline = res.ok && contentType.includes('application/json');
    } catch {
      this.isBackendOnline = false;
    } finally {
      this.connectionChecked = true;
      this.notifyListeners();
    }
  }



  // --- Per-Category Progress & Position Persistence ---
  initCategoryProgress() {
    if (typeof localStorage === 'undefined') return {};
    let existing = {};
    try {
      const raw = localStorage.getItem('ll_category_progress');
      if (raw) existing = JSON.parse(raw) || {};
    } catch {
      existing = {};
    }

    let completedList = [];
    try {
      const rawComp = localStorage.getItem('ll_completed_lessons');
      const rawParsed = parseRawCompletedList(rawComp);
      completedList = rawParsed.map((id) => resolveCanonicalLessonId(id)).filter(Boolean);
    } catch {
      completedList = [];
    }

    const merged = {};
    INITIAL_CATEGORIES.forEach((cat) => {
      const catLessons = ALL_LESSONS.filter((l) => l.categoryId === cat.id);
      const totalLessons = catLessons.length || cat.count || 20;
      const prev = existing[cat.id] || {};

      // Retain or build completedLessonIds for this category
      const catLessonIdSet = new Set(catLessons.map((l) => l.id));
      const prevCompleted = parseRawCompletedList(prev.completedLessonIds)
        .map((id) => resolveCanonicalLessonId(id))
        .filter(Boolean);
      const fromGlobal = completedList.filter((id) => catLessonIdSet.has(id));
      const combinedCompleted = Array.from(new Set([...prevCompleted, ...fromGlobal]));

      // Preserve last visited index if valid
      let lastVisitedIndex = 0;
      if (typeof prev.lastVisitedIndex === 'number' && prev.lastVisitedIndex >= 0 && prev.lastVisitedIndex < totalLessons) {
        lastVisitedIndex = prev.lastVisitedIndex;
      }
      let lastVisitedLessonId = prev.lastVisitedLessonId || (catLessons[lastVisitedIndex]?.id || null);

      merged[cat.id] = {
        categoryId: cat.id,
        categoryName: cat.name,
        lastVisitedIndex,
        lastVisitedLessonId,
        completedLessonIds: combinedCompleted,
        totalLessons,
        isCompleted: combinedCompleted.length >= totalLessons && totalLessons > 0,
        lastUpdated: prev.lastUpdated || Date.now()
      };
    });

    try {
      localStorage.setItem('ll_category_progress', JSON.stringify(merged));
    } catch (e) {
      console.error('Failed to write ll_category_progress', e);
    }
    return merged;
  }

  getAllCategoryProgress() {
    if (typeof localStorage === 'undefined') return {};
    try {
      const raw = localStorage.getItem('ll_category_progress');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {}
    return this.initCategoryProgress();
  }

  getCategoryProgress(categoryId) {
    if (!categoryId) return null;
    const all = this.getAllCategoryProgress();
    if (all && all[categoryId]) {
      return all[categoryId];
    }
    const fresh = this.initCategoryProgress();
    if (fresh[categoryId]) return fresh[categoryId];

    const catLessons = ALL_LESSONS.filter((l) => l.categoryId === categoryId);
    return {
      categoryId,
      lastVisitedIndex: 0,
      lastVisitedLessonId: catLessons[0]?.id || null,
      completedLessonIds: [],
      totalLessons: catLessons.length || 20,
      isCompleted: false,
      lastUpdated: Date.now()
    };
  }

  saveCategoryPosition(categoryId, cardIndex, lessonId = null) {
    if (typeof localStorage === 'undefined' || !categoryId) return null;
    const all = this.getAllCategoryProgress();
    const catLessons = ALL_LESSONS.filter((l) => l.categoryId === categoryId);
    const maxIdx = Math.max(0, catLessons.length - 1);
    const safeIdx = Math.max(0, Math.min(Number(cardIndex) || 0, maxIdx));
    const safeLessonId = lessonId || (catLessons[safeIdx]?.id || null);

    const prev = all[categoryId] || {
      categoryId,
      completedLessonIds: [],
      totalLessons: catLessons.length,
      isCompleted: false
    };

    all[categoryId] = {
      ...prev,
      lastVisitedIndex: safeIdx,
      lastVisitedLessonId: safeLessonId,
      lastUpdated: Date.now()
    };

    try {
      localStorage.setItem('ll_category_progress', JSON.stringify(all));
    } catch (e) {
      console.error('Failed to save category position', e);
    }

    this.notifyListeners();
    return all[categoryId];
  }

  resetCategoryReview(categoryId) {
    if (typeof localStorage === 'undefined' || !categoryId) return null;
    const catLessons = ALL_LESSONS.filter((l) => l.categoryId === categoryId);
    return this.saveCategoryPosition(categoryId, 0, catLessons[0]?.id || null);
  }

  // --- Categories & Lessons ---
  // Shared authoritative category progress getter
  getCategoryProgressSummary() {
    return this.getCategoriesSync();
  }

  async getCategories() {
    return this.getCategoriesSync();
  }

  getCategoriesSync() {
    const completedList = this.getCompletedLessons();
    const completedSet = new Set(completedList);
    const catProgMap = this.getAllCategoryProgress();

    return INITIAL_CATEGORIES.map((cat) => {
      const catLessons = ALL_LESSONS.filter((l) => l.categoryId === cat.id);
      const realCount = catLessons.length || cat.count || 20;
      const prog = catProgMap[cat.id] || {};

      const progCompleted = Array.isArray(prog.completedLessonIds) ? prog.completedLessonIds : [];
      progCompleted.forEach((id) => completedSet.add(id));

      const catLessonIdSet = new Set(catLessons.map((l) => l.id));
      const completedCount = Array.from(completedSet).filter((id) => catLessonIdSet.has(id)).length;
      const safeCompleted = Math.min(completedCount, realCount);
      const percentage = realCount > 0 ? Math.min(100, Math.round((safeCompleted / realCount) * 100)) : 0;

      return {
        ...cat,
        id: cat.id,
        name: cat.name,
        count: realCount,
        lessonCount: realCount,
        totalLessons: realCount,
        completed: safeCompleted,
        completedCount: safeCompleted,
        percentage,
        pct: percentage,
        lastVisitedIndex: typeof prog.lastVisitedIndex === 'number' ? prog.lastVisitedIndex : 0,
        lastVisitedLessonId: prog.lastVisitedLessonId || null,
        isCompleted: safeCompleted >= realCount && realCount > 0
      };
    });
  }

  async getAllLessons() {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${BASE_URL}/lessons`);
        if (res.ok) return await res.json();
      } catch {
        this.isBackendOnline = false;
        this.notifyListeners();
      }
    }
    return ALL_LESSONS;
  }

  getAllLessonsSync() {
    return ALL_LESSONS;
  }

  getLessonsSync(category) {
    switch (category) {
      case 'alphabets': return ALPHABETS_DATA;
      case 'numbers': return NUMBERS_DATA;
      case 'colors': return COLORS_DATA;
      case 'shapes': return SHAPES_DATA;
      case 'animals': return ANIMALS_DATA;
      case 'fruits-veggies': return FRUITS_VEGGIES_DATA;
      case 'vehicles': return VEHICLES_DATA;
      case 'body-parts': return BODY_PARTS_DATA;
      default: return ALL_LESSONS;
    }
  }

  async getLessons(category) {
    if (this.isBackendOnline) {
      try {
        const url = category && category !== 'all' ? `${BASE_URL}/lessons?category=${category}` : `${BASE_URL}/lessons`;
        const res = await fetch(url);
        if (res.ok) {
          const remoteData = await res.json();
          if (Array.isArray(remoteData) && remoteData.length > 0) {
            return remoteData.map((item, idx) => {
              const canonical = ALL_LESSONS.find(
                (l) => l.id === item.id || l.id === item.lessonId || (l.categoryId === (item.categoryId || category) && l.orderIndex === (item.orderIndex || idx + 1))
              );
              return {
                ...(canonical || {}),
                ...item,
                id: canonical ? canonical.id : (item.id || item.lessonId || `${category}-${idx + 1}`),
                categoryId: canonical ? canonical.categoryId : (item.categoryId || category)
              };
            });
          }
        }
      } catch {
        this.isBackendOnline = false;
        this.notifyListeners();
      }
    }

    return this.getLessonsSync(category);
  }

  // --- Quizzes ---
  async getQuizQuestions(category, difficulty = 'all') {
    let rawList = [];
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${BASE_URL}/quizzes?category=${category}&difficulty=${difficulty}`);
        if (res.ok) rawList = await res.json();
      } catch {
        this.isBackendOnline = false;
        this.notifyListeners();
      }
    }

    if (!rawList || !Array.isArray(rawList) || rawList.length === 0) {
      // Filter local questions
      rawList = QUIZ_QUESTIONS.filter((q) => {
        const catMatch = !category || category === 'all' || q.category === category;
        const diffMatch = !difficulty || difficulty === 'all' || q.difficulty === difficulty;
        return catMatch && diffMatch;
      });
    }

    // Normalize and filter out invalid/malformed questions
    return rawList
      .map(normalizeQuizQuestion)
      .filter((q) => q !== null);
  }

  async submitQuiz(submission) {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${BASE_URL}/quizzes/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission)
        });
        if (res.ok) {
          const result = await res.json();
          return { ...result, source: 'Spring Boot (Java 21 Backend)' };
        }
      } catch {
        this.isBackendOnline = false;
        this.notifyListeners();
      }
    }

    // Local grading
    let correct = 0;
    const questionsList = Array.isArray(submission.questions) && submission.questions.length > 0
      ? submission.questions
      : QUIZ_QUESTIONS.map(normalizeQuizQuestion).filter(Boolean);

    const total = questionsList.length || Object.keys(submission.answers || {}).length;
    const reviews = [];

    questionsList.forEach((q) => {
      if (q && submission.answers && submission.answers[q.id] !== undefined) {
        const selected = submission.answers[q.id];
        const isRight = selected === q.answerIndex;
        if (isRight) correct++;
        reviews.push({
          questionId: q.id,
          questionText: q.questionText,
          selectedIndex: selected,
          correctIndex: q.answerIndex,
          isCorrect: isRight,
          explanation: q.explanation
        });
      }
    });

    const scorePct = total > 0 ? (correct / total) * 100 : 0;
    const starsEarned = typeof submission.sessionStarsEarned === 'number' 
      ? submission.sessionStarsEarned 
      : correct * 2;

    return {
      totalQuestions: total,
      correctAnswers: correct,
      scorePercentage: Math.round(scorePct),
      starsEarned,
      feedbackMessage: scorePct >= 80 
        ? 'Superstar! Lumi is doing a happy celebration dance!' 
        : scorePct >= 50
          ? 'Great job! You answered most questions correctly!'
          : 'Good effort! Keep practicing, little explorer!',
      reviews,
      source: 'Client Offline Engine (Demo Mode)'
    };
  }

  // --- Progress & Stars ---
  getProfile() {
    const stars = parseInt(localStorage.getItem('ll_stars') || '24', 10);
    const completed = JSON.parse(localStorage.getItem('ll_completed_lessons') || '[]');
    const badges = this.getBadges();
    const unlockedBadges = badges.filter((b) => b.unlocked).length;
    const completedPractices = this.getCompletedPractices();

    return {
      name: 'Little Explorer',
      avatar: '🦊',
      totalStars: stars,
      badgesEarned: unlockedBadges,
      completedLessonsCount: completed.length,
      completedPracticesCount: completedPractices.length,
      streakDays: 4,
      timeSpentMinutes: 48,
      quizAccuracy: 94.2
    };
  }

  getCompletedPractices() {
    if (typeof localStorage === 'undefined') return [];
    try {
      const raw = localStorage.getItem('ll_completed_practices');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('[api.getCompletedPractices] Error reading ll_completed_practices:', e);
    }
    return [];
  }

  isPracticeCompleted(lessonId) {
    if (!lessonId) return false;
    const list = this.getCompletedPractices();
    return list.includes(lessonId);
  }

  recordPracticeReward(lessonId, categoryId = null, lessonTitle = '') {
    if (!lessonId) return { awarded: false, starsEarned: 0, totalStars: this.getProfile().totalStars };
    const list = this.getCompletedPractices();
    if (list.includes(lessonId)) {
      return { awarded: false, starsEarned: 0, totalStars: this.getProfile().totalStars };
    }

    list.push(lessonId);
    try {
      localStorage.setItem('ll_completed_practices', JSON.stringify(list));
    } catch (e) {
      console.error('[api.recordPracticeReward] Error saving ll_completed_practices:', e);
    }

    const titleStr = lessonTitle || lessonId;
    this.addStars(2, `Quick Practice: ${titleStr}`);

    if (this.isBackendOnline) {
      fetch(`${BASE_URL}/progress/practice-reward?lessonId=${encodeURIComponent(lessonId)}`, {
        method: 'POST'
      }).catch(() => {});
    }

    return { awarded: true, starsEarned: 2, totalStars: this.getProfile().totalStars };
  }

  addStars(count, activityName) {
    if (count <= 0) return;
    const current = parseInt(localStorage.getItem('ll_stars') || '24', 10);
    const newTotal = current + count;
    localStorage.setItem('ll_stars', newTotal.toString());

    // Update history stack (DSA ActivityStack simulation in localStorage)
    const history = JSON.parse(localStorage.getItem('ll_history') || '[]');
    history.unshift(`${activityName} (+${count} ⭐)`);
    if (history.length > 40) history.pop();
    localStorage.setItem('ll_history', JSON.stringify(history));

    // Check badge unlocks
    const badges = this.getBadges();
    let changed = false;
    badges.forEach((b) => {
      if (!b.unlocked && newTotal >= b.requiredStars) {
        b.unlocked = true;
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem('ll_badges', JSON.stringify(badges));
    }
    this.notifyListeners();
  }

  markLessonComplete(lessonId, categoryId = null) {
    if (!lessonId) return false;
    const targetId = typeof lessonId === 'object' && lessonId ? lessonId.id : String(lessonId);
    const canonicalTargetId = resolveCanonicalLessonId(targetId) || targetId;

    const completed = this.getCompletedLessons();

    // Determine category ID if not provided
    let catId = categoryId;
    if (!catId) {
      const foundLesson = ALL_LESSONS.find((l) => l.id === canonicalTargetId);
      if (foundLesson) catId = foundLesson.categoryId;
    }

    if (!completed.includes(canonicalTargetId)) {
      completed.push(canonicalTargetId);
      try {
        localStorage.setItem('ll_completed_lessons', JSON.stringify(completed));
      } catch {}

      // Update category-level progress
      if (catId) {
        const all = this.getAllCategoryProgress();
        const catProg = all[catId] || {
          categoryId: catId,
          lastVisitedIndex: 0,
          completedLessonIds: [],
          totalLessons: ALL_LESSONS.filter((l) => l.categoryId === catId).length,
          isCompleted: false
        };
        const currentCompletedSet = new Set(
          parseRawCompletedList(catProg.completedLessonIds).map((i) => resolveCanonicalLessonId(i) || String(i))
        );
        currentCompletedSet.add(canonicalTargetId);
        const updatedCompletedList = Array.from(currentCompletedSet);
        const totalCatLessons = ALL_LESSONS.filter((l) => l.categoryId === catId).length || 20;
        const isDone = updatedCompletedList.length >= totalCatLessons;

        all[catId] = {
          ...catProg,
          completedLessonIds: updatedCompletedList,
          totalLessons: totalCatLessons,
          isCompleted: isDone,
          lastUpdated: Date.now()
        };

        try {
          localStorage.setItem('ll_category_progress', JSON.stringify(all));
        } catch {}
      }

      this.addStars(3, `Learned lesson ${canonicalTargetId}`);
      if (this.isBackendOnline) {
        fetch(`${BASE_URL}/progress/complete-lesson?lessonId=${encodeURIComponent(canonicalTargetId)}`, {
          method: 'POST'
        }).catch(() => {});
      }
      this.notifyListeners();
      return true; // Newly completed
    }
    return false; // Already completed previously
  }

  isLessonCompleted(lessonId) {
    if (!lessonId) return false;
    const targetId = typeof lessonId === 'object' && lessonId ? lessonId.id : String(lessonId);
    const canonicalTargetId = resolveCanonicalLessonId(targetId) || targetId;
    const completed = this.getCompletedLessons();
    return completed.includes(canonicalTargetId);
  }

  getCompletedLessons() {
    if (typeof localStorage === 'undefined') return [];
    const completedSet = new Set();

    // 1. Read ll_completed_lessons
    try {
      const raw = localStorage.getItem('ll_completed_lessons');
      const parsedItems = parseRawCompletedList(raw);
      parsedItems.forEach((item) => {
        const canonicalId = resolveCanonicalLessonId(item);
        if (canonicalId) completedSet.add(canonicalId);
      });
    } catch (e) {
      console.warn('[api.getCompletedLessons] Error reading ll_completed_lessons:', e);
    }

    // 2. Read ll_category_progress
    try {
      const rawProg = localStorage.getItem('ll_category_progress');
      if (rawProg) {
        let catMap = null;
        try { catMap = JSON.parse(rawProg); } catch {}
        if (catMap && typeof catMap === 'object') {
          Object.values(catMap).forEach((prog) => {
            if (prog) {
              const ids = parseRawCompletedList(prog.completedLessonIds || prog);
              ids.forEach((item) => {
                const canonicalId = resolveCanonicalLessonId(item);
                if (canonicalId) completedSet.add(canonicalId);
              });
            }
          });
        }
      }
    } catch (e) {
      console.warn('[api.getCompletedLessons] Error merging ll_category_progress:', e);
    }

    const resultArray = Array.from(completedSet);

    // Safely sync cleaned format if changed
    try {
      const cleanJson = JSON.stringify(resultArray);
      const rawBefore = localStorage.getItem('ll_completed_lessons');
      if (rawBefore !== cleanJson) {
        localStorage.setItem('ll_completed_lessons', cleanJson);
      }
    } catch {}

    console.log('[DIAGNOSTIC] 1. ALL_LESSONS.length:', ALL_LESSONS.length);
    console.log('[DIAGNOSTIC] 2. Raw localStorage ll_completed_lessons:', localStorage.getItem('ll_completed_lessons'));
    console.log('[DIAGNOSTIC] 3. Parsed getCompletedLessons():', resultArray);

    return resultArray;
  }

  saveCompletedLessons(completedList) {
    if (typeof localStorage === 'undefined') return;
    const rawItems = parseRawCompletedList(completedList);
    const canonicalSet = new Set();
    rawItems.forEach((item) => {
      const canonicalId = resolveCanonicalLessonId(item);
      if (canonicalId) canonicalSet.add(canonicalId);
    });
    const safeList = Array.from(canonicalSet);
    try {
      localStorage.setItem('ll_completed_lessons', JSON.stringify(safeList));
    } catch (e) {
      console.error('[api.saveCompletedLessons] Error saving:', e);
    }
    this.initCategoryProgress();
    this.notifyListeners();
  }

  getCategoryPosition(categoryId) {
    if (!categoryId) return 0;
    const catProg = this.getCategoryProgress(categoryId);
    if (catProg && typeof catProg.lastVisitedIndex === 'number') {
      return catProg.lastVisitedIndex;
    }
    return 0;
  }

  saveProfile(profileData) {
    if (typeof localStorage === 'undefined' || !profileData) return;
    if (typeof profileData.totalStars === 'number' && !isNaN(profileData.totalStars)) {
      localStorage.setItem('ll_stars', String(profileData.totalStars));
    }
    this.notifyListeners();
  }

  // --- Challenges Queue (FIFO) ---
  getDailyChallenge() {
    const challenges = JSON.parse(localStorage.getItem('ll_challenges') || '[]');
    return challenges[0] || INITIAL_DAILY_CHALLENGES[0];
  }

  completeDailyChallenge() {
    const challenges = JSON.parse(localStorage.getItem('ll_challenges') || '[]');
    if (challenges.length > 0) {
      const [done, ...rest] = challenges;
      this.addStars(done.reward || 3, `Completed Daily Quest: ${done.title}`);
      // Circular FIFO queue rotation
      rest.push({
        ...done,
        id: 'c_' + Date.now(),
        reward: (done.reward || 3) + 1
      });
      localStorage.setItem('ll_challenges', JSON.stringify(rest));
      return done;
    }
    return null;
  }

  // --- Badges & Leaderboard ---
  getBadges() {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem('ll_badges');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch (e) {
      console.warn('[api.getBadges] Error reading ll_badges from localStorage:', e);
    }
    return BADGES_DATA.map((b) => ({ ...b }));
  }

  async getLeaderboard() {
    let list = [];
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${BASE_URL}/leaderboard`);
        if (res.ok) {
          const raw = await res.json();
          if (Array.isArray(raw)) {
            list = raw.map((item) => ({ ...item, source: 'Spring Boot (Java 21 Backend)' }));
          }
        }
      } catch {
        this.isBackendOnline = false;
        this.notifyListeners();
      }
    }

    if (!list || !Array.isArray(list) || list.length === 0) {
      let myStars = 24;
      try {
        myStars = parseInt(localStorage.getItem('ll_stars') || '24', 10);
        if (isNaN(myStars)) myStars = 24;
      } catch {
        myStars = 24;
      }

      const demoList = [
        { id: '1', name: 'Oliver Owl', avatar: '🦉', stars: 95, badges: 7 },
        { id: '2', name: 'Maya Star', avatar: '🦄', stars: 85, badges: 6 },
        { id: '3', name: 'Leo Lion', avatar: '🦁', stars: 64, badges: 5 },
        { id: '4', name: 'Little Explorer (You)', avatar: '🦊', stars: myStars, badges: 3 },
        { id: '5', name: 'Sammy Swift', avatar: '🚀', stars: 52, badges: 4 },
        { id: '6', name: 'Penny Penguin', avatar: '🐧', stars: 44, badges: 3 },
        { id: '7', name: 'Ella Elephant', avatar: '🐘', stars: 38, badges: 2 }
      ];

      list = demoList.sort((a, b) => b.stars - a.stars).map((item, idx) => ({ 
        ...item, 
        rank: idx + 1,
        source: 'Client MergeSort Engine (Demo Mode)' 
      }));
    }

    return Array.isArray(list) ? list : [];
  }

  // --- Real Java Backend DSA Benchmarks ---
  async runSearchBenchmark(size = 100) {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${BASE_URL}/dsa/benchmark/search?size=${size}`);
        if (res.ok) {
          const data = await res.json();
          return { ...data, source: 'Spring Boot (Java 21 SearchEngine)' };
        }
      } catch {
        this.isBackendOnline = false;
        this.notifyListeners();
      }
    }

    // Client fallback simulation
    const startLinear = performance.now();
    let linearSteps = 0;
    for (let i = 0; i < size; i++) {
      linearSteps++;
      if (i === size - 2) break;
    }
    const durationLinear = Math.max(0.01, performance.now() - startLinear);

    const startBinary = performance.now();
    const binarySteps = Math.ceil(Math.log2(size));
    const durationBinary = Math.max(0.005, performance.now() - startBinary);

    return {
      algorithmA: 'Linear Search',
      algorithmB: 'Binary Search',
      inputSize: size,
      comparisonsA: linearSteps,
      comparisonsB: binarySteps,
      timeNanosA: Math.round(durationLinear * 1000),
      timeNanosB: Math.round(durationBinary * 1000),
      theoreticalComplexityA: 'O(n)',
      theoreticalComplexityB: 'O(log n)',
      summary: `For size N=${size}, Binary Search needed only ${binarySteps} comparisons vs ${linearSteps} checks in Linear Search!`,
      source: 'Client JavaScript Simulation (Demo Mode)'
    };
  }

  async runSortBenchmark(size = 100) {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${BASE_URL}/dsa/benchmark/sort?size=${size}`);
        if (res.ok) {
          const data = await res.json();
          return { ...data, source: 'Spring Boot (Java 21 SortingEngine)' };
        }
      } catch {
        this.isBackendOnline = false;
        this.notifyListeners();
      }
    }

    // Client simulation
    const comparisonsBubble = Math.round((size * (size - 1)) / 2);
    const comparisonsMerge = Math.round(size * Math.log2(size));

    return {
      algorithmA: 'Bubble Sort',
      algorithmB: 'Merge Sort',
      inputSize: size,
      comparisonsA: comparisonsBubble,
      comparisonsB: comparisonsMerge,
      timeNanosA: Math.round(comparisonsBubble * 15),
      timeNanosB: Math.round(comparisonsMerge * 25),
      theoreticalComplexityA: 'O(n^2)',
      theoreticalComplexityB: 'O(n log n)',
      summary: `For size N=${size}, Merge Sort required ~${comparisonsMerge} comparisons vs ~${comparisonsBubble} comparisons in Bubble Sort!`,
      source: 'Client JavaScript Simulation (Demo Mode)'
    };
  }

  async getDsaConcepts() {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${BASE_URL}/dsa/concepts`);
        if (res.ok) {
          return await res.json();
        }
      } catch {
        this.isBackendOnline = false;
        this.notifyListeners();
      }
    }
    return [
      {
        name: "Dynamic Array (CustomArrayList)",
        javaEquivalent: "ArrayList<T>",
        timeComplexity: "O(1) access by index, O(1) amortized insertion, O(n) resize/shift",
        spaceComplexity: "O(n)",
        useCase: "Stores lessons, achievements, and question collections in Little Learners. Demonstrates dynamic 1.5x capacity resizing when element threshold is reached."
      },
      {
        name: "Hash Table (CustomHashMap)",
        javaEquivalent: "HashMap<K, V>",
        timeComplexity: "O(1) average lookup, insertion, and deletion",
        spaceComplexity: "O(n)",
        useCase: "Enables instant O(1) lookups of categories and answer keys during quiz grading. Implements separate chaining collision handling with Node<K, V> buckets."
      },
      {
        name: "Queue (ChallengeQueue)",
        javaEquivalent: "Queue<T> / LinkedList<T>",
        timeComplexity: "O(1) enqueue, O(1) dequeue, O(1) peek",
        spaceComplexity: "O(n)",
        useCase: "Maintains the child's sequential daily learning challenge queue. Respects First-In, First-Out (FIFO) so completed tasks rotate seamlessly."
      },
      {
        name: "Stack (ActivityStack)",
        javaEquivalent: "Stack<T> / Deque<T>",
        timeComplexity: "O(1) push, O(1) pop, O(1) peek",
        spaceComplexity: "O(n)",
        useCase: "Powers the Creative Corner drawing canvas undo/redo system and keeps navigation breadcrumbs for going back to previous learning lessons."
      },
      {
        name: "Binary Search (SearchEngine)",
        javaEquivalent: "Collections.binarySearch()",
        timeComplexity: "O(log n) search time on sorted elements",
        spaceComplexity: "O(1)",
        useCase: "Divides sorted curricula in half repeatedly to locate lessons and dictionary items in logarithmic time."
      },
      {
        name: "Merge Sort (SortingEngine)",
        javaEquivalent: "Arrays.sort() / TimSort",
        timeComplexity: "O(n log n) divide-and-conquer sorting",
        spaceComplexity: "O(n)",
        useCase: "Ranks learner leaderboard scores and sorts educational activities by star difficulty. Stable and predictable performance."
      }
    ];
  }

  async executeSearch(array, target, algorithm = 'binary') {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${BASE_URL}/dsa/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ array, target, algorithm })
        });
        if (res.ok) {
          return await res.json();
        }
      } catch {
        this.isBackendOnline = false;
        this.notifyListeners();
      }
    }

    // Client fallback simulation
    const isLinear = algorithm === 'linear';
    if (isLinear) {
      let comparisons = 0;
      let foundIndex = -1;
      for (let i = 0; i < array.length; i++) {
        comparisons++;
        if (array[i] === target) {
          foundIndex = i;
          break;
        }
      }
      return {
        found: foundIndex >= 0,
        index: foundIndex,
        comparisons,
        durationNanos: comparisons * 120,
        algorithm: 'Linear Search',
        theoreticalComplexity: 'O(n)',
        summary: `Linear search checked ${comparisons} elements sequentially`,
        source: 'Client JavaScript Simulation (Demo Mode)'
      };
    } else {
      const sorted = [...array].sort((a, b) => a - b);
      let low = 0;
      let high = sorted.length - 1;
      let comparisons = 0;
      let foundIndex = -1;
      while (low <= high) {
        comparisons++;
        const mid = Math.floor((low + high) / 2);
        if (sorted[mid] === target) {
          foundIndex = mid;
          break;
        } else if (sorted[mid] < target) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      return {
        found: foundIndex >= 0,
        index: foundIndex,
        comparisons,
        durationNanos: comparisons * 250,
        sortedArray: sorted,
        algorithm: 'Binary Search',
        theoreticalComplexity: 'O(log n)',
        summary: `Binary search found target in ${comparisons} logarithmic steps`,
        source: 'Client JavaScript Simulation (Demo Mode)'
      };
    }
  }

  async executeSort(array, algorithm = 'merge') {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${BASE_URL}/dsa/sort`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ array, algorithm })
        });
        if (res.ok) {
          return await res.json();
        }
      } catch {
        this.isBackendOnline = false;
        this.notifyListeners();
      }
    }

    // Client fallback simulation
    const copy = [...array];
    if (algorithm === 'bubble') {
      let comparisons = 0;
      let swaps = 0;
      for (let i = 0; i < copy.length - 1; i++) {
        for (let j = 0; j < copy.length - i - 1; j++) {
          comparisons++;
          if (copy[j] > copy[j + 1]) {
            const temp = copy[j];
            copy[j] = copy[j + 1];
            copy[j + 1] = temp;
            swaps++;
          }
        }
      }
      return {
        sortedArray: copy,
        comparisons,
        swaps,
        durationNanos: comparisons * 300,
        algorithm: 'Bubble Sort',
        theoreticalComplexity: 'O(n^2)',
        summary: `Bubble sort completed with ${comparisons} comparisons and ${swaps} swaps`,
        source: 'Client JavaScript Simulation (Demo Mode)'
      };
    } else {
      copy.sort((a, b) => a - b);
      const comps = Math.round(copy.length * Math.log2(copy.length));
      return {
        sortedArray: copy,
        comparisons: comps,
        swaps: comps,
        durationNanos: comps * 200,
        algorithm: 'Merge Sort',
        theoreticalComplexity: 'O(n log n)',
        summary: `Merge sort sorted array in ${comps} comparisons via divide-and-conquer`,
        source: 'Client JavaScript Simulation (Demo Mode)'
      };
    }
  }

  resetAllDemoData() {
    if (typeof localStorage === 'undefined') return;
    // 1. Reset stars to documented initial default (24)
    localStorage.setItem('ll_stars', '24');

    // 2. Clear completed lesson IDs and practice challenge rewards
    localStorage.setItem('ll_completed_lessons', JSON.stringify([]));
    localStorage.setItem('ll_completed_practices', JSON.stringify([]));

    // 3. Reset badges to documented initial defaults:
    // Badges b1, b2, b3 are unlocked (since stars = 24 >= 5, 10, 15), while higher tier badges are locked
    const defaultBadges = BADGES_DATA.map((b) => ({
      ...b,
      unlocked: 24 >= b.requiredStars
    }));
    localStorage.setItem('ll_badges', JSON.stringify(defaultBadges));

    // 4. Reset daily challenge quests FIFO queue
    localStorage.setItem('ll_challenges', JSON.stringify(INITIAL_DAILY_CHALLENGES));

    // 5. Reset activity history log
    localStorage.setItem('ll_history', JSON.stringify([
      'Learned letter A with Lumi',
      'Counted 5 stars on abacus',
      'Mixed Yellow and Blue into Green'
    ]));

    // 6. Reset per-category progress map and position index to 0
    localStorage.setItem('ll_category_progress', JSON.stringify({}));
    this.initCategoryProgress();

    // 7. Notify all component subscribers (App, Navbar, Dashboard, ExploreLearn, RewardsRoom, ParentCorner)
    this.notifyListeners();
  }
}

export const api = new ApiService();
