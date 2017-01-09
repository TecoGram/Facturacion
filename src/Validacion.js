const validator = require('validator')
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

  validarMedico: (formData) => {

    const nombre = formData.nombre || ''
    const email = formData.email || ''
    const comision = formData.comision || '0'
    const telefono1 = formData.telefono1 || ''
    const telefono2 = formData.telefono2 || ''

    const errors = {}
    const inputs = {}

    if(!validator.isInt(comision))
      errors.comision = 'comision inválida'
    else
      inputs.comision = comision

    if(validator.isEmpty(nombre))
      errors.nombre = campo_obligatorio
    else
      inputs.nombre = nombre

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

    let errors = {}
    let inputs = {}

    if(validator.isEmpty(codigo))
      errors.codigo = campo_obligatorio_min
    else if(!validator.isNumeric(codigo))
      errors.codigo = invalido
    else
      inputs.codigo = codigo

    if(validator.isEmpty(fecha))
      errors.fecha = campo_obligatorio_min
    else if(!validator.isDate(fecha))
      errors.fecha = invalido
    else
      inputs.fecha = fecha

    if(!validator.isEmpty(descuento)
      && !validator.isInt(descuento, {min: 0, max: 99}))
      errors.descuento = invalido
    else
      inputs.descuento = descuento

    if(validator.isEmpty(formaPago))
      errors.formaPago = campo_obligatorio_min
    else
      inputs.formaPago = formaPago

    if(validator.isEmpty(cliente))
      errors.cliente = campo_obligatorio_min
    else if (!validator.isNumeric(cliente))
      errors.cliente = invalido
    else
      inputs.cliente = cliente

    inputs.autorizacion = autorizacion

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
}
