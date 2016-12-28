/* eslint-env node, mocha */
/* eslint-disable no-console */

if(process.env.NODE_ENV !== 'test') {
  //Por el amor de dios solo ejecutar esto en ambiente de prueba
  console.error("QUE CHUCHA CREES QUE HACES?",
  "QUIERES BORRAR TODA LA BASE DE PRODUCCION?",
  "DEBES DE EJECUTAR ESTO CON NODE_ENV=test")
  process.exit(1)
}

const assert = require('assert');
const chai = require('chai')
  , expect = chai.expect
  , should = chai.should();

const db = require("../../backend/dbAdmin.js")

describe('metodos de dbAdmin.js', function () {

  describe('insertarProducto', function () {

    it("persiste varios productos en la base encadenando con promise", function (done) {
      db.insertarProducto("fsers4", "producto A", 9.99, 14.99)
      .then(function (ids) {
        ids.should.not.be.empty
        ids[0].should.be.a('number')
        return db.insertarProducto("gfdtt", "producto B", 19.99, 24.99)
      }).then(function (ids) {
        ids.should.not.be.empty
        ids[0].should.be.a('number')
        return db.insertarProducto("gfgtb4", "producto C", 14.99, 18.99)
      }).then(function (ids) {
        ids.should.not.be.empty
        ids[0].should.be.a('number')
        done()
      })
    })

  })

  describe('findProductos', function () {

    it('retorna un array con todos los productos existentes si se le pasa un string vacio', function (done) {
      db.findProductos('')
      .then(function(productos) {
        productos.should.be.an('array')
        productos.should.not.be.empty
        done()
      })
    })

    it('puede buscar prodctos por nombre, si se le pasa un string no vacio como argumento', function (done) {
      db.findProductos('prod')
      .then(function(productos) {
        productos.should.be.an('array')
        //Esto asume que en el describe anterior se ingresaron unicamente 3 productos
        productos.length.should.be.equal(3)
        productos[0].nombre.should.be.equal('producto A')
        productos[1].nombre.should.be.equal('producto B')
        productos[2].nombre.should.be.equal('producto C')
        done()
      })
    })

  })

  describe('insertarCliente', function() {

    it('persiste varios clientes en la base encadenando con promise', function (done) {
      db.insertarCliente("0954236576001", "Dr. Juan Perez", "jperez@gmail.com",
      "Av. Pedro Carbo y Sucre 512", "2645987", "2978504")
      .then(function (ids) {
        ids.should.not.be.empty
        ids[0].should.be.a('number')
        return db.insertarCliente("0934233576001", "Carlos Sanchez",
        "carlos-sanchez84@live.com", "Av. Brasil y la del ejercito", "2353477", "2375980")
      }).then(function(ids) {
        ids.should.not.be.empty
        ids[0].should.be.a('number')
        done()
      })

    })

  })

  describe('findClientes', function () {

    it('retorna un array con todos los clientes existentes si se le pasa un string vacio', function (done) {
      db.findClientes('')
      .then(function(clientes) {
        clientes.should.be.an('array')
        clientes.should.not.be.empty
        done()
      })
    })

    it('puede buscar clientes por nombre, si se le pasa un string no vacio como argumento', function (done) {
      db.findClientes('Juan Carlos')
      .then(function(clientes) {
        clientes.should.be.an('array')
        //Esto asume que en el describe anterior se ingresaron unicamente Juan Perez y Carlos Sanchez
        clientes.length.should.be.equal(2)
        clientes[0].nombre.should.be.equal('Dr. Juan Perez')
        clientes[1].nombre.should.be.equal('Carlos Sanchez')
        done()
      })
    })

  })

  const ventaInsertada = {
    codigo: '0009993',
    ruc: '10954236576001',
    fecha: '2016-11-26',
    autorizacion: 'fse4',
    formaPago: 'VISA',
    subtotal: 21.00,
    descuento: 3.12,
    iva: 5.43,
    total: 38.12,
    productos: [
      {
        producto: 1,
        fechaExp: '2016-11-26',
        lote: '545f2',
        count: 1,
        precioVenta: 10,
      },
      {
        producto: 2,
        fechaExp: '2016-11-26',
        lote: '5453s',
        count: 2,
        precioVenta: 7,
      },
    ],
  }

  describe('insertarVenta', function() {

    const {
      codigo,
      ruc,
      fecha,
      autorizacion,
      formaPago,
      subtotal,
      descuento,
      iva,
      total,
      productos,
    } = ventaInsertada

    it('persiste una nueva venta en la base y agrega las unidades vendidas a la base',
      function (done) {
        db.insertarVenta(codigo, ruc, fecha, autorizacion, formaPago, subtotal,
          descuento, iva, total, productos)
        .then(function (res) {
          const lasInsertedId = res[0]
          //test api ya inserto una unidad, mas estas dos, la nueva debe de ser 3
          lasInsertedId.should.be.equal(3)
          done()
        })
      })
  })

  describe('getFacturaData', function () {
    it('busca en la base de datos la fila de la venta, y los productos vendidos',
    function (done) {
      const {
        codigo,
        ruc,
        fecha,
        autorizacion,
        formaPago,
        subtotal,
        descuento,
        iva,
        total,
        productos,
      } = ventaInsertada

      db.getFacturaData(codigo, fecha) //datos del test anterior 'insertarVenta'
      .then (function (ventaRow) {
        ventaRow.formaPago.should.equal('VISA')
        ventaRow.cliente.should.equal(ruc)
        ventaRow.total.should.equal(total)
        ventaRow.productos.length.should.equal(2)

        const producto1 = ventaRow.productos[0]
        const producto2 = ventaRow.productos[1]

        producto1.producto.should.equal(1)
        producto1.precioVenta.should.equal(10)
        producto2.producto.should.equal(2)
        producto2.precioVenta.should.equal(7)
        done()
      })

    })

    it ('rechaza la promesa si no encuentra la factura', function () {
      db.getFacturaData('0000', '2016-11-03') //inexistente
      .then( function () {},
        function (errorCode) {
          errorCode.should.equal(404)
        })
    })

    it ('rechaza la promesa si los parametros son invalidos', function () {
      db.getFacturaData('0000', 'corrupted') //inexistente
      .then( function () {},
        function (errorCode) {
          errorCode.should.equal(505)
        })
    })

  })

})
