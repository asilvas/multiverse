export default function insert(data, pos, size = []) {
  const { axis } = this;

  if (pos.length !== axis.length) throw new Error(`expected position length of ${axis.length}, but received ${pos.length}`);

  const node = new Array(pos.length);
  const id = Symbol();

  // if we want to optimize in the future, we can create per multiverse instances with optimized unrolled/inlined code without loops
  for (let ai = 0; ai < pos.length; ai++) {
    const arr = axis[ai];
    const key = pos[ai];
    const delta = (size[ai] / 2) || 0;
    const axisData = { id, key, left: key - delta, right: key + delta, node, data };
    node[ai] = arr.insert(key, axisData);
  }

  return node;
}
