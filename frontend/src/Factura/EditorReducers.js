import {
  sanitizarFacturaInput,
  sanitizarUnidadInput,
  validarVentaInsert,
  validarVentaUpdate,
  validarVentaExamenInsert,
  validarVentaExamenUpdate
} from 'facturacion_common/src/Validacion.js';
import {
  oneYearFromToday,
  toReadableDate,
  toDatilDate
} from 'facturacion_common/src/DateParser.js';
import { calcularValoresFacturables } from 'facturacion_common/src/Math.js';
import * as Actions from './EditorActions.js';
import API from 'facturacion_common/src/api.js';
import Money from 'facturacion_common/src/Money.js';
import DateParser from 'facturacion_common/src/DateParser.js';
import { FormasDePago } from 'facturacion_common/src/Models.js';

export const getDefaultState = () => ({
  clienteRow: null,
  medicoRow: null,
  errors: {},
  inputs: {
    codigo: '',
    fecha: 'now',
    descuento: '',
    autorizacion: '',
    flete: '',
    detallado: true,
    paciente: '',
    contable: false,
    guia: ''
  },
  unidades: [],
  pagos: [],
  guardando: false
});

const findValidacionErrors = (config, state) => {
  if (!state.clienteRow) return 'Por favor ingresa un cliente.';

  if (state.unidades.length === 0) return 'Por favor ingresa un producto.';

  if (config.isExamen && !state.inputs.paciente)
    return 'Por favor ingresa un paciente.';

  return null;
};

const crearVenta = (config, state, subtotal) => {
  const { clienteRow, medicoRow, inputs } = state;
  const ventaDate = inputs.fecha === 'now' ? new Date() : inputs.fecha;
  return {
    codigo: inputs.codigo || '',
    rowid: inputs.rowid,
    empresa: config.empresa,
    cliente: clienteRow.rowid,
    fecha: toDatilDate(ventaDate),
    autorizacion: inputs.autorizacion,
    guia: inputs.guia,
    contable: inputs.contable,
    detallado: inputs.detallado,
    tipo: config.isExamen ? 1 : 0,
    descuento: inputs.descuento,
    iva: config.iva,
    subtotal,
    medico: (medicoRow || {}).rowid,
    paciente: inputs.paciente,
    unidades: state.unidades,
    pagos: state.pagos
  };
};

const subirVenta = ({ config, venta, callback }) => {
  const uploadFn = config.editar ? API.updateVenta : API.insertarVenta;
  return uploadFn(venta)
    .then(res => {
      callback({ success: true, rowid: res.body.rowid });
      return { type: Actions.getDefaultState };
    })
    .catch(err => {
      callback({ success: false, msg: err.response.text });
      return { type: Actions.abortInsert };
    });
};

const validarPagos = (pagos, total) => {
  const totalPagado = pagos.reduce(
    (acc, i) => (i.valor ? acc + i.valor : acc),
    0
  );
  if (totalPagado === total) return { pagos };

  const diff = Math.abs(totalPagado - total);
  if (diff < 100) {
    const nuevosPagos = [...pagos];
    const [primerPago] = pagos;
    nuevosPagos[0].valor =
      totalPagado < total ? primerPago.valor + diff : primerPago.valor - diff;
    return { pagos: nuevosPagos };
  }

  return {
    pagosError:
      totalPagado < total
        ? `Por favor revisa los pagos. Faltan $${Money.print(diff)}`
        : `Por favor revisa los pagos. Sobran $${Money.print(diff)}`
  };
};

const guardarFactura = ({ config, callback }) => state => {
  if (state.guardando) return state;

  const vError = findValidacionErrors(config, state);
  if (vError) {
    callback({ success: false, msg: vError });
    return state;
  }

  const { subtotal, total } = calcularValoresFacturables({
    unidades: state.unidades,
    descuento: state.inputs.descuento || 0,
    iva: config.isExamen ? 0 : config.iva,
    flete: state.inputs.flete || 0
  });

  const { pagos, pagosError } = validarPagos(state.pagos, total);
  if (pagosError) {
    callback({ success: false, msg: pagosError });
    return state;
  }

  const venta = crearVenta(config, { ...state, pagos }, subtotal);
  const validacionFn = config.editar
    ? config.isExamen
      ? validarVentaExamenUpdate
      : validarVentaUpdate
    : config.isExamen
    ? validarVentaExamenInsert
    : validarVentaInsert;
  const { errors, inputs } = validacionFn(venta);
  if (errors) {
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

  return [
    { ...state, guardando: true },
    subirVenta({ config, venta: inputs, callback })
  ];
};

const updateFacturaInput = ({ key, value }) => state => {
  const { inputs } = state;
  const sanitizedValue = sanitizarFacturaInput(key, value);
  if (sanitizedValue != null) {
    switch (key) {
      case 'flete':
        return {
          ...state,
          inputs: { ...inputs, flete: sanitizedValue, fleteText: value }
        };
      default:
        return { ...state, inputs: { ...inputs, [key]: value } };
    }
  }
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
      return {
        type: Actions.editarFactura,
        venta: res.body
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
  const { ventaRow, clienteRow, medicoRow, paciente, unidades, pagos } = venta;
  return {
    clienteRow: clienteRow || null,
    medicoRow: medicoRow || null,
    inputs: {
      rowid: ventaRow.rowid,
      codigo: ventaRow.codigo,
      fecha: DateParser.parseDBDate(ventaRow.fecha),
      descuento: ventaRow.descuento,
      autorizacion: ventaRow.autorizacion,
      flete: ventaRow.flete,
      detallado: !!ventaRow.detallado,
      paciente: paciente || '',
      contable: false,
      guia: ''
    },
    unidades: unidades.map(u => ({
      ...u,
      countText: '' + u.count,
      pagaIva: !!u.pagaIva,
      precioVentaText: Money.print(u.precioVenta)
    })),
    pagos: pagos.map(p => ({
      ...p,
      formaPagoText: FormasDePago[p.formaPago],
      valorText: Money.print(p.valor)
    }))
  };
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
