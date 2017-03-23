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
    const { cliente, medico, facturaData, facturables } = resp
    const _facturaData = Object.assign({}, facturaData)
    _facturaData.fecha = parseDBDate(facturaData.fecha)
    const _facturables = []

    let i
    for (i = 0; i < facturables.length; i++) {
      const p = facturables[i]
      const _p = Object.assign({}, p)
      _p.fechaExp = parseDBDate(p.fechaExp)
      _facturables.push(_p)
    }

    return {
      cliente,
      medico,
      facturaData: _facturaData,
      facturables: _facturables,
    }
  },
}
