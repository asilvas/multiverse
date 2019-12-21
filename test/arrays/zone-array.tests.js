import test from 'ava';
import zoneArray from '../../src/arrays/zone-array';

test('inserts', t => {
  const arr = zoneArray();

  arr.insert(1, { val: 1 });
  arr.insert(2, { val: 2 });
  arr.insert(2, { val: 3 });

  const data = arr.nearest(1, 10);

  t.is(data.length, 3);
  t.is(data.reduce((ctx, v) => {
    return ctx + v.key;
  }, 0), 5);
  t.is(data.reduce((ctx, v) => {
    return ctx + v.data.val;
  }, 0), 6);
});

test('nearest ordering ASC', t => {
  const arr = zoneArray();

  arr.insert(1);
  arr.insert(2);
  arr.insert(3);

  const data = arr.nearest(1, 10);

  t.is(data[0].key, 1);
  t.is(data[1].key, 2);
  t.is(data[2].key, 3);
});

test('nearest ordering DESC', t => {
  const arr = zoneArray();

  arr.insert(1);
  arr.insert(2);
  arr.insert(3);

  const data = arr.nearest(3, 10);

  t.is(data[0].key, 3);
  t.is(data[1].key, 2);
  t.is(data[2].key, 1);
});

test('nearestIter', t => {
  const arr = zoneArray();

  arr.insert(1);
  arr.insert(2);
  arr.insert(4);

  const generator = arr.nearestIter(2);

  t.is(generator.next().value.key, 2);
  t.is(generator.next().value.key, 1);
  t.is(generator.next().value.key, 4);
});
