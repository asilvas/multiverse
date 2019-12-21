import test from 'ava';
import multiverse from '../src/multiverse';

test('2d', t => {
  const arr = multiverse();

  t.is(typeof arr.insert, 'function');
  
  const node1 = arr.insert({ id: 1 }, [1, 1]);
  const node2 = arr.insert({ id: 2 }, [1, 2]);
  const node3 = arr.insert({ id: 3 }, [1, 4]);

  const generator = arr.nearestIter([1, 2]);

  t.is(generator.next().value.data.id, 2);
  t.is(generator.next().value.data.id, 1);
  t.is(generator.next().value.data.id, 3);
  t.is(generator.next().value, undefined);
});

test('3d /w partial offset', t => {
  const arr = multiverse(3);

  t.is(typeof arr.insert, 'function');
  
  const node1 = arr.insert({ id: 1 }, [1, 1, 1]);
  const node2 = arr.insert({ id: 2 }, [1, 2, 3]);
  const node3 = arr.insert({ id: 3 }, [4, 5, 6]);

  const generator = arr.nearestIter([1, 2, 4]);

  t.is(generator.next().value.data.id, 2);
  t.is(generator.next().value.data.id, 1);
  t.is(generator.next().value.data.id, 3);
  t.is(generator.next().value, undefined);
});
