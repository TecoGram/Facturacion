import * as Actions from './Actions.js';
import { excludeKeys } from 'facturacion_common/src/Object.js';
import { TiposID } from 'facturacion_common/src/Models.js';
import API from 'facturacion_common/src/api.js';
import {
  validarClienteInsert,
  validarClienteUpdate
} from 'facturacion_common/src/Validacion.js';

const tiposReverseMap = Object.keys(TiposID).reduce((acc, key) => {
  const value = TiposID[key];
  return { ...acc, [value]: key };
}, {});

export const getDefaultState = cliente => {
  if (cliente)
    return {
      inputs: { ...cliente },
      errors: {},
      serverError: null,
      working: false
    };

  return {
    inputs: {
      id: '',
      tipoText: '',
      tipo: undefined,
      nombre: '',
      direccion: '',
      email: '',
      telefono1: '',
      telefono2: '',
      descDefault: ''
    },
    errors: {},
    serverError: null,
    working: false
  };
};

const createNewInputs = (oldInputs, key, value) => {
  switch (key) {
    case 'tipo': {
      return { ...oldInputs, tipoText: value, tipo: tiposReverseMap[value] };
    }
    default: {
      return { ...oldInputs, [key]: value };
    }
  }
};

const updateInput = ({ key, value }) => state => {
  const newInputs = createNewInputs(state.inputs, key, value);
  if (!state.errors[key])
    return { ...state, inputs: newInputs, serverError: null };

  const newErrors = excludeKeys(state.errors, [key]);
  return { ...state, inputs: newInputs, errors: newErrors, serverError: null };
};

const setServerError = ({ serverError }) => state => ({
  ...state,
  serverError,
  working: false
});

const upload = (cliente, callback) => {
  const promise = cliente.rowid
    ? API.updateCliente(cliente)
    : API.insertarCliente(cliente);

  return promise
    .then(() => {
      callback();
      return { type: Actions.getDefaultState };
    })
    .catch(err => {
      return { type: Actions.setServerError, serverError: err.text };
    });
};

const guardar = ({ callback }) => state => {
  if (state.working) return state;

  const { errors, inputs } = state.inputs.rowid
    ? validarClienteUpdate(state.inputs)
    : validarClienteInsert(state.inputs);

  if (errors) return { ...state, errors };

  return [state, upload(inputs, callback)];
};

const cerrar = ({ callback }) => state => {
  if (!state.working) callback();

  return state;
};

export const createReducer = ({ type, ...params }) => {
  switch (type) {
    case Actions.getDefaultState:
      return () => getDefaultState();

    case Actions.updateInput:
      return updateInput(params);

    case Actions.setServerError:
      return setServerError(params);

    case Actions.guardar:
      return guardar(params);

    case Actions.cerrar:
      return cerrar(params);

    default:
      return x => x;
  }
};
