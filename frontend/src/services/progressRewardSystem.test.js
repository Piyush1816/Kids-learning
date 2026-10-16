import test from 'node:test';
import assert from 'node:assert';
import { api } from './api.js';

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
    { id: 'fv-apple', categoryId: 'fruits-veggies' },
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
  assert.deepStrictEqual(api.getCompletedLessons(), [], 'Reset should clear completed lessons array to []');

  unsub();
});
