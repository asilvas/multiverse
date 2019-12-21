import test from 'ava';
import multiverse from '../src/multiverse';

test('move', t => {
  const arr = multiverse();

  t.is(typeof arr.insert, 'function');
  
  const node = arr.insert({ hello: 'world' }, [1, 2]);

  arr.move(node, [2, 1]);

  // existing node is updated during a move (to avoid having to update refs), but inner axis node's are replaced since a remove and insert are needed
  const [x, y] = node;

  t.deepEqual(y.data, {
    id: y.data.id,
    key: 1,
    left: 1,
    right: 1,
    node,
    data: {
      hello: 'world'
    }
  });

  t.deepEqual(x.data, {
    id: x.data.id,
    key: 2,
    left: 2,
    right: 2,
    node,
    data: {
      hello: 'world'
    }
  });
});

test('move invalid position', t => {
  const arr = multiverse();

  t.is(typeof arr.insert, 'function');
  
  const node = arr.insert({ hello: 'world' }, [1, 2]);

  t.throws(() => arr.move(node, [1]));
});
