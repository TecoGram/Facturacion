import * as Actions from './Actions.js';
import { sanitizarDinero } from 'facturacion_common/src/Validacion.js';

export const getDefaultState = () => ({
  modificado: false,
  pagos: [],
  errorMsg: ''
});

const updateFormaPago = params => state => {
  const { index, formaPagoText, formaPago, originalPagos } = params;

  const src = state.modificado ? state.pagos : originalPagos;
  const newPagos = [
    ...src.slice(0, index),
    { ...src[index], formaPagoText, formaPago },
    ...src.slice(index + 1)
  ];

  return { ...state, modificado: true, pagos: newPagos };
};

const updateValor = params => state => {
  const { index, valorText, originalPagos } = params;
  const valor = sanitizarDinero(valorText);

  const src = state.modificado ? state.pagos : originalPagos;
  const newPagos = [
    ...src.slice(0, index),
    { ...src[index], valor, valorText },
    ...src.slice(index + 1)
  ];

  return { ...state, modificado: true, pagos: newPagos };
};

const agregarPago = params => state => {
  const src = state.modificado ? state.pagos : params.originalPagos;
  const newPagos = [
    ...src,
    {
      key: params.key,
      formaPagoText: '',
      formaPago: undefined,
      valorText: '',
      valor: undefined
    }
  ];

  return {
    ...state,
    modificado: true,
    pagos: newPagos
  };
};

const removerPago = params => state => {
  const { index, originalPagos } = params;
  const src = state.modificado ? state.pagos : originalPagos;
  const newPagos = [...src.slice(0, index), ...src.slice(index + 1)];

  return { ...state, modificado: true, pagos: newPagos };
};

const guardarPagos = params => state => {
  const { modificado, pagos } = state;

  if (!modificado) {
    params.cancelarDialog();
    return getDefaultState();
  }

  const needsFormaPago = pagos.find(item => !item.formaPago);
  if (needsFormaPago)
    return {
      ...state,
      errorMsg: 'Por favor selecciona una forma de pago válida.'
    };

  const needsValor = pagos.find(item => !item.valor);
  if (needsValor)
    return {
      ...state,
      errorMsg: 'Por favor ingresa un valor de pago mayor que cero.'
    };

  params.onSaveData(pagos);
  params.cancelarDialog();

  return getDefaultState();
};

export const createReducer = ({ type, ...params }) => {
  switch (type) {
    case Actions.getDefaultState:
      return getDefaultState;

    case Actions.updateFormaPago:
      return updateFormaPago(params);

    case Actions.updateValor:
      return updateValor(params);

    case Actions.agregarPago:
      return agregarPago(params);

    case Actions.removerPago:
      return removerPago(params);

    case Actions.guardarPagos:
      return guardarPagos(params);

    default:
      return x => x;
  }
};
