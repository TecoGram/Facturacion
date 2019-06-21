const request = require('superagent');
const { validarDatilConfig } = require('facturacion_common/src/Validacion.js');
const config = require('../../datil.config.js');

const host = 'https://link.datil.co';

const r = validarDatilConfig(config);
if (r.errors) {
  const [primerError] = Object.values(r.errors);
  console.error(
    'Error de configuración Datil. %s.\n\nPor favor revisa el archivo ',
    primerError,
    require.resolve('../../datil.config.js')
  );
  process.exit(1);
}

const ventaToReqBody = venta => {
  return {
    secuencial: venta.rowid
  };
};

const emitirFactura = venta => {
  const body = { ...emision };
  return request
    .post(host + '/cliente/new')
    .set('X-Key', config.apiKey)
    .set('X-Password', config.password)
    .set('Accept', 'application/json')
    .send(body);
};

module.exports = {
  emitirFactura
};
