const format = require('fecha').format
const iva = 0.14

const calcularSubtotal = (productos) => {
  let subtotal = 0
  const len = productos.size
  for (let i = 0; i < len; i++) {
    const product = productos.get(i)
    subtotal += product.get('precioVenta') * product.get('count')
  }
  return subtotal
}

const calcularIVA = (subtotal) => {
  return subtotal * iva
}

const calcularValores = (productos, descuento) => {
  const subtotal = calcularSubtotal(productos)
  const rebaja = subtotal * descuento / 100
  const valorIVA = calcularIVA(subtotal)
  const total = subtotal - rebaja + valorIVA

  return Object.freeze({
    subtotal: subtotal,
    rebaja: rebaja,
    valorIVA: valorIVA,
    total: total,
  })
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
  
  crearVentaRow: (clienteObj, facturaData, productos) => {

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
      autorizacion: facturaData.get('autorizacion'),
      formaPago: facturaData.get('formaPago'),
      fecha: format(facturaData.get('fecha'), 'YYYY-MM-DD'),
      iva: valorIVA,
      subtotal: subtotal,
      total: total,
      unidades: crearUnidadesRows(productos),
    }
  },

  calcularValores: calcularValores,


}
