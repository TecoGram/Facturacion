const { calcularTotalVentaRow } = require('../src/custom/Factura/Math.js')
const { FormasDePago } = require('../src/custom/Factura/Models.js')

const parsearBooleanSQLite = (bool) => {
  if (typeof bool === 'boolean')
    return bool
  if (typeof bool === 'number')
    return bool !== 0
  throw Error('Unexpected type ' + (typeof bool))
}

module.exports = {
  calcularTotalVentaRow,
  crearListaFacturasParaTabla: (ventas) => {
    const len = ventas.length
    const listaParaRender = []
    for (let i = 0; i < len; i++) {
      const venta = ventas[i]
      const total = new Number(calcularTotalVentaRow(venta)).toFixed(2)
      listaParaRender.push({
        codigo: venta.codigo,
        empresa: venta.empresa,
        fecha: venta.fecha,
        ruc: venta.ruc,
        nombre: venta.nombre,
        total: total,
      })
    }
    return listaParaRender
  },

  findVentas: (ventas) => {
    if (ventas.length > 0) {
      const newVentas = []
      let i
      for (i = 0; i < ventas.length; i++) {
        const v = ventas[i]
        const copy = Object.assign({}, v)
        copy.total = new Number(v.total).toFixed(2)
        newVentas.push(copy)
      }
      return newVentas
    }
    return ventas
  },

  verVenta: (ventaQueryResp) => {
    const {
      codigo,
      empresa,
      facturables,
      fecha,
      flete,
      descuento,
      detallado,
      autorizacion,
      paciente,
      medico,
      subtotal,
      formaPago,
    } = ventaQueryResp.ventaRow

    return {
      cliente: Object.assign({}, ventaQueryResp.cliente),
      facturaData: {
        codigo: codigo,
        empresa: empresa,
        paciente: paciente,
        medico: medico,
        detallado: parsearBooleanSQLite(detallado),
        fecha: fecha,
        descuento: '' + descuento,
        subtotal: subtotal,
        autorizacion: autorizacion,
        flete: '' + flete,
        formaPago: FormasDePago[formaPago],
        total: new Number(calcularTotalVentaRow(ventaQueryResp.ventaRow)).toFixed(2),
      },
      facturables: facturables.slice(),
    }
  },
}
