const format = require('fecha').format
/*
* Parsea un Date de un string formato YYYY-MM-dd sin timezones
*/
const parseDBDate = (fecha) => {
  //fucking timezones http://stackoverflow.com/a/31732581
  return new Date(fecha.replace(/-/g, '/'))
}

const toReadableDate = (fecha) => {
  return format(fecha, 'YYYY-MM-DD')
}

const oneYearFromToday = () => {
  return new Date(new Date().setFullYear(new Date().getFullYear() + 1))
}

module.exports = {
  oneYearFromToday,
  parseDBDate,
  toReadableDate,

  verVenta (resp) {
    const { cliente, facturaData, productos } = resp
    const _facturaData = Object.assign({}, facturaData)
    _facturaData.fecha = parseDBDate(facturaData.fecha)
    const _productos = []

    let i
    for (i = 0; i < productos.length; i++) {
      const p = productos[i]
      const _p = Object.assign({}, p)
      _p.fechaExp = parseDBDate(p.fechaExp)
      _productos.push(_p)
    }

    return {
      cliente: cliente,
      facturaData: _facturaData,
      productos: _productos,
    }
  },
}
