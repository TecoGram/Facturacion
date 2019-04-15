const {
  validarBusqueda,
  validarMedico,
  validarProducto,
  validateFormWithSchema,
  clienteInsertSchema,
  clienteRowSchema,
  ventaInsertSchema,
  ventaSchema,
  ventaExamenInsertSchema,
  ventaExamenSchema
} = require('../../frontend/src/Validacion.js');

const sendBadArgumentsResponse = (res, errors) => {
  res.status(400).send(errors);
};

const setSafeData = (req, data) => {
  // eslint-disable-next-line fp/no-mutation
  req.safeData = data;
};

const validationMiddleware = (schema, key = 'body') => (req, res, next) => {
  const { inputs, errors } = validateFormWithSchema(schema, req[key]);
  //console.log('validacion', req[key], errors);
  if (errors) {
    sendBadArgumentsResponse(res, errors);
  } else {
    setSafeData(req, inputs);
    next();
  }
};

module.exports = {
  validarBusqueda: (req, res, next) => {
    const q = req.query.q;
    const limit = req.query.limit;
    const errors = validarBusqueda(q, limit);
    if (errors) sendBadArgumentsResponse(res, errors);
    else next();
  },

  validarCliente: validationMiddleware(clienteInsertSchema),
  validarClienteUpdate: validationMiddleware(clienteRowSchema),

  validarMedico: function(req, res, next) {
    const { inputs, errors } = validarMedico(req.body);
    if (errors) {
      sendBadArgumentsResponse(res, errors);
    } else {
      setSafeData(req, {
        ...inputs,
        comision: Number(inputs.comision)
      });
      next();
    }
  },

  validarProducto: function(req, res, next) {
    const { inputs, errors } = validarProducto(req.body);
    if (errors) {
      sendBadArgumentsResponse(res, errors);
    } else {
      setSafeData(req, {
        ...inputs,
        precioDist: Number(inputs.precioDist),
        precioVenta: Number(inputs.precioVenta),
        rowid: req.url === '/producto/update' ? req.body.rowid : undefined
      });
      next();
    }
  },

  validarVenta: validationMiddleware(ventaInsertSchema),
  validarVentaUpdate: validationMiddleware(ventaSchema),
  validarVentaExamen: validationMiddleware(ventaExamenInsertSchema),
  validarVentaExamenUpdate: validationMiddleware(ventaExamenSchema)
};
