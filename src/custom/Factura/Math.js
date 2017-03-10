const iva = 0.14

const calcularTotalVentaRow = (ventaRow) => {
  return ventaRow.subtotal + ventaRow.iva - ventaRow.descuento
}

const calcularSubtotalIVAImm = (facturablesImm) => {
  let subtotal = 0
  let valorIVA = 0
  const len = facturablesImm.size
  for (let i = 0; i < len; i++) {
    const facturableImm = facturablesImm.get(i)
    const recargo = facturableImm.get('precioVenta') * facturableImm.get('count')
    subtotal += recargo
    if (facturableImm.get('pagaIva'))
      valorIVA += recargo * iva
  }
  return { subtotal, valorIVA }
}

const calcularValoresTotales = (totalesObject, descuento) => {
  const { subtotal, valorIVA } = totalesObject
  const rebaja = subtotal * descuento / 100
  const total = subtotal - rebaja + valorIVA

  return Object.freeze({
    subtotal: subtotal,
    rebaja: rebaja,
    valorIVA: valorIVA,
    total: total,
  })
}

const calcularValoresFacturablesImm = (facturablesImm, descuento) => {
  const totalesObject = calcularSubtotalIVAImm(facturablesImm)
  return calcularValoresTotales(totalesObject, descuento)
}

module.exports = {
  calcularSubtotalIVAImm,
  calcularTotalVentaRow,
  calcularValoresFacturablesImm,
}
