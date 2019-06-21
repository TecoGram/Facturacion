const fs = require('fs');
const {
  fromVentaRow,
  crearMatrizValoresTotales,
  generarDetalleOpcionesDePago
} = require('./facturaPDFData.js');

const billetesPalabras = billetes => {
  if (billetes === 0) return 'CERO';
  else if (billetes === 1) return 'UN';
  else if (billetes === 2) return 'DOS';
  else if (billetes === 3) return 'TRES';
  else if (billetes === 4) return 'CUATRO';
  else if (billetes === 5) return 'CINCO';
  else if (billetes === 6) return 'SEIS';
  else if (billetes === 7) return 'SIETE';
  else if (billetes === 8) return 'OCHO';
  else if (billetes === 9) return 'NUEVE';
  else if (billetes === 10) return 'DIEZ';
  else if (billetes === 11) return 'ONCE';
  else if (billetes === 12) return 'DOCE';
  else if (billetes === 13) return 'TRECE';
  else if (billetes === 14) return 'CATORCE';
  else if (billetes === 15) return 'QUINCE';
  else if (billetes === 16) return 'DIECISÉIS';
  else if (billetes > 16 && billetes < 20)
    return 'DIECI' + billetesPalabras(billetes - 10);
  else if (billetes === 20) return 'VEINTE';
  else if (billetes === 21) return 'VEINTIÚN';
  else if (billetes === 22) return 'VEINTIDÓS';
  else if (billetes === 23) return 'VEINTITRÉS';
  else if (billetes === 26) return 'VEINTISÉIS';
  else if (billetes > 20 && billetes < 30)
    return 'VEINTI' + billetesPalabras(billetes - 20);
  else if (billetes === 30) return 'TREINTA';
  else if (billetes > 30 && billetes < 40)
    return 'TREINTA Y ' + billetesPalabras(billetes - 30);
  else if (billetes === 40) return 'CUARENTA';
  else if (billetes > 40 && billetes < 50)
    return 'CUARENTA Y ' + billetesPalabras(billetes - 40);
  else if (billetes === 50) return 'CINCUENTA';
  else if (billetes > 50 && billetes < 60)
    return 'CINCUENTA Y ' + billetesPalabras(billetes - 50);
  else if (billetes === 60) return 'SESENTA';
  else if (billetes > 60 && billetes < 70)
    return 'SESENTA Y ' + billetesPalabras(billetes - 60);
  else if (billetes === 70) return 'SETENTA';
  else if (billetes > 70 && billetes < 80)
    return 'SETENTA Y ' + billetesPalabras(billetes - 70);
  else if (billetes === 80) return 'OCHENTA';
  else if (billetes > 80 && billetes < 90)
    return 'OCHENTA Y ' + billetesPalabras(billetes - 80);
  else if (billetes === 90) return 'NOVENTA';
  else if (billetes > 90 && billetes < 100)
    return 'NOVENTA Y ' + billetesPalabras(billetes - 90);
  else if (billetes === 100) return 'CIEN';
  else if (billetes > 100 && billetes < 200)
    return 'CIENTO ' + billetesPalabras(billetes - 100);
  else if (billetes >= 500 && billetes < 600)
    return 'QUINIENTOS ' + billetesPalabras(billetes - 500);
  else if (billetes >= 700 && billetes < 800)
    return 'SETECIENTOS ' + billetesPalabras(billetes - 700);
  else if (billetes >= 900 && billetes < 1000)
    return 'NOVECIENTOS ' + billetesPalabras(billetes - 900);
  else if (billetes >= 200 && billetes < 1000)
    return (
      billetesPalabras(Math.trunc(billetes / 100)) +
      'CIENTOS ' +
      billetesPalabras(billetes % 100)
    );
  else if (billetes === 1000) return 'MIL';
  else if (billetes > 1000 && billetes < 2000)
    return 'MIL ' + billetesPalabras(billetes % 1000);
  else if (billetes >= 2000)
    return (
      billetesPalabras(Math.trunc(billetes / 1000)) +
      ' MIL ' +
      billetesPalabras(billetes % 1000)
    );
};

const valorPalabras = valorRaw => {
  const valor = Number(valorRaw).toFixed(2);
  const decimales = valor.split('.')[1];
  const billetes = Math.trunc(valor);
  return `${billetesPalabras(billetes)} CON ${decimales}/100 DÓLARES`;
};

const createTemporaryDir = dirname => {
  const tempDir = '/tmp/' + dirname;
  try {
    fs.mkdirSync(tempDir);
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
  return tempDir;
};

module.exports = {
  billetesPalabras,
  valorPalabras,
  createTemporaryDir,
  crearMatrizValoresTotales,
  generarDetalleOpcionesDePago,
  ventaRowToPDFData: fromVentaRow
};
