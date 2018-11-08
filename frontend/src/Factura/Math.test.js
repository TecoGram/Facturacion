const { calcularValoresTotales } = require('./Math.js');

describe('Math.js', () => {
  describe('calcularValoresTotales', () => {
    it('calcula cada valor de la factura con dos valores decimales', () => {
      const { rebaja, impuestos, total } = calcularValoresTotales(
        14.99,
        0,
        12,
        3
      );

      expect(rebaja).toEqual(0.45);
      expect(impuestos).toEqual(1.74);
      expect(total).toEqual(16.28);
    });
  });
});
