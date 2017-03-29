/* eslint-env node, mocha */

const chai = require('chai')
chai.should()
chai.use(require('chai-string'));
const expect = chai.expect

const DialogState = require('../../src/custom/NuevoCliente/DialogState.js')
let state
let stateManager
const setStateFunc = (arg) => {
  state = Object.assign (state, arg)
}

const llenarStateConDatosCorrectos = () => {
  state.inputs = {
    ruc: '0937816882001',
    nombre: 'Dr. Julio Mendoza',
    direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
    correo: 'julio_mendoza@yahoo.com.ec',
    telefono1: '2645422', telefono2: '2876357', descDefault: '0',
  }
}

describe('Cliente Dialog State', function () {

  before(function () {
    state = {
      inputs: {},
      errors: {},
      serverError: null,
    }
  })

  describe('validarDatos', function () {
    it('retorna null si no logra validar el cliente', function () {
      stateManager = new DialogState({}, setStateFunc)
      const result = stateManager.validarDatos(state.inputs)
      expect(result).to.be.null
    })

    it('retorna el objeto inputs si logra validar el cliente', function () {
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
      state.should.eql({
        inputs: {},
        errors: {},
        serverError: null,
      })
    })
  })

  describe('revisarDataParaEditar', function () {
    it('revisa props y si hay un objeto editar se lo pasa al state', function () {
      const editar = {
        ruc: '0937816882001',
        nombre: 'Dr. Julio Mendoza',
        direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
        correo: 'julio_mendoza@yahoo.com.ec',
        telefono1: '2645422', telefono2: '2876357', descDefault: '0',
      }
      stateManager = new DialogState({ editar }, setStateFunc)
      stateManager.revisarDataParaEditar()
      state.inputs.should.eql(editar)
    })
  })
})
