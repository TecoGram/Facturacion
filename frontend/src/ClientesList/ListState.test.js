import ListState from './ListState.js';

let state;
let stateManager;
const setStateFunc = funcArg => {
  state = Object.assign(state, funcArg(state));
};

describe('Clientes ListView State', () => {
  beforeEach(() => {
    state = { rows: [] };
  });

  const insertarClientesDePruebaTest = () => {
    const resp = {
      body: [
        { ruc: '9999', nombre: 'Test 1' },
        { ruc: '9994', nombre: 'Test 2' }
      ]
    };
    stateManager.colocarClientesDelResponse(resp);
    expect(state.rows).toEqual(resp.body);
  };

  describe('colocarClientesDelResponse', () => {
    it('coloca la lista de clientes que llegan en un response en el state', () => {
      stateManager = new ListState({}, setStateFunc);
      insertarClientesDePruebaTest();
    });
  });

  describe('colocarListaVacia', () => {
    it('coloca una lista vacia en el state', () => {
      stateManager = new ListState({}, setStateFunc);
      insertarClientesDePruebaTest();
      stateManager.colocarListaVacia();
      expect(state.rows).toHaveLength(0);
    });
  });

  describe('removerClienteDeLaLista', () => {
    it('remueve un cliente del state', () => {
      stateManager = new ListState({}, setStateFunc);
      insertarClientesDePruebaTest();
      stateManager.removerClienteDeLaLista('9999');
      expect(state.rows).toEqual([{ ruc: '9994', nombre: 'Test 2' }]);
    });
  });

  describe('mostrarError', () => {
    it('llama a la funcion mostrarErrorConSnackbar de props con el error del response', () => {
      let errorMostrado = null;
      const mostrarErrorConSnackbar = msg => {
        errorMostrado = msg;
      };
      stateManager = new ListState({ mostrarErrorConSnackbar }, setStateFunc);
      const resp = {
        response: {
          text: 'No se pudo borrar'
        }
      };
      stateManager.mostrarError(resp);
      expect(errorMostrado).toEqual(resp.response.text);
    });
  });
});
