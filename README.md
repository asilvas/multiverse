# @afk/multiverse

Fast tracking and collision detection for large volumes of objects within an arbitrary number of dimensions.


## Basic Usage

```
import multiverse from '@afk/multiverse';

// 3d world
const world = multiverse(3);

const obj1 = { name: 'Taco' };
const obj2 = { name: 'Kujo' };

// insert objects to 3d space with size
// size is optional
// up to you where to store identifier
obj1.mv = world.insert(obj1, [1, 2, 3], [0.1, 0.2, 0.1]);
obj2.mv = world.insert(obj2, [2, 3, 1], [0.1, 0.2, 0.1]);

world.move(obj1.mv, [3, 2, 1]);

// calc distance in 3d space (taking into account size of objects)
const distance = world.distance(obj1.mv, obj2.mv);

// find nearest 1 object from obj1 position
const [[nearest, [nearestX, nearestY, nearestZ]] = world.nearest(obj1.mv, 1);

// or iterate through nearest... generally ordered, but optimized for speed over accuracy
let findings = [];
for (let o of world.nearestIter(obj1.mv)) {
  findings.push(o);
  if (findings.length > 10) break;
}

// find nearest 1 object from desired position
const [[find, [findX, findY, findZ]]] = world.find([5, 1, 1], 1);

// optionally provide a bounding zone (which in this example won't find a result)
const [nearestInZone] = world.find([5, 1, 1], 1, [1, 1, 1]);

// change bounding size after the fact
world.size(obj1.mv, [0.2, 0.2, 0.2]);

// information about the world
const { bounds, objects } = world.info();

// remove object
world.remove(obj2.mv);

// copy
const newWorld = world.clone();

// clean slate
world.reset();
```


## Advanced Usage

```
// find intersecting objects if any within the bounds of the provided object
const [collidingObj] = world.intersect(obj1.mv, 1);

// similar to `find`, but with conditionals only the caller understands
world.filter([5, 1, 1], 1, o => o.name === 'Kujo');

// return serializable object for persistence and/or transfer over wire
const worldData = world.toJSON();

// create world from exported data
const restoredWorld = multiverse(worldData);
```
