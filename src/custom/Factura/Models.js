const { oneYearFromToday, toReadableDate } = require('../../DateParser.js')
const { calcularValoresFacturablesImm } = require('./Math.js')

const crearUnidadesRows = (facturablesImm) => {
  const len = facturablesImm.size
  const unidades = []
  for (let i = 0; i < len; i++) {
    const facturableImm = facturablesImm.get(i)
    const count = facturableImm.get('count')
    for (let j = 0; j < count; j++)
      unidades.push({
        producto: facturableImm.get('rowid'),
        lote: facturableImm.get('lote'),
        fechaExp: facturableImm.get('fechaExp'),
      })
  }
  return unidades
}


const productoAFacturable = (producto) => {
  const facturable = Object.assign({}, producto)
  facturable.producto = producto.rowid
  delete facturable.rowid
  delete facturable.precioDist
  facturable.lote = ''
  facturable.count = 1
  facturable.fechaExp = oneYearFromToday()
  return facturable
}

const facturableAUnidad = (facturable) => {
  const unidad = Object.assign({}, facturable)
  delete unidad.pagaIva
  delete unidad.nombre
  delete unidad.codigo
  unidad.fechaExp = toReadableDate(unidad.fechaExp)
  return unidad
}

const crearVentaRow = (clienteObj, facturaDataImm, facturablesImm, unidades, empresa) => {
  const desc = facturaDataImm.get('descuento')
  const {
    subtotal,
    rebaja,
    valorIVA,
    total,
  } = calcularValoresFacturablesImm(facturablesImm, desc)

  return {
    cliente: clienteObj.ruc,
    codigo: facturaDataImm.get('codigo'),
    descuento: rebaja,
    empresa: empresa,
    autorizacion: facturaDataImm.get('autorizacion'),
    formaPago: facturaDataImm.get('formaPago'),
    fecha: toReadableDate(facturaDataImm.get('fecha')),
    iva: valorIVA,
    subtotal: subtotal,
    total: total,
    unidades: unidades,
  }
}

module.exports = {
  crearUnidadesRows,
  crearVentaRow,
  facturableAUnidad,
  productoAFacturable,
}
