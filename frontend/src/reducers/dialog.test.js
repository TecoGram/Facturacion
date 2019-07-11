import ClienteForm from '../NuevoCliente/ClienteForm';
import ProductoForm from '../NuevoProducto/ProductoForm';

import actionCreators from '../ActionCreators.js';
import dialogReducer from './dialog.js';

const defaultStore = require('../DefaultStore.js');
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
      Content: ClienteForm,
      open: true,
      title: 'Nuevo Cliente'
    });
  });

  it('coloca dialog de cliente listo para editar con editarCliente action', () => {
    const ruc = '999999';
    const action = actionCreators.editarCliente(ruc);
    const newState = dialogReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      Content: ClienteForm,
      editar: ruc,
      open: true,
      title: 'Editar Cliente'
    });
  });

  it('coloca dialog de producto listo para editar con editarProducto action', () => {
    const editarObj = { rowid: 1, nombre: 'test' };
    const action = actionCreators.editarProducto(editarObj);
    const newState = dialogReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      Content: ProductoForm,
      editar: editarObj,
      open: true,
      title: 'Editar Producto'
    });
  });

  it('coloca open=false con cerrarDialogConMsg action', () => {
    state.open = true;
    const action = actionCreators.cerrarDialogConMsg('Error');
    const newState = dialogReducer(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      editar: null,
      open: false
    });
  });
});
