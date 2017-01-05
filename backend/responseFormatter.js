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
      fecha,
      descuento,
      autorizacion,
      formaPago,
      productos,
    } = ventaQueryResp.ventaRow

    return {
      cliente: Object.assign({}, ventaQueryResp.cliente),
      facturaData: {
        codigo: codigo,
        fecha: fecha,
        descuento: descuento,
        autorizacion: autorizacion,
        formaPago: formaPago,
      },
      productos: productos.slice(),
    }
  },
}
