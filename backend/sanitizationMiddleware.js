const {
  validarBusqueda,
  validarCliente,
  validarMedico,
  validarProducto,
  validarVentaRow,
  validarVentaRowExamen,
} = require('../src/Validacion.js')
const {
  FormasDePago,
} = require('../src/custom/Factura/Models.js')

const sendBadArgumentsResponse = (res, errors) => {
  res.status(400).send(errors)
}

const parsearNumerosEnUnidades = (unidades) => {
  for (let i = 0; i < unidades.length; i++) {
    const unidad = unidades[i]
    unidad.count = Number(unidad.count)
    unidad.precioVenta = Number(unidad.precioVenta)
  }
}

module.exports = {
  validarBusqueda: (req, res, next) => {
    const q = req.query.q
    const limit = req.query.limit
    const errors = validarBusqueda(q, limit)
    if (errors)
      sendBadArgumentsResponse(res, errors)
    else next()
  },

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
      inputs.formaPago = FormasDePago.indexOf(inputs.formaPago.toUpperCase())
      parsearNumerosEnUnidades(inputs.unidades)
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
      inputs.formaPago = FormasDePago.indexOf(inputs.formaPago.toUpperCase())
      parsearNumerosEnUnidades(inputs.unidades)
      req.safeData = inputs
      next()
    }
  },

}
