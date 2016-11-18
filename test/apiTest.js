/* eslint-env node, mocha */
const api = require('../src/api.js')
const server = require('../backend/server.js')

const assert = require('assert');
const chai = require('chai')
  , expect = chai.expect
  , should = chai.should();

const unexpectedError = Error('Ocurrio algo inesperado');

if(process.env.NODE_ENV !== 'test') {
  //Por el amor de dios solo ejecutar esto en ambiente de prueba
  console.error("QUE CHUCHA CREES QUE HACES?",
  "QUIERES BORRAR TODA LA BASE DE PRODUCCION?",
  "DEBES DE EJECUTAR ESTO CON NODE_ENV=test")
  process.exit(1)
}

describe('endpoints disponibles para el cliente', function () {

  describe('/cliente/new', function () {
    const mi_ruc = '0937816882001'
    it('retorna 200 al ingresar datos correctos', function (done) {
      api.insertarCliente(
        mi_ruc,
        'Dr. Julio Mendoza',
        'Avenida Juan Tanca Marengo y Gomez Gould',
        'julio_mendoza@yahoo.com.ec',
        '2645422', '2876357')
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
        mi_ruc,
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

  describe('/producto/new', function () {
    const mi_producto = 'TGO 8x50'
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
})
