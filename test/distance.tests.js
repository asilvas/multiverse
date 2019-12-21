import test from 'ava';
import multiverse from '../src/multiverse';

test('distance', t => {
  const arr = multiverse();

  const node1 = arr.insert({ hello: 'world' }, [1, 2]);
  const node2 = arr.insert({ hello: 'world' }, [3, 7]);

  const [xDelta, yDelta] = arr.distance(node1, node2);

  t.is(xDelta, 2);
  t.is(yDelta, 5);
});

test('negative distance', t => {
  const arr = multiverse();

  const node1 = arr.insert({ hello: 'world' }, [1, 2]);
  const node2 = arr.insert({ hello: 'world' }, [3, 7]);

  const [xDelta, yDelta] = arr.distance(node2, node1);

  t.is(xDelta, 2);
  t.is(yDelta, 5);
});
