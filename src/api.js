const request = require('superagent')

module.exports = {
  insertarCliente: (ruc, nombre, direccion, email, telefono1, telefono2) => {
    return request.post('http://localhost:8192/cliente/new')
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
}
