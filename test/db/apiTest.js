/* eslint-env node, mocha */
const api = require('../../src/api.js')
const server = require('../../backend/server.js')
const fs = require('fs')
const request = require('superagent')

const assert = require('assert');
const chai = require('chai')
  , expect = chai.expect
  , should = chai.should();

const setup = require('../../backend/scripts/setupDB.js')
const FacturacionUtils = require('../../src/custom/FacturacionUtils')
const unexpectedError = Error('Ocurrio algo inesperado');
const facturaDir = '/tmp/facturas/'

if(process.env.NODE_ENV !== 'test') {
  //Por el amor de dios solo ejecutar esto en ambiente de prueba
  console.error("QUE CHUCHA CREES QUE HACES?",
  "QUIERES BORRAR TODA LA BASE DE PRODUCCION?",
  "DEBES DE EJECUTAR ESTO CON NODE_ENV=test")
  process.exit(1)
}

describe('server.js', function () {

  before('borrar base de datos de prueba', function (done) {
    console.log('wipe api')
    setup().then(() => done())
  })

  it ('crea el directorio /tmp/facturas/ durante startup', function () {
    //se asume que el test se ejecuta en la raiz del proyecto
    fs.existsSync(facturaDir).should.equal(true)
  })
})

const cliente1 = {
  ruc: '0937816882001',
  nombre: 'Dr. Julio Mendoza',
  direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
  correo: 'julio_mendoza@yahoo.com.ec',
  telefono1: '2645422', telefono2: '2876357',
}

describe('endpoints disponibles para el cliente', function () {

  describe('/cliente/new', function () {
    it('retorna 200 al ingresar datos correctos', function (done) {
      api.insertarCliente(
        cliente1.ruc,
        cliente1.nombre,
        cliente1.direccion,
        cliente1.correo,
        cliente1.telefono1, cliente1.telefono2)
      .then(function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(200)
        done()
      }, function (err) {
        console.error('test fail ' + JSON.stringify(err))
        done(err)
      })
    })

    it('retorna 500 al ingresar cliente con un ruc ya existente', function (done) {
      api.insertarCliente(
        cliente1.ruc,
        'Eduardo Villacreses',
        'Via a Samborondon km. 7.5 Urbanizacion Tornasol mz. 5 villa 20',
        'edu_vc@outlook.com',
        '2854345', '28654768')
      .then(function (resp) {
        throw unexpectedError
      }, function (err) {
        const statusCode = err.status
        const resp = err.response
        statusCode.should.equal(422)
        resp.text.should.be.a('string')
        const db_error = JSON.parse(resp.text)
        db_error.code.should.equal('SQLITE_CONSTRAINT')
        done()
      })
    })
  })

  describe('/cliente/find', function () {

    it('retorna 200 al encontrar clientes', function (done) {
      api.findClientes('ju')
      .then(function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(200)
        //Esto asume que en el test anterior se inserto un cliente Julio Mendoza
        const clientes = resp.body
        clientes.should.be.a('array')
        clientes.length.should.equal(1)
        done()
      }, function (err) {
        console.error('test fail ' + JSON.stringify(err))
        done(err)
      })
    })

    it('retorna 404 si no encuentra clientes', function (done) {
      api.findClientes('xyz')
      .then(function (resp) {
        throw unexpectedError
      }, function (err) {
        const statusCode = err.status
        const resp = err.response
        statusCode.should.equal(404)
        resp.text.should.be.a('string')
        done()
      })
    })
  })

  const mi_producto = 'TGO 8x50'
  describe('/producto/new', function () {
    it('retorna 200 al ingresar datos correctos', function (done) {
      api.insertarProducto(
        'rytertg663433g',
        mi_producto,
        39.99, 49.99)
      .then(function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(200)
        resp.body.should.be.an('array')
        resp.body[0].should.equal(1)
        done()
      }, function (err) {
        console.error('test fail ' + JSON.stringify(err))
        done(err)
      })
    })

    it('retorna 500 al ingresar producto con un nombre ya existente', function (done) {
      api.insertarProducto(
        '34tger5',
        mi_producto,
        39.99, 49.99)
      .then(function (resp) {
        throw unexpectedError
      }, function (err) {
        const statusCode = err.status
        const resp = err.response
        statusCode.should.equal(422)
        resp.text.should.be.a('string')
        const db_error = JSON.parse(resp.text)
        db_error.code.should.equal('SQLITE_CONSTRAINT')
        done()
      })
    })
  })


  describe('/producto/find', function () {

    it('retorna 200 al encontrar productos', function (done) {
      api.findProductos('TG')
      .then(function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(200)
        //Esto asume que en el test anterior se inserto un producto TGO 8x50
        const productos = resp.body
        productos.should.be.a('array')
        productos.length.should.equal(1)
        done()
      }, function (err) {
        console.error('test fail ' + JSON.stringify(err))
        done(err)
      })
    })

    it('retorna 404 si no encuentra productos', function (done) {
      api.findProductos('xyz')
      .then(function (resp) {
        throw unexpectedError
      }, function (err) {
        const statusCode = err.status
        const resp = err.response
        statusCode.should.equal(404)
        resp.text.should.be.a('string')
        done()
      })
    })
  })


  const newVentaRow = {
    codigo: '9999999',
    cliente: cliente1.ruc,
    fecha: '2016-11-26',
    autorizacion: '',
    formaPago: 'CONTADO',
    subtotal: 19.99,
    descuento: 0,
    iva: 2.00,
    total: 22.00,
  }

  describe('/venta/new', function () {
    it('retorna 200 al ingresar datos correctos', function (done) {

      api.findProductos('TGO 8x50')
        .then(function (resp) {
          const products = resp.body
          const unidades = [ FacturacionUtils.productoAUnidad(products[0]) ]
          newVentaRow.productos = unidades
          return api.insertarVenta(newVentaRow)
        })
        .then(function (resp) {
          const statusCode = resp.status
          statusCode.should.equal(200)
          done()
        }, function (err) {
          console.error('test fail ' + JSON.stringify(err))
          done(err)
        })
    })

    it('permite ingresar 2 facturas con mismo codigo pero diferente fecha', function (done) {
      const ventaRowCopy = Object.assign({}, newVentaRow)
      ventaRowCopy.fecha = '2016-11-27'
      api.insertarVenta(ventaRowCopy)
      .then(function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(200)
        done()
      }, function (err) {
        done(err)
      })
    })

    it('retorna 500 al ingresar datos duplicados', function (done) {
      api.insertarVenta(newVentaRow)
      .then(function (resp) {
        console.error('test fail ' + JSON.stringify(resp))
        done(resp)
      }, function (err) {
        const statusCode = err.status
        statusCode.should.equal(500)
        done()
      })
    })
  })

  const formaPagoUpdated = 'VISA'
  describe('/venta/update', function () {
    it('retorna 200 al ingresar datos correctos', function (done) {
      const editedVenta = Object.assign({}, newVentaRow)
      const autorizacionUpdated = "1235"
      editedVenta.autorizacion = autorizacionUpdated
      editedVenta.formaPago = formaPagoUpdated
      api.updateVenta(editedVenta)
        .then(function (resp) {
          const statusCode = resp.status
          statusCode.should.equal(200)
          done()
        }, function (err) {
          done(err)
        })
    })
  })

  describe('/venta/ver/:fecha/:codigo', function () {
    it('descarga el pdf de una factura existente', function(done) {
      const url = api.getFacturaURL(newVentaRow.codigo, newVentaRow.fecha)
      request.get(url)
      .end(function (err, res) {
        res.status.should.equal(200)
        res.header['content-type'].should.equal('application/pdf')
        done()
      })
    })

    it('retorna json si el header \'Accept\' es igual a \'application/json\'', function (done) {
      api.verVenta(newVentaRow.codigo, newVentaRow.fecha)
        .then(function (resp) {
          const { facturaData, productos, cliente } = resp.body
          facturaData.codigo.should.equal(newVentaRow.codigo)
          facturaData.fecha.should.equal(newVentaRow.fecha)
          facturaData.formaPago.should.equal(formaPagoUpdated)

          productos.length.should.equal(newVentaRow.productos.length)

          cliente.ruc.should.equal(cliente1.ruc)
          cliente.nombre.should.equal(cliente1.nombre)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it('retorna 404 si la factura solicitada no existe', function (done) {
      request.get(`localhost:8192/venta/ver/2016-12-15/000123`)
      .end(function (err, res) {
        res.status.should.equal(404)
        res.text.should.equal('factura no encontrada')
        done()
      })
    })

  })

  describe('/venta/find', function () {
    it('retorna 200 al encontrar facturas', function (done) {
      api.findVentas('Jul')
      .then(function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(200)
        //Esto asume que en el test anterior se insertaron 2 ventas
        const ventas = resp.body
        ventas.should.be.an('array')
        ventas.length.should.equal(2)
        done()
      }, function (err) {
        console.error('test fail ' + JSON.stringify(err))
        done(err)
      })
    })

    it('retorna 404 si no encuentra ventas', function (done) {
      api.findVentas('xyz')
      .then(function (resp) {
        throw unexpectedError
      }, function (err) {
        const statusCode = err.status
        const resp = err.response
        statusCode.should.equal(404)
        resp.text.should.be.a('string')
        done()
      })
    })
  })

})
