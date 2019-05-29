const { calcularValoresTotales } = require('./Math.js');

describe('Math.js', () => {
  describe('calcularValoresTotales', () => {
    it('calcula cada valor de la factura con dos valores decimales', () => {
      const { rebaja, impuestos, total } = calcularValoresTotales(
        149900,
        0,
        12,
        3
      );

      expect(rebaja).toEqual(4497);
      expect(impuestos).toEqual(17448);
      expect(total).toEqual(162851);
    });
  });
});
