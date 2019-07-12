const {
  clienteInsertSchema,
  clienteRowSchema,
  getClienteSchemaForIdType,
  validarBusqueda,
  validateFormWithSchema,
  medicoInsertSchema,
  ventaInsertSchema,
  ventaUpdateSchema,
  productoInsertSchema,
  productoUpdateSchema,
  ventaExamenInsertSchema,
  ventaExamenUpdateSchema
} = require('facturacion_common/src/Validacion.js');
const { calcularValoresTotales } = require('facturacion_common/src/Math.js');
const {
  empresaName: empresaConDatil,
  tarifaIVA
} = require('./DatilClient.js');
const { empresas } = require('../../system.config.js');

const sendBadArgumentsResponse = (res, errors) => {
  res.status(400).send(errors);
};

const setSafeData = (req, data) => {
  // eslint-disable-next-line fp/no-mutation
  req.safeData = data;
};

const validateWithSchemaMiddleware = arg => (req, res, next) => {
  const { body } = req;
  if (!body) return sendBadArgumentsResponse(res, 'Request mal formado');

  const schema = typeof arg === 'function' ? arg(body) : arg;
  if (!schema)
    return sendBadArgumentsResponse(res, 'Error al interpretar datos');

  const { inputs, errors } = validateFormWithSchema(schema, body);
  if (errors) {
    sendBadArgumentsResponse(res, errors);
  } else {
    setSafeData(req, inputs);
    next();
  }
};

const validarClienteMiddleware = ({ isInsert }) =>
  validateWithSchemaMiddleware(body => {
    return getClienteSchemaForIdType(
      isInsert ? clienteInsertSchema : clienteRowSchema,
      body.tipo
    );
  });

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

const validarVentaUpdate = validateWithSchemaMiddleware(unsafeVenta => {
  switch (unsafeVenta.tipo) {
    case 1:
      return ventaExamenUpdateSchema;
    case 0:
      return ventaUpdateSchema;
    default:
      return undefined;
  }
});

const validarNombreEmpresa = (req, res, next) => {
  const venta = req.safeData;

  if (!empresas.includes(venta.empresa))
    sendBadArgumentsResponse(res, `Empresa desconocida: ${venta.empresa}`);
  else if (venta.contable && venta.empresa !== empresaConDatil)
    sendBadArgumentsResponse(
      res,
      `La empresa ${venta.empresa} no puede emitir comprobantes electrónicos`
    );
  else next();
};

const validarVentaInsert = validateWithSchemaMiddleware(unsafeVenta => {
  switch (unsafeVenta.tipo) {
    case 1:
      return ventaExamenInsertSchema;
    case 0:
      return ventaInsertSchema;
    default:
      return undefined;
  }
});

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

  validarMedico: validateWithSchemaMiddleware(medicoInsertSchema),

  validarNombreEmpresa,

  validarProducto: validateWithSchemaMiddleware(productoInsertSchema),
  validarProductoUpdate: validateWithSchemaMiddleware(productoUpdateSchema),

  validarPagos,
  validarVentaInsert,
  validarVentaUpdate
};
