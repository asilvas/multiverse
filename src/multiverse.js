import parse from './parse';
import insert from './insert';
import move from './move';
import zoneArray from './arrays/zone-array';
import distance from './distance';
import clone from './clone';
import nearestIter from './nearestIter';

const constructor = (dimensionsOrData = 2) => {
  if (typeof dimensionsOrData === 'object') return parse(dimensionsOrData);

  const dimensions = Math.max(1, Math.min(dimensionsOrData, 9));

  const axis = new Array(dimensions).fill(0).map(() => zoneArray());

  return {
    info: {
      multiverse: '1.0',
      dimensions
    },
    constructor,
    axis,
    insert,
    move,
    distance,
    clone,
    nearestIter
  }
};

export default constructor;
