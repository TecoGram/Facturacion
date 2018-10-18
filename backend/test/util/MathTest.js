/* eslint-env node, mocha */
require('chai');

const { calcularValoresTotales } = require('../../src/Factura/Math.js');

describe('Math.js', function() {
  describe('calcularValoresTotales', function() {
    it('calcula cada valor de la factura con dos valores decimales', function() {
      const { rebaja, impuestos, total } = calcularValoresTotales(
        14.99,
        0,
        12,
        3
      );

      rebaja.should.equal(0.45);
      impuestos.should.equal(1.74);
      total.should.equal(16.28);
    });
  });
});
