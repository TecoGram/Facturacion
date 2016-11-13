/* eslint-env node, mocha */
require('blanket')
const api = require('../src/api.js')
const server = require('../backend/server.js')

const assert = require('assert');
const chai = require('chai')
  , expect = chai.expect
  , should = chai.should();

if(process.env.NODE_ENV !== 'test') {
  //Por el amor de dios solo ejecutar esto en ambiente de prueba
  console.error("QUE CHUCHA CREES QUE HACES?",
  "QUIERES BORRAR TODA LA BASE DE PRODUCCION?",
  "DEBES DE EJECUTAR ESTO CON NODE_ENV=test")
  process.exit(1)
}

describe('endpoints disponibles para el cliente', function () {
  describe('insertarCliente', function () {
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
        const statusCode = resp.status
        statusCode.should.not.equal(200)
        done()
      }, function (err) {
        const statusCode = err.status
        const resp = err.response
        statusCode.should.equal(500)
        const db_error = JSON.parse(resp.text)
        db_error.code.should.equal('SQLITE_CONSTRAINT')
        done()
      })
    })
  })
})
