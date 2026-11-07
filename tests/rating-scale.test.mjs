import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeMax, normalizeValue } from '../js/rating-scale.js';
test('defaults and invalid scales', () => {
  for (const value of [null, undefined, '', 0, -1, 1.5, Infinity, 'oops', 101]) assert.equal(normalizeMax(value), 5);
});
test('valid scales', () => {
  for (const value of [1, 5, 10, 100]) assert.equal(normalizeMax(String(value)), value);
});
test('values are clamped and rounded', () => {
  assert.equal(normalizeValue(-4), 0);
  assert.equal(normalizeValue(8), 5);
  assert.equal(normalizeValue('3'), 3);
  assert.equal(normalizeValue(2.6), 3);
  assert.equal(normalizeValue(8, 10), 8);
});
test('invalid values are unrated', () => {
  for (const value of [null, undefined, '', 'oops', Infinity, NaN]) assert.equal(normalizeValue(value), 0);
});
