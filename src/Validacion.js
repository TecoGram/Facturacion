const validator = require('validator')
const campo_obligatorio = 'Este campo es obligatorio'

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
}
