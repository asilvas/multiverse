export default function distance(node1, node2) {
  if (node1.length !== node2.length) throw new Error(`expected dimension of ${node1.length}, but received ${node2.length}`);

  const result = new Array(node1.length);

  // if we want to optimize in the future, we can create per multiverse instances with optimized unrolled/inlined code without loops
  for (let ai = 0; ai < node1.length; ai++) {
    const axisNode1 = node1[ai];
    const axisNode2 = node2[ai];

    result[ai] = Math.abs(axisNode1.key - axisNode2.key);
  }

  return result;
}
