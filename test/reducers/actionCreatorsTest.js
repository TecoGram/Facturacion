/* eslint-env node, mocha */

require('chai').should()
const actionCreators = require('../../src/ActionCreators.js')
const {
  CLIENTE_DIALOG,
  MEDICO_DIALOG, PRODUCTO_DIALOG } = require('../../src/DialogTypes.js')

describe('ActionCreators', function () {

  describe('mostrarDialog', function () {
    it('permite mostrar dialog para cliente', function (){
      const action = actionCreators.mostrarDialog(CLIENTE_DIALOG, true)
      action.value.should.equal(CLIENTE_DIALOG)
      action.editar.should.be.true
    })
    it('permite mostrar dialog para medico', function (){
      const action = actionCreators.mostrarDialog(MEDICO_DIALOG, false)
      action.value.should.equal(MEDICO_DIALOG)
      action.editar.should.be.false
    })
    it('permite mostrar dialog para producto', function (){
      const action = actionCreators.mostrarDialog(PRODUCTO_DIALOG, true)
      action.value.should.equal(PRODUCTO_DIALOG)
      action.editar.should.be.true
    })
  })
})
