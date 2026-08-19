import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitRouteName } from '../server/openbus.ts';

test('splits a route name into start and end', () => {
  const { start, end } = splitRouteName(
    'מסוף רדינג/רציפים-תל אביב יפו<->מסוף יהוד/הורדה-יהוד מונוסון-10',
    '1',
    '0',
  );
  assert.equal(start, 'מסוף רדינג/רציפים-תל אביב יפו');
  assert.equal(end, 'מסוף יהוד/הורדה-יהוד מונוסון');
});

test('strips the direction suffix only when it is really there', () => {
  assert.equal(splitRouteName('A<->B-3#', '3', '#').end, 'B');
  assert.equal(splitRouteName('A<->B-9#', '3', '#').end, 'B-9#');
});

test('handles a name with no separator', () => {
  const { start, end } = splitRouteName('Somewhere', '1', '#');
  assert.equal(start, 'Somewhere');
  assert.equal(end, null);
});

test('survives a missing name', () => {
  const { start, end } = splitRouteName(undefined, '1', '#');
  assert.equal(start, null);
  assert.equal(end, null);
});
