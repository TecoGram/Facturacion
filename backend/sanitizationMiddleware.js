const {
  validarCliente,
  validarMedico,
  validarProducto,
  validarVentaRow,
  validarVentaRowExamen,
} = require('../src/Validacion.js')

const sendBadArgumentsResponse = (res, errors) => {
  res.status(400).send(errors)
}

module.exports = {
  validarCliente: function (req, res, next) {
    const { inputs, errors } = validarCliente(req.body)
    if (errors) {
      sendBadArgumentsResponse(res, errors)
    } else {
      inputs.descDefault = Number(inputs.descDefault)
      req.safeData = inputs
      next()
    }
  },

  validarMedico: function (req, res, next) {
    const { inputs, errors } = validarMedico(req.body)
    if (errors) {
      sendBadArgumentsResponse(res, errors)
    } else {
      inputs.comision = Number(inputs.comision)
      req.safeData = inputs
      next()
    }
  },

  validarProducto: function (req, res, next) {
    const { inputs, errors } = validarProducto(req.body)
    if (errors) {
      sendBadArgumentsResponse(res, errors)
    } else {
      inputs.precioDist = Number(inputs.precioDist)
      inputs.precioVenta = Number(inputs.precioVenta)
      req.safeData = inputs
      next()
    }
  },

  validarVenta: function (req, res, next) {
    const { inputs, errors } = validarVentaRow(req.body)
    if (errors) {
      sendBadArgumentsResponse(res, errors)
    } else {
      inputs.descuento = Number(inputs.descuento)
      inputs.flete = Number(inputs.flete)
      req.safeData = inputs
      next()
    }
  },

  validarVentaExamen: function (req, res, next) {
    const { inputs, errors } = validarVentaRowExamen(req.body)
    if (errors) {
      sendBadArgumentsResponse(res, errors)
    } else {
      inputs.descuento = Number(inputs.descuento)
      req.safeData = inputs
      next()
    }
  },

}
