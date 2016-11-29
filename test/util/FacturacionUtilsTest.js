/* eslint-env node, mocha */

const Immutable = require('immutable')
const assert = require('assert');
const chai = require('chai')
  , expect = chai.expect
  , should = chai.should();

const FacturacionUtils = require('../../src/custom/FacturacionUtils.js')

const unexpectedError = Error('Ocurrio algo inesperado');


describe('FacturacionUtils', function () {
  describe('crearVentaRow', function () {
    it('Genera la fila de una venta a partir de un mapa inmutable', function () {
      const clienteObj = {
        ruc: '09455867443001',
      }

      const facturaData = Immutable.Map({
        codigo: '0003235',
        descuento: '10',
        autorizacion: '5962',
        formaPago: 'CONTADO',
        fecha: new Date(2016, 10, 26),
      })

      const ventaRow = FacturacionUtils.crearVentaRow(clienteObj, facturaData)
      ventaRow.cliente.should.equal('09455867443001')
      ventaRow.codigo.should.equal('0003235')
      ventaRow.descuento.should.equal('10')
      ventaRow.autorizacion.should.equal('5962')
      ventaRow.formaPago.should.equal('CONTADO')
      ventaRow.fecha.should.equal('2016-11-26')

    })
  })


  describe('crearUnidadesRows', function () {
    it('Expande la lista de productos facturados para generar ' +
      'filas de unidades vendidas', function () {

      const productos = Immutable.List.of(
        Immutable.Map(
          {
            rowid: 1,
            count: 3,
            lote: '3456f',
            fechaExp: '2017-11-26',
          }),
        Immutable.Map(
          {
            rowid: 4,
            count: 2,
            lote: '3tf6f',
            fechaExp: '2017-11-26',
          })
      )

      const rows = FacturacionUtils.crearUnidadesRows(productos)
      rows.length.should.equal(5)
      rows.forEach((row, i) => {
        expect(row).to.have.property('producto', i < 3 ? 1 : 4)
        expect(row).to.have.property('lote')
        expect(row).to.have.property('fechaExp')
      })
    })
  })

  describe('calcularValores', function() {
    it('agrega los precio de venta multiplicado por la cantidad para calcular rubros de factura', function () {
      const productos = Immutable.List.of(
        Immutable.Map(
          {
            rowid: 1,
            count: 3,
            precioVenta: '25.99',
          }),
        Immutable.Map(
          {
            rowid: 4,
            count: 2,
            precioVenta: '17.99',
          })
      )

      const {
        subtotal,
        rebaja,
        total,
        valorIVA,
      } = FacturacionUtils.calcularValores(productos, '')

      expect(subtotal).to.be.closeTo(113.95, 0.001)
      rebaja.should.equal(0)
      expect(valorIVA).to.be.closeTo(15.953, 0.001)
      expect(total).to.be.closeTo(129.90, 0.005)
    })
  })

})
