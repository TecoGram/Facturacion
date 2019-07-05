const {
  clienteInsertSchema,
  clienteRowSchema,
  getClienteSchemaForIdType,
  validarBusqueda,
  validarMedico,
  validarProducto,
  validateFormWithSchema,
  ventaInsertSchema,
  ventaUpdateSchema,
  ventaExamenInsertSchema,
  ventaExamenUpdateSchema
} = require('facturacion_common/src/Validacion.js');
const { calcularValoresTotales } = require('facturacion_common/src/Math.js');
const { tarifaIVA } = require('./DatilClient.js');

const sendBadArgumentsResponse = (res, errors) => {
  res.status(400).send(errors);
};

const setSafeData = (req, data) => {
  // eslint-disable-next-line fp/no-mutation
  req.safeData = data;
};

const validarClienteMiddleware = ({ isInsert }) => (req, res, next) => {
  const { body } = req;
  const schema = getClienteSchemaForIdType(
    isInsert ? clienteInsertSchema : clienteRowSchema,
    body.tipo
  );
  const { inputs, errors } = validateFormWithSchema(schema, body);
  if (errors) {
    sendBadArgumentsResponse(res, errors);
  } else {
    setSafeData(req, inputs);
    next();
  }
};

const validarPagos = (req, res, next) => {
  const { safeData: venta } = req;
  const { total } = calcularValoresTotales(
    venta.subtotal,
    venta.flete,
    venta.tipo === 1 ? 0 : tarifaIVA,
    venta.descuento
  );

  const totalPagado = venta.pagos.reduce((acc, item) => acc + item.valor, 0);

  if (totalPagado !== total)
    sendBadArgumentsResponse(
      res,
      `Pagos no cuadran. Se esperaban ${total}, pero se encontró ${totalPagado}.`
    );
  else next();
};

const getSchemaForVentaInsertByTipo = tipo => {
  switch (tipo) {
    case 1:
      return ventaExamenInsertSchema;
    case 0:
      return ventaInsertSchema;
    default:
      return undefined;
  }
};

const getSchemaForVentaUpdateByTipo = tipo => {
  switch (tipo) {
    case 1:
      return ventaExamenUpdateSchema;
    case 0:
      return ventaUpdateSchema;
    default:
      return undefined;
  }
};

const validarVentaInsert = (req, res, next) => {
  const unsafeVenta = req.body;
  if (!unsafeVenta) return sendBadArgumentsResponse(res, 'Request mal formado');

  const schema = getSchemaForVentaInsertByTipo(unsafeVenta.tipo);
  if (!schema)
    return sendBadArgumentsResponse(
      res,
      `tipo de venta desconocido: ${unsafeVenta.tipo}`
    );

  const { inputs, errors } = validateFormWithSchema(schema, unsafeVenta);
  if (errors) {
    sendBadArgumentsResponse(res, errors);
  } else {
    setSafeData(req, inputs);
    next();
  }
};

const validarVentaUpdate = (req, res, next) => {
  const unsafeVenta = req.body;
  if (!unsafeVenta) return sendBadArgumentsResponse(res, 'Request mal formado');

  const schema = getSchemaForVentaUpdateByTipo(unsafeVenta.tipo);
  if (!schema)
    return sendBadArgumentsResponse(
      res,
      `tipo de venta desconocido: ${unsafeVenta.tipo}`
    );

  const { inputs, errors } = validateFormWithSchema(schema, unsafeVenta);
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

  validarCliente: validarClienteMiddleware({ isInsert: true }),
  validarClienteUpdate: validarClienteMiddleware({ isInsert: false }),

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

  validarPagos,
  validarVentaInsert,
  validarVentaUpdate
};
