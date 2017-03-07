const calcularTotalVentaRow = (ventaRow) => {
  return ventaRow.subtotal + ventaRow.iva - ventaRow.descuento
}

module.exports = {
  calcularTotalVentaRow,
  crearListaFacturasParaTabla: (ventas) => {
    const len = ventas.length
    const listaParaRender = []
    for (let i = 0; i < len; i++) {
      const venta = ventas[i]
      const total = calcularTotalVentaRow(venta)
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
      descuento,
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
        fecha: fecha,
        descuento: descuento,
        subtotal: subtotal,
        autorizacion: autorizacion,
        formaPago: formaPago,
        total: calcularTotalVentaRow(ventaQueryResp.ventaRow),
      },
      facturables: facturables.slice(),
    }
  },
}
