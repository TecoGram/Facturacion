const { validarCliente, validarProducto, validarMedico } = require('../src/Validacion.js')

module.exports = {
  validarCliente: function (req, res, next) {
    const { inputs, errors } = validarCliente(req.body)
    if (errors) {
      res.status(400).send(errors)
    } else {
      inputs.descDefault = Number(inputs.descDefault)
      req.safeData = inputs
      next()
    }
  },

  validarMedico: function (req, res, next) {
    const { inputs, errors } = validarMedico(req.body)
    if (errors) {
      res.status(400).send(errors)
    } else {
      inputs.comision = Number(inputs.comision)
      req.safeData = inputs
      next()
    }
  },
}
