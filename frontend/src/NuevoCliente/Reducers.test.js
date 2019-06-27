jest.mock('facturacion_common/src/api.js', () => ({
  insertarCliente: jest.fn(),
  updateCliente: jest.fn()
}));
import * as Actions from './Actions.js';
import { getDefaultState, createReducer } from './Reducers.js';
import { assertWithSchema, runActions } from '../TestingUtils.js';
import API from 'facturacion_common/src/api.js';

describe('Nuevo cliente reducers', () => {
  it('puede crear un nuevo cliente', async () => {
    const cerrarDialog = jest.fn();
    API.insertarCliente.mockReturnValueOnce(Promise.resolve());

    const actions = [
      { type: Actions.getDefaultState },
      {
        type: Actions.updateInput,
        key: 'tipo',
        value: 'CONSUMIDOR FINAL'
      },
      { type: Actions.updateInput, key: 'id', value: '9999999999' },
      { type: Actions.updateInput, key: 'nombre', value: 'Consumidor Final' },
      {
        type: Actions.updateInput,
        key: 'direccion',
        value: 'Malecon y 9 de Octubre'
      },
      { type: Actions.updateInput, key: 'email', value: 'none@gmail.com' },
      { type: Actions.updateInput, key: 'telefono1', value: '555555' },
      { type: Actions.updateInput, key: 'descDefault', value: '0' },
      { type: Actions.guardar, callback: cerrarDialog }
    ];

    await runActions(createReducer, actions);
    expect(cerrarDialog).toHaveBeenCalledTimes(1);
    expect(API.insertarCliente).toHaveBeenCalledTimes(1);

    const [[inserted]] = API.insertarCliente.mock.calls;
    expect(inserted).toEqual({
      id: '9999999999',
      nombre: 'Consumidor Final',
      direccion: 'Malecon y 9 de Octubre',
      email: 'none@gmail.com',
      telefono1: '555555',
      telefono2: '',
      descDefault: 0,
      tipo: 'consumidor_final'
    });
  });

  it('puede editar cliente existente', async () => {
    const cerrarDialog = jest.fn();
    API.updateCliente.mockReturnValueOnce(Promise.resolve());

    const actions = [
      { type: Actions.updateInput, key: 'direccion', value: 'Guayaquil' },
      { type: Actions.updateInput, key: 'email', value: 'none@somewhere.com' },
      { type: Actions.guardar, callback: cerrarDialog }
    ];

    const initialState = getDefaultState({
      rowid: 1,
      id: '9999999999',
      nombre: 'Consumidor Final',
      direccion: 'Malecon y 9 de Octubre',
      email: 'none@gmail.com',
      telefono1: '555555',
      telefono2: '',
      descDefault: 0,
      tipo: 'consumidor_final'
    });

    await runActions(createReducer, actions, initialState);

    expect(cerrarDialog).toHaveBeenCalledTimes(1);
    expect(API.updateCliente).toHaveBeenCalledTimes(1);

    const [[updated]] = API.updateCliente.mock.calls;
    expect(updated).toEqual(
      expect.objectContaining({
        rowid: 1,
        nombre: 'Consumidor Final',
        direccion: 'Guayaquil',
        email: 'none@somewhere.com'
      })
    );
  });
});
