/* eslint-env node, mocha */

const FacturaPDFData = require('../../backend/pdf/facturaPDFData.js');
require('chai');

describe('FacturaPDF', function() {
  describe('fromVentaRow', function() {
    it('coloca la matriz de valores totales y un array con el detalle de formas de pago a una instancia de ventaRow', function() {
      const ventaRow = {
        subtotal: 10,
        iva: 2,
        descuento: 3,
        flete: 0,
        formaPago: 0,
      };

      const expectedMatrix = [
        ['Sub-Total', '$', '10.00'],
        ['Descuento', '3%', '0.30'],
        ['IVA', '%', ''],
        ['Flete', '$', '0.00'],
        ['IVA', '2%', '0.19'],
        ['Total US', '$', '9.89'],
      ];

      const expectedFormasDePago = [
        ['EFECTIVO', '9.89'],
        ['DINERO ELECTRÓNICO', null],
        ['TARJETA DE CRÉDITO/DÉBITO', null],
        ['TRANSFERENCIA', null],
        ['OTRO', null],
      ];

      const facturaPDFData = FacturaPDFData.fromVentaRow(ventaRow);
      facturaPDFData.matrizValoresTotales.should.eql(expectedMatrix);
      facturaPDFData.formasDePago.should.eql(expectedFormasDePago);
      facturaPDFData.total.should.equal(9.89);
    });
  });

  /*
  describe('crearMatrizValoresTotales', function() {
    it('Si el IVA es 0, solo usa la primer fila de IVA', function() {
      const expectedMatrix = [
        ['Sub-Total', '$', '19.99'],
        ['Descuento', '0%', '0.00'],
        ['IVA', '0%', '0.00'],
        ['Flete', '$', '3.99'],
        ['IVA', '%', ''],
        ['Total US', '$', '19.99'],
      ];

      const matrix = FacturaPDFData.crearMatrizValoresTotales(
        19.99,
        3.99,
        0,
        0,
        0,
        0,
        19.99
      );
      matrix.should.eql(expectedMatrix);
    });

    it('Si el IVA es mayor a 0, solo usa la segunda fila de IVA', function() {
      const expectedMatrix = [
        ['Sub-Total', '$', '19.99'],
        ['Descuento', '0%', '0.00'],
        ['IVA', '%', ''],
        ['Flete', '$', '3.99'],
        ['IVA', '14%', '1.40'],
        ['Total US', '$', '19.99'],
      ];

      const matrix = FacturaPDFData.crearMatrizValoresTotales(
        19.99,
        3.99,
        14,
        0,
        1.4,
        0,
        19.99
      );
      matrix.should.eql(expectedMatrix);
    });
  });
  */
});
