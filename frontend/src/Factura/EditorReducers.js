import {
  sanitizarFacturaInput,
  sanitizarUnidadInput,
  validarVentaInsert,
  validarVentaExamenInsert
} from 'facturacion_common/src/Validacion.js';
import {
  oneYearFromToday,
  toReadableDate
} from 'facturacion_common/src/DateParser.js';
import * as Actions from './EditorActions.js';
import API from 'facturacion_common/src/api.js';
import Money from 'facturacion_common/src/Money.js';
import DateParser from 'facturacion_common/src/DateParser.js';

export const getDefaultState = () => ({
  clienteRow: null,
  medicoRow: null,
  errors: {},
  inputs: {
    fecha: new Date(),
    descuento: '',
    autorizacion: '',
    flete: '',
    detallado: true,
    paciente: '',
    guia: ''
  },
  unidades: [],
  pagos: [],
  guardando: false
});

const findValidacionErrors = (config, state) => {
  if (!state.clienteRow) return 'Por favor ingresa un cliente.';

  if (state.unidades.length === 0) return 'Por favor ingresa un producto.';

  if (config.isExamen && !state.medicoRow)
    return 'Por favor ingresa un médico.';

  return null;
};

const crearVenta = (config, state, subtotal) => {
  const { clienteRow, medicoRow, inputs } = state;
  return {
    codigo: '',
    empresa: config.empresa,
    cliente: clienteRow.rowid,
    fecha: toReadableDate(inputs.fecha),
    autorizacion: inputs.autorizacion,
    guia: inputs.guia,
    detallado: inputs.detallado,
    descuento: inputs.descuento,
    iva: config.iva,
    subtotal,
    medico: (medicoRow || {}).rowid,
    paciente: inputs.paciente,
    unidades: state.unidades,
    pagos: state.pagos
  };
};

const insertarVenta = (venta, callback) =>
  API.insertarVenta(venta)
    .then(res => {
      callback({ success: true });
      return { type: Actions.getDefaultState };
    })
    .catch(err => {
      callback({ success: false, msg: err.text });
      return { type: Actions.abortInsert };
    });

const guardarFactura = ({ config, subtotal, callback }) => state => {
  if (state.guardando) return state;

  const vError = findValidacionErrors(config, state);
  if (vError) {
    callback({ success: false, msg: vError });
    return;
  }
  const venta = crearVenta(config, state, subtotal);
  const validacionFn = config.isExamen
    ? validarVentaExamenInsert
    : validarVentaInsert;
  const { errors, inputs } = validacionFn(venta);
  if (errors) {
    console.log('errors', errors);
    callback({
      success: false,
      msg: 'Por favor revisa los datos ingresados.'
    });
    return {
      ...state,
      errors: {
        ...state.errors,
        ...errors
      }
    };
  }

  return [{ ...state, guardando: true }, insertarVenta(inputs, callback)];
};

const updateFacturaInput = ({ key, value }) => state => {
  const { inputs } = state;
  const sanitizedValue = sanitizarFacturaInput(key, value);
  if (sanitizedValue != null)
    return { ...state, inputs: { ...inputs, [key]: value } };
  return state;
};

const updateUnidadInput = ({ index, key, value }) => state => {
  const { unidades } = state;
  const sanitizedValue = sanitizarUnidadInput(key, value);
  if (sanitizedValue != null) {
    const newUnidades = [...unidades];
    switch (key) {
      case 'count': {
        newUnidades[index] = {
          ...unidades[index],
          countText: value,
          count: sanitizedValue
        };
        break;
      }
      case 'precioVenta': {
        newUnidades[index] = {
          ...unidades[index],
          precioVentaText: value,
          precioVenta: sanitizedValue
        };
        break;
      }
      default: {
        newUnidades[index] = {
          ...unidades[index],
          [key]: sanitizedValue
        };
      }
    }
    return { ...state, unidades: newUnidades };
  }
  return state;
};

const agregarProducto = params => state => {
  const { precioDist, nombreAscii, rowid, ...unidad } = params.productoRow;
  unidad.lote = '';
  unidad.count = 1;
  unidad.countText = '1';
  unidad.precioVentaText = Money.print(unidad.precioVenta);
  unidad.producto = rowid;
  unidad.fechaExp = toReadableDate(oneYearFromToday());

  return { ...state, unidades: [...state.unidades, unidad] };
};

const setCliente = ({ clienteRow }) => state => ({ ...state, clienteRow });

const setMedico = ({ medicoRow }) => state => ({ ...state, medicoRow });

const abortInsert = state => ({ ...state, guardando: false });

const getVenta = ({ ventaKey, isExamen }) => {
  const fetchFn = isExamen ? API.verVentaExamen : API.verVenta;
  return fetchFn(ventaKey)
    .then(res => {
      const venta = DateParser.verVenta(res.body);
      return {
        type: Actions.editarFactura,
        venta
      };
    })
    .catch(err => {
      return { type: Actions.getDefaultState };
    });
};

const getFacturaExistente = params => state => {
  const { ventaKey } = params;
  if (!ventaKey) return state;

  return [state, getVenta(params)];
};

const removeUnidad = ({ index }) => state => {
  const unidades = [...state.unidades];
  unidades.splice(index, 1);
  return { ...state, unidades };
};

const updatePagos = ({ pagos }) => state => {
  return { ...state, pagos };
};

const editarFactura = ({ venta }) => state => {
  return { ...state, ...venta };
};

export const createReducer = action => {
  const { type, ...params } = action;
  switch (type) {
    case Actions.getDefaultState: {
      return getDefaultState;
    }

    case Actions.guardarFactura: {
      return guardarFactura(params);
    }

    case Actions.updateFacturaInput: {
      return updateFacturaInput(params);
    }

    case Actions.updateUnidadInput: {
      return updateUnidadInput(params);
    }
    case Actions.abortInsert: {
      return abortInsert;
    }

    case Actions.setCliente: {
      return setCliente(params);
    }

    case Actions.setMedico: {
      return setMedico(params);
    }

    case Actions.agregarProducto: {
      return agregarProducto(params);
    }

    case Actions.getFacturaExistente: {
      return getFacturaExistente(params);
    }

    case Actions.editarFactura: {
      return editarFactura(params);
    }

    case Actions.removeUnidad: {
      return removeUnidad(params);
    }

    case Actions.updatePagos: {
      return updatePagos(params);
    }

    default: {
      return x => x;
    }
  }
};
