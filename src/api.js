const request = require('superagent')

const prefix = process.env.NODE_ENV === 'test' ? 'http://localhost:8192' : ''
module.exports = {
  insertarCliente: (ruc, nombre, direccion, email, telefono1, telefono2) => {
    return request.post(prefix + '/cliente/new')
      .send({
        ruc: ruc,
        nombre: nombre,
        direccion: direccion,
        email: email,
        telefono1: telefono1,
        telefono2: telefono2,
      })
      .set('Accept', 'application/json')
  },

  findClientes: (queryString) => {
    return request.get(prefix + '/cliente/find?q=' + queryString)
      .send()
  },

  insertarProducto: (codigo, nombre, precioDist, precioVenta) => {
    return request.post(prefix + '/producto/new')
      .send({
        codigo: codigo,
        nombre: nombre,
        precioDist: precioDist,
        precioVenta: precioVenta,
      })
      .set('Accept', 'application/json')
  },

  findProductos: (queryString) => {
    return request.get(prefix + '/producto/find?q=' + queryString)
      .send()
  },

  insertarVenta: (codigo, cliente, fecha, autorizacion, formaPago, subtotal,
    descuento, iva, total) => {
    return request.post(prefix + '/venta/new')
      .send({
        codigo: codigo,
        cliente: cliente,
        fecha: fecha,
        autorizacion: autorizacion,
        formaPago: formaPago,
        subtotal: subtotal,
        descuento: descuento,
        iva: iva,
        total: total,
      })
      .set('Accept', 'application/json')
  },

}
