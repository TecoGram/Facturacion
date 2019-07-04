const parseFormInt = str => {
  if (str === '') return 0;
  return parseInt(str, 10);
};

const parseFormFloat = str => {
  if (str === '') return 0;
  return parseFloat(str);
};

module.exports = {
  parseFormFloat,
  parseFormInt
};
