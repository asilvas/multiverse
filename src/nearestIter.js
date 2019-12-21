export default function* nearestIter(nodeOrVector, range = []) {
  const { axis } = this;
  const vector = typeof nodeOrVector[0] === 'number' ? nodeOrVector : nodeOrVector.map(axis => axis.key);

  if (vector.length !== axis.length) throw new Error(`expected axis length of ${axis.length}, but received ${vector.length}`);

  const vectorGenerator = vector.map((v, idx) => axis[idx].nearestIter(v, range[idx]));

  const returnedIds = {};

  let nextNode, nextSorted;
  let nextNodes = vectorGenerator.map(iter => iter.next());
  do {
    nextSorted = nextNodes.map(({ /*done, */value }, index) => {
      let distance = Infinity;
      let id;

      if (value) {
        distance = value.data.node.reduce((distance, axis, idx) => {
          // yeah this is kinda gross. #shame
          return distance + Math.abs(axis.data.key - vector[idx]);
        }, 0);
        id = value.data.id;
      }

      return { id, value, distance, index };
    }).sort((n1, n2) => (n1.distance < n2.distance) ? -1 : (n1.distance > n2.distance) ? 1 : 0);

    nextNode = nextSorted[0] && nextSorted[0].value && nextSorted[0];

    if (!nextNode || !nextNode.value) {
      break;
    } 

    // grab next result for the given axis
    nextNodes[nextNode.index] = vectorGenerator[nextNode.index].next();

    if (nextNode.id in returnedIds) {
      continue; // skip if previously returned
    }

    returnedIds[nextNode.id] = true;

    yield nextNode.value.data;
  } while (nextNode);
}
