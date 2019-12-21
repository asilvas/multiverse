export default () => {
  const ret = this.constructor(this.info.dimensions);

  // clone each axis
  ret.axis = this.axis.map(a => a.clone());

  return ret;
}
