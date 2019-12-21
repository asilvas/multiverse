const ZONE_MIN = 100;
const ZONE_SOFT_MAX = 1000;
const ZONE_HARD_MAX = 2000;

const constructor = () => {
  return {
    zones: [],
    min: undefined,
    max: undefined,
    insert,
    remove,
    nearest,
    nearestIter,
    range,
    clone
  };
}

export default constructor;

function insert(key, data) {
  let zone = findZone(this, key);

  if (!zone) {
    zone = { min: key, max: key, arr: [] };
    this.min = key;
    this.max = key;
    this.zones.push(zone);
  }

  const node = { key, data, zone };
  zone.arr.push(node);

  // update min/max
  zone.min = Math.min(zone.min, key);
  zone.max = Math.max(zone.max, key);
  this.min = Math.min(this.min, key);
  this.max = Math.max(this.max, key);

  grow(this, zone);
  sort(this, zone);

  return node;
}

function findZone($this, key) {
  const { zones, min, max } = $this;

  if (zones.length <= 1 || key < min) return zones[0];

  if (key > max) return zones[zones.length - 1];

  // estimates are based on linear ranges. linear spans require fewer iterations
  let perc = Math.max(0, (key - min) / max);
  let i = Math.floor(zones.length * perc);
  let zone;
  let lowIndex = 0;
  let highIndex = zones.length - 1;

  do {
    zone = zones[i];
    if (zone.min >= key && zone.max <= key) return zone; // found the correct zone!

    // determine direction
    if (key < zone.min) {
      // to the left, to the left
      highIndex = i - 1; // set the new high
    } else {
      // to the right, to the right
      lowIndex = i + 1; // set the new low
    }

    if ((highIndex - lowIndex) <= 3) {
      // if we're close, just incrament/decrement, no need for estimate
      if (key < zone.min) i--;
      else i++;
    } else {
      // time for new estimate between low and high
      perc = Math.max(0, (key - zones[lowIndex].min) / zones[highIndex].max);
      i = Math.floor(zones.length * perc); // we shouldn't need any bounds check.. famous last words
    }
  } while (true); // gulp!
}

function remove({ index, zone }) {
  zone.arr.splice(index, 1); // remove this one node

  if (zone.index === 0 && zone.arr.length > 0) { // if first zone shrunk, update min
    this.min = zone.min;
  }
  const lastZone = this.zones[this.zones.length - 1];
  if (lastZone.index === zone.index) { // if the last zone shrunk, update max
    this.max = lastZone.max;
  }

  shrink(this, zone);
}

function grow($this, zone) {
  const { arr } = zone;
  if (arr.length <= ZONE_HARD_MAX) return; // we're within the hard limit, no action needed

  // always grow to right to permit recursive growth (in the future we might use more advanced weighted direction)
  const moving = zone.arr.splice(ZONE_SOFT_MAX); // grab anything beyond the soft limit
  // update max to reflect the moved items
  zone.max = zone.arr[zone.arr.length - 1].key;

  const nextZi = zone.index + 1;
  // determine next zone, or create new one if none available
  let nextZone = $this.zones[nextZi];
  if (!nextZone) {
    $this.zones[nextZi] = {
      arr: [],
      index: nextZi,
      min: moving[0].key,
      max: moving[moving.length - 1].key
    };
  } else {
    // if zone already exists, apply minimum to next
    nextZone.min = moving[0].key;
  }

  // moved items on the left, previous on the right
  nextZone.arr = moving.concat(nextZone.arr);

  // identify growth on next zone in case it too needs to shift to right
  grow($this, nextZone);
}

function sort($this, { arr }) {
  // sort
  arr.sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
  // track index (needed during iteration)
  for (let i = 0; i < arr.length; i++) { // for i is generally faster
    arr[i].index = i;
  }
}

function shrink($this, zone) {
  if (zone.arr.length >= ZONE_MIN) return; // size is fine, no action needed

  // TODO: future. eventually handle merging of zones as needed
}

function nearest(key, top = 1) {
  if (top > 1) {
    const arr = [];

    for (let node of this.nearestIter(key)) {
      arr.push(node); // has the added benefit of being in order of proximity from center... in the future may build it's own function to go from left to right
      if (arr.length === top) break;
    }
  
    return arr;
  }

  const zone = findZone(this, key);

  if (!zone) return; // if no zone, certainly no node

  // if this looks almost identical to `findZone`, it's because it's based on the same linear-forgiving algorithm

  const { arr, min, max } = zone;
  if (arr.length <= 1 || key < min) return arr[0];

  if (key > max) return arr[arr.length - 1];

  // estimates are based on linear ranges. linear spans require fewer iterations
  let perc = Math.max(0, (key - min) / max);
  let i = Math.floor(arr.length * perc);
  let node, distance, distanceLeft, distanceRight, nearestNode, nearestDistance;
  let lowIndex = 0;
  let highIndex = arr.length - 1;

  do {
    node = arr[i];
    if (node.key === key) return node; // unlikely, but possible

    distance = Math.abs(key - node.key);
    if (!nearestNode || distance < nearestDistance) { // set for first time, or if nearest
      nearestNode = node;
      nearestDistance = distance;
    }

    // determine direction
    if (key < node.key) {
      // to the left, to the left
      i--;
      highIndex = i; // set the new high
    } else {
      // to the right, to the right
      i++;
      lowIndex = i; // set the new low
    }

    if ((highIndex - lowIndex) <= 5) {
      // if we're close, just incrament/decrement, no need for linear (gu)estimate

      // unlike the long jump, incrament/decrement is based on distance of left and right
      distanceLeft = Math.abs(arr[lowIndex].key - key);
      distanceRight = Math.abs(arr[highIndex].key - key);

      if (nearestDistance <= distanceLeft && nearestDistance <= distanceRight) return nearestNode; // look no further, we've already identified nearest!
    } else {
      // time for new estimate between low and high
      perc = Math.max(0, (key - arr[lowIndex].key) / arr[highIndex].key);
      i = Math.floor(arr.length * perc); // we shouldn't need any bounds check.. famous last words
    }
  } while (true); // gulp!
}

function* nearestIter(key, range) {
  // return nearest iterable
  let node = this.nearest(key);
  if (!node) return;

  let left = node;
  let right = node;

  let prev, next, prevDistance, nextDistance;

  do {
    yield node;

    prev = left.index > 0 ? left.zone.arr[node.index - 1] : left.zone.index > 0 ? this.zones[left.zone.index - 1].arr[this.zones[left.zone.index - 1].arr.length - 1] : null;
    next = right.index < (right.zone.arr.length - 1) ? right.zone.arr[right.index + 1] : right.zone.index < (this.zones.length - 1) ? this.zones[right.zone.index + 1].arr[0] : null;
    if (prev && next) {
      // only compare if there is both a previous and a next
      prevDistance = key - prev.key;
      nextDistance = next.key - key;

      if (prevDistance <= nextDistance) {
        // use previous if closer than next
        node = prev;
        left = node;
      } else {
        // otherwise use next
        node = next;
        right = node;
      }
    } else if (prev) {
      node = prev;
      left = node;
    } else if (next) {
      node = next;
      right = node;
    } else {
      node = null;
    }

    if (range && Math.abs(key - node.key) > range) {
      // if node is outside of range, do not include
      node = null;
    }
  } while (node);
}

function range(low, high, top = Infinity) {
  const arr = [];

  for (let node of this.nearestIter((low + high) / 2)) {
    arr.push(node); // has the added benefit of being in order of proximity from center... in the future may build it's own function to go from left to right
    if (arr.length === top) break;
  }

  return arr;
}

function clone() {
  const c = constructor();

  c.zones = JSON.parse(JSON.stringify(this.zones)); // quick'n'dirty copy
  c.min = this.min;
  c.max = this.max;

  return c;
}
