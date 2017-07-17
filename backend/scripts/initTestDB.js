/* eslint-disable no-console*/

if (process.env.NODE_ENV !== 'test') {
  //Por el amor de dios solo ejecutar esto en ambiente de prueba
  console.error(
    'QUE CHUCHA CREES QUE HACES?',
    'QUIERES BORRAR TODA LA BASE DE PRODUCCION?',
    'DEBES DE EJECUTAR ESTO CON NODE_ENV=test'
  );
  process.exit(1);
}

const fs = require('fs');
const path = require('path');

try {
  fs.unlinkSync(path.resolve(__dirname, '../test.sqlite'));
} catch (err) {
  if (err.code !== 'ENOENT') throw err;
}
require('./setupDB.js');
