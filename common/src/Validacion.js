const validator = require('validator');

const { FormasDePago, TiposID } = require('./Models.js');
const Money = require('./Money.js');
const { excludeKeys } = require('./Object.js');

const phoneCharset = '1234567890-+()';
const usesCharset = (str, charset) => {
  const len = str.length;
  for (let i = 0; i < len; i++) {
    if (!charset.includes(str[i])) return str[i];
  }
};

const isEmptyObj = obj => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

const esPorcentajeValido = porcentajeString => {
  return (
    porcentajeString === '' ||
    validator.isInt(porcentajeString, { min: 0, max: 100 })
  );
};

const esNumeroValido = numeroString => {
  return numeroString === '' || validator.isFloat(numeroString, { min: 0 });
};

const esEnteroValido = enteroString => {
  return enteroString === '' || validator.isInt(enteroString, { min: 0 });
};

const sanitizarDinero = dineroString => {
  if (!esNumeroValido(dineroString)) return null;

  const dotPosition = dineroString.indexOf('.');

  if (
    dotPosition > 0 &&
    dineroString.length > 2 &&
    dotPosition < dineroString.length - 3
  )
    return null; // demasiados decimales

  const dinero = Money.fromString(dineroString);
  if (isNaN(dinero)) return null;
  return dinero;
};

const sanitizarFacturaInput = (key, value) => {
  switch (key) {
    case 'descuento': {
      if (esPorcentajeValido(value)) return parseInt(value, 10);
      return null;
    }
    case 'flete': {
      return sanitizarDinero(value);
    }
    default:
      return value;
  }
};

const sanitizarUnidadInput = (key, value) => {
  switch (key) {
    case 'count': {
      if (esEnteroValido(value)) return parseInt(value, 10);
      return null;
    }
    case 'precioVenta': {
      return sanitizarDinero(value);
    }

    default:
      return value;
  }
};

const sanitizarId = maybeId => {
  if (esEnteroValido(maybeId)) return parseInt(maybeId, 10);
  return null;
};

//regext dates between 2010 and 2029
const fechaRegex = /20(1|2)[0-9]-(0|1)[0-9]-[0-3][0-9]/i;
const esFechaValida = dateString => fechaRegex.test(dateString);

const array = ({ item, fallback }) => (ctx, value) => {
  if (!value) {
    if (fallback || fallback === []) return fallback;
    return new Error(`"${ctx.name}" es requerido`);
  }

  if (!value.length || value.length === 0) {
    return new Error(`${ctx.name} debe ser un arreglo válido, no vacío`);
  }

  const itemValidatorFn = object({ schema: item });
  const newValue = value.map((v, index) =>
    itemValidatorFn({ name: `#${index}` }, v)
  );

  const itemErrors = newValue.filter(i => i instanceof Error);

  if (itemErrors.length > 0) {
    const error = itemErrors[0];
    const index = newValue.indexOf(error);
    const originalMsg = itemErrors[0].message;
    return new Error(
      `Item inválido en "${ctx.name}#${index}" , ${originalMsg}`
    );
  }

  return newValue;
};

const primaryKey = ({ optional } = {}) => (ctx, value) => {
  if (optional && !value) return null;

  if (typeof value !== 'number' || !validator.isInt('' + value, { min: 1 }))
    return new Error(`"${ctx.name}" debe de ser una clave primaria`);

  return value;
};

const dateString = () => (ctx, value) => {
  if (!value) return new Error(`"${ctx.name}" es requerido.`);

  if (
    typeof value !== 'string' ||
    !validator.isDate(value) ||
    !esFechaValida(value)
  )
    return new Error(`"${ctx.name}" debe ser una fecha con forma "YYYY-MM-dd"`);

  return value;
};

const iso8601DateString = () => (ctx, value) => {
  if (!value) return new Error(`"${ctx.name}" es requerido.`);

  if (
    typeof value !== 'string' ||
    !validator.isISO8601(value, { strict: true })
  )
    return new Error(`"${ctx.name}" debe ser una fecha con formato ISO8601`);

  return value;
};

const bool = ({ fallback } = {}) => (ctx, value) => {
  if (value === null || value === undefined) {
    if (fallback === true || fallback === false) return fallback;
    return new Error(`"${ctx.name}" es requerido`);
  }

  if (typeof value !== 'boolean')
    return new Error(`"${ctx.name}" debe de ser un boolean`);

  return value;
};

const string = ({ fallback, maxLen, allowEmpty } = {}) => (ctx, value) => {
  if (value === null || value === undefined) {
    if (fallback || fallback === '') return fallback;
    return new Error(`"${ctx.name}" es requerido`);
  }

  if (typeof value !== 'string')
    return new Error(`"${ctx.name}" debe de ser un string`);

  if (value.length > maxLen)
    return new Error(
      `"${ctx.name}" no puede tener más de ${maxLen} caracteres`
    );

  if (!allowEmpty && value === '')
    return new Error(`"${ctx.name}" no puede ser un string vacio`);

  return value;
};

const email = ({ fallback } = {}) => (ctx, value) => {
  if (!value) {
    if (fallback || fallback === '') return fallback;
    return new Error(`"${ctx.name}" es requerido`);
  }

  if (typeof value !== 'string')
    return new Error(`"${ctx.name}" debe de ser un string`);

  if (!validator.isEmpty(value) && !validator.isEmail(value))
    return new Error('e-mail inválido');

  return value;
};

const phone = ({ fallback } = {}) => (ctx, value) => {
  if (!value) {
    if (fallback || fallback === '') return fallback;
    return new Error(`"${ctx.name}" es requerido`);
  }

  if (typeof value !== 'string')
    return new Error(`"${ctx.name}" debe de ser un string`);

  const invalidPhoneChar = usesCharset(value, phoneCharset);
  if (invalidPhoneChar)
    return new Error(`caracter inválido en ${ctx.name}: '${invalidPhoneChar}'`);

  return value;
};

const either = ({ opts, transform, abrv }) => (ctx, value) => {
  if (value === undefined || value === null)
    return abrv
      ? new Error('obligatorio')
      : new Error(`"${ctx.name}" es obligatorio`);
  const newValue = transform ? transform(value) : value;

  if (!opts.includes(newValue))
    return abrv
      ? new Error('Inválido')
      : new Error(`"${value}" no es una opción válida para "${ctx.name}"`);

  return newValue;
};

const int = (args = {}) => (ctx, value) => {
  const { fallback, max, min, abrv } = args;
  const { name } = ctx;

  if (!value && value !== 0) {
    if (fallback || fallback === null || fallback === 0) return fallback;

    return abrv
      ? new Error('Obligatorio')
      : new Error(`"${name}" es requerido`);
  }

  if (typeof value === 'string') return int(args)(ctx, parseInt(value, 10));

  const bounds = max ? { min: min || 0, max: max } : { min: min || 0 };
  if (typeof value !== 'number' || !validator.isInt('' + value, bounds))
    return abrv
      ? new Error('Inválido')
      : new Error(`"${name}" debe de ser un entero`);

  return value;
};

const float = (args = {}) => (ctx, value) => {
  const { fallback, min, max } = args;
  if (!value) {
    if (fallback || fallback === 0) return fallback;
    return new Error(`"${ctx.name}" es requerido`);
  }

  if (typeof value === 'string') return float()(ctx, parseFloat(value, 10));

  const bounds = max ? { min: min || 0, max: max } : { min: min || 0 };
  if (typeof value !== 'number' || !validator.isFloat('' + value, bounds))
    return new Error(`"${ctx.name}" debe de ser un float`);

  return value;
};

const numericString = ({ fallback, abrv, len, minLen, maxLen } = {}) => (
  ctx,
  value
) => {
  if (!value) {
    if (fallback || fallback === '') return fallback;

    return abrv
      ? new Error(`Obligatorio`)
      : new Error(`"${ctx.name}" es requerido`);
  }

  if (typeof value !== 'string')
    return abrv
      ? new Error(`Inválido`)
      : new Error(`"${ctx.name}" debe de ser tipo string`);

  const min = minLen || 1;
  if (len && value.length !== len)
    return abrv
      ? new Error(`Inválido`)
      : new Error(`"${ctx.name}" debe tener exactamente ${len} caracteres.`);
  else if (maxLen && value.length > maxLen)
    return abrv
      ? new Error(`Inválido`)
      : new Error(`"${ctx.name}" debe de tener menos de ${maxLen} caracteres.`);
  else if (value.length < minLen)
    return abrv
      ? new Error(`Inválido`)
      : new Error(`"${ctx.name}" debe de tener más de ${min} caracteres.`);

  if (!validator.isNumeric(value))
    return abrv
      ? new Error(`Inválido`)
      : new Error(`"${ctx.name}" debe de ser una cadena de dígitos`);

  return value;
};

const validateObjectWithSchema = (schema, data, path) => {
  const keys = Object.keys(schema);
  return keys.reduce((res, dataKey) => {
    const validatorFn = schema[dataKey];
    const rawValue = data[dataKey];
    const name = path ? path + '.' + dataKey : dataKey;
    res[dataKey] = validatorFn({ name }, rawValue);
    return res;
  }, {});
};

const object = ({ schema, path }) => (ctx, value) => {
  const validated = validateObjectWithSchema(schema, value, path);
  const errorKey = Object.keys(validated).find(
    key => validated[key] instanceof Error
  );
  if (errorKey) return validated[errorKey];

  return validated;
};

const validateFormWithSchema = (schema, data) => {
  const validated = validateObjectWithSchema(schema, data);
  const output = Object.keys(validated).reduce(
    (res, key) => {
      const maybeError = validated[key];
      if (maybeError instanceof Error) {
        res.inputs = null;
        res.errors[key] = maybeError.message;
      } else if (res.inputs != null) {
        res.inputs[key] = maybeError;
      }
      return res;
    },
    { inputs: {}, errors: {} }
  );

  if (output.inputs != null) output.errors = null;
  return output;
};

const productoRowSchema = {
  rowid: primaryKey(),
  codigo: string(),
  nombre: string(),
  marca: string({ fallback: '' }),
  precioDist: int({ min: 0, fallback: 0 }),
  precioVenta: int({ min: 0 }),
  pagaIva: bool()
};

const productoInsertSchema = excludeKeys(productoRowSchema, ['rowid']);

const productoUpdateSchema = productoRowSchema;

const medicoRowSchema = {
  rowid: primaryKey(),
  nombre: string(),
  direccion: string({ fallback: '' }),
  email: email(),
  telefono1: phone(),
  telefono2: phone({ fallback: '' }),
  comision: int({ fallback: 0, min: 0, max: 100 })
};

const medicoInsertSchema = excludeKeys(medicoRowSchema, ['rowid']);

const medicoUpdateSchema = medicoRowSchema;

const unidadSchema = Object.freeze({
  producto: primaryKey(),
  fechaExp: dateString(),
  lote: string({ fallback: '', allowEmpty: true }),
  count: int({ min: 1 }),
  precioVenta: int({ min: 0 })
});

const pagoSchema = Object.freeze({
  formaPago: either({
    opts: Object.keys(FormasDePago),
    abrv: true
  }),
  valor: int({ min: 1 })
});

const ventaSchema = {
  rowid: primaryKey(),
  codigo: numericString({ fallback: '', allowEmpty: true }),
  fecha: iso8601DateString(),
  descuento: int({ fallback: 0, min: 0, max: 100, abrv: true }),
  iva: int({ max: 30 }),
  empresa: string(),
  flete: int({ min: 0, fallback: 0 }),
  subtotal: int({ min: 0 }),
  guia: string({ fallback: '', allowEmpty: true }),
  autorizacion: string({ fallback: '', allowEmpty: true }),
  cliente: primaryKey(),
  detallado: bool(),
  contable: bool(),
  tipo: int({ min: 0, max: 1 }),
  pagos: array({ item: pagoSchema, fallback: [] }),
  unidades: array({ item: unidadSchema })
};

const ventaInsertSchema = excludeKeys(ventaSchema, ['rowid']);

const ventaUpdateSchema = ventaSchema;

const facturaSchema = excludeKeys(ventaSchema, ['rowid', 'pagos']);

const clienteRowSchema = {
  rowid: primaryKey(),
  id: numericString(),
  nombre: string(),
  direccion: string({ fallback: '' }),
  email: email(),
  telefono1: phone(),
  telefono2: phone({ fallback: '' }),
  descDefault: int({ fallback: 0, min: 0, max: 100 }),
  tipo: either({ opts: Object.keys(TiposID) })
};

const clienteInsertSchema = excludeKeys(clienteRowSchema, ['rowid']);
const ventaExamenSchema = {
  rowid: primaryKey(),
  codigo: numericString({ fallback: '' }),
  fecha: dateString(),
  descuento: int({ fallback: 0, max: 100, abrv: true }),
  empresa: string(),
  flete: float({ fallback: 0 }),
  subtotal: float({ fallback: 0 }),
  autorizacion: string({ fallback: '', allowEmpty: true }),
  guia: string({ fallback: '', allowEmpty: true }),
  cliente: primaryKey(),
  medico: primaryKey({ optional: true }),
  paciente: string(),
  contable: bool(),
  tipo: int({ min: 0, max: 1 }),
  pagos: array({ item: pagoSchema }),
  unidades: array({ item: unidadSchema })
};

const ventaExamenInsertSchema = excludeKeys(ventaExamenSchema, ['rowid']);
const ventaExamenUpdateSchema = ventaExamenSchema;

const busquedaProductoSchema = {
  pagaIva: int({ min: 0, max: 1, fallback: null }),
  queryString: string({ allowEmpty: true, fallback: '' }),
  limit: int({ fallback: 5 })
};

const datilConfigSchema = {
  apiKey: string(),
  password: string(),
  codigoIVA: int(),

  emision: object({
    path: 'emision',
    schema: {
      ambiente: int(),
      moneda: string(),
      tipo_emision: int(),

      emisor: object({
        path: 'emision.emisor',
        schema: {
          ruc: numericString({ len: 13 }),
          razon_social: string(),
          nombre_comercial: string(),
          direccion: string(),
          contribuyente_especial: string({ allowEmpty: true }),
          obligado_contabilidad: bool(),

          establecimiento: object({
            path: 'emision.emisor.establecimiento',
            schema: {
              codigo: numericString({ len: 3 }),
              punto_emision: numericString({ len: 3 }),
              direccion: string()
            }
          })
        }
      })
    }
  })
};

const validarBusqueda = (q, limit) => {
  const errors = {};
  if (q && typeof q !== 'string') errors.q = 'consulta invalida';
  if (limit && !validator.isInt('' + limit))
    errors.limit = 'limite invalido, debe de ser un entero';
  if (isEmptyObj(errors)) return null;
  return errors;
};

const getExpectedIDLength = idType => {
  switch (idType) {
    case 'ruc':
      return 13;
    case 'cedula':
      return 10;
    default:
      return undefined;
  }
  // retorna undefined si recibe tipo desconocido
  // porque no hay limite
};

const getClienteSchemaForIdType = (schema, idType) => {
  const len = getExpectedIDLength(idType);
  return {
    ...schema,
    id: numericString({ len })
  };
};

const validarProductoInsert = data =>
  validateFormWithSchema(productoInsertSchema, data);

const validarProductoUpdate = data =>
  validateFormWithSchema(productoUpdateSchema, data);

const validarMedicoInsert = data =>
  validateFormWithSchema(medicoInsertSchema, data);

const validarMedicoUpdate = data =>
  validateFormWithSchema(medicoUpdateSchema, data);

const validarVentaExamenInsert = data =>
  validateFormWithSchema(ventaExamenInsertSchema, data);

const validarFactura = data => validateFormWithSchema(facturaSchema, data);

const validarVentaInsert = data =>
  validateFormWithSchema(ventaInsertSchema, data);

const validarVentaExamenUpdate = data =>
  validateFormWithSchema(ventaExamenUpdateSchema, data);

const validarVentaUpdate = data =>
  validateFormWithSchema(ventaUpdateSchema, data);

const validarClienteInsert = data =>
  validateFormWithSchema(
    getClienteSchemaForIdType(clienteInsertSchema, data.tipo),
    data
  );

const validarClienteUpdate = data =>
  validateFormWithSchema(
    getClienteSchemaForIdType(clienteRowSchema, data.tipo),
    data
  );

const validarDatilConfig = data =>
  validateFormWithSchema(datilConfigSchema, data);

module.exports = {
  busquedaProductoSchema,
  datilConfigSchema,
  getClienteSchemaForIdType,
  medicoInsertSchema,
  validarFactura,
  validarClienteInsert,
  validarClienteUpdate,
  validarDatilConfig,
  validarBusqueda,
  validarMedicoInsert,
  validarMedicoUpdate,
  validarProductoInsert,
  validarProductoUpdate,
  validarVentaInsert,
  validarVentaExamenInsert,
  validarVentaUpdate,
  validarVentaExamenUpdate,
  validateFormWithSchema,
  facturaSchema,
  productoInsertSchema,
  productoUpdateSchema,
  ventaSchema,
  ventaInsertSchema,
  ventaUpdateSchema,
  ventaExamenSchema,
  ventaExamenInsertSchema,
  ventaExamenUpdateSchema,
  clienteRowSchema,
  clienteInsertSchema,
  sanitizarDinero,
  sanitizarFacturaInput,
  sanitizarId,
  sanitizarUnidadInput
};
