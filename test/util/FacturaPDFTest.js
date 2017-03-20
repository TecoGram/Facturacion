/* eslint-env node, mocha */

const FacturaPDFData = require('../../backend/pdf/facturaPDFData.js')
require('chai')

describe('FacturaPDF', function () {

  describe('fromVentaRow', function () {

    it('coloca el total y un array con el detalle de formas de pago a una instancia de ventaRow',
      function () {
        const ventaRow = {
          subtotal: 10,
          iva: 2,
          descuento: 0,
          flete: 0,
          formaPago: 0,
        }

        const facturaPDFData = FacturaPDFData.fromVentaRow(ventaRow)
        facturaPDFData.total.should.equal(10.20)
        facturaPDFData.formasDePago[0].should.eql(['EFECTIVO', 10.20])
      })
  })
})
