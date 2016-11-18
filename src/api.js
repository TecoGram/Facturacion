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
}
