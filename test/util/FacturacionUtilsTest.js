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

      const productos = Immutable.List.of(
        Immutable.Map({
          rowid: 1,
          lote: 'asd3',
          fechaExp: '2017-02-02',
          count: 1,
          precioVenta: 10,
        }),
        Immutable.Map({
          rowid: 2,
          lote: 'asd5',
          fechaExp: '2017-02-02',
          count: 2,
          precioVenta: 20,
        })
      )
      const ventaRow = FacturacionUtils.crearVentaRow(clienteObj, facturaData, productos)
      ventaRow.cliente.should.equal('09455867443001')
      ventaRow.codigo.should.equal('0003235')
      ventaRow.subtotal.should.equal(50)
      ventaRow.descuento.should.equal(5)
      expect(ventaRow.iva).to.be.closeTo(7, 0.001)
      expect(ventaRow.total).to.be.closeTo(52, 0.001)
      ventaRow.autorizacion.should.equal('5962')
      ventaRow.formaPago.should.equal('CONTADO')
      ventaRow.fecha.should.equal('2016-11-26')

      const unidades = ventaRow.productos
      unidades.length.should.equal(2)

      const primerItem = unidades[0]
      primerItem.producto.should.equal(1)
      primerItem.lote.should.equal('asd3')
      primerItem.fechaExp.should.equal('2017-02-02')
      primerItem.precioVenta.should.equal(10)
      primerItem.count.should.equal(1)

      const segundoItem = unidades[1]
      segundoItem.producto.should.equal(2)
      segundoItem.lote.should.equal('asd5')
      segundoItem.fechaExp.should.equal('2017-02-02')
      segundoItem.precioVenta.should.equal(20)
      segundoItem.count.should.equal(2)
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
