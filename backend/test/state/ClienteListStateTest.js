/* eslint-env node, mocha */

require('chai').should();

const ListState = require('../../src/ClientesList/ListState.js');
let state;
let stateManager;
const setStateFunc = funcArg => {
  state = Object.assign(state, funcArg(state));
};

describe('Clientes ListView State', function() {
  before(function() {
    state = { rows: [] };
  });

  const insertarClientesDePruebaTest = () => {
    const resp = {
      body: [
        { ruc: '9999', nombre: 'Test 1' },
        { ruc: '9994', nombre: 'Test 2' },
      ],
    };
    stateManager.colocarClientesDelResponse(resp);
    state.rows.should.eql(resp.body);
  };

  describe('colocarClientesDelResponse', function() {
    it('coloca la lista de clientes que llegan en un response en el state', function() {
      stateManager = new ListState({}, setStateFunc);
      insertarClientesDePruebaTest();
    });
  });

  describe('colocarListaVacia', function() {
    it('coloca una lista vacia en el state', function() {
      stateManager = new ListState({}, setStateFunc);
      insertarClientesDePruebaTest();
      stateManager.colocarListaVacia();
      state.rows.length.should.equal(0);
    });
  });

  describe('removerClienteDeLaLista', function() {
    it('remueve un cliente del state', function() {
      stateManager = new ListState({}, setStateFunc);
      insertarClientesDePruebaTest();
      stateManager.removerClienteDeLaLista('9999');
      state.rows.should.eql([{ ruc: '9994', nombre: 'Test 2' }]);
    });
  });

  describe('mostrarError', function() {
    it('llama a la funcion mostrarErrorConSnackbar de props con el error del response', function() {
      let errorMostrado = null;
      const mostrarErrorConSnackbar = msg => {
        errorMostrado = msg;
      };
      stateManager = new ListState({ mostrarErrorConSnackbar }, setStateFunc);
      const resp = {
        response: {
          text: 'No se pudo borrar',
        },
      };
      stateManager.mostrarError(resp);
      errorMostrado.should.equal(resp.response.text);
    });
  });
});
