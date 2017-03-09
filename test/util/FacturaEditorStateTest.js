/* eslint-env node, mocha */

const Immutable = require('immutable')
const chai = require('chai')
  , expect = chai.expect

chai.use(require('chai-string'));

const FacturaEditor = require('../../src/custom/Factura/EditorState.js')
const getState = FacturaEditor.getDefaultState

const crearProducto = () => {
  return {
    rowid: 0,
    codigo: "AA",
    nombre: "A",
    precioDist: 0.99,
    precioVenta: 1.99,
    pagaIva: true,
  }
}

describe('Factura Editor State', function () {

  describe('agregarProductoComoFacturable', function () {
    it('devuelve funcion que agrega un facturable a la lista inmutable del state', function () {
      const state = getState()
      const newProduct = crearProducto()
      const modificacion = FacturaEditor.agregarProductoComoFacturable(newProduct)
      expect(typeof modificacion).to.equal('function')
      const cambios = modificacion(state)
      cambios.facturables.size.should.equal(1)
    })
  })

  describe('editarFacturaExistente', function () {
    it('modifica el estado para editar una factura a partir de la respuesta de "verVenta"', function () {
      const state = getState()
      const verVentaResp = {
        body: {
          cliente: '0956658756',
          facturaData: {
            codigo: '004356',
            fecha: '2017-03-02',
          },
          facturables: [
            {
              nombre: 'A',
              count: 2,
              fechaExp: '2018-03-02',
            },
          ],
        },
      }
      const modificacion = FacturaEditor.editarFacturaExistente(verVentaResp)
      expect(typeof modificacion).to.equal('function')
      const cambios = modificacion(state)
      cambios.cliente.should.equal(verVentaResp.body.cliente)
      cambios.facturaData.should.be.instanceof(Immutable.Map)
      cambios.facturables.should.be.instanceof(Immutable.List)
    })
  })

  describe('modificarValorEnFacturable', function () {
    let state;

    const assertModificacion = (propKey, newPropValue) => {
      const modificacion = FacturaEditor.modificarValorEnFacturable(0,
        propKey, newPropValue)
      expect(typeof modificacion).to.equal('function')
      const cambios = modificacion(state)
      cambios.facturables.get(0).get(propKey).should.equal(newPropValue)
    }

    before(function () {
      state = getState()
      const newProduct = crearProducto()
      const agregarMod = FacturaEditor.agregarProductoComoFacturable(newProduct)
      const cambios = agregarMod(state)
      state.facturables = cambios.facturables

    })
    it('modifica lista de facturables si se le pasa un valor valido de count', function () {
      assertModificacion('count', '5')
    })
    it('retorna null si se le pasa un valor invalido de count', function () {
      const modificacion = FacturaEditor.modificarValorEnFacturable(0, 'count', 's')
      expect(modificacion).to.equal(null)
    })
    it('modifica lista de facturables si se le pasa un valor valido de precioVenta', function () {
      assertModificacion('precioVenta', '19.99')
    })
    it('retorna null si se le pasa un valor invalido de count', function () {
      const modificacion = FacturaEditor.modificarValorEnFacturable(0, 'precioVenta', 's')
      expect(modificacion).to.equal(null)
    })
  })

  describe('modificarValorEnFacturaData', function () {
    it('modifica facturaData si se le pasa un valor valido de descuento', function () {
      const state = getState()
      const modificacion = FacturaEditor.modificarValorEnFacturaData('descuento', '50')
      expect(typeof modificacion).to.equal('function')
      const cambios = modificacion(state)
      cambios.facturaData.get('descuento').should.equal('50')
    })
    it('retorna null si se le pasa un valor invalido de descuento', function () {
      const modificacion = FacturaEditor.modificarValorEnFacturaData('descuento', 's')
      expect(modificacion).to.equal(null)
    })
  })

  describe('puedeGuardarFactura', function () {
    it('retorna true si tiene cliente y por lo menos 1 item facturable', function () {
      const state = getState()
      FacturaEditor.puedeGuardarFactura(state).should.equal(false)
      state.cliente = { ruc: "0956676546" }
      FacturaEditor.puedeGuardarFactura(state).should.equal(false)
      state.facturables = Immutable.List.of(crearProducto())
      FacturaEditor.puedeGuardarFactura(state).should.equal(true)
    })
  })

  describe('prepararFacturaParaGuardar', function () {
    let state;

    before(function () {
      state = getState()
      const newProduct = crearProducto()
      const modificacion = FacturaEditor.agregarProductoComoFacturable(newProduct)
      expect(typeof modificacion).to.equal('function')
      const cambios = modificacion(state)
      state.facturables = cambios.facturables
      state.cliente = { ruc: "0956676546" }
    })

    it('retorna unicamente errores si fracasa al validar factura', function () {
      const {
        errors,
        ventaRow,
        prom,
        msg } = FacturaEditor.prepararFacturaParaGuardar(state, false, "emp")

      expect(ventaRow).to.equal(null)
      expect(prom).to.equal(null)
      expect(msg).to.equal(null)
      expect(errors).to.be.an('object')
      expect(errors).to.have.ownProperty('formaPago')
      expect(errors).to.have.ownProperty('codigo')
    })

    it('retorna unicamente prom, msg y ventaRow si logra validar factura nueva', function () {
      state.facturaData = state.facturaData.set('codigo', '00657')
                            .set('formaPago', 'CONTADO')

      const {
        errors,
        ventaRow,
        prom,
        msg } = FacturaEditor.prepararFacturaParaGuardar(state, false, "emp")

      expect(errors).to.be.null
      prom.url.should.endWith('/venta/new')
      ventaRow.empresa.should.equal("emp")
      msg.should.equal('La factura se generó exitosamente.')
    })

    it('retorna unicamente prom, msg y ventaRow si logra validar factura editada', function () {
      state.facturaData = state.facturaData.set('codigo', '00657')
                            .set('formaPago', 'CONTADO')

      const {
        errors,
        ventaRow,
        prom,
        msg } = FacturaEditor.prepararFacturaParaGuardar(state, true, "emp")

      expect(errors).to.be.null
      prom.url.should.endWith('/venta/update')
      ventaRow.empresa.should.equal("emp")
      msg.should.equal('La factura se editó exitosamente.')
    })
  })
})
