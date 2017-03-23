const Immutable = require('immutable')

const {
  insertarVenta,
  updateVenta,
  insertarVentaExamen,
  updateVentaExamen } = require('../../api.js')
const DateParser = require('../../DateParser.js')
const {
  crearVentaRow,
  facturableAUnidad,
  productoAFacturable } = require('./Models.js')
const {
  esFacturablePropValido,
  esFacturaDataPropValido,
  validarVentaRow,
  validarVentaRowExamen } = require('../../Validacion.js')
const {
  parseFormInt,
  parseFormFloat,
} = require('../../FormNumberPaser.js')
const {
  calcularValoresFacturablesImm,
} = require('./Math.js')

const getDefaultState = () => {
  return {
    cliente: null,
    medico: null,
    errors: Immutable.Map(),
    facturaData: Immutable.Map({
      codigo: '',
      fecha: new Date(),
      descuento: '',
      autorizacion: '',
      formaPago: '',
      flete: '',
      detallado: true,
      paciente: '',
    }),
    facturables: Immutable.List(),
  }
}

const agregarProductoComoFacturable = (producto) => {
  return (prevState) => {
    const facturable = Immutable.Map(productoAFacturable(producto))
    return { facturables: prevState.facturables.push(facturable) }
  }
}

const calcularValoresTotales = (facturablesImm, fleteString, porcentajeIVA,
  porcentajeDescuentoString) => {
  const flete = parseFormFloat(fleteString)
  const porcentajeDescuento = parseFormInt(porcentajeDescuentoString)
  return calcularValoresFacturablesImm(facturablesImm, flete,
    porcentajeIVA, porcentajeDescuento)
}

const convertirFacturablesImmAUnidades = (facturablesImm) => {
  return facturablesImm.map((facturableImm) => {
    return facturableAUnidad(facturableImm.toJS())
  }).toJS()
}

const crearGuardarPromiseYMensaje = (editar, isExamen, ventaRow) => {
  const actionVerb = editar ? 'editó' : 'generó'
  const msg = `La factura se ${actionVerb} exitosamente.`
  const prom = selectGuardarPromise(editar, isExamen, ventaRow)
  return {
    errors: null,
    prom,
    msg,
    ventaRow,
  }
}

const editarFacturaExistente = (verVentaResp) => {
  const resp = DateParser.verVenta(verVentaResp.body)
  return () => {
    return {
      cliente: resp.cliente,
      facturaData: Immutable.fromJS(resp.facturaData),
      facturables: Immutable.fromJS(resp.facturables),
    }
  }
}

const modificarValorEnFacturable = (index, propKey, newPropValue) => {
  if (esFacturablePropValido(propKey, newPropValue)) {
    return (prevState) => {
      const facturables = prevState.facturables
      const updatedFacturables = facturables.update(index,
        (facturable) => facturable.set(propKey, newPropValue))
      return { facturables: updatedFacturables }
    }
  }
  return null
}

const modificarValorEnFacturaData = (dataKey, newDataValue) => {
  if(!esFacturaDataPropValido(dataKey, newDataValue))
    return null;
  return (prevState) => {
    return { facturaData: prevState.facturaData.set(dataKey, newDataValue) }
  }
}

const puedeGuardarFactura = (state) => {
  if(!state.cliente) return false
  if(state.facturables.isEmpty()) return false
  return true
}

const prepararFacturaParaGuardar = (state, editar, empresa, isExamen, porcentajeIVA) => {
  const {
    cliente,
    medico,
    facturables,
    facturaData,
  } = state

  const unidades = convertirFacturablesImmAUnidades(facturables)
  const ventaRow = crearVentaRow(cliente, medico, facturaData, facturables, unidades,
    empresa, isExamen, porcentajeIVA)
  const { errors } = isExamen ? validarVentaRowExamen(ventaRow) : validarVentaRow(ventaRow)
  if (errors)
    return { errors, prom: null, msg: null, ventaRow: null }
  else
    return crearGuardarPromiseYMensaje(editar, isExamen, ventaRow)
}

const removeFacturableAt = (index) => {
  return (prevState) => {
    return { facturables: prevState.facturables.remove(index) }
  }
}

const selectGuardarPromise = (editar, isExamen, ventaRow) => {
  if (editar && isExamen)
    return updateVentaExamen(ventaRow)
  if (isExamen)
    return insertarVentaExamen(ventaRow)
  if (editar)
    return updateVenta(ventaRow)
  return insertarVenta(ventaRow)
}

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
  selectGuardarPromise,
}
