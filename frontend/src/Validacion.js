const validator = require('validator');
const { FormasDePago } = require('./Factura/Models.js');

const campo_obligatorio = 'Este campo es obligatorio';
const campo_obligatorio_min = 'obligatorio';
const invalido = 'inválido';
const porcentaje_invalido = 'No está entre 0 y 100';

const phoneCharset = '1234567890-+()';
const usesCharset = (str, charset) => {
  const len = str.length;
  for (let i = 0; i < len; i++) {
    if (!charset.includes(str[i])) return str[i];
  }
};

const percentageOpts = { min: 0, max: 100 };

const isEmptyObj = obj => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

const eitherErrorsOrInputs = (errors, inputs) => {
  if (isEmptyObj(errors))
    return {
      errors: null,
      inputs: inputs
    };
  return {
    errors: errors,
    inputs: null
  };
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

const validarString = (str, errors, inputs, key) => {
  if (typeof str === 'string' && str.length > 0) inputs[key] = str;
  else errors[key] = `${key} es un argumento erróneo`;
};

const esFacturaDataPropValido = (propKey, newPropValue) => {
  switch (propKey) {
    case 'descuento':
      return esPorcentajeValido(newPropValue);
    case 'flete':
      return esNumeroValido(newPropValue);
    default:
      return true;
  }
};

const esFacturablePropValido = (propKey, newPropValue) => {
  switch (propKey) {
    case 'count':
      return esEnteroValido(newPropValue);
    case 'precioVenta':
      return esNumeroValido(newPropValue);
    default:
      return true;
  }
};

const validarBoolean = (bool, errors, inputs, key) => {
  if (typeof bool === 'boolean') inputs[key] = bool;
  else errors[key] = `${key} debe de ser boolean (true|false)`;
};

const validarNumeroCalculado = (num, errors, inputs, key) => {
  if (typeof num === 'number' && num >= 0) inputs[key] = num;
  else errors[key] = `${key} debe de ser un número real no negativo`;
};

const validarNumeroIngresado = (num, errors, inputs, key) => {
  if (!esNumeroValido(num))
    errors[key] = `${key} debe ser un número real no negativo`;
  else inputs[key] = num;
};

const validarRUC = (ruc, errors, inputs, key) => {
  if (validator.isEmpty(ruc)) errors[key] = campo_obligatorio;
  else if (!validator.isNumeric(ruc)) errors[key] = 'RUC inválido';
  else inputs[key] = ruc;
};

const validarNombre = (nombre, errors, inputs) => {
  if (validator.isEmpty(nombre)) errors.nombre = campo_obligatorio;
  else inputs.nombre = nombre;
};

const validarDireccion = (direccion, errors, inputs) => {
  if (validator.isEmpty(direccion)) errors.direccion = campo_obligatorio;
  else inputs.direccion = direccion;
};

const validarEmail = (email, errors, inputs) => {
  if (!validator.isEmpty(email) && !validator.isEmail(email))
    errors.email = 'e-mail inválido';
  else inputs.email = email;
};

const validarTelefono = (telefonoValue, errors, inputs, telefonoKey) => {
  const invalidPhoneChar = usesCharset(telefonoValue, phoneCharset);
  if (invalidPhoneChar)
    errors[telefonoKey] = 'caracter inválido: ' + invalidPhoneChar;
  else inputs[telefonoKey] = telefonoValue;
};

const validarPorcentajeIVA = (iva, errors, inputs) => {
  if (typeof iva !== 'number' || iva < 0 || iva > 30)
    errors.iva = 'porcentaje iva inválido.';
  else inputs.iva = iva;
};

//regext dates between 2010 and 2029
const fechaRegex = /20(1|2)[0-9]-(0|1)[0-9]-[0-3][0-9]/i;
const esFechaValida = dateString => fechaRegex.test(dateString);

const validarUnidad = unidad => {
  const { producto, fechaExp, lote, count, precioVenta } = unidad;

  if (typeof producto !== 'number' || !validator.isInt('' + producto))
    return 'producto inválido';
  if (
    typeof fechaExp !== 'string' ||
    !validator.isDate(fechaExp) ||
    !esFechaValida(fechaExp)
  )
    return 'fecha expiración inválida';
  if (typeof lote !== 'string') return 'lote inválido';
  if (!esEnteroValido(count)) return 'cantidad inválida';
  if (!esNumeroValido(precioVenta)) return 'precio de venta inválido';
};

const array = ({ item }) => (ctx, value) => {
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

const primaryKey = () => (ctx, value) => {
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

const string = ({ fallback, maxLen } = {}) => (ctx, value) => {
  if (!value) {
    if (fallback || fallback === '') return fallback;
    return new Error(`"${ctx.name}" es requerido`);
  }

  if (typeof value !== 'string')
    return new Error(`"${ctx.name}" debe de ser un string`);

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
    errors.email = 'e-mail inválido';

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

const bool = () => (ctx, value) => {
  if (typeof value !== 'boolean')
    return new Error(`"${ctx.name}" debe de ser boolean`);

  return value;
};

const either = ({ opts, transform, abrv }) => (ctx, value) => {
  if (!value)
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

  if (!value) {
    if (fallback || fallback === 0) return fallback;

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

const numericString = ({ fallback, abrv, minLen, maxLen } = {}) => (
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
  if (value.length < min || (maxLen && value.length > maxLen))
    return abrv
      ? new Error(`Inválido`)
      : new Error(`"${ctx.name}" debe de ser tipo string`);

  if (!validator.isNumeric(value))
    return abrv
      ? new Error(`Inválido`)
      : new Error(`"${ctx.name}" debe de ser una cadena de dígitos`);

  return value;
};

const validateObjectWithSchema = (schema, data) => {
  const keys = Object.keys(schema);
  return keys.reduce((res, dataKey) => {
    const validatorFn = schema[dataKey];
    const rawValue = data[dataKey];
    res[dataKey] = validatorFn({ name: dataKey }, rawValue);
    return res;
  }, {});
};
const object = ({ schema }) => (ctx, value) => {
  const validated = validateObjectWithSchema(schema, value);
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

const validarListaUnidades = (unidades, errors, inputs) => {
  if (!unidades.length || unidades.length === 0) {
    errors.unidades = 'unidades debe ser un arreglo válido, no vacío';
    return;
  }

  const esUnError = item => item;
  const erroresDeListaUnidades = unidades.map(validarUnidad);
  const primerError = erroresDeListaUnidades.find(esUnError);
  if (primerError) {
    const posicionDelPrimerError =
      erroresDeListaUnidades.indexOf(primerError) + 1;
    errors.unidades = `Error en posición #${posicionDelPrimerError}: ${primerError}`;
    return;
  }

  inputs.unidades = unidades;
};

const validarDescuentoDefault = (descDefault, errors, inputs) => {
  if (!esPorcentajeValido(descDefault))
    errors.descDefault = 'descuento inválido. ' + porcentaje_invalido;
  else inputs.descDefault = descDefault;
};

const validarDescuentoSmall = (descuento, errors, inputs) => {
  if (!esPorcentajeValido(descuento)) errors.descuento = invalido;
  else inputs.descuento = descuento;
};
const validarComision = (comision, errors, inputs) => {
  if (!validator.isInt(comision, percentageOpts))
    errors.comision = 'comision inválida. ' + porcentaje_invalido;
  else inputs.comision = comision;
};

const validarCodigoRegistroSanitario = (codigo, errors, inputs) => {
  if (validator.isEmpty(codigo)) errors.codigo = campo_obligatorio;
  else inputs.codigo = codigo;
};

const validarPrecioFabrica = (precioDist, errors, inputs) => {
  const precio_invalido = 'precio inválido';
  if (!validator.isEmpty(precioDist) && !validator.isDecimal(precioDist))
    errors.precioDist = precio_invalido;
  else inputs.precioDist = precioDist;
};

const validarPrecioVenta = (precioVenta, errors, inputs) => {
  if (validator.isEmpty(precioVenta)) errors.precioVenta = campo_obligatorio;
  else if (!validator.isDecimal(precioVenta)) errors.precioVenta = precioVenta;
  else inputs.precioVenta = precioVenta;
};

const validarCodigoFactura = (codigo, errors, inputs) => {
  if (validator.isEmpty(codigo)) errors.codigo = campo_obligatorio_min;
  else if (!validator.isNumeric(codigo)) errors.codigo = invalido;
  else inputs.codigo = codigo;
};

const validarFecha = (fecha, errors, inputs) => {
  if (validator.isEmpty(fecha)) errors.fecha = campo_obligatorio_min;
  else if (!validator.isDate(fecha)) errors.fecha = invalido;
  else inputs.fecha = fecha;
};

const validarFormaPago = (formaPago, errors, inputs) => {
  if (validator.isEmpty(formaPago)) errors.formaPago = campo_obligatorio_min;
  else if (!FormasDePago.includes(formaPago.toUpperCase()))
    errors.formaPago = invalido;
  else inputs.formaPago = formaPago;
};

const validarMedico = formData => {
  const nombre = formData.nombre || '';
  const email = formData.email || '';
  const direccion = formData.direccion || '';
  const comision = String(formData.comision || '0');
  const telefono1 = formData.telefono1 || '';
  const telefono2 = formData.telefono2 || '';

  const errors = {};
  const inputs = { direccion };

  validarComision(comision, errors, inputs);
  validarNombre(nombre, errors, inputs);
  validarEmail(email, errors, inputs);
  validarTelefono(telefono1, errors, inputs, 'telefono1');
  validarTelefono(telefono2, errors, inputs, 'telefono2');

  return eitherErrorsOrInputs(errors, inputs);
};

const validarProducto = formData => {
  const codigo = formData.codigo || '';
  const nombre = formData.nombre || '';
  const marca = formData.marca || '';
  const precioDist = String(formData.precioDist || '');
  const precioVenta = String(formData.precioVenta || '');
  const pagaIva = formData.pagaIva;

  const errors = {};
  const inputs = { pagaIva, marca };

  validarCodigoRegistroSanitario(codigo, errors, inputs);
  validarNombre(nombre, errors, inputs);
  validarPrecioFabrica(precioDist, errors, inputs);
  validarPrecioVenta(precioVenta, errors, inputs);

  return eitherErrorsOrInputs(errors, inputs);
};

const unidadSchema = Object.freeze({
  producto: primaryKey(),
  fechaExp: dateString(),
  lote: string({ fallback: '' }),
  count: int({ min: 1 }),
  precioVenta: float()
});

const getSchemaExcludingKeys = (schema, keys) => {
  const copiedSchema = { ...schema };
  keys.forEach(key => {
    delete copiedSchema[key];
  });
  return copiedSchema;
};
const ventaSchema = {
  rowid: primaryKey(),
  codigo: numericString({ fallback: '' }),
  fecha: dateString(),
  descuento: int({ fallback: 0, max: 100, abrv: true }),
  iva: int({ max: 30 }),
  empresa: string(),
  flete: float({ fallback: 0 }),
  subtotal: float({ fallback: 0 }),
  autorizacion: string({ fallback: '' }),
  formaPago: either({ opts: FormasDePago, abrv: true }),
  cliente: primaryKey(),
  detallado: bool(),
  unidades: array({ item: unidadSchema })
};

const ventaInsertSchema = getSchemaExcludingKeys(ventaSchema, ['rowid']);

const clienteRowSchema = {
  rowid: primaryKey(),
  ruc: numericString(),
  nombre: string(),
  direccion: string({ fallback: '' }),
  email: email(),
  telefono1: phone(),
  telefono2: phone({ fallback: '' }),
  descDefault: int({ fallback: 0, min: 0, max: 100 }),
  tipo: either({ opts: [1, 2, 3] })
};

clienteInsertSchema = getSchemaExcludingKeys(clienteRowSchema, ['rowid']);

const validarVentaRowExamen = formData => {
  const schema = {
    codigo: numericString({ fallback: '' }),
    fecha: dateString(),
    descuento: int({ fallback: 0, max: 100, abrv: true }),
    empresa: string(),
    flete: float({ fallback: 0 }),
    subtotal: float({ fallback: 0 }),
    autorizacion: string({ fallback: '' }),
    formaPago: either({ opts: FormasDePago, abrv: true }),
    cliente: primaryKey(),
    medico: primaryKey(),
    paciente: string(),
    detallado: bool(),
    unidades: array({ item: unidadSchema })
  };

  return validateFormWithSchema(schema, formData);
};

const validarBusqueda = (q, limit) => {
  const errors = {};
  if (q && typeof q !== 'string') errors.q = 'consulta invalida';
  if (limit && !validator.isInt('' + limit))
    errors.limit = 'limite invalido, debe de ser un entero';
  if (isEmptyObj(errors)) return null;
  return errors;
};

module.exports = {
  esFacturablePropValido,
  esFacturaDataPropValido,
  validarBusqueda,
  validarMedico,
  validarProducto,
  validarUnidad,
  validarVentaRowExamen,
  validateFormWithSchema,
  ventaSchema,
  ventaInsertSchema,
  clienteRowSchema,
  clienteInsertSchema
};
