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
      const formatted = formatter.findVentas(arr)

      formatted.should.be.an('array')
      arr.should.not.be.eql(formatted)

      formatted[0].total.should.be.equal('23.35')
      formatted[1].total.should.be.equal('12.56')
      formatted[2].total.should.be.equal('658.00')
    })

    it('Si recibe un array vacio, devuelve lo mismo', function () {
      const arr = []
      const formatted = formatter.findVentas(arr)
      formatted.should.be.equal(arr)
    })
  })

  describe ('verVenta', function () {
    it ('Recibe el resultado del query que busca la informacion de una venta y' +
      ' retorna un objeto de la forma del state de FacturaEditor', function () {
      const queryResp = {
        ventaRow:{
          codigo:9999999,
          cliente: '0937816882001',
          fecha:'2016-11-26',
          autorizacion:'',
          formaPago:'CONTADO',
          subtotal:19.99,
          descuento:0,
          iva:2,
          total:22,
          productos:[
            {
              nombre:'TGO 8x50',
              count:1,
              precioVenta:11,
              lote:'ert3',
              fechaExp: '2017-04-04',
            },
          ],
        },
        cliente:{
          ruc:'0937816882001',
          nombre:'Dr. Julio Mendoza',
          email:'julio_mendoza@yahoo.com.ec',
          direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
          telefono1: '2645422',telefono2: '2876357',
        },
      }

      const desiredResp = {
        facturaData: {
          codigo:9999999,
          fecha:'2016-11-26',
          autorizacion:'',
          descuento:0,
          formaPago:'CONTADO',
        },
        cliente:{
          ruc:'0937816882001',
          nombre:'Dr. Julio Mendoza',
          email:'julio_mendoza@yahoo.com.ec',
          direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
          telefono1: '2645422',telefono2: '2876357',
        },
        productos:[
          {
            nombre:'TGO 8x50',
            count:1,
            precioVenta:11,
            lote:'ert3',
            fechaExp: '2017-04-04',
          },
        ],
      }
      const formattedResp = formatter.verVenta(queryResp)
      formattedResp.should.be.eql(desiredResp)
    })
  })

})
