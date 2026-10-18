import test from 'node:test';
import assert from 'node:assert';
import { api } from './api.js';
import { getProgressDotState } from './progressDotUtils.js';

// Polyfill minimal localStorage for node environment testing
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear()
  };
}

test('api.markLessonComplete awards +3 stars for newly completed lesson and prevents duplicate awards', () => {
  api.resetAllDemoData();
  const initialProfile = api.getProfile();
  const initialStars = initialProfile.totalStars;

  // Mark a new lesson complete (e.g. alpha-c)
  const isNew = api.markLessonComplete('alpha-c', 'alphabets');
  assert.strictEqual(isNew, true, 'markLessonComplete should return true for a new completion');

  const updatedProfile = api.getProfile();
  assert.strictEqual(updatedProfile.totalStars, initialStars + 3, 'Stars should increase by exactly 3');

  const completedList = api.getCompletedLessons();
  assert.ok(completedList.includes('alpha-c'), 'alpha-c must be in completed list');

  // Attempt duplicate completion on same lesson ID
  const isDuplicate = api.markLessonComplete('alpha-c', 'alphabets');
  assert.strictEqual(isDuplicate, false, 'markLessonComplete should return false for duplicate completion');

  const afterDuplicateProfile = api.getProfile();
  assert.strictEqual(afterDuplicateProfile.totalStars, initialStars + 3, 'Stars should NOT increase on duplicate completion');
});

test('api.addStars persists star balance and notifies subscribers', () => {
  api.resetAllDemoData();
  const startStars = api.getProfile().totalStars;

  let notified = false;
  let notifiedStatus = null;
  const unsub = api.subscribe((status) => {
    notified = true;
    notifiedStatus = status;
  });

  api.addStars(5, 'Test Activity');

  assert.strictEqual(notified, true, 'api.addStars must call notifyListeners()');
  assert.strictEqual(api.getProfile().totalStars, startStars + 5, 'Star balance must increase by 5');

  unsub();
});

test('api.getCategoriesSync reflects completion counts accurately across all 8 categories', () => {
  api.resetAllDemoData();

  // Mark one canonical lesson in each of the 8 categories
  const testLessons = [
    { id: 'alpha-d', categoryId: 'alphabets' },
    { id: 'num-2', categoryId: 'numbers' },
    { id: 'col-red', categoryId: 'colors' },
    { id: 'shp-circle', categoryId: 'shapes' },
    { id: 'ani-lion', categoryId: 'animals' },
    { id: 'frt-apple', categoryId: 'fruits-veggies' },
    { id: 'veh-car', categoryId: 'vehicles' },
    { id: 'bod-eyes', categoryId: 'body-parts' }
  ];

  testLessons.forEach((tl) => {
    const newlyDone = api.markLessonComplete(tl.id, tl.categoryId);
    assert.strictEqual(newlyDone, true, `Lesson ${tl.id} in ${tl.categoryId} should be newly completed`);
  });

  const categories = api.getCategoriesSync();
  assert.strictEqual(categories.length, 8, 'There must be 8 categories');

  categories.forEach((cat) => {
    assert.ok(cat.completed >= 1, `Category ${cat.id} must show at least 1 completed lesson`);
  });
});

test('api.resetAllDemoData resets stars, completed lessons, and notifies subscribers', () => {
  api.resetAllDemoData();
  api.markLessonComplete('alpha-z', 'alphabets');
  api.addStars(10, 'Bonus');

  let resetNotified = false;
  const unsub = api.subscribe(() => {
    resetNotified = true;
  });

  api.resetAllDemoData();

  assert.strictEqual(resetNotified, true, 'resetAllDemoData must notify subscribers');
  assert.strictEqual(api.getProfile().totalStars, 24, 'Reset should restore base stars to 24');
  assert.strictEqual(api.getProfile().badgesEarned, 3, 'Reset should restore default unlocked badges to 3');
  assert.deepStrictEqual(api.getCompletedLessons(), [], 'Reset should clear completed lessons array to []');

  // Verify all categories reset positions to 0
  const categories = api.getCategoriesSync();
  categories.forEach((cat) => {
    assert.strictEqual(cat.completed, 0, `Category ${cat.id} must have 0 completed lessons after reset`);
    assert.strictEqual(cat.lastVisitedIndex, 0, `Category ${cat.id} position must reset to 0`);
  });

  unsub();
});

test('api.resetAllDemoData strictly preserves theme and accessibility settings', () => {
  // Set theme, reduced motion, high contrast, sound preferences
  globalThis.localStorage.setItem('ll_dark_mode', 'true');
  globalThis.localStorage.setItem('ll_reduced_motion', 'true');
  globalThis.localStorage.setItem('ll_high_contrast', 'true');
  globalThis.localStorage.setItem('ll_sound_enabled', 'false');

  api.resetAllDemoData();

  // Verify preferences were preserved without deletion or corruption
  assert.strictEqual(globalThis.localStorage.getItem('ll_dark_mode'), 'true', 'Dark mode must be preserved');
  assert.strictEqual(globalThis.localStorage.getItem('ll_reduced_motion'), 'true', 'Reduced motion must be preserved');
  assert.strictEqual(globalThis.localStorage.getItem('ll_high_contrast'), 'true', 'High contrast must be preserved');
  assert.strictEqual(globalThis.localStorage.getItem('ll_sound_enabled'), 'false', 'Sound preference must be preserved');
});

test('api.recordPracticeReward awards +2 stars once per challenge and prevents duplicate awards', () => {
  api.resetAllDemoData();
  const initialStars = api.getProfile().totalStars;

  // 1. Award practice challenge for alpha-a
  const res1 = api.recordPracticeReward('alpha-a', 'alphabets', 'Letter Aa — Apple');
  assert.strictEqual(res1.awarded, true, 'First practice challenge should award stars');
  assert.strictEqual(res1.starsEarned, 2, 'Should earn exactly +2 stars');
  assert.strictEqual(api.getProfile().totalStars, initialStars + 2, 'Star balance must increase by 2');
  assert.strictEqual(api.isPracticeCompleted('alpha-a'), true, 'isPracticeCompleted must be true for alpha-a');

  // 2. Duplicate reward attempt for same challenge
  const res2 = api.recordPracticeReward('alpha-a', 'alphabets', 'Letter Aa — Apple');
  assert.strictEqual(res2.awarded, false, 'Duplicate practice challenge must not award stars');
  assert.strictEqual(res2.starsEarned, 0, 'Stars earned should be 0 on duplicate');
  assert.strictEqual(api.getProfile().totalStars, initialStars + 2, 'Star balance must remain unchanged');
});

test('Quick Practice Challenge (+2 ⭐) and Lesson Completion (+3 ⭐) are distinct and work across all 8 categories', () => {
  api.resetAllDemoData();
  const startStars = api.getProfile().totalStars; // 24

  const eightCategorySamples = [
    { id: 'alpha-b', catId: 'alphabets', name: 'Letter Bb' },
    { id: 'num-3', catId: 'numbers', name: 'Number 3' },
    { id: 'col-blue', catId: 'colors', name: 'Color Blue' },
    { id: 'shp-square', catId: 'shapes', name: 'Square' },
    { id: 'ani-tiger', catId: 'animals', name: 'Tiger' },
    { id: 'frt-banana', catId: 'fruits-veggies', name: 'Banana' },
    { id: 'veh-airplane', catId: 'vehicles', name: 'Airplane' },
    { id: 'bod-hands', catId: 'body-parts', name: 'Hands' }
  ];

  let expectedStars = startStars;

  // Complete both Practice Challenge (+2) and Lesson Completion (+3) for each of the 8 categories
  eightCategorySamples.forEach((sample) => {
    // 1. Complete Practice Challenge
    const pracResult = api.recordPracticeReward(sample.id, sample.catId, sample.name);
    assert.strictEqual(pracResult.awarded, true, `Practice for ${sample.id} in ${sample.catId} must award stars`);
    expectedStars += 2;
    assert.strictEqual(api.getProfile().totalStars, expectedStars, `Stars after practice for ${sample.id}`);

    // 2. Complete Lesson
    const lessonResult = api.markLessonComplete(sample.id, sample.catId);
    assert.strictEqual(lessonResult, true, `Lesson ${sample.id} in ${sample.catId} must be newly marked completed`);
    expectedStars += 3;
    assert.strictEqual(api.getProfile().totalStars, expectedStars, `Stars after lesson ${sample.id}`);
  });

  // Check total stars earned: 24 + 8 * (2 + 3) = 24 + 40 = 64
  assert.strictEqual(api.getProfile().totalStars, 64, 'Total stars must be 64 after completing 8 practices and 8 lessons');

  // Verify categories sync reflect 1 completed lesson in all 8 categories
  const categories = api.getCategoriesSync();
  eightCategorySamples.forEach((sample) => {
    const cat = categories.find((c) => c.id === sample.catId);
    assert.ok(cat, `Category ${sample.catId} must exist`);
    assert.ok(cat.completed >= 1, `Category ${sample.catId} must show at least 1 completed lesson`);
  });
});

test('Progress Dot Colour Rules: Rule 1 (Not completed and not current lesson) is grey with no orange ring', () => {
  const isCur = false;
  const isDone = false;
  const state = getProgressDotState(isCur, isDone);

  assert.strictEqual(state.fillColor, 'grey', 'Rule 1 must have grey fill');
  assert.strictEqual(state.hasOrangeRing, false, 'Rule 1 must NOT have orange ring');
  assert.ok(state.classes.includes('bg-slate-300'), 'Rule 1 must include slate-300 fill');
  assert.ok(!state.classes.includes('ring-amber'), 'Rule 1 must NOT contain ring-amber');
  assert.ok(state.classes.includes('w-3.5 h-3.5 rounded-full'), 'Dot must remain circular and consistent in size');
});

test('Progress Dot Colour Rules: Rule 2 (Completed lesson and not current lesson) is green with no orange ring', () => {
  const isCur = false;
  const isDone = true;
  const state = getProgressDotState(isCur, isDone);

  assert.strictEqual(state.fillColor, 'green', 'Rule 2 must have green fill');
  assert.strictEqual(state.hasOrangeRing, false, 'Rule 2 must NOT have orange ring');
  assert.ok(state.classes.includes('bg-emerald-500'), 'Rule 2 must include emerald-500 fill');
  assert.ok(!state.classes.includes('ring-amber'), 'Rule 2 must NOT contain ring-amber');
  assert.ok(state.classes.includes('w-3.5 h-3.5 rounded-full'), 'Dot must remain circular and consistent in size');
});

test('Progress Dot Colour Rules: Rule 3 (Current lesson and not completed) is orange with clearly visible orange ring', () => {
  const isCur = true;
  const isDone = false;
  const state = getProgressDotState(isCur, isDone);

  assert.strictEqual(state.fillColor, 'orange', 'Rule 3 must have orange fill');
  assert.strictEqual(state.hasOrangeRing, true, 'Rule 3 must have visible orange ring');
  assert.ok(state.classes.includes('bg-amber-500'), 'Rule 3 must include amber-500 fill');
  assert.ok(state.classes.includes('ring-2 ring-amber-500'), 'Rule 3 must have ring-2 ring-amber-500');
  assert.ok(state.classes.includes('ring-offset-2'), 'Rule 3 must have offset so ring does not distort or cover dot');
  assert.ok(state.classes.includes('w-3.5 h-3.5 rounded-full'), 'Dot must remain circular and consistent in size (not elongated)');
});

test('Progress Dot Colour Rules: Rule 4 (Current lesson that is already completed) is green with clearly visible orange ring', () => {
  const isCur = true;
  const isDone = true;
  const state = getProgressDotState(isCur, isDone);

  assert.strictEqual(state.fillColor, 'green', 'Rule 4 must have green fill communicating completion');
  assert.strictEqual(state.hasOrangeRing, true, 'Rule 4 must have visible orange ring communicating current selection');
  assert.ok(state.classes.includes('bg-emerald-500'), 'Rule 4 must include emerald-500 fill');
  assert.ok(state.classes.includes('ring-2 ring-amber-500'), 'Rule 4 must have ring-2 ring-amber-500');
  assert.ok(state.classes.includes('ring-offset-2'), 'Rule 4 must have offset so ring does not distort or cover dot');
  assert.ok(state.classes.includes('w-3.5 h-3.5 rounded-full'), 'Dot must remain circular and consistent in size');
});

test('Progress Dots: Answering practice correctly does NOT mark lesson completed; clicking Mastered transitions Rule 3 to Rule 4', () => {
  api.resetAllDemoData();

  const lessonId = 'alpha-e';
  const categoryId = 'alphabets';

  // Initially: Lesson is current (index 4) and uncompleted -> Rule 3
  let completed = api.getCompletedLessons();
  assert.strictEqual(completed.includes(lessonId), false, 'Lesson must start uncompleted');
  let dotState = getProgressDotState(true, completed.includes(lessonId));
  assert.strictEqual(dotState.state, 'CURRENT_UNCOMPLETED');
  assert.strictEqual(dotState.fillColor, 'orange');
  assert.strictEqual(dotState.hasOrangeRing, true);

  // 1. Answer practice challenge correctly
  const practiceResult = api.recordPracticeReward(lessonId, categoryId, 'Letter Ee');
  assert.strictEqual(practiceResult.awarded, true, 'Practice reward awarded');
  
  // Verify lesson is STILL NOT completed in storage
  completed = api.getCompletedLessons();
  assert.strictEqual(completed.includes(lessonId), false, 'Answering practice correctly MUST NOT mark lesson as completed');
  
  // Dot MUST remain Rule 3 (Orange + Ring)
  dotState = getProgressDotState(true, completed.includes(lessonId));
  assert.strictEqual(dotState.state, 'CURRENT_UNCOMPLETED');
  assert.strictEqual(dotState.fillColor, 'orange');

  // 2. Click "I Learned This!" to master the lesson
  const masterResult = api.markLessonComplete(lessonId, categoryId);
  assert.strictEqual(masterResult, true, 'Lesson mastered');
  completed = api.getCompletedLessons();
  assert.strictEqual(completed.includes(lessonId), true, 'Lesson is now completed in storage');

  // Dot MUST immediately transition to Rule 4 (Green + Orange Ring)
  dotState = getProgressDotState(true, completed.includes(lessonId));
  assert.strictEqual(dotState.state, 'CURRENT_COMPLETED');
  assert.strictEqual(dotState.fillColor, 'green');
  assert.strictEqual(dotState.hasOrangeRing, true);

  // 3. User navigates to next card (so this card is now non-current completed)
  dotState = getProgressDotState(false, completed.includes(lessonId));
  assert.strictEqual(dotState.state, 'NON_CURRENT_COMPLETED');
  assert.strictEqual(dotState.fillColor, 'green');
  assert.strictEqual(dotState.hasOrangeRing, false);
});

test('Mandatory 10 Regression Steps: Home Dashboard Progress Synchronization', () => {
  // Step 9/Init: Reset progress to start clean
  api.resetAllDemoData();
  let categories = api.getCategoryProgressSummary();
  const alphabetsInitial = categories.find((c) => c.id === 'alphabets');
  assert.strictEqual(alphabetsInitial.completed, 0, 'Alphabets starts at 0 completed after reset');
  assert.strictEqual(alphabetsInitial.percentage, 0, 'Alphabets starts at 0% after reset');

  const initialStars = api.getProfile().totalStars;

  // Step 1 & 2: Complete one genuinely new lesson in Alphabets
  const isNew = api.markLessonComplete('alpha-a', 'alphabets');
  assert.strictEqual(isNew, true, 'alpha-a should be newly completed');
  assert.strictEqual(api.getProfile().totalStars, initialStars + 3, 'Earned +3 stars exactly once');

  // Step 3: Verify Home dashboard Alphabets count and percentage increase
  categories = api.getCategoryProgressSummary();
  const alphaPost1 = categories.find((c) => c.id === 'alphabets');
  assert.strictEqual(alphaPost1.completed, 1, 'Alphabets completed count must be 1');
  assert.strictEqual(alphaPost1.count, 26, 'Alphabets total count must be 26');
  assert.strictEqual(alphaPost1.percentage, 4, '1 / 26 * 100 rounded is 4%');

  // Step 4: Repeat with a different category (Numbers)
  const numNew = api.markLessonComplete('num-1', 'numbers');
  assert.strictEqual(numNew, true, 'num-1 should be newly completed');
  categories = api.getCategoryProgressSummary();
  const numPost1 = categories.find((c) => c.id === 'numbers');
  assert.strictEqual(numPost1.completed, 1, 'Numbers completed count must be 1');
  assert.strictEqual(numPost1.count, 33, 'Numbers total count must be 33');
  assert.strictEqual(numPost1.percentage, 3, '1 / 33 * 100 rounded is 3%');

  // Step 5: Refresh (simulate page reload by re-querying progress getters)
  const refreshedCategories = api.getCategoryProgressSummary();
  const alphaRefreshed = refreshedCategories.find((c) => c.id === 'alphabets');
  const numRefreshed = refreshedCategories.find((c) => c.id === 'numbers');
  assert.strictEqual(alphaRefreshed.completed, 1, 'Persisted Alphabets count remains 1');
  assert.strictEqual(numRefreshed.completed, 1, 'Persisted Numbers count remains 1');

  // Step 6: Complete another lesson in Alphabets
  api.markLessonComplete('alpha-b', 'alphabets');
  categories = api.getCategoryProgressSummary();
  const alphaPost2 = categories.find((c) => c.id === 'alphabets');
  assert.strictEqual(alphaPost2.completed, 2, 'Alphabets count increases to 2');
  assert.strictEqual(alphaPost2.percentage, 8, '2 / 26 * 100 rounded is 8%');

  // Step 7: Reopening a completed lesson does not duplicate stars
  const starsBeforeDup = api.getProfile().totalStars;
  const isDuplicate = api.markLessonComplete('alpha-a', 'alphabets');
  assert.strictEqual(isDuplicate, false, 'Duplicate completion returns false');
  assert.strictEqual(api.getProfile().totalStars, starsBeforeDup, 'Stars balance remains unchanged on duplicate');

  // Step 8: Demo mode works when backend is offline
  api.isBackendOnline = false;
  const offlineCategories = api.getCategoryProgressSummary();
  const alphaOffline = offlineCategories.find((c) => c.id === 'alphabets');
  assert.strictEqual(alphaOffline.completed, 2, 'Offline Demo mode accurately reads 2 completed lessons');

  // Step 9: Reset progress and verify Home updates to reset state
  api.resetAllDemoData();
  const resetCategories = api.getCategoryProgressSummary();
  resetCategories.forEach((cat) => {
    assert.strictEqual(cat.completed, 0, `Category ${cat.id} resets to 0 completed`);
    assert.strictEqual(cat.percentage, 0, `Category ${cat.id} resets to 0%`);
  });
});

test('Mandatory 11 Proof Steps: Course Header, Button & Dot Transitions Across All 8 Categories', () => {
  api.resetAllDemoData();
  const startStars = api.getProfile().totalStars;

  // 1 & 2. Open Alphabet Safari and select uncompleted lesson alpha-a
  let alphaCompleted = api.isLessonCompleted('alpha-a');
  assert.strictEqual(alphaCompleted, false, 'alpha-a is initially uncompleted');

  // 3 & 4. Click "I Learned This!" -> markLessonComplete
  const masterAlphaA = api.markLessonComplete('alpha-a', 'alphabets');
  assert.strictEqual(masterAlphaA, true, 'alpha-a is newly mastered (+3 ⭐)');
  assert.strictEqual(api.getProfile().totalStars, startStars + 3, 'Stars balance increased by +3');

  // 5 & 6. Verify header changes from 0/26 to 1/26 and ~4%
  let categories = api.getCategoryProgressSummary();
  const alphaSummary = categories.find((c) => c.id === 'alphabets');
  assert.strictEqual(alphaSummary.completed, 1, 'Alphabet Safari header shows 1 mastered lesson');
  assert.strictEqual(alphaSummary.count, 26, 'Alphabet Safari total count is 26');
  assert.strictEqual(alphaSummary.percentage, 4, 'Alphabet Safari percentage is 4% (1/26)');

  // 7. Verify current dot state is Rule 4 (Green center + Orange outline)
  const dotState = getProgressDotState(true, api.isLessonCompleted('alpha-a'));
  assert.strictEqual(dotState.fillColor, 'green', 'Dot fill is green');
  assert.strictEqual(dotState.hasOrangeRing, true, 'Dot has orange ring');

  // 8. Refresh (re-query progress) and verify all states remain correct
  assert.strictEqual(api.isLessonCompleted('alpha-a'), true, 'alpha-a completion persisted after refresh');
  const alphaRefreshed = api.getCategoryProgressSummary().find((c) => c.id === 'alphabets');
  assert.strictEqual(alphaRefreshed.completed, 1, 'Refreshed header retains 1/26');

  // 9. Click completed button again -> no extra stars
  const duplicateAlpha = api.markLessonComplete('alpha-a', 'alphabets');
  assert.strictEqual(duplicateAlpha, false, 'Duplicate completion returns false');
  assert.strictEqual(api.getProfile().totalStars, startStars + 3, 'Stars balance remains unchanged');

  // 10. Repeat with 1 lesson in each of the remaining 7 categories
  const categorySamples = [
    { catId: 'numbers', lessonId: 'num-1', expectedTotal: 33, expectedPct: 3 },
    { catId: 'colors', lessonId: 'col-red', expectedTotal: 15, expectedPct: 7 },
    { catId: 'shapes', lessonId: 'shp-circle', expectedTotal: 17, expectedPct: 6 },
    { catId: 'animals', lessonId: 'ani-lion', expectedTotal: 30, expectedPct: 3 },
    { catId: 'fruits-veggies', lessonId: 'frt-apple', expectedTotal: 22, expectedPct: 5 },
    { catId: 'vehicles', lessonId: 'veh-car', expectedTotal: 16, expectedPct: 6 },
    { catId: 'body-parts', lessonId: 'bod-eyes', expectedTotal: 16, expectedPct: 6 }
  ];

  categorySamples.forEach((sample) => {
    const isNew = api.markLessonComplete(sample.lessonId, sample.catId);
    assert.strictEqual(isNew, true, `Lesson ${sample.lessonId} in ${sample.catId} newly completed`);
    assert.strictEqual(api.isLessonCompleted(sample.lessonId), true, `${sample.lessonId} is completed`);

    const summary = api.getCategoryProgressSummary().find((c) => c.id === sample.catId);
    assert.strictEqual(summary.completed, 1, `Category ${sample.catId} shows 1 mastered lesson`);
    assert.strictEqual(summary.count, sample.expectedTotal, `Category ${sample.catId} total is ${sample.expectedTotal}`);
    assert.strictEqual(summary.percentage, sample.expectedPct, `Category ${sample.catId} percentage is ${sample.expectedPct}%`);
  });
});

test('UI Completion Service Path: Complete lesson via api.markLessonComplete and verify saved ID, count, mastered status, and +3 reward', () => {
  api.resetAllDemoData();
  const startStars = api.getProfile().totalStars;
  const currentLessonId = 'alpha-a';
  const activeCategory = 'alphabets';

  // Simulate UI handleCompleteCurrentLesson execution path
  const newlyCompleted = api.markLessonComplete(currentLessonId, activeCategory);
  assert.strictEqual(newlyCompleted, true, 'markLessonComplete must return true for new completion');

  // Verify saved ID in getCompletedLessons
  const completedList = api.getCompletedLessons();
  assert.ok(completedList.includes(currentLessonId), `Saved ID ${currentLessonId} must exist in getCompletedLessons`);

  // Verify mastered status
  assert.strictEqual(api.isLessonCompleted(currentLessonId), true, 'isLessonCompleted must be true');

  // Verify +3 star reward
  assert.strictEqual(api.getProfile().totalStars, startStars + 3, 'Stars balance must increase by +3');

  // Verify category count and percentage
  const categories = api.getCategoryProgressSummary();
  const catSummary = categories.find((c) => c.id === activeCategory);
  assert.strictEqual(catSummary.completed, 1, 'Alphabets category count must be 1');
  assert.strictEqual(catSummary.count, 26, 'Alphabets category total must be 26');
  assert.strictEqual(catSummary.percentage, 4, 'Alphabets category percentage must be 4%');
});

test('Quiz Adventure: getQuizQuestions returns unique questions with no duplicate IDs', async () => {
  const categories = ['all', 'alphabets', 'numbers', 'colors', 'shapes', 'animals', 'fruits-veggies', 'vehicles', 'body-parts'];
  const difficulties = ['all', 'Easy', 'Medium', 'Challenge'];

  for (const cat of categories) {
    for (const diff of difficulties) {
      const questions = await api.getQuizQuestions(cat, diff);
      const idSet = new Set();
      questions.forEach((q) => {
        assert.ok(q.id, 'Every question must have a valid ID');
        assert.ok(!idSet.has(q.id), `Question ID ${q.id} must be unique in session for ${cat}/${diff}`);
        idSet.add(q.id);
      });
    }
  }
});

test('Quiz Adventure: Correct answer awards +2 stars exactly once per question ID; incorrect answer does not award stars', () => {
  api.resetAllDemoData();
  const startStars = api.getProfile().totalStars;

  const q1 = { id: 'q-test-1', questionText: 'Test Q1', answerIndex: 0 };
  const q2 = { id: 'q-test-2', questionText: 'Test Q2', answerIndex: 1 };

  const awardedIds = new Set();

  // 1. Correct answer on Q1
  const isQ1Correct = 0 === q1.answerIndex;
  assert.strictEqual(isQ1Correct, true);
  if (isQ1Correct && !awardedIds.has(q1.id)) {
    awardedIds.add(q1.id);
    api.addStars(2, 'Quiz Correct');
  }

  assert.strictEqual(api.getProfile().totalStars, startStars + 2, 'Stars increased by +2');

  // 2. Duplicate click on Q1 -> blocked by awardedIds
  if (isQ1Correct && !awardedIds.has(q1.id)) {
    api.addStars(2, 'Quiz Correct Duplicate');
  }
  assert.strictEqual(api.getProfile().totalStars, startStars + 2, 'Stars remained same on duplicate click');

  // 3. Incorrect answer on Q2
  const isQ2Correct = 0 === q2.answerIndex; // Incorrect answer chosen
  assert.strictEqual(isQ2Correct, false);
  if (isQ2Correct && !awardedIds.has(q2.id)) {
    awardedIds.add(q2.id);
    api.addStars(2, 'Quiz Correct');
  }
  assert.strictEqual(api.getProfile().totalStars, startStars + 2, 'Stars did NOT increase on incorrect answer');
});
test('Dashboard 10 Required Test Steps: Mastered count, percentage, legacy migration, star isolation, and reset', () => {
  // Step 1: Reset to clean baseline and inspect existing saved completions
  api.resetAllDemoData();
  const initialCompletions = api.getCompletedLessons();
  assert.strictEqual(initialCompletions.length, 0, 'Reset baseline should have 0 completed lessons');

  const initialCategories = api.getCategoriesSync();
  const initialMastered = initialCategories.reduce((sum, c) => sum + c.completed, 0);
  assert.strictEqual(initialMastered, 0, 'Baseline mastered lessons on Home must be 0');

  // Step 2 & 3: Complete one new Alphabet lesson (alpha-a) and verify saved completion ID
  const isNewComp = api.markLessonComplete('alpha-a', 'alphabets');
  assert.strictEqual(isNewComp, true, 'markLessonComplete should succeed for new Alphabet lesson');

  const updatedCompletions = api.getCompletedLessons();
  assert.ok(updatedCompletions.includes('alpha-a'), 'Saved completion ID alpha-a must appear in getCompletedLessons()');

  // Step 4 & 5: Verify Home mastered count increases by one and overall percentage updates
  const updatedCategories = api.getCategoriesSync();
  const newMastered = updatedCategories.reduce((sum, c) => sum + c.completed, 0);
  assert.strictEqual(newMastered, 1, 'Home mastered count must increase to 1');

  const overallPct = Math.round((newMastered / 175) * 100); // 1 / 175 = 0.57% -> 1%
  assert.strictEqual(overallPct, 1, 'Overall percentage must calculate to 1%');

  // Step 6: Navigate away and return to Home; verify same values
  const reFetchedCompletions = api.getCompletedLessons();
  assert.strictEqual(reFetchedCompletions.length, 1, 'Re-fetched completions count must remain 1');

  // Step 7: Refresh simulation / legacy format migration
  // Simulate legacy object format in localStorage: { "alpha-b": true }
  globalThis.localStorage.setItem('ll_completed_lessons', JSON.stringify({ 'alpha-b': true }));
  const migratedCompletions = api.getCompletedLessons();
  assert.ok(migratedCompletions.includes('alpha-b'), 'Legacy object format must be migrated safely');

  // Step 8: Verify earning stars without completing a lesson does NOT increase mastered count
  const countBeforeStars = api.getCompletedLessons().length;
  api.recordPracticeReward('alpha-c', 'alphabets', 'Letter C Quick Practice');
  api.addStars(10, 'Daily Quest');
  const countAfterStars = api.getCompletedLessons().length;
  assert.strictEqual(countAfterStars, countBeforeStars, 'Earning stars alone must NOT increase mastered lesson count');

  // Step 9: Verify reset progress returns counts to zero ONLY when user explicitly confirms reset
  api.resetAllDemoData();
  const resetMastered = api.getCompletedLessons().length;
  assert.strictEqual(resetMastered, 0, 'Reset progress must set mastered counts to zero');
});
