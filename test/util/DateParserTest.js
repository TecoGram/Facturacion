/* eslint-env node, mocha */
const DateParser = require('../../src/DateParser.js')
const assert = require('assert');
const chai = require('chai')
  , expect = chai.expect
  , should = chai.should();

describe ('DateParser', function() {

  describe ('verVenta', function () {
    it ('Recibe el resultado del query que busca la informacion de una venta y' +
      ' retorna un nuevo objeto con todas las fechas en string convertidas a objetos Date', function () {
      const queryResp = {
        cliente:{
          ruc:'0937816882001',
          nombre:'Dr. Julio Mendoza',
          email:'julio_mendoza@yahoo.com.ec',
          direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
          telefono1: '2645422',telefono2: '2876357',
        },
        facturaData: {
          codigo:9999999,
          fecha: '2016-11-26',
          autorizacion:'',
          descuento:0,
          formaPago:'CONTADO',
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

      const desiredResp = {
        cliente:{
          ruc:'0937816882001',
          nombre:'Dr. Julio Mendoza',
          email:'julio_mendoza@yahoo.com.ec',
          direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
          telefono1: '2645422',telefono2: '2876357',
        },
        facturaData: {
          codigo:9999999,
          fecha: new Date('2016-11-26'),
          autorizacion:'',
          descuento:0,
          formaPago:'CONTADO',
        },
        productos:[
          {
            nombre:'TGO 8x50',
            count:1,
            precioVenta:11,
            lote:'ert3',
            fechaExp: new Date('2017-04-04'),
          },
        ],
      }
      const formattedResp = DateParser.verVenta(queryResp)
      formattedResp.should.be.eql(desiredResp)
    })
  })

})
