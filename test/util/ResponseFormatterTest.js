/* eslint-env node, mocha */
const formatter = require('../../backend/responseFormatter.js')
const assert = require('assert');
const chai = require('chai')
  , expect = chai.expect
  , should = chai.should();

describe ('responseFormatter', function() {

  describe('formatFindVentas', function () {
    it('Recibe un array de objetos con campo \'total\' y formatea este campo' +
      ' para que solo tenga 2 numeros decimales.', function () {
      const arr = [
        { total: 23.34596 },
        { total: 12.5612 },
        { total: 657.9998 },
      ]
      const formatted = formatter.formatFindVentas(arr)

      formatted.should.be.an('array')
      arr.should.not.be.eql(formatted)

      formatted[0].total.should.be.equal('23.35')
      formatted[1].total.should.be.equal('12.56')
      formatted[2].total.should.be.equal('658.00')
    })

    it('Si recibe un array vacio, devuelve lo mismo', function () {
      const arr = []
      const formatted = formatter.formatFindVentas(arr)
      formatted.should.be.equal(arr)
    })
  })

})
