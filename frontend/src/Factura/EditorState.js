import {
  insertarVenta,
  updateVenta,
  insertarVentaExamen,
  updateVentaExamen
} from 'facturacion_common/src/api.js';
import DateParser from 'facturacion_common/src/DateParser.js';
import {
  crearVentaRow,
  facturableAUnidad,
  productoAFacturable
} from 'facturacion_common/src/Models.js';
import {
  esFacturablePropValido,
  esFacturaDataPropValido,
  validarFactura,
  validarVentaInsert,
  validarVentaExamenInsert
} from 'facturacion_common/src/Validacion.js';
import { parseFormInt } from 'facturacion_common/src/FormNumberPaser.js';
import { calcularValoresFacturables } from 'facturacion_common/src/Math.js';
import Money from 'facturacion_common/src/Money.js';

export const getDefaultState = () => {
  return {
    clienteRow: null,
    medicoRow: null,
    errors: {},
    facturaData: {
      fecha: new Date(),
      descuento: '',
      autorizacion: '',
      flete: '',
      detallado: true,
      paciente: ''
    },
    facturables: []
  };
};

export const agregarProductoComoFacturable = producto => {
  return prevState => {
    const facturable = productoAFacturable(producto);
    return { facturables: [...prevState.facturables, facturable] };
  };
};

export const calcularFacturaEditorResults = (
  facturables,
  fleteString,
  iva,
  porcentajeDescuentoString
) => {
  const flete = Money.fromString(fleteString);
  const descuento = parseFormInt(porcentajeDescuentoString);
  return calcularValoresFacturables(facturables, flete, iva, descuento);
};

export const selectGuardarPromise = (editar, isExamen, ventaRow) => {
  if (editar && isExamen) return updateVentaExamen(ventaRow);
  if (isExamen) return insertarVentaExamen(ventaRow);
  if (editar) return updateVenta(ventaRow);
  return insertarVenta(ventaRow);
};

const crearGuardarPromiseYMensaje = (editar, isExamen, ventaRow) => {
  const actionVerb = editar ? 'editó' : 'generó';
  const msg = `La factura se ${actionVerb} exitosamente.`;
  const prom = selectGuardarPromise(editar, isExamen, ventaRow);
  return {
    errors: null,
    prom,
    msg,
    ventaRow
  };
};

export const editarFacturaExistente = verVentaResp => {
  const resp = DateParser.verVenta(verVentaResp.body);
  return () => {
    return {
      cliente: resp.cliente,
      medico: resp.medico,
      facturaData: resp.facturaData,
      facturables: resp.facturables
    };
  };
};

export const modificarValorEnFacturable = (index, propKey, newPropValue) => {
  if (esFacturablePropValido(propKey, newPropValue)) {
    return prevState => {
      const facturables = prevState.facturables;
      const updatedFacturables = [
        ...facturables.slice(0, index),
        { ...facturables[index], [propKey]: newPropValue },
        ...facturables.slice(index + 1)
      ];
      return { facturables: updatedFacturables };
    };
  }
  return null;
};

export const modificarValorEnFacturaData = (dataKey, newDataValue) => {
  if (!esFacturaDataPropValido(dataKey, newDataValue)) return null;
  return prevState => {
    const newFacturaData = {
      ...prevState.facturaData,
      [dataKey]: newDataValue
    };
    return { facturaData: newFacturaData };
  };
};

export const puedeGuardarFactura = (state, isExamen) => {
  if (!state.clienteRow) return false;
  if (state.facturables.length === 0) return false;
  if (isExamen && !state.medicoRow) return false;
  return true;
};

export const prepararFacturaParaGuardar = (state, config) => {
  const { clienteRow, medicoRow, facturables, facturaData } = state;
  const { editar, empresa, isExamen, iva } = config;

  const unidades = facturables.map(facturableAUnidad);
  const ventaRow = crearVentaRow({
    clienteRow,
    medicoRow,
    facturaData,
    facturables,
    unidades,
    empresa,
    isExamen,
    iva
  });
  const { errors } = config.isExamen
    ? validarVentaExamenInsert(ventaRow)
    : validarVentaInsert(ventaRow);
  if (errors) return { errors, prom: null, msg: null, ventaRow: null };
  else return crearGuardarPromiseYMensaje(editar, isExamen, ventaRow);
};

export const removeFacturableAt = index => {
  return prevState => {
    const { facturables } = prevState;
    return {
      facturables: [
        ...facturables.slice(0, index),
        ...facturables.slice(index + 1)
      ]
    };
  };
};
