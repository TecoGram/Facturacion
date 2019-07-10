import ListState from './ListState.js';

let state;
let stateManager;
const setStateFunc = funcArg => {
  state = Object.assign(state, funcArg(state));
};

describe('Productos ListView State', () => {
  beforeEach(() => {
    state = { rows: [] };
  });

  const insertarProductosDePrebaTest = () => {
    const resp = {
      body: [
        { rowid: 1, precioVenta: 199900, marca: 'TECO' },
        { rowid: 2, precioVenta: 199900, marca: 'TECO' }
      ]
    };
    stateManager.colocarProductosDelResponse(resp);
    expect(state.rows).toEqual([
      {
        rowid: 1,
        precioVenta: 199900,
        precioVentaText: '19.99',
        marca: 'TECO'
      },
      { rowid: 2, precioVenta: 199900, precioVentaText: '19.99', marca: 'TECO' }
    ]);
  };

  describe('colocarProductosDelResponse', () => {
    it('coloca la lista de productos que llegan en un response en el state', () => {
      stateManager = new ListState({}, setStateFunc);
      insertarProductosDePrebaTest();
    });
  });

  describe('colocarListaVacia', () => {
    it('coloca una lista vacia en el state', () => {
      stateManager = new ListState({}, setStateFunc);
      insertarProductosDePrebaTest();
      stateManager.colocarListaVacia();
      expect(state.rows).toHaveLength(0);
    });
  });

  describe('removerProductoDeLaLista', () => {
    it('remueve una venta del state', () => {
      stateManager = new ListState({}, setStateFunc);
      insertarProductosDePrebaTest();
      stateManager.removerProductoDeLaLista(1);
      expect(state.rows).toEqual([
        {
          rowid: 2,
          marca: 'TECO',
          precioVenta: 199900,
          precioVentaText: '19.99'
        }
      ]);
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
