/* eslint-env node, mocha */
const formatter = require('../../backend/responseFormatter.js')
const chai = require('chai')
chai.should();

describe ('responseFormatter', function() {

  describe('formatFindVentas', function () {
    it('Recibe un array de objetos con campo \'total\' y formatea este campo' +
      ' para que solo tenga 2 numeros decimales.', function () {
      const arr = [
        { subtotal: 23.34596, iva: 12, descuento: 0, flete: 0, detallado: 0 },
        { subtotal: 12.5612, iva: 12, descuento: 0, flete: 0, detallado: false },
        { subtotal: 657.9998, iva: 12, descuento: 0, flete: 0, detallado: 1 },
      ]
      const formatted = formatter.findVentas(arr)

      formatted.should.be.an('array')
      arr.should.not.be.eql(formatted)

      formatted[0].total.should.be.equal('26.15')
      formatted[1].total.should.be.equal('14.07')
      formatted[2].total.should.be.equal('736.96')
    })

    it('Si recibe un array vacio, devuelve lo mismo', function () {
      const arr = []
      const formatted = formatter.findVentas(arr)
      formatted.should.be.equal(arr)
    })
  })

  describe ('verVenta', function () {
    const queryResp = {
      ventaRow:{
        codigo:9999999,
        empresa:'NAMCO',
        cliente: '0937816882001',
        fecha:'2016-11-26',
        autorizacion:'',
        formaPago:0,
        subtotal:19.99,
        detallado:1,
        descuento:0,
        iva:2,
        flete:0,
        facturables:[
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
        empresa: 'NAMCO',
        fecha:'2016-11-26',
        autorizacion:'',
        descuento:'0',
        detallado:true,
        flete:'0',
        formaPago:'EFECTIVO',
        subtotal:19.99,
        total:'20.39',
        medico: undefined,
        paciente: undefined,
      },
      cliente:{
        ruc:'0937816882001',
        nombre:'Dr. Julio Mendoza',
        email:'julio_mendoza@yahoo.com.ec',
        direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
        telefono1: '2645422',telefono2: '2876357',
      },
      facturables:[
        {
          nombre:'TGO 8x50',
          count:'1',
          precioVenta:'11',
          lote:'ert3',
          fechaExp: '2017-04-04',
        },
      ],
    }

    it ('Recibe el resultado del query que busca la informacion de una venta y' +
      ' retorna un objeto de la forma del state de FacturaEditor', function () {
      const formattedResp = formatter.verVenta(queryResp)
      formattedResp.should.be.eql(desiredResp)
    })

    it('devuelve nombres de paciente y medico cuando se trata de una factura examen',
      function () {
        const examenQueryResp = Object.assign({}, queryResp)
        examenQueryResp.ventaRow = Object.assign({}, queryResp.ventaRow)
        const medico1 = 'Dr. Benavides'
        const paciente1 = 'Edgar Bazurto'
        examenQueryResp.ventaRow.medico = medico1
        examenQueryResp.ventaRow.paciente = paciente1

        const examenDesiredResp = Object.assign({}, desiredResp)
        examenDesiredResp.facturaData = Object.assign({}, examenDesiredResp.facturaData)
        examenDesiredResp.facturaData.medico = medico1
        examenDesiredResp.facturaData.paciente = paciente1
        const formattedResp = formatter.verVenta(examenQueryResp)
        formattedResp.should.be.eql(examenDesiredResp)
      })
  })

})
