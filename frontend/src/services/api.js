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
  INITIAL_DAILY_CHALLENGES
} from './mockData';

const BASE_URL = 'http://localhost:8080/api';

class ApiService {
  constructor() {
    this.isBackendOnline = false;
    this.connectionChecked = false;
    this.listeners = new Set();
    this.initLocalStorage();
    this.checkBackendHealth();
  }

  initLocalStorage() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem('ll_stars')) {
      localStorage.setItem('ll_stars', '24');
    }
    if (!localStorage.getItem('ll_completed_lessons')) {
      localStorage.setItem('ll_completed_lessons', JSON.stringify(['alpha-a', 'alpha-b', 'num-1']));
    }
    if (!localStorage.getItem('ll_badges')) {
      localStorage.setItem('ll_badges', JSON.stringify(BADGES_DATA));
    }
    if (!localStorage.getItem('ll_challenges')) {
      localStorage.setItem('ll_challenges', JSON.stringify(INITIAL_DAILY_CHALLENGES));
    }
    if (!localStorage.getItem('ll_history')) {
      localStorage.setItem('ll_history', JSON.stringify([
        'Learned letter A with Lumi',
        'Counted 5 stars on abacus',
        'Mixed Yellow and Blue into Green'
      ]));
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach((fn) => fn({
      isOnline: this.isBackendOnline,
      checked: this.connectionChecked
    }));
  }

  async checkBackendHealth() {
    try {
      const res = await fetch(`${BASE_URL}/categories`, {
        method: 'GET',
        signal: AbortSignal.timeout(1200)
      });
      this.isBackendOnline = res.ok;
    } catch {
      this.isBackendOnline = false;
    } finally {
      this.connectionChecked = true;
      this.notifyListeners();
    }
  }

  // --- Categories & Lessons ---
  async getCategories() {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${BASE_URL}/categories`);
        if (res.ok) return await res.json();
      } catch {
        this.isBackendOnline = false;
        this.notifyListeners();
      }
    }
    return INITIAL_CATEGORIES;
  }

  async getLessons(category) {
    if (this.isBackendOnline) {
      try {
        const url = category && category !== 'all' ? `${BASE_URL}/lessons?category=${category}` : `${BASE_URL}/lessons`;
        const res = await fetch(url);
        if (res.ok) return await res.json();
      } catch {
        this.isBackendOnline = false;
        this.notifyListeners();
      }
    }

    // Offline category router
    switch (category) {
      case 'alphabets': return ALPHABETS_DATA;
      case 'numbers': return NUMBERS_DATA;
      case 'colors': return COLORS_DATA;
      case 'shapes': return SHAPES_DATA;
      case 'animals': return ANIMALS_DATA;
      case 'fruits-veggies': return FRUITS_VEGGIES_DATA;
      case 'vehicles': return VEHICLES_DATA;
      case 'body-parts': return BODY_PARTS_DATA;
      default: return ALPHABETS_DATA;
    }
  }

  // --- Quizzes ---
  async getQuizQuestions(category, difficulty = 'all') {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${BASE_URL}/quizzes?category=${category}&difficulty=${difficulty}`);
        if (res.ok) return await res.json();
      } catch {
        this.isBackendOnline = false;
        this.notifyListeners();
      }
    }
    // Filter local questions
    return QUIZ_QUESTIONS.filter((q) => {
      const catMatch = !category || category === 'all' || q.category === category;
      const diffMatch = !difficulty || difficulty === 'all' || q.difficulty === difficulty;
      return catMatch && diffMatch;
    });
  }

  async submitQuiz(submission) {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${BASE_URL}/quizzes/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission)
        });
        if (res.ok) return await res.json();
      } catch {
        this.isBackendOnline = false;
        this.notifyListeners();
      }
    }

    // Local grading
    let correct = 0;
    const total = Object.keys(submission.answers || {}).length;
    const reviews = [];

    QUIZ_QUESTIONS.forEach((q) => {
      if (submission.answers[q.id] !== undefined) {
        const selected = submission.answers[q.id];
        const isRight = selected === q.answerIndex;
        if (isRight) correct++;
        reviews.push({
          questionId: q.id,
          questionText: q.question,
          selectedIndex: selected,
          correctIndex: q.answerIndex,
          isCorrect: isRight,
          explanation: q.explanation
        });
      }
    });

    const scorePct = total > 0 ? (correct / total) * 100 : 0;
    const starsEarned = Math.round((scorePct / 100) * 5);

    if (starsEarned > 0) {
      this.addStars(starsEarned, `Completed ${submission.difficulty || 'Quiz'} adventure`);
    }

    return {
      totalQuestions: total,
      correctAnswers: correct,
      scorePercentage: Math.round(scorePct),
      starsEarned,
      feedbackMessage: scorePct >= 80 ? 'Superstar! Lumi is doing a happy dance!' : 'Great effort! Keep practicing, little explorer!',
      reviews
    };
  }

  // --- Progress & Stars ---
  getProfile() {
    const stars = parseInt(localStorage.getItem('ll_stars') || '24', 10);
    const completed = JSON.parse(localStorage.getItem('ll_completed_lessons') || '[]');
    const badges = JSON.parse(localStorage.getItem('ll_badges') || '[]');
    const unlockedBadges = badges.filter((b) => b.unlocked).length;

    return {
      name: 'Little Explorer',
      avatar: '🦊',
      totalStars: stars,
      badgesEarned: unlockedBadges,
      completedLessonsCount: completed.length,
      streakDays: 4,
      timeSpentMinutes: 48,
      quizAccuracy: 94.2
    };
  }

  addStars(count, activityName) {
    const current = parseInt(localStorage.getItem('ll_stars') || '24', 10);
    const newTotal = current + count;
    localStorage.setItem('ll_stars', newTotal.toString());

    // Update history stack
    const history = JSON.parse(localStorage.getItem('ll_history') || '[]');
    history.unshift(`${activityName} (+${count} ⭐)`);
    if (history.length > 30) history.pop();
    localStorage.setItem('ll_history', JSON.stringify(history));

    // Check badge unlocks
    const badges = JSON.parse(localStorage.getItem('ll_badges') || '[]');
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
  }

  markLessonComplete(lessonId) {
    const completed = JSON.parse(localStorage.getItem('ll_completed_lessons') || '[]');
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      localStorage.setItem('ll_completed_lessons', JSON.stringify(completed));
      this.addStars(3, `Learned lesson ${lessonId}`);
    }
  }

  // --- Challenges Queue ---
  getDailyChallenge() {
    const challenges = JSON.parse(localStorage.getItem('ll_challenges') || '[]');
    return challenges[0] || INITIAL_DAILY_CHALLENGES[0];
  }

  completeDailyChallenge() {
    const challenges = JSON.parse(localStorage.getItem('ll_challenges') || '[]');
    if (challenges.length > 0) {
      const [done, ...rest] = challenges;
      this.addStars(done.reward || 3, `Completed Daily Quest: ${done.title}`);
      // Circular queue rotation
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
    return JSON.parse(localStorage.getItem('ll_badges') || JSON.stringify(BADGES_DATA));
  }

  getLeaderboard() {
    const myStars = parseInt(localStorage.getItem('ll_stars') || '24', 10);
    const list = [
      { id: '1', name: 'Oliver Owl', avatar: '🦉', stars: 95, badges: 7 },
      { id: '2', name: 'Maya Star', avatar: '🦄', stars: 85, badges: 6 },
      { id: '3', name: 'Leo Lion', avatar: '🦁', stars: 64, badges: 5 },
      { id: '4', name: 'Little Explorer (You)', avatar: '🦊', stars: myStars, badges: 3 },
      { id: '5', name: 'Sammy Swift', avatar: '🚀', stars: 52, badges: 4 },
      { id: '6', name: 'Penny Penguin', avatar: '🐧', stars: 44, badges: 3 },
      { id: '7', name: 'Ella Elephant', avatar: '🐘', stars: 38, badges: 2 }
    ];
    // Merge Sort simulation
    return list.sort((a, b) => b.stars - a.stars).map((item, idx) => ({ ...item, rank: idx + 1 }));
  }

  // --- DSA Visualizer benchmarks ---
  runSearchBenchmark(size = 100) {
    const startLinear = performance.now();
    let linearSteps = 0;
    for (let i = 0; i < size; i++) {
      linearSteps++;
      if (i === size - 2) break;
    }
    const durationLinear = Math.max(0.01, performance.now() - startLinear);

    const startBinary = performance.now();
    let binarySteps = Math.ceil(Math.log2(size));
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
      summary: `For size N=${size}, Binary Search needed only ${binarySteps} checks vs ${linearSteps} checks in Linear Search!`
    };
  }

  resetAllDemoData() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('ll_stars');
    localStorage.removeItem('ll_completed_lessons');
    localStorage.removeItem('ll_badges');
    localStorage.removeItem('ll_challenges');
    localStorage.removeItem('ll_history');
    this.initLocalStorage();
  }
}

export const api = new ApiService();
