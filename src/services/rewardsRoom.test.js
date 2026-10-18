import test from 'node:test';
import assert from 'node:assert';
import { api } from './api.js';

test('api.getBadges returns array and handles invalid localStorage safely', () => {
  const badges = api.getBadges();
  assert.ok(Array.isArray(badges), 'getBadges should return an Array');
  assert.ok(badges.length > 0, 'Badges array should not be empty');
  assert.ok(badges[0].id, 'Badge object should have id property');
  assert.ok(badges[0].title, 'Badge object should have title property');
});

test('api.getLeaderboard returns promise that resolves to array', async () => {
  const leaderboardPromise = api.getLeaderboard();
  assert.ok(leaderboardPromise instanceof Promise, 'getLeaderboard should return a Promise');
  
  const leaderboard = await leaderboardPromise;
  assert.ok(Array.isArray(leaderboard), 'Resolved leaderboard must be an Array');
  assert.ok(leaderboard.length > 0, 'Leaderboard array should not be empty');
  assert.strictEqual(typeof leaderboard[0].rank, 'number', 'Leaderboard item should have numeric rank');
  assert.ok(leaderboard[0].name, 'Leaderboard item should have name');
});
