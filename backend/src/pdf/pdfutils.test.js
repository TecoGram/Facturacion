const pdfutils = require('./pdfutils.js');
const billetesPalabras = pdfutils.billetesPalabras;
const valorPalabras = pdfutils.valorPalabras;

describe('pdfutils', () => {
  it('billetesPalabras convierte numeros enteros a palabras', () => {
    expect(billetesPalabras(0)).toEqual('CERO');
    expect(billetesPalabras(14)).toEqual('CATORCE');
    expect(billetesPalabras(15)).toEqual('QUINCE');
    expect(billetesPalabras(19)).toEqual('DIECINUEVE');
    expect(billetesPalabras(20)).toEqual('VEINTE');
    expect(billetesPalabras(22)).toEqual('VEINTIDÓS');
    expect(billetesPalabras(23)).toEqual('VEINTITRÉS');
    expect(billetesPalabras(26)).toEqual('VEINTISÉIS');
    expect(billetesPalabras(30)).toEqual('TREINTA');
    expect(billetesPalabras(40)).toEqual('CUARENTA');
    expect(billetesPalabras(41)).toEqual('CUARENTA Y UN');
    expect(billetesPalabras(50)).toEqual('CINCUENTA');
    expect(billetesPalabras(54)).toEqual('CINCUENTA Y CUATRO');
    expect(billetesPalabras(60)).toEqual('SESENTA');
    expect(billetesPalabras(100)).toEqual('CIEN');
    expect(billetesPalabras(521)).toEqual('QUINIENTOS VEINTIÚN');
    expect(billetesPalabras(110)).toEqual('CIENTO DIEZ');
    expect(billetesPalabras(316)).toEqual('TRESCIENTOS DIECISÉIS');
    expect(billetesPalabras(778)).toEqual('SETECIENTOS SETENTA Y OCHO');
    expect(billetesPalabras(1463)).toEqual('MIL CUATROCIENTOS SESENTA Y TRES');
    expect(billetesPalabras(1282)).toEqual('MIL DOSCIENTOS OCHENTA Y DOS');
    expect(billetesPalabras(1607)).toEqual('MIL SEISCIENTOS SIETE');
    expect(billetesPalabras(1994)).toEqual('MIL NOVECIENTOS NOVENTA Y CUATRO');
    expect(billetesPalabras(12835)).toEqual(
      'DOCE MIL OCHOCIENTOS TREINTA Y CINCO'
    );
  });

  it('valorPalabras convierte numeros de punto flotante a cadenas de caracteres legibles', () => {
    expect(valorPalabras(1)).toEqual('UN CON 00/100 DÓLARES');
    expect(valorPalabras(11)).toEqual('ONCE CON 00/100 DÓLARES');
    expect(valorPalabras(12.02)).toEqual('DOCE CON 02/100 DÓLARES');
    expect(valorPalabras(13.78)).toEqual('TRECE CON 78/100 DÓLARES');
    expect(valorPalabras(27.9)).toEqual('VEINTISIETE CON 90/100 DÓLARES');
    expect(valorPalabras(60.54)).toEqual('SESENTA CON 54/100 DÓLARES');
    expect(valorPalabras(70.0)).toEqual('SETENTA CON 00/100 DÓLARES');
    expect(valorPalabras(80.01)).toEqual('OCHENTA CON 01/100 DÓLARES');
    expect(valorPalabras(90.99)).toEqual('NOVENTA CON 99/100 DÓLARES');
    expect(valorPalabras(1000.45)).toEqual('MIL CON 45/100 DÓLARES');
  });

  it('valorPalabras redondea correctamente los centavos', () => {
    expect(valorPalabras(54.999999)).toEqual(
      'CINCUENTA Y CINCO CON 00/100 DÓLARES'
    );
    expect(valorPalabras(45.4899999999)).toEqual(
      'CUARENTA Y CINCO CON 49/100 DÓLARES'
    );
    expect(valorPalabras(45.5772)).toEqual(
      'CUARENTA Y CINCO CON 58/100 DÓLARES'
    );
    expect(valorPalabras(32.0772)).toEqual('TREINTA Y DOS CON 08/100 DÓLARES');
  });

  it('valorPalabras tambien acepta strings como argumento', () => {
    expect(valorPalabras('54.999999')).toEqual(
      'CINCUENTA Y CINCO CON 00/100 DÓLARES'
    );
    expect(valorPalabras('45.4899999999')).toEqual(
      'CUARENTA Y CINCO CON 49/100 DÓLARES'
    );
  });
});
