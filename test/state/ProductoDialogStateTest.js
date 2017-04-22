/* eslint-env node, mocha */

const chai = require('chai')
chai.should()
chai.use(require('chai-string'));
const expect = chai.expect

const DialogState = require('../../src/NuevoProducto/DialogState.js')
let state
let stateManager
const setStateFunc = (arg) => {
  state = Object.assign (state, arg)
}

const llenarStateConDatosCorrectos = () => {
  state.inputs = {
    codigo: "fsers4",
    nombre: "producto Á",
    marca: "TECO",
    precioDist: 9.99,
    precioVenta: 14.99,
    pagaIva: true,
  }
}

describe('PRODUCTO_DIALOG Dialog State', function () {

  before(function () {
    state = new DialogState({}, setStateFunc).getDefaultState()
  })

  describe('validarDatos', function () {
    it('retorna null si no logra validar el producto', function () {
      stateManager = new DialogState({}, setStateFunc)
      const result = stateManager.validarDatos(state.inputs)
      expect(result).to.be.null
    })

    it('retorna el objeto inputs si logra validar el producto', function () {
      stateManager = new DialogState({}, setStateFunc)
      llenarStateConDatosCorrectos()
      const result = stateManager.validarDatos(state.inputs)
      expect(result).to.be.ok
    })
  })

  describe('cerrarDialogConExito', function (){
    it('cierra el dialog usando el dispatch cerrarDialogConMsg', function () {
      let msg
      const cerrarDialogConMsg = function (message) {
        msg = message
      }
      stateManager = new DialogState({ cerrarDialogConMsg }, setStateFunc)
      llenarStateConDatosCorrectos()
      stateManager.cerrarDialogConExito('test')
      state.should.eql(stateManager.getDefaultState())
      msg.should.endWith('test')
    })
  })

  describe('mostrarErrorDeServidor', function () {
    it('parsea el error de la respuesta y lo coloca en el state', function () {
      stateManager = new DialogState({}, setStateFunc)
      const resp = {response: { text: 'Error!'}}
      stateManager.mostrarErrorDeServidor(resp)
      state.serverError.should.endWith('Error!')
    })
  })

  describe('updateData', function () {
    it('coloca propiedades al state y remueve errores', function () {
      stateManager = new DialogState({}, setStateFunc)
      state.errors.nombre = 'incorrecto'
      stateManager.updateData('nombre', 'test', state)
      expect(state.errors.nombre).to.not.be.ok
      state.inputs.nombre.should.equal('test')
    })
  })

  describe('cancelarDialog', function () {
    it('resetea el estado del dialog y llama al dispatch cancelarDialog', function () {
      let called
      const cancelarDialog = function () {
        called = true
      }
      stateManager = new DialogState({ cancelarDialog }, setStateFunc)
      stateManager.cancelarDialog()
      called.should.be.true
      state.should.eql(stateManager.getDefaultState())
    })
  })

  describe('getMensajeExito', function () {
    it('obtiene el mensaje de exito a mostrar segun el valor de editar en props', function () {
      stateManager = new DialogState({ editar: {} }, setStateFunc)
      const editarMsg = stateManager.getMensajeExito('test')
      editarMsg.should.equal('Producto actualizado: test')

      stateManager.props.editar = null
      const insertarMsg = stateManager.getMensajeExito('test')
      insertarMsg.should.equal('Nuevo producto guardado: test')
    })
  })

  describe('revisarDataParaEditar', function () {
    it('revisa props y si hay un objeto editar se lo pasa al state', function () {
      const editar = {
        rowid: 1,
        codigo: "fgdfg4",
        nombre: "producto B",
        marca: "BIO",
        precioDist: 19.99,
        precioVenta: 24.99,
        pagaIva: 0,
      }
      const editarInputs = {
        rowid: 1,
        codigo: "fgdfg4",
        nombre: "producto B",
        marca: "BIO",
        precioDist: '19.99',
        precioVenta: '24.99',
        pagaIva: false,
      }
      stateManager = new DialogState({ editar }, setStateFunc)
      stateManager.revisarDataParaEditar()
      state.inputs.should.eql(editarInputs)
    })
  })
})
