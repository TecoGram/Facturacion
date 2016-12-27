/* eslint-env node, mocha */

const Immutable = require('immutable')
const assert = require('assert');
const chai = require('chai')
  , expect = chai.expect
  , should = chai.should();

const pdfutils = require('../../backend/pdf/pdfutils.js')
const billetesPalabras = pdfutils.billetesPalabras
const valorPalabras = pdfutils.valorPalabras

describe('pdfutils', function () {
  it('billetesPalabras convierte numeros enteros a palabras', function () {
    billetesPalabras(0).should.equal('CERO')
    billetesPalabras(19).should.equal('DIECINUEVE')
    billetesPalabras(20).should.equal('VEINTE')
    billetesPalabras(30).should.equal('TREINTA')
    billetesPalabras(40).should.equal('CUARENTA')
    billetesPalabras(50).should.equal('CINCUENTA')
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
    valorPalabras(13.78).should.equal('TRECE CON 78/100 DÓLARES')
    valorPalabras(11).should.equal('ONCE CON 0/100 DÓLARES')
    valorPalabras(12.02).should.equal('DOCE CON 2/100 DÓLARES')
  })
})
