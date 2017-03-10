/* eslint-env node, mocha */
const formatter = require('../../backend/responseFormatter.js')
const chai = require('chai')
chai.should();

describe ('responseFormatter', function() {

  describe('crearListaFacturasParaTabla', function () {
    it('calcula y agrega el total a cada elemento', function () {
      const ventas = [{
        codigo:"00546",
        empresa:"TecoGram",
        fecha:"2017-03-05",
        ruc:"09455476584",
        nombre:"Miguel Narvaez",
        iva:1.99,
        descuento:0.99,
        subtotal:19.99,
      }]
      const listaParaRender = formatter.crearListaFacturasParaTabla(ventas)
      listaParaRender[0].total.should.be.equal('20.99')
    })

    it('calcula el total redondeando a dos decimales', function () {
      const ventas = [{
        codigo:"00546",
        empresa:"TecoGram",
        fecha:"2017-03-05",
        ruc:"09455476584",
        nombre:"Miguel Narvaez",
        iva:1.9869,
        descuento:0.3567,
        subtotal:19.4667,
      }]
      const listaParaRender = formatter.crearListaFacturasParaTabla(ventas)
      listaParaRender[0].total.should.be.equal('21.10')
    })
  })

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
    const queryResp = {
      ventaRow:{
        codigo:9999999,
        empresa:'NAMCO',
        cliente: '0937816882001',
        fecha:'2016-11-26',
        autorizacion:'',
        formaPago:'CONTADO',
        subtotal:19.99,
        descuento:0,
        iva:2,
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
        descuento:0,
        formaPago:'CONTADO',
        subtotal:19.99,
        total:21.99,
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
          count:1,
          precioVenta:11,
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
        const medico1 = 'Dr. Benavides'
        const paciente1 = 'Edgar Bazurto'
        examenQueryResp.ventaRow.medico = medico1
        examenQueryResp.ventaRow.paciente = paciente1

        const examenDesiredResp = Object.assign({}, desiredResp)
        examenDesiredResp.facturaData.medico = medico1
        examenDesiredResp.facturaData.paciente = paciente1
        const formattedResp = formatter.verVenta(examenQueryResp)
        formattedResp.should.be.eql(examenDesiredResp)
      })
  })

})
