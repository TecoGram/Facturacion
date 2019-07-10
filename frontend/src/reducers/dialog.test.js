import actionCreators from '../ActionCreators.js';
const defaultStore = require('../DefaultStore.js');
const dialogReducer = require('./dialog.js');
const { CLIENTE_DIALOG, PRODUCTO_DIALOG } = require('../DialogTypes.js');

let state;
describe('dialog reducer', () => {
  beforeEach(() => {
    state = Object.assign({}, defaultStore.dialog);
  });

  it('cambia todos los atributos del state con mostrarDialog action', () => {
    const action = actionCreators.mostrarDialog(CLIENTE_DIALOG, {
      editar: true
    });
    const newState = dialogReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      value: CLIENTE_DIALOG,
      dialogParams: {
        editar: true,
        open: true
      }
    });
  });

  it('Si se cierra el dialog con CAMBIAR_DIALOG_ACTION, se setea editar null', () => {
    const action = actionCreators.cancelarDialog();
    const newState = dialogReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      value: CLIENTE_DIALOG,
      dialogParams: {
        open: false
      }
    });
  });

  it('coloca dialog de cliente listo para editar con editarCliente action', () => {
    const ruc = '999999';
    const action = actionCreators.editarCliente(ruc);
    const newState = dialogReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      value: CLIENTE_DIALOG,
      dialogParams: {
        editar: ruc,
        key: ruc,
        open: true
      }
    });
  });

  it('coloca dialog de producto listo para editar con editarProducto action', () => {
    const editarObj = { rowid: 1, nombre: 'test' };
    const action = actionCreators.editarProducto(editarObj);
    const newState = dialogReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      value: PRODUCTO_DIALOG,
      dialogParams: {
        editar: editarObj,
        open: true
      }
    });
  });

  it('coloca open=false con cancelarDialog action', () => {
    state.open = true;
    const action = actionCreators.cancelarDialog();
    const newState = dialogReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      value: state.value,
      dialogParams: {
        editar: state.editar,
        open: false
      }
    });
  });

  it('coloca open=false con cerrarDialogConMsg action', () => {
    state.open = true;
    const action = actionCreators.cerrarDialogConMsg('Error');
    const newState = dialogReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      value: state.value,
      dialogParams: {
        editar: null,
        open: false
      }
    });
  });
});
