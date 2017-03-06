const { oneYearFromToday, toReadableDate } = require('../../DateParser.js')
const iva = 0.14

const calcularSubtotalIVA = (productos) => {
  let subtotal = 0
  let valorIVA = 0
  const len = productos.size
  for (let i = 0; i < len; i++) {
    const product = productos.get(i)
    const recargo = product.get('precioVenta') * product.get('count')
    subtotal += recargo
    if (product.get('pagaIva'))
      valorIVA += recargo * iva
  }
  return { subtotal, valorIVA }
}

const calcularValores = (productos, descuento) => {
  const { subtotal, valorIVA } = calcularSubtotalIVA(productos)
  const rebaja = subtotal * descuento / 100
  const total = subtotal - rebaja + valorIVA

  return Object.freeze({
    subtotal: subtotal,
    rebaja: rebaja,
    valorIVA: valorIVA,
    total: total,
  })
}

const crearProductosVendidosRows = (productos) => {
  const len = productos.size
  const unidades = []
  for (let i = 0; i < len; i++) {
    const producto = productos.get(i)
    unidades.push({
      producto: producto.get('producto'),
      lote: producto.get('lote'),
      fechaExp: toReadableDate(producto.get('fechaExp')),
      count: producto.get('count'),
      precioVenta: producto.get('precioVenta'),
    })
  }
  return unidades
}

const crearUnidadesRows = (productos) => {
  const len = productos.size
  const unidades = []
  for (let i = 0; i < len; i++) {
    const producto = productos.get(i)
    const count = producto.get('count')
    for (let j = 0; j < count; j++)
      unidades.push({
        producto: producto.get('rowid'),
        lote: producto.get('lote'),
        fechaExp: producto.get('fechaExp'),
      })
  }
  return unidades
}

module.exports = {
  crearUnidadesRows: crearUnidadesRows,

  productoAUnidad: (producto) => {
    const unidad = Object.assign({}, producto)
    unidad.producto = producto.rowid
    delete unidad.rowid
    delete unidad.precioDist
    delete unidad.pagaIva
    unidad.lote = ''
    unidad.count = 1
    unidad.fechaExp = oneYearFromToday()
    return unidad
  },

  crearVentaRow: (clienteObj, facturaData, productos, empresa) => {

    const desc = facturaData.get('descuento')
    const {
      subtotal,
      rebaja,
      valorIVA,
      total,
    } = calcularValores(productos, desc)

    return {
      cliente: clienteObj.ruc,
      codigo: facturaData.get('codigo'),
      descuento: rebaja,
      empresa: empresa,
      autorizacion: facturaData.get('autorizacion'),
      formaPago: facturaData.get('formaPago'),
      fecha: toReadableDate(facturaData.get('fecha')),
      iva: valorIVA,
      subtotal: subtotal,
      total: total,
      productos: crearProductosVendidosRows(productos),
    }
  },

  calcularValores: calcularValores,

}
