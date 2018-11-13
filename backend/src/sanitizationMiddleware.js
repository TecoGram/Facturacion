const {
  validarBusqueda,
  validarCliente,
  validarMedico,
  validarProducto,
  validarVentaRow,
  validarVentaRowExamen
} = require('../../frontend/src/Validacion.js');
const { FormasDePago } = require('../../frontend/src/Factura/Models.js');

const sendBadArgumentsResponse = (res, errors) => {
  res.status(400).send(errors);
};

const setSafeData = (req, data) => {
  // eslint-disable-next-line fp/no-mutation
  req.safeData = data;
};

const parsearNumerosEnUnidades = unidades =>
  unidades.map(unidad => ({
    ...unidad,
    count: Number(unidad.count),
    precioVenta: Number(unidad.precioVenta)
  }));

module.exports = {
  validarBusqueda: (req, res, next) => {
    const q = req.query.q;
    const limit = req.query.limit;
    const errors = validarBusqueda(q, limit);
    if (errors) sendBadArgumentsResponse(res, errors);
    else next();
  },

  validarCliente: function(req, res, next) {
    const { inputs, errors } = validarCliente(req.body);
    if (errors) {
      sendBadArgumentsResponse(res, errors);
    } else {
      setSafeData(req, {
        ...inputs,
        descDefault: Number(inputs.descDefault)
      });
      next();
    }
  },

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

  validarVenta: function(req, res, next) {
    const { inputs, errors } = validarVentaRow(req.body);
    if (errors) {
      sendBadArgumentsResponse(res, errors);
    } else {
      setSafeData(req, {
        ...inputs,
        descuento: Number(inputs.descuento),
        flete: Number(inputs.flete),
        formaPago: FormasDePago.indexOf(inputs.formaPago.toUpperCase()),
        unidades: parsearNumerosEnUnidades(inputs.unidades)
      });
      next();
    }
  },

  validarVentaExamen: function(req, res, next) {
    const { inputs, errors } = validarVentaRowExamen(req.body);
    if (errors) {
      sendBadArgumentsResponse(res, errors);
    } else {
      // eslint-disable-next-line
      setSafeData(req, {
        ...inputs,
        descuento: Number(inputs.descuento),
        formaPago: FormasDePago.indexOf(inputs.formaPago.toUpperCase()),
        unidades: parsearNumerosEnUnidades(inputs.unidades)
      });
      next();
    }
  }
};
