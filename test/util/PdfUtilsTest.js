/* eslint-env node, mocha */

const chai = require('chai')
chai.should();

const pdfutils = require('../../backend/pdf/pdfutils.js')
const billetesPalabras = pdfutils.billetesPalabras
const valorPalabras = pdfutils.valorPalabras

describe('pdfutils', function () {
  it('billetesPalabras convierte numeros enteros a palabras', function () {
    billetesPalabras(0).should.equal('CERO')
    billetesPalabras(14).should.equal('CATORCE')
    billetesPalabras(15).should.equal('QUINCE')
    billetesPalabras(19).should.equal('DIECINUEVE')
    billetesPalabras(20).should.equal('VEINTE')
    billetesPalabras(22).should.equal('VEINTIDÓS')
    billetesPalabras(23).should.equal('VEINTITRÉS')
    billetesPalabras(26).should.equal('VEINTISÉIS')
    billetesPalabras(30).should.equal('TREINTA')
    billetesPalabras(40).should.equal('CUARENTA')
    billetesPalabras(41).should.equal('CUARENTA Y UN')
    billetesPalabras(50).should.equal('CINCUENTA')
    billetesPalabras(54).should.equal('CINCUENTA Y CUATRO')
    billetesPalabras(60).should.equal('SESENTA')
    billetesPalabras(100).should.equal('CIEN')
    billetesPalabras(521).should.equal('QUINIENTOS VEINTIÚN')
    billetesPalabras(110).should.equal('CIENTO DIEZ')
    billetesPalabras(316).should.equal('TRESCIENTOS DIECISÉIS')
    billetesPalabras(778).should.equal('SETECIENTOS SETENTA Y OCHO')
    billetesPalabras(1463).should.equal('MIL CUATROCIENTOS SESENTA Y TRES')
    billetesPalabras(1282).should.equal('MIL DOSCIENTOS OCHENTA Y DOS')
    billetesPalabras(1607).should.equal('MIL SEISCIENTOS SIETE')
    billetesPalabras(1994).should.equal('MIL NOVECIENTOS NOVENTA Y CUATRO')
    billetesPalabras(12835).should.equal('DOCE MIL OCHOCIENTOS TREINTA Y CINCO')
  })

  it('valorPalabras convierte numeros de punto flotante a cadenas de caracteres legibles', function () {
    valorPalabras(1).should.equal('UN CON 00/100 DÓLARES')
    valorPalabras(11).should.equal('ONCE CON 00/100 DÓLARES')
    valorPalabras(12.02).should.equal('DOCE CON 02/100 DÓLARES')
    valorPalabras(13.78).should.equal('TRECE CON 78/100 DÓLARES')
    valorPalabras(27.90).should.equal('VEINTISIETE CON 90/100 DÓLARES')
    valorPalabras(60.54).should.equal('SESENTA CON 54/100 DÓLARES')
    valorPalabras(70.00).should.equal('SETENTA CON 00/100 DÓLARES')
    valorPalabras(80.01).should.equal('OCHENTA CON 01/100 DÓLARES')
    valorPalabras(90.99).should.equal('NOVENTA CON 99/100 DÓLARES')
    valorPalabras(1000.45).should.equal('MIL CON 45/100 DÓLARES')
  })

  it('valorPalabras redondea correctamente los centavos', function () {
    valorPalabras(54.999999).should.equal('CINCUENTA Y CINCO CON 00/100 DÓLARES')
    valorPalabras(45.4899999999).should.equal('CUARENTA Y CINCO CON 49/100 DÓLARES')
    valorPalabras(45.5772).should.equal('CUARENTA Y CINCO CON 58/100 DÓLARES')
    valorPalabras(32.0772).should.equal('TREINTA Y DOS CON 08/100 DÓLARES')
  })

  it('valorPalabras tambien acepta strings como argumento', function () {
    valorPalabras('54.999999').should.equal('CINCUENTA Y CINCO CON 00/100 DÓLARES')
    valorPalabras('45.4899999999').should.equal('CUARENTA Y CINCO CON 49/100 DÓLARES')
  })
})
