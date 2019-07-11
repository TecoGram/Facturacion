import * as Actions from './Actions.js';
import { excludeKeys } from 'facturacion_common/src/Object.js';
import API from 'facturacion_common/src/api.js';
import Money from 'facturacion_common/src/Money.js';
import {
  validarProductoInsert,
  validarProductoUpdate
} from 'facturacion_common/src/Validacion.js';

export const getDefaultState = producto => {
  if (producto)
    return {
      inputs: { ...producto },
      errors: {},
      serverError: null,
      working: false
    };

  return {
    inputs: {
      nombre: '',
      marca: '',
      codigo: '',
      precioVentaText: '',
      precioDistText: '',
      pagaIva: true
    },
    errors: {},
    serverError: null,
    working: false
  };
};

const createNewInputs = (oldInputs, key, value) => {
  switch (key) {
    case 'precioVenta': {
      return {
        ...oldInputs,
        precioVentaText: value,
        precioVenta: Money.fromString(value)
      };
    }
    case 'precioDist': {
      return {
        ...oldInputs,
        precioDistText: value,
        precioDist: Money.fromString(value)
      };
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

const upload = (producto, callback) => {
  const editing = !!producto.rowid;
  const promise = editing
    ? API.updateProducto(producto)
    : API.insertarProducto(producto);

  return promise
    .then(() => {
      callback(
        editing
          ? `Producto editado: ${producto.nombre}`
          : `Producto creado: ${producto.nombre}`
      );
      return { type: Actions.getDefaultState };
    })
    .catch(err => {
      return { type: Actions.setServerError, serverError: err.text };
    });
};

const guardar = ({ callback }) => state => {
  if (state.working) return state;

  const { errors, inputs } = state.inputs.rowid
    ? validarProductoUpdate(state.inputs)
    : validarProductoInsert(state.inputs);

  if (errors) return { ...state, errors };

  return [state, upload(inputs, callback)];
};

const cerrar = ({ callback }) => state => {
  if (!state.working) callback();

  return state;
};

const editar = ({ producto }) => state => {
  return {
    inputs: {
      ...producto,
      precioVentaText: Money.print(producto.precioVenta),
      precioDistText: Money.print(producto.precioDist),
      pagaIva: !!producto.pagaIva
    },
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
