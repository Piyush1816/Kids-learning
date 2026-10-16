import test from 'node:test';
import assert from 'node:assert';
import { normalizeQuizQuestion } from './api.js';

test('normalizeQuizQuestion handles Java Spring Boot Backend quiz question schema', () => {
  const backendQuestion = {
    id: 'q-fv-1',
    categoryId: 'fruits-veggies',
    difficulty: 'Easy',
    questionText: 'Which crunchy orange vegetable is famous for supporting bright healthy eyesight?',
    illustration: '🥕',
    options: ['Carrot', 'Potato', 'Cucumber', 'Onion'],
    correctAnswerIndex: 0,
    explanation: 'Carrots are rich in Vitamin A, which helps our eyes see clearly!'
  };

  const normalized = normalizeQuizQuestion(backendQuestion);

  assert.notStrictEqual(normalized, null);
  assert.strictEqual(normalized.id, 'q-fv-1');
  assert.strictEqual(normalized.category, 'fruits-veggies');
  assert.strictEqual(normalized.difficulty, 'Easy');
  assert.strictEqual(normalized.questionText, 'Which crunchy orange vegetable is famous for supporting bright healthy eyesight?');
  assert.strictEqual(normalized.icon, '🥕');
  assert.deepStrictEqual(normalized.options, ['Carrot', 'Potato', 'Cucumber', 'Onion']);
  assert.strictEqual(normalized.answerIndex, 0);
  assert.strictEqual(normalized.explanation, 'Carrots are rich in Vitamin A, which helps our eyes see clearly!');
});

test('normalizeQuizQuestion handles local mock data quiz question schema', () => {
  const mockQuestion = {
    id: 'q-alpha-1',
    category: 'alphabets',
    difficulty: 'Easy',
    question: 'Which letter does the word "Apple" begin with?',
    icon: '🍎',
    options: ['Letter A', 'Letter B', 'Letter C', 'Letter D'],
    answerIndex: 0,
    explanation: 'A is for Apple! (a-a-apple).'
  };

  const normalized = normalizeQuizQuestion(mockQuestion);

  assert.notStrictEqual(normalized, null);
  assert.strictEqual(normalized.id, 'q-alpha-1');
  assert.strictEqual(normalized.category, 'alphabets');
  assert.strictEqual(normalized.questionText, 'Which letter does the word "Apple" begin with?');
  assert.strictEqual(normalized.icon, '🍎');
  assert.deepStrictEqual(normalized.options, ['Letter A', 'Letter B', 'Letter C', 'Letter D']);
  assert.strictEqual(normalized.answerIndex, 0);
});

test('normalizeQuizQuestion discards invalid or empty questions', () => {
  assert.strictEqual(normalizeQuizQuestion(null), null);
  assert.strictEqual(normalizeQuizQuestion({}), null);
  assert.strictEqual(normalizeQuizQuestion({ questionText: '', options: ['A', 'B'] }), null);
  assert.strictEqual(normalizeQuizQuestion({ questionText: 'Valid Text', options: ['Only One'] }), null);
  assert.strictEqual(normalizeQuizQuestion({ questionText: 'Valid Text', options: ['A', 'B'], answerIndex: 5 }), null);
});
