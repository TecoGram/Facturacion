import * as Actions from './Actions.js';
import { excludeKeys } from 'facturacion_common/src/Object.js';
import API from 'facturacion_common/src/api.js';
import {
  validarMedicoInsert,
  validarMedicoUpdate
} from 'facturacion_common/src/Validacion.js';

export const getDefaultState = medico => {
  if (medico)
    return {
      inputs: { ...medico },
      errors: {},
      serverError: null,
      working: false
    };

  return {
    inputs: {
      nombre: '',
      direccion: '',
      email: '',
      telefono1: '',
      telefono2: '',
      comision: ''
    },
    errors: {},
    serverError: null,
    working: false
  };
};

const updateInput = ({ key, value }) => state => {
  const newInputs = { ...state.inputs, [key]: value };
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

const upload = (medico, callback) => {
  const promise = medico.rowid
    ? API.updateMedico(medico)
    : API.insertarMedico(medico);

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
    ? validarMedicoUpdate(state.inputs)
    : validarMedicoInsert(state.inputs);

  if (errors) return { ...state, errors };

  return [state, upload(inputs, callback)];
};

const cerrar = ({ callback }) => state => {
  if (!state.working) callback();

  return state;
};

const editar = ({ medico }) => state => {
  return {
    inputs: { ...medico },
    errors: {},
    serverError: null,
    working: false
  };
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

    case Actions.editar:
      return editar(params);

    default:
      return x => x;
  }
};
