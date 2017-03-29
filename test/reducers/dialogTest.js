/* eslint-env node, mocha */

require('chai').should()
const actionCreators = require('../../src/ActionCreators.js')
const defaultStore = require('../../src/DefaultStore.js')
const dialogReducer = require('../../src/reducers/dialog.js')
const { CLIENTE_DIALOG } = require('../../src/DialogTypes.js')

let state
describe('dialog reducer', function() {

  before(function () {
    state = Object.assign({}, defaultStore.dialog)
  })

  it('cambia todos los atributos del state con mostrarDialog action', function() {
    const action = actionCreators.mostrarDialog(CLIENTE_DIALOG, true)
    const newState = dialogReducer(state, action)

    newState.should.not.equal(state)
    newState.should.eql({
      value: CLIENTE_DIALOG,
      editar: true,
      open: true,
    })
  })

  it('coloca dialog de cliente listo para editar con editarCliente action', function() {
    const ruc = '999999'
    const action = actionCreators.editarCliente(ruc)
    const newState = dialogReducer(state, action)

    newState.should.not.equal(state)
    newState.should.eql({
      value: CLIENTE_DIALOG,
      editar: ruc,
      open: true,
    })
  })

  it('coloca open=false con cancelarDialog action', function() {
    state.open = true
    const action = actionCreators.cancelarDialog()
    const newState = dialogReducer(state, action)

    newState.should.not.equal(state)
    newState.should.eql({
      value: state.value,
      editar: state.editar,
      open: false,
    })
  })

  it('coloca open=false con cerrarDialogConMsg action', function() {
    state.open = true
    const action = actionCreators.cerrarDialogConMsg('Error')
    const newState = dialogReducer(state, action)

    newState.should.not.equal(state)
    newState.should.eql({
      value: state.value,
      editar: state.editar,
      open: false,
    })
  })
})
