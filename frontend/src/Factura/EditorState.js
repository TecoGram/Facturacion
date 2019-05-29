const {
  insertarVenta,
  updateVenta,
  insertarVentaExamen,
  updateVentaExamen
} = require('../api.js');
const DateParser = require('../DateParser.js');
const {
  crearVentaRow,
  facturableAUnidad,
  productoAFacturable
} = require('./Models.js');
const {
  esFacturablePropValido,
  esFacturaDataPropValido,
  validarVentaInsert,
  validarVentaExamenInsert
} = require('../Validacion.js');
const { parseFormInt } = require('../FormNumberPaser.js');
const { calcularValoresFacturables } = require('./Math.js');
const Money = require('./Money.js');

const getDefaultState = () => {
  return {
    clienteRow: null,
    medicoRow: null,
    errors: {},
    facturaData: {
      codigo: '',
      fecha: new Date(),
      descuento: '',
      autorizacion: '',
      formaPago: '',
      flete: '',
      detallado: true,
      paciente: ''
    },
    facturables: []
  };
};

const agregarProductoComoFacturable = producto => {
  return prevState => {
    const facturable = productoAFacturable(producto);
    return { facturables: [...prevState.facturables, facturable] };
  };
};

const calcularValoresTotales = (
  facturables,
  fleteString,
  iva,
  porcentajeDescuentoString
) => {
  const flete = Money.fromString(fleteString);
  const descuento = parseFormInt(porcentajeDescuentoString);
  return calcularValoresFacturables(facturables, flete, iva, descuento);
};

const selectGuardarPromise = (editar, isExamen, ventaRow) => {
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

const editarFacturaExistente = verVentaResp => {
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

const modificarValorEnFacturable = (index, propKey, newPropValue) => {
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

const modificarValorEnFacturaData = (dataKey, newDataValue) => {
  if (!esFacturaDataPropValido(dataKey, newDataValue)) return null;
  return prevState => {
    const newFacturaData = {
      ...prevState.facturaData,
      [dataKey]: newDataValue
    };
    return { facturaData: newFacturaData };
  };
};

const puedeGuardarFactura = (state, isExamen) => {
  if (!state.clienteRow) return false;
  if (state.facturables.length === 0) return false;
  if (isExamen && !state.medicoRow) return false;
  return true;
};

const prepararFacturaParaGuardar = ({
  state,
  editar,
  empresa,
  isExamen,
  iva
}) => {
  const { clienteRow, medicoRow, facturables, facturaData } = state;

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
  const { errors } = isExamen
    ? validarVentaExamenInsert(ventaRow)
    : validarVentaInsert(ventaRow);
  if (errors) return { errors, prom: null, msg: null, ventaRow: null };
  else return crearGuardarPromiseYMensaje(editar, isExamen, ventaRow);
};

const removeFacturableAt = index => {
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

module.exports = {
  agregarProductoComoFacturable,
  calcularValoresTotales,
  editarFacturaExistente,
  getDefaultState,
  modificarValorEnFacturaData,
  modificarValorEnFacturable,
  puedeGuardarFactura,
  prepararFacturaParaGuardar,
  removeFacturableAt,
  selectGuardarPromise
};
