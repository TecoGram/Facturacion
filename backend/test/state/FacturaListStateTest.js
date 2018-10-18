/* eslint-env node, mocha */

require('chai');

const ListState = require('../../src/FacturasList/ListState.js');
let state;
const setStateFunc = funcArg => {
  state = Object.assign(state, funcArg(state));
};

describe('Factura ListView State', function() {
  before(function() {
    state = { rows: [] };
  });

  describe('colocarVentas', function() {
    it('coloca la lista de ventas en el state venta del state', function() {
      const newVentas = [
        { codigo: '00435', empresa: 'TECO' },
        { codigo: '00434', empresa: 'TECO' },
      ];
      const stateManager = new ListState({}, setStateFunc);
      stateManager.colocarVentas(newVentas);
      state.should.eql({ rows: newVentas });
      stateManager.colocarVentas([]);
      state.should.eql({ rows: [] });
    });
  });

  describe('deleteVenta', function() {
    it('remueve una venta del state', function() {
      state.rows = [
        { codigo: '00435', empresa: 'TECO' },
        { codigo: '00434', empresa: 'TECO' },
      ];
      const stateManager = new ListState({}, setStateFunc);
      stateManager.deleteVenta('00434', 'TECO');
      state.should.eql({
        rows: [{ codigo: '00435', empresa: 'TECO' }],
      });
    });
  });

  describe('openEditorPage', function() {
    it('ejecuta accion editarFactura en props si tipo es 0', function() {
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
      success.should.be.true;
    });

    it('ejecuta accion editarFacturaExamen en props si tipo es 1', function() {
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
      success.should.be.true;
    });

    it('ejecuta la accion correcta incluso si props es seteado despues de llamar al constructor', function() {
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
      success.should.be.true;
    });
  });
});
