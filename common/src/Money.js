const PRECISION = 10000;

const fromString = s => {
  if (s === '') return 0;

  return Math.floor(parseFloat(s) * PRECISION);
};

const print = v => (v / PRECISION).toFixed(2);

module.exports = {
  fromString,
  print
};
