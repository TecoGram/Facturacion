const format = require('fecha').format;
/*
* Parsea un Date de un string formato YYYY-MM-dd sin timezones
*/
const parseDBDate = fecha => {
  // ISO6801 string
  if (fecha.includes('T') && fecha.endsWith('Z')) return new Date(fecha);

  //fucking timezones http://stackoverflow.com/a/31732581
  return new Date(fecha.replace(/-/g, '/'));
};

const toReadableDate = fecha => {
  return format(fecha, 'YYYY-MM-DD');
};

const toReadableDateTime = fecha => {
  return format(fecha, 'YYYY-MM-DD HH:mm');
};

const toDatilDate = fecha => {
  return fecha.toISOString();
};

const oneYearFromToday = () => {
  return new Date(new Date().setFullYear(new Date().getFullYear() + 1));
};

module.exports = {
  oneYearFromToday,
  parseDBDate,
  toReadableDate,
  toReadableDateTime,
  toDatilDate,

  verVenta(resp) {
    const { cliente, medico, facturaData, facturables } = resp;
    const _facturaData = Object.assign({}, facturaData);
    _facturaData.fecha = parseDBDate(facturaData.fecha);

    return {
      cliente,
      medico,
      facturaData: _facturaData,
      facturables
    };
  }
};
