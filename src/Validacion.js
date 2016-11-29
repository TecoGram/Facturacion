const validator = require('validator')
const Immutable = require('immutable')
const campo_obligatorio = 'Este campo es obligatorio'
const campo_obligatorio_min = 'obligatorio'
const invalido = 'inválido'

const phoneCharset = '1234567890-+()'
const usesCharset = (str, charset) => {
  const len = str.length
  for (let i = 0; i < len; i++) {
    if(!phoneCharset.includes(str[i]))
      return str[i]
  }
}

const isEmptyObj = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}
module.exports = {
  validarCliente: (formData) => {

    const ruc = formData.ruc || ''
    const nombre = formData.nombre || ''
    const direccion = formData.direccion || ''
    const email = formData.email || ''
    const telefono1 = formData.telefono1 || ''
    const telefono2 = formData.telefono2 || ''

    const errors = {}
    const inputs = {}

    if(validator.isEmpty(ruc))
      errors.ruc = campo_obligatorio
    else if(!validator.isNumeric(ruc))
      errors.ruc = 'RUC inválido'
    else
      inputs.ruc = ruc

    if(validator.isEmpty(nombre))
      errors.nombre = campo_obligatorio
    else
      inputs.nombre = nombre

    if(validator.isEmpty(direccion))
      errors.direccion = campo_obligatorio
    else
      inputs.direccion = direccion


    if(!validator.isEmpty(email) && !validator.isEmail(email))
      errors.email = 'e-mail inválido'
    else
      inputs.email = email

    const invalidPhoneChar1 = usesCharset(telefono1, phoneCharset)
    if(invalidPhoneChar1)
      errors.telefono1 = 'caracter inválido: ' + invalidPhoneChar1
    else
      inputs.telefono1 = telefono1

    const invalidPhoneChar2 = usesCharset(telefono2, phoneCharset)
    if(invalidPhoneChar2)
      errors.telefono2 = 'caracter inválido: ' + invalidPhoneChar2
    else
      inputs.telefono2 = telefono2

    if(isEmptyObj(errors))
      return {
        errors: null,
        inputs: inputs,
      }
    return {
      errors: errors,
      inputs: null,
    }
  },

  validarProducto: (formData) => {

    const codigo = formData.codigo || ''
    const nombre = formData.nombre || ''
    const precioFab = formData.precioFab || ''
    const precioVenta = formData.precioVenta || ''

    const errors = {}
    const inputs = {}

    if(validator.isEmpty(codigo))
      errors.codigo = campo_obligatorio
    else
      inputs.codigo = codigo

    if(validator.isEmpty(nombre))
      errors.nombre = campo_obligatorio
    else
      inputs.nombre = nombre

    const precio_invalido = 'precio inválido'
    if(!validator.isEmpty(precioFab) && !validator.isDecimal(precioFab))
      errors.precioFab = precio_invalido
    else
      inputs.precioFab = precioFab

    if(validator.isEmpty(precioVenta))
      errors.precioVenta = campo_obligatorio
    else if (!validator.isDecimal(precioVenta))
      errors.precioVenta = precioVenta
    else
      inputs.precioVenta = precioVenta

    if(isEmptyObj(errors))
      return {
        errors: null,
        inputs: inputs,
      }
    return {
      errors: errors,
      inputs: null,
    }
  },

  validarVentaRow: (formData) => {

    const codigo = formData.codigo || ''
    const fecha = formData.fecha || ''
    const descuento = formData.descuento || ''
    const autorizacion = formData.autorizacion || ''
    const formaPago = formData.formaPago || ''
    const cliente = formData.cliente ||''

    const codigoKey = 'codigo'
    const fechaKey = 'fecha'
    const descuentoKey = 'descuento'
    const autorizacionKey = 'autorizacion'
    const formaPagoKey = 'formaPago'
    const clienteKey = 'cliente'

    let errors = Immutable.Map()
    let inputs = Immutable.Map()

    if(validator.isEmpty(codigo))
      errors = errors.set(codigoKey,campo_obligatorio_min)
    else if(!validator.isNumeric(codigo))
      errors = errors.set(codigoKey, invalido)
    else
      inputs = inputs.set(codigoKey, codigo)

    if(validator.isEmpty(fecha))
      errors = errors.set(fechaKey, campo_obligatorio_min)
    else if(!validator.isDate(fecha))
      errors = errors.set(fechaKey, invalido)
    else
      inputs = inputs.set(fechaKey, fecha)

    if(validator.isEmpty(descuento))
      errors = errors.set(descuentoKey, campo_obligatorio_min)
    else if(!validator.isInt(descuento,{min: 0, max: 99}))
      errors = errors.set(descuentoKey, invalido)
    else
      inputs = inputs.set(descuentoKey, descuento)

    if(validator.isEmpty(formaPago))
      errors = errors.set(formaPagoKey, campo_obligatorio_min)
    else
      inputs = inputs.set(formaPagoKey, formaPago)

    if(validator.isEmpty(cliente))
      errors = errors.set(clienteKey, campo_obligatorio_min)
    else if (!validator.isNumeric(cliente))
      errors = errors.set(clienteKey, invalido)
    else
      inputs = inputs.set(clienteKey, cliente)

    inputs = inputs.set(autorizacionKey, autorizacion)

    if(errors.isEmpty())
      return {
        errors: null,
        inputs: inputs,
      }
    return {
      errors: errors,
      inputs: null,
    }
  },
}
