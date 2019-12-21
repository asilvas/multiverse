import test from 'ava';
import multiverse from '../src/multiverse';

test('insert', t => {
  const arr = multiverse();

  t.is(typeof arr.insert, 'function');
  
  const node = arr.insert({ hello: 'world' }, [1, 2]);
  const [x, y] = node;

  t.deepEqual(x.data, {
    id: x.data.id,
    key: 1,
    left: 1,
    right: 1,
    node,
    data: {
      hello: 'world'
    }
  });

  t.deepEqual(y.data, {
    id: y.data.id,
    key: 2,
    left: 2,
    right: 2,
    node,
    data: {
      hello: 'world'
    }
  });
});

test('insert invalid position', t => {
  const arr = multiverse();

  t.is(typeof arr.insert, 'function');
  
  t.throws(() => arr.insert({ hello: 'world' }, [2]));
});

test('insert size', t => {
  const arr = multiverse();

  t.is(typeof arr.insert, 'function');
  
  const node = arr.insert({ hello: 'world' }, [1, 2], [, 2]);
  const [x, y] = node;

  t.deepEqual(x.data, {
    id: x.data.id,
    key: 1,
    left: 1,
    right: 1,
    node,
    data: {
      hello: 'world'
    }
  });

  t.deepEqual(y.data, {
    id: y.data.id,
    key: 2,
    left: 1,
    right: 3,
    node,
    data: {
      hello: 'world'
    }
  });
});
