/* eslint-env node, mocha */

require('chai')

const ListState = require('../../src/ProductosList/ListState.js')
let state
let stateManager
const setStateFunc = (funcArg) => {
  state = Object.assign (state, funcArg(state))
}

describe('Productos ListView State', function () {

  before(function () {
    state = { rows: []}
  })

  const insertarProductosDePrebaTest = () => {
    const resp = {
      body: [{rowid: 1, marca: 'TECO'}, {rowid: 2, marca: 'TECO'}],
    }
    stateManager.colocarProductosDelResponse(resp)
    state.rows.should.eql(resp.body)
  }

  describe('colocarProductosDelResponse', function () {
    it('coloca la lista de productos que llegan en un response en el state', function () {
      stateManager = new ListState({}, setStateFunc)
      insertarProductosDePrebaTest()
    })
  })

  describe('colocarListaVacia', function () {
    it('coloca una lista vacia en el state', function () {
      stateManager = new ListState({}, setStateFunc)
      insertarProductosDePrebaTest()
      stateManager.colocarListaVacia()
      state.rows.length.should.equal(0)
    })
  })

  describe('removerProductoDeLaLista', function () {
    it('remueve una venta del state', function () {
      stateManager = new ListState({}, setStateFunc)
      insertarProductosDePrebaTest()
      stateManager.removerProductoDeLaLista(1)
      state.rows.should.eql([{rowid: 2, marca: 'TECO'}])
    })
  })

  describe('mostrarError', function () {
    it('llama a la funcion mostrarErrorConSnackbar de props con el error del response', function() {
      let errorMostrado = null
      const mostrarErrorConSnackbar = (msg) => { errorMostrado = msg }
      stateManager = new ListState({ mostrarErrorConSnackbar }, setStateFunc)
      const resp = {
        response: {
          text: 'No se pudo borrar',
        },
      }
      stateManager.mostrarError(resp)
      errorMostrado.should.equal(resp.response.text)

    })
  })

})
