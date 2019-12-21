export default function move(node, pos) {
  const { axis } = this;

  if (pos.length !== axis.length) throw new Error(`expected position length of ${axis.length}, but received ${pos.length}`);

  // if we want to optimize in the future, we can create per multiverse instances with optimized unrolled/inlined code without loops
  for (let ai = 0; ai < pos.length; ai++) {
    const key = pos[ai];
    const axisNode = node[ai];
    if (key === axisNode.key) continue; // if position on an axis does not change, skip that axis

    const axisData = axisNode.data;
    const arr = axis[ai];

    const delta = ((axisData.right - axisData.left) / 2) || 0;
    axisData.key = key;
    axisData.left = key - delta;
    axisData.right = key + delta;

    // remove old node entry
    arr.remove(node[ai]);

    // update node's axis
    node[ai] = arr.insert(key, axisData); 
  }

  return node;
}
