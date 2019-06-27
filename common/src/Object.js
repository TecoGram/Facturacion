const excludeKeys = (src, keys) => {
  const dst = { ...src };
  keys.forEach(key => {
    delete dst[key];
  });
  return dst;
};

module.exports = { excludeKeys };
