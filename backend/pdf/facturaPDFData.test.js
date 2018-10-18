const FacturaPDFData = require('./facturaPDFData.js');

describe('FacturaPDF', () => {
  describe('fromVentaRow', () => {
    it('coloca la matriz de valores totales y un array con el detalle de formas de pago a una instancia de ventaRow', () => {
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
      expect(facturaPDFData.matrizValoresTotales).toEqual(expectedMatrix);
      expect(facturaPDFData.formasDePago).toEqual(expectedFormasDePago);
      expect(facturaPDFData.total).toEqual(9.89);
    });
  });
});
