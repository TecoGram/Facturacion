module.exports = {
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
      fecha,
      descuento,
      autorizacion,
      paciente,
      medico,
      subtotal,
      formaPago,
      productos,
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
      },
      productos: productos.slice(),
    }
  },
}
