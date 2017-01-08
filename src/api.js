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

  insertarMedico: (nombre, direccion, comision, email, telefono1, telefono2) => {
    return request.post(prefix + '/medico/new')
      .send({
        nombre: nombre,
        direccion: direccion,
        email: email,
        comision,
        telefono1: telefono1,
        telefono2: telefono2,
      })
      .set('Accept', 'application/json')
  },

  findMedicos: (queryString) => {
    return request.get(prefix + '/medico/find?q=' + queryString)
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

  insertarVenta: (ventaRow) => {
    return request.post(prefix + '/venta/new')
      .send(ventaRow)
      .set('Accept', 'application/json')
  },

  updateVenta: (ventaRow) => {
    return request.post(prefix + '/venta/update')
      .send(ventaRow)
      .set('Accept', 'application/json')
  },

  findVentas: (queryString) => {
    return request.get(prefix + '/venta/find?q=' + queryString)
      .send()
  },

  verVenta: (codigo, fecha) => {
    return request.get(prefix + `/venta/ver/${fecha}/${codigo}`)
      .send()
      .set('Accept', 'application/json')
  },

  deleteVenta: (codigo, fecha) => {
    return request.get(prefix + `/venta/delete/${fecha}/${codigo}`)
      .send()
      .set('Accept', 'application/json')
  },

  getFacturaURL: (codigo, fecha) => {
    return `http://localhost:8192/venta/ver/${fecha}/${codigo}`
  },

}
