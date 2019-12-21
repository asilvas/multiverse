import test from 'ava';
import multiverse from '../src/multiverse';

test('constructor defaults', t => {
  t.notThrows(() => multiverse());

  const arr = multiverse();

  t.is(typeof arr.insert, 'function');

  t.is(arr.info.dimensions, 2);
});
