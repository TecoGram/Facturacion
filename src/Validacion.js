const validator = require('validator')
const campo_obligatorio = 'Este campo es obligatorio'
const campo_obligatorio_min = 'obligatorio'
const invalido = 'inválido'
const porcentaje_invalido = 'No está entre 0 y 100'

const phoneCharset = '1234567890-+()'
const usesCharset = (str, charset) => {
  const len = str.length
  for (let i = 0; i < len; i++) {
    if(!charset.includes(str[i]))
      return str[i]
  }
}

const percentageOpts = { min: 0, max: 100 }

const isEmptyObj = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

const eitherErrorsOrInputs = (errors, inputs) => {
  if(isEmptyObj(errors))
    return {
      errors: null,
      inputs: inputs,
    }
  return {
    errors: errors,
    inputs: null,
  }
}

const esDescuentoValido = (descuentoString) => {
  return descuentoString === ""
    || validator.isInt(descuentoString, {min: 0, max: 100})
}

const esFacturaDataPropValido = (propKey, newPropValue) => {
  switch(propKey) {
    case 'descuento':
      return esDescuentoValido(newPropValue)
    default:
      return true
  }
}

const esFacturablePropValido = (propKey, newPropValue) => {
  switch(propKey) {
    case 'count':
      return validator.isInt(newPropValue,{min: 0})
        || newPropValue.length === 0
    case 'precioVenta':
      return validator.isFloat(newPropValue, {min: 0})
        || newPropValue.length === 0
    default:
      return true
  }
}

const validarRUC = (ruc, errors, inputs, key) => {
  if(validator.isEmpty(ruc))
    errors[key] = campo_obligatorio
  else if(!validator.isNumeric(ruc))
    errors[key] = 'RUC inválido'
  else
    inputs[key] = ruc
}

const validarNombre = (nombre, errors, inputs) => {
  if(validator.isEmpty(nombre))
    errors.nombre = campo_obligatorio
  else
    inputs.nombre = nombre
}

const validarDireccion = (direccion, errors, inputs) => {
  if(validator.isEmpty(direccion))
    errors.direccion = campo_obligatorio
  else
    inputs.direccion = direccion
}

const validarEmail = (email, errors, inputs) => {
  if(!validator.isEmpty(email) && !validator.isEmail(email))
    errors.email = 'e-mail inválido'
  else
    inputs.email = email
}

const validarTelefono = (telefonoValue, errors, inputs, telefonoKey) => {
  const invalidPhoneChar = usesCharset(telefonoValue, phoneCharset)
  if(invalidPhoneChar)
    errors[telefonoKey] = 'caracter inválido: ' + invalidPhoneChar
  else
    inputs[telefonoKey] = telefonoValue
}

const validarDescuentoDefault = (descDefault, errors, inputs) => {
  if(!esDescuentoValido(descDefault))
    errors.descDefault = 'descuento inválido. ' + porcentaje_invalido
  else
    inputs.descDefault = parseInt(descDefault, 10)
}

const validarDescuentoSmall = (descuento, errors, inputs) => {
  if(!esDescuentoValido(descuento))
    errors.descuento = invalido
  else
    inputs.descuento = descuento
}
const validarComision = (comision, errors, inputs) => {
  if(!validator.isInt(comision, percentageOpts))
    errors.comision = 'comision inválida. ' + porcentaje_invalido
  else
    inputs.comision = comision
}

const validarCodigoRegistroSanitario = (codigo, errors, inputs) => {
  if(validator.isEmpty(codigo))
    errors.codigo = campo_obligatorio
  else
    inputs.codigo = codigo
}

const validarPrecioFabrica = (precioFab, errors, inputs) => {
  const precio_invalido = 'precio inválido'
  if(!validator.isEmpty(precioFab) && !validator.isDecimal(precioFab))
    errors.precioFab = precio_invalido
  else
    inputs.precioFab = precioFab
}

const validarPrecioVenta = (precioVenta, errors, inputs) => {
  if(validator.isEmpty(precioVenta))
    errors.precioVenta = campo_obligatorio
  else if (!validator.isDecimal(precioVenta))
    errors.precioVenta = precioVenta
  else
    inputs.precioVenta = precioVenta
}

const validarCodigoFactura = (codigo, errors, inputs) => {
  if(validator.isEmpty(codigo))
    errors.codigo = campo_obligatorio_min
  else if(!validator.isNumeric(codigo))
    errors.codigo = invalido
  else
    inputs.codigo = codigo
}

const validarFecha = (fecha, errors, inputs) => {
  if(validator.isEmpty(fecha))
    errors.fecha = campo_obligatorio_min
  else if(!validator.isDate(fecha))
    errors.fecha = invalido
  else
    inputs.fecha = fecha
}

const validarFormaPago = (formaPago, errors, inputs) => {
  if(validator.isEmpty(formaPago))
    errors.formaPago = campo_obligatorio_min
  else
    inputs.formaPago = formaPago
}

const validarCliente = (formData) => {

  const ruc = formData.ruc || ''
  const nombre = formData.nombre || ''
  const direccion = formData.direccion || ''
  const email = formData.email || ''
  const telefono1 = formData.telefono1 || ''
  const telefono2 = formData.telefono2 || ''
  const descDefault = String(formData.descDefault || '0')

  const errors = {}
  const inputs = {}

  validarRUC(ruc, errors, inputs, 'ruc')
  validarNombre(nombre, errors, inputs)
  validarDireccion(direccion, errors, inputs)
  validarEmail(email, errors, inputs)
  validarTelefono(telefono1, errors, inputs, 'telefono1')
  validarTelefono(telefono2, errors, inputs, 'telefono2')
  validarDescuentoDefault(descDefault, errors, inputs)

  return eitherErrorsOrInputs(errors, inputs)
}

const validarMedico = (formData) => {

  const nombre = formData.nombre || ''
  const email = formData.email || ''
  const direccion = formData.direccion || ''
  const comision = String(formData.comision || '0')
  const telefono1 = formData.telefono1 || ''
  const telefono2 = formData.telefono2 || ''

  const errors = {}
  const inputs = { direccion }

  validarComision(comision, errors, inputs)
  validarNombre(nombre, errors, inputs)
  validarEmail(email, errors, inputs )
  validarTelefono(telefono1, errors, inputs, 'telefono1')
  validarTelefono(telefono2, errors, inputs, 'telefono2')

  return eitherErrorsOrInputs(errors, inputs)
}

const validarProducto = (formData) => {

  const codigo = formData.codigo || ''
  const nombre = formData.nombre || ''
  const precioFab = String(formData.precioFab || '')
  const precioVenta = String(formData.precioVenta || '')
  const pagaIva = Boolean(formData.pagaIva || true)

  const errors = {}
  const inputs = { pagaIva }

  validarCodigoRegistroSanitario(codigo, errors, inputs)
  validarNombre(nombre, errors, inputs)
  validarPrecioFabrica(precioFab, errors, inputs)
  validarPrecioVenta(precioVenta, errors, inputs)

  return eitherErrorsOrInputs(errors, inputs)
}

const validarVentaRow = (formData) => {
  const codigo = formData.codigo || ''
  const fecha = formData.fecha || ''
  const descuento = String(formData.descuento || '0')
  const autorizacion = formData.autorizacion || ''
  const formaPago = formData.formaPago || ''
  const cliente = formData.cliente ||''

  let errors = {}
  let inputs = {}

  validarCodigoFactura(codigo, errors, inputs)
  validarFecha(fecha, errors, inputs)
  validarDescuentoSmall(descuento, errors, inputs)
  validarFormaPago(formaPago, errors, inputs )
  validarRUC(cliente, errors, inputs, 'cliente')
  inputs.autorizacion = autorizacion

  return eitherErrorsOrInputs(errors, inputs)
}

module.exports = {
  esFacturablePropValido,
  esFacturaDataPropValido,
  validarCliente,
  validarMedico,
  validarProducto,
  validarVentaRow,
}
