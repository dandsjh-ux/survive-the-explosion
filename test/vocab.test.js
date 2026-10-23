import test from 'node:test';
import assert from 'node:assert/strict';
import { VOCAB_QUESTIONS, pickVocabRound, VOCAB_COINS_PER_CORRECT, VOCAB_ROUND_SIZE } from '../src/data/vocab.js';
import { GLOSSARY } from '../src/data/facts.js';

function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

test('constants', () => {
  assert.equal(VOCAB_COINS_PER_CORRECT, 20);
  assert.equal(VOCAB_ROUND_SIZE, 20);
});

test('bank is big enough and well formed', () => {
  assert.ok(VOCAB_QUESTIONS.length >= 40);
  const ids = new Set();
  const types = new Set();
  for (const q of VOCAB_QUESTIONS) {
    assert.ok(!ids.has(q.id), `duplicate id ${q.id}`);
    ids.add(q.id);
    types.add(q.type);
    assert.ok(['meaning', 'word', 'gap'].includes(q.type), q.id);
    assert.equal(q.options.length, 4, q.id);
    assert.equal(new Set(q.options).size, 4, `${q.id} options not distinct`);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4, q.id);
    assert.ok(q.word && q.explain, q.id);
    assert.ok(q.q.length < 120, `${q.id} question too long`);
    assert.ok(q.explain.length < 140, `${q.id} explain too long`);
    for (const o of q.options) assert.ok(o.length < 80, `${q.id} option too long`);
  }
  assert.equal(types.size, 3);
});

test('answers are spread over all four positions', () => {
  const counts = [0, 0, 0, 0];
  for (const q of VOCAB_QUESTIONS) counts[q.answer]++;
  for (const c of counts) assert.ok(c >= VOCAB_QUESTIONS.length / 8);
});

test('every glossary word is tested', () => {
  const tested = new Set(VOCAB_QUESTIONS.map((q) => q.word.toLowerCase()));
  for (const g of GLOSSARY) assert.ok(tested.has(g.word.toLowerCase()), `not tested: ${g.word}`);
});

test('gap questions contain a gap, word questions ask for a word', () => {
  for (const q of VOCAB_QUESTIONS) {
    if (q.type === 'gap') assert.ok(q.q.includes('____'), q.id);
    else assert.ok(!q.q.includes('____'), q.id);
  }
});

test('pickVocabRound gives 20 distinct questions with answers preserved', () => {
  for (let seed = 1; seed <= 30; seed++) {
    const round = pickVocabRound(seeded(seed));
    assert.equal(round.length, 20);
    assert.equal(new Set(round.map((q) => q.id)).size, 20);
    assert.equal(new Set(round.map((q) => q.word.toLowerCase())).size, 20, 'one question per word');
    for (const q of round) {
      const orig = VOCAB_QUESTIONS.find((o) => o.id === q.id);
      assert.equal(q.options[q.answer], orig.options[orig.answer], q.id);
      assert.deepEqual([...q.options].sort(), [...orig.options].sort());
      assert.ok(q.answer >= 0 && q.answer < 4);
    }
  }
});

test('different seeds give different rounds', () => {
  const a = pickVocabRound(seeded(1)).map((q) => q.id).join();
  const b = pickVocabRound(seeded(2)).map((q) => q.id).join();
  assert.notEqual(a, b);
});

test('the source bank is not mutated by shuffling', () => {
  const before = JSON.stringify(VOCAB_QUESTIONS);
  pickVocabRound(seeded(5));
  assert.equal(JSON.stringify(VOCAB_QUESTIONS), before);
});
