import * as Actions from './Actions.js';
import { createReducer } from './Reducers.js';
import { assertWithSchema, runActions } from '../TestingUtils.js';

describe('Pagos reducers', () => {
  it('puede agregar y editar multiples pagos', async () => {
    const cancelarDialog = jest.fn();
    const onSaveData = jest.fn();

    const actions = [
      { type: Actions.getDefaultState },
      {
        type: Actions.agregarPago,
        key: 0,
        originalPagos: []
      },
      {
        type: Actions.updateFormaPago,
        index: 0,
        formaPagoText: 'EFECTIVO',
        formaPago: 'efectivo',
        originalPagos: []
      },
      {
        type: Actions.updateValor,
        index: 0,
        valorText: '10',
        originalPagos: []
      },
      {
        type: Actions.agregarPago,
        key: 1,
        originalPagos: []
      },
      {
        type: Actions.updateFormaPago,
        index: 1,
        formaPagoText: 'TARJETA DE CRÉDITO',
        formaPago: 'tarjeta_credito',
        originalPagos: []
      },
      {
        type: Actions.updateValor,
        index: 1,
        valorText: '15.5',
        originalPagos: []
      },
      {
        type: Actions.guardarPagos,
        onSaveData,
        cancelarDialog
      }
    ];

    const finalState = await runActions(createReducer, actions);
    expect(finalState.pagos).toEqual([]);

    const [[savedPagos]] = onSaveData.mock.calls;
    expect(cancelarDialog).toHaveBeenCalledTimes(1);
    expect(savedPagos).toEqual([
      {
        key: 0,
        formaPagoText: 'EFECTIVO',
        formaPago: 'efectivo',
        valorText: '10',
        valor: 100000
      },
      {
        key: 1,
        formaPagoText: 'TARJETA DE CRÉDITO',
        formaPago: 'tarjeta_credito',
        valorText: '15.5',
        valor: 155000
      }
    ]);
  });

  it('muestra errores cuando intenta guardar con datos invalidos', async () => {
    const cancelarDialog = jest.fn();
    const onSaveData = jest.fn();

    const actions = [
      { type: Actions.getDefaultState },
      {
        type: Actions.agregarPago,
        key: 0,
        originalPagos: []
      },
      {
        type: Actions.updateFormaPago,
        index: 0,
        formaPagoText: 'EFECTIVO',
        formaPago: 'efectivo',
        originalPagos: []
      },
      {
        type: Actions.updateValor,
        index: 0,
        valorText: '1w',
        originalPagos: []
      },
      {
        type: Actions.guardarPagos,
        onSaveData,
        cancelarDialog
      }
    ];

    const finalState = await runActions(createReducer, actions);
    expect(finalState).toEqual(
      expect.objectContaining({
        errorMsg: 'Por favor ingresa un valor de pago mayor que cero.',
        modificado: true
      })
    );

    expect(cancelarDialog).toHaveBeenCalledTimes(0);
    expect(onSaveData).toHaveBeenCalledTimes(0);
  });
});
