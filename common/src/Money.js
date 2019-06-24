const PRECISION = 10000;

const fromString = s => {
  if (s === '') return 0;

  return Math.floor(parseFloat(s) * PRECISION);
};

const print = v => (v / PRECISION).toFixed(2);

const printFloat = v => parseFloat(print(v));

module.exports = {
  fromString,
  print,
  printFloat
};
