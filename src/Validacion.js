const validator = require('validator')
const { FormasDePago } = require('./custom/Factura/Models.js')

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

const esPorcentajeValido = (porcentajeString) => {
  return porcentajeString === ""
    || validator.isInt(porcentajeString, {min: 0, max: 100})
}

const esNumeroValido = (numeroString) => {
  return numeroString === ''
    || validator.isFloat(numeroString, { min: 0 })
}

const esEnteroValido = (enteroString) => {
  return enteroString === ''
    || validator.isInt(enteroString, { min: 0 })
}

const validarString = (str, errors, inputs, key) => {
  if(typeof str === 'string' && str.length > 0)
    inputs[key] = str
  else
    errors[key] = `${key} es un argumento erróneo`
}

const esFacturaDataPropValido = (propKey, newPropValue) => {
  switch(propKey) {
    case 'descuento':
      return esPorcentajeValido(newPropValue)
    case 'flete':
      return esNumeroValido(newPropValue)
    default:
      return true
  }
}

const esFacturablePropValido = (propKey, newPropValue) => {
  switch(propKey) {
    case 'count':
      return esEnteroValido(newPropValue)
    case 'precioVenta':
      return esNumeroValido(newPropValue)
    default:
      return true
  }
}

const validarBoolean = (bool, errors, inputs, key) => {
  if (typeof bool === 'boolean')
    inputs[key] = bool
  else
    errors[key] = `${key} debe de ser boolean (true|false)`
}

const validarNumeroCalculado = (num, errors, inputs, key) => {
  if (typeof num === 'number' && num >= 0)
    inputs[key] = num
  else
    errors[key] = `${key} debe de ser un número real no negativo`
}

const validarNumeroIngresado = (num, errors, inputs, key) => {
  if (!esNumeroValido(num))
    errors[key] = `${key} debe ser un número real no negativo`
  else
    inputs[key] = num
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

const validarPorcentajeIVA = (iva, errors, inputs) => {
  if(typeof iva !== 'number' || iva < 0 || iva > 30)
    errors.iva = 'porcentaje iva inválido.'
  else
    inputs.iva = iva
}

const validarUnidad = (unidad) => {
  const {
    producto,
    fechaExp,
    lote,
    count,
    precioVenta,
  } = unidad

  if (typeof producto !== 'number' || !validator.isInt('' + producto))
    return 'producto inválido'
  if (typeof fechaExp !== 'string' || !validator.isDate(fechaExp))
    return 'fecha expiración inválida'
  if (typeof lote !== 'string')
    return 'lote inválido'
  if (!esEnteroValido(count))
    return 'cantidad inválida'
  if (!esNumeroValido(precioVenta))
    return 'precio de venta inválido'
}

const validarListaUnidades = (unidades, errors, inputs) => {
  if (!unidades.length || unidades.length === 0) {
    errors.unidades = 'unidades debe ser un arreglo válido, no vacío'
    return
  }

  const esUnError = (item) => item
  const erroresDeListaUnidades = unidades.map(validarUnidad)
  const primerError = erroresDeListaUnidades.find(esUnError)
  if (primerError) {
    const posicionDelPrimerError = erroresDeListaUnidades.indexOf(primerError)
    errors.unidades = `Error en posición #${posicionDelPrimerError}: ${primerError}`
    return
  }

  inputs.unidades = unidades
}

const validarDescuentoDefault = (descDefault, errors, inputs) => {
  if(!esPorcentajeValido(descDefault))
    errors.descDefault = 'descuento inválido. ' + porcentaje_invalido
  else
    inputs.descDefault = descDefault
}

const validarDescuentoSmall = (descuento, errors, inputs) => {
  if(!esPorcentajeValido(descuento))
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

const validarPrecioFabrica = (precioDist, errors, inputs) => {
  const precio_invalido = 'precio inválido'
  if(!validator.isEmpty(precioDist) && !validator.isDecimal(precioDist))
    errors.precioDist = precio_invalido
  else
    inputs.precioDist = precioDist
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
  else if (!FormasDePago.includes(formaPago.toUpperCase()))
    errors.formaPago = invalido
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
  const marca = formData.marca || ''
  const precioDist = String(formData.precioDist || '')
  const precioVenta = String(formData.precioVenta || '')
  const pagaIva = formData.pagaIva

  const errors = {}
  const inputs = { pagaIva, marca }

  validarCodigoRegistroSanitario(codigo, errors, inputs)
  validarNombre(nombre, errors, inputs)
  validarPrecioFabrica(precioDist, errors, inputs)
  validarPrecioVenta(precioVenta, errors, inputs)

  return eitherErrorsOrInputs(errors, inputs)
}

const validarVentaRow = (formData) => {
  const codigo = formData.codigo || ''
  const fecha = formData.fecha || ''
  const descuento = formData.descuento || ''
  const iva = formData.iva
  const flete = String(formData.flete || '0')
  const autorizacion = formData.autorizacion || ''
  const formaPago = formData.formaPago || ''
  const cliente = formData.cliente ||''

  let errors = {}
  let inputs = {}

  validarCodigoFactura(codigo, errors, inputs)
  validarFecha(fecha, errors, inputs)
  validarString(formData.empresa, errors, inputs, 'empresa')
  validarDescuentoSmall(descuento, errors, inputs)
  validarPorcentajeIVA(iva, errors, inputs)
  validarFormaPago(formaPago, errors, inputs )
  validarRUC(cliente, errors, inputs, 'cliente')
  validarBoolean(formData.detallado, errors, inputs, 'detallado')
  validarNumeroIngresado(flete, errors, inputs, 'flete')
  validarNumeroCalculado(formData.subtotal, errors, inputs, 'subtotal')
  validarListaUnidades(formData.unidades, errors, inputs)
  inputs.autorizacion = autorizacion

  return eitherErrorsOrInputs(errors, inputs)
}

const validarVentaRowExamen = (formData) => {
  const codigo = formData.codigo || ''
  const fecha = formData.fecha || ''
  const descuento = String(formData.descuento || '0')
  const autorizacion = formData.autorizacion || ''
  const formaPago = formData.formaPago || ''
  const cliente = formData.cliente ||''

  let errors = {}
  let inputs = {}

  validarCodigoFactura(codigo, errors, inputs)
  validarString(formData.empresa, errors, inputs, 'empresa')
  validarFecha(fecha, errors, inputs)
  validarDescuentoSmall(descuento, errors, inputs)
  validarFormaPago(formaPago, errors, inputs )
  validarRUC(cliente, errors, inputs, 'cliente')
  validarNumeroCalculado(formData.subtotal, errors, inputs, 'subtotal')
  validarListaUnidades(formData.unidades, errors, inputs)
  validarString(formData.paciente, errors, inputs, 'paciente')
  validarString(formData.medico, errors, inputs, 'medico')
  inputs.autorizacion = autorizacion

  return eitherErrorsOrInputs(errors, inputs)
}

const validarBusqueda = (q, limit) => {
  const errors = {}
  if (q && typeof q !== 'string')
    errors.q = 'consulta invalida'
  if (limit && !validator.isInt('' + limit))
    errors.limit = 'limite invalido, debe de ser un entero'
  if (isEmptyObj(errors)) return null
  return errors
}

module.exports = {
  esFacturablePropValido,
  esFacturaDataPropValido,
  validarBusqueda,
  validarCliente,
  validarMedico,
  validarProducto,
  validarVentaRow,
  validarVentaRowExamen,
}
