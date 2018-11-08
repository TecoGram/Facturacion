const ListState = require('./ListState.js');

let state;
const setStateFunc = funcArg => {
  state = Object.assign(state, funcArg(state));
};

describe('Factura ListView State', () => {
  beforeAll(() => {
    state = { rows: [] };
  });

  describe('colocarVentas', () => {
    it('coloca la lista de ventas en el state venta del state', () => {
      const newVentas = [
        { codigo: '00435', empresa: 'TECO' },
        { codigo: '00434', empresa: 'TECO' },
      ];
      const stateManager = new ListState({}, setStateFunc);
      stateManager.colocarVentas(newVentas);
      expect(state).toEqual({ rows: newVentas });

      stateManager.colocarVentas([]);
      expect(state).toEqual({ rows: [] });
    });
  });

  describe('deleteVenta', () => {
    it('remueve una venta del state', () => {
      state.rows = [
        { codigo: '00435', empresa: 'TECO' },
        { codigo: '00434', empresa: 'TECO' },
      ];
      const stateManager = new ListState({}, setStateFunc);
      stateManager.deleteVenta('00434', 'TECO');
      expect(state).toEqual({
        rows: [{ codigo: '00435', empresa: 'TECO' }],
      });
    });
  });

  describe('openEditorPage', () => {
    it('ejecuta accion editarFactura en props si tipo es 0', () => {
      let success = false;
      const props = {
        editarFactura: () => {
          success = true;
        },
        editarFacturaExamen: () => {
          success = false;
        },
      };
      const stateManager = new ListState(props, setStateFunc);
      stateManager.openEditorPage('00546', 'TECO', 0);
      expect(success).toEqual(true);
    });

    it('ejecuta accion editarFacturaExamen en props si tipo es 1', () => {
      let success = false;
      const props = {
        editarFactura: () => {
          success = false;
        },
        editarFacturaExamen: () => {
          success = true;
        },
      };
      const stateManager = new ListState(props, setStateFunc);
      stateManager.openEditorPage('00546', 'TECO', 1);
      expect(success).toBe(true);
    });

    it('ejecuta la accion correcta incluso si props es seteado despues de llamar al constructor', () => {
      let success = false;
      const props = {
        editarFactura: () => {
          success = true;
        },
        editarFacturaExamen: () => {
          success = false;
        },
      };
      const stateManager = new ListState({}, setStateFunc);
      stateManager.props = props;
      stateManager.openEditorPage('00546', 'TECO', 0);
      expect(success).toBe(true);
    });
  });
});
