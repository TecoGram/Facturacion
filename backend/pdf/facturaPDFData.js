const { calcularTotalVentaRow } = require('../../src/custom/Factura/Math.js')
const { FormasDePago } = require('../../src/custom/Factura/Models.js')


const crearOpciondePagoConTotalPagado = (formaPagoIndex, total) => {
  return (opcion, index) => {
    const nuevaOpcion = [ opcion, 0 ]
    if (formaPagoIndex === index)
      nuevaOpcion[1] = total
    return nuevaOpcion
  }
}

const generarDetalleOpcionesDePago = (formaPago, total) => {
  const func = crearOpciondePagoConTotalPagado(formaPago, total)
  return FormasDePago.map(func)
}

const fromVentaRow = (ventaRow) => {
  const facturaPDFData = Object.assign({}, ventaRow)
  const total = calcularTotalVentaRow(ventaRow)
  facturaPDFData.total = total
  facturaPDFData.formasDePago = generarDetalleOpcionesDePago(ventaRow.formaPago,
    total)
  return facturaPDFData
}

module.exports = {
  FormasDePago,
  fromVentaRow,
}
