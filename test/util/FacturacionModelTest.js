/* eslint-env node, mocha */

const Immutable = require('immutable')
const chai = require('chai')
  , expect = chai.expect

const FacturacionModels = require('../../src/custom/Factura/Models.js')
const FacturacionMath = require('../../src/custom/Factura/Math.js')
const DateParser = require('../../src/DateParser.js')

describe('Facturacion Models', function () {
  describe('crearVentaRow', function () {
    const clienteObj = {
      ruc: '09455867443001',
    }

    const facturaData = Immutable.Map({
      codigo: '0003235',
      descuento: '10',
      autorizacion: '5962',
      formaPago: 'CONTADO',
      detallado: true,
      flete: "",
      fecha: new Date(2016, 10, 26),
    })

    const facturables = Immutable.List.of(
      Immutable.Map({
        producto: 1,
        lote: 'asd3',
        fechaExp: DateParser.parseDBDate('2017-02-02'), //Fecha como la pone la DB
        count: 1,
        precioVenta: 10,
        pagaIva: true,
      }),
      Immutable.Map({
        producto: 2,
        lote: 'asd5',
        fechaExp: DateParser.oneYearFromToday(), //fecha como la pone FacturarView por default
        count: 2,
        precioVenta: 20,
        pagaIva: true,
      })
    )
    const unidades = [
      {
        producto: 1,
        lote: 'asd3',
        fechaExp: DateParser.parseDBDate('2017-02-02'), //Fecha como la pone la DB
        count: 1,
        precioVenta: 10,
        pagaIva: true,
      },
      {
        producto: 2,
        lote: 'asd5',
        fechaExp: DateParser.oneYearFromToday(), //fecha como la pone FacturarView por default
        count: 2,
        precioVenta: 20,
        pagaIva: true,
      },
    ]

    const empresa = "TecoGram"

    it('Genera la fila de una venta a partir de un mapa inmutable', function () {
      const ventaRow = FacturacionModels.crearVentaRow(clienteObj, facturaData,
        facturables, unidades, empresa, false, 14)
      ventaRow.cliente.should.equal('09455867443001')
      ventaRow.codigo.should.equal('0003235')
      ventaRow.subtotal.should.equal(50)
      ventaRow.descuento.should.equal('10')
      ventaRow.empresa.should.equal(empresa)
      ventaRow.iva.should.equal(14)
      ventaRow.autorizacion.should.equal('5962')
      ventaRow.flete.should.equal('')
      ventaRow.detallado.should.be.true
      ventaRow.formaPago.should.equal('CONTADO')
      ventaRow.fecha.should.equal('2016-11-26')

      const venta_unidades = ventaRow.unidades
      venta_unidades.length.should.equal(unidades.length)

      const primerItem = venta_unidades[0]
      primerItem.producto.should.equal(1)
      primerItem.lote.should.equal('asd3')
      primerItem.fechaExp.should.equal(unidades[0].fechaExp)
      primerItem.precioVenta.should.equal(10)
      primerItem.count.should.equal(1)

      const segundoItem = venta_unidades[1]
      segundoItem.producto.should.equal(2)
      segundoItem.lote.should.equal('asd5')
      segundoItem.fechaExp.should.equal(unidades[1].fechaExp)
      segundoItem.precioVenta.should.equal(20)
      segundoItem.count.should.equal(2)
    })


    it('Genera la fila de una venta con cero iva y detallado = false si es examen', function () {
      const ventaRow = FacturacionModels.crearVentaRow(clienteObj, facturaData,
        facturables, unidades, empresa, true, 14)
      ventaRow.detallado.should.be.false
      ventaRow.iva.should.equal(0)
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

      const rows = FacturacionModels.crearUnidadesRows(productos)
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
            pagaIva: true,
          }),
        Immutable.Map(
          {
            rowid: 4,
            count: 2,
            precioVenta: '17.99',
            pagaIva: true,
          })
        )

      const {
        subtotal,
        rebaja,
        impuestos,
        total,
      } = FacturacionMath.calcularValoresFacturablesImm(productos, 2.99, 14, 10)

      expect(subtotal).to.be.closeTo(113.95, 0.001)
      expect(rebaja).to.be.closeTo(11.395, 0.001)
      expect(impuestos).to.be.closeTo(14.358, 0.001)
      expect(total).to.be.closeTo(119.90, 0.005)
    })
  })

  describe('productoAFacturable', function() {
    it('convierte una fila de producto a un objeto facturable con valores por defecto', function () {
      const producto = {
        rowid: 14,
        nombre: 'Acido Urico',
        pagaIva: true,
        precioDist: 19.99,
        precioVenta: 29.99,
        codigo: 'asdf',
      }

      const facturable = FacturacionModels.productoAFacturable(producto)

      facturable.should.have.property('producto', producto.rowid)
      facturable.should.not.have.property('rowid')
      facturable.should.not.have.property('precioDist')
      facturable.should.have.property('codigo')
      facturable.should.have.property('nombre')
      facturable.should.have.property('precioVenta', '' + producto.precioVenta)
      facturable.should.have.property('fechaExp')
      facturable.should.have.property('count', '1')
      facturable.should.have.property('lote', '')
    })
  })

  describe('facturable', function() {
    it('convierte un objeto facturable a una fila de unidad con valores por defecto', function () {
      const facturable = {
        producto: 1,
        nombre: 'Acido Urico',
        pagaIva: true,
        precioVenta: 29.99,
        codigo: 'asdf',
        fechaExp: new Date(),
        count: 1,
        lote: '',
      }

      const unidad = FacturacionModels.facturableAUnidad(facturable)

      unidad.should.have.property('producto')
      unidad.should.not.have.property('pagaIva')
      unidad.should.not.have.property('codigo')
      unidad.should.not.have.property('nombre')
      unidad.should.have.property('precioVenta', facturable.precioVenta)
      unidad.should.have.property('fechaExp')
      unidad.should.have.property('count', 1)
      unidad.should.have.property('lote', '')
    })
  })
})
