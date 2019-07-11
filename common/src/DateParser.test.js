/* eslint-env node, jest */
const DateParser = require('./DateParser.js');

describe('DateParser', () => {
  describe('toReadableDate', () => {
    it('convierte la fecha un Date object a String tomando en cuenta la zona horaria', () => {
      const dbDate = '2016-12-25T01:13:44.345Z';
      const parsedDate = DateParser.parseDBDate(dbDate);
      const result = DateParser.toReadableDate(parsedDate);
      expect(result).toEqual('2016-12-24');
    });
  });
});
