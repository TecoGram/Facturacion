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
const setup = require('../../backend/scripts/setupDB.js')

describe('metodos de dbAdmin.js', function () {

  before('borrar base de datos de prueba', function (done) {
    this.timeout(5000)
    setup().then(() => done())
    .catch((err) => done(err))
  })

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

  const cliente1 = {
    ruc: "0954236576001",
    nombre: "Dr. Juan Perez",
    email: "jperez@gmail.com",
    direccion:  "Av. Pedro Carbo y Sucre 512",
    telefono1: "2645987",
    telefono2: "2978504",
  }

  describe('insertarCliente', function() {


    it('persiste varios clientes en la base encadenando con promise', function (done) {
      db.insertarCliente(cliente1.ruc, cliente1.nombre, cliente1.direccion,
        cliente1.email, cliente1.telefono1, cliente1.telefono2)
      .then(function (ids) {
        ids.should.not.be.empty
        ids[0].should.be.a('number')
        return db.insertarCliente("0934233576001", "Carlos Sanchez",
        "Av. Brasil y la del ejercito", "carlos-sanchez84@live.com", "2353477", "2375980")
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

  const medico1 = {
    nombre: "Dr. William Hurtado",
    email: "whurtado@gmail.com",
    direccion:  "Av. Boyaca y 10 de Agosto 332",
    comision:  10,
    telefono1: "2434566",
    telefono2: "2885855",
  }

  describe('insertarMedico', function() {

    it('inserta una nueva fila a la tabla medicos', function (done) {
      db.insertarMedico(medico1.nombre, medico1.direccion, medico1.email,
        medico1.comision, medico1.telefono1, medico1.telefono2)
      .then(function (ids) {
        ids.should.not.be.empty
        ids[0].should.be.a('number')
        return db.insertarMedico("Dr. Carlos Jaramillo", "Av. Brasil 546",
        "carlos-jm@live.com", 5, "2353477", "2375980")
      }).then(function(ids) {
        ids.should.not.be.empty
        ids[0].should.be.a('number')
        done()
      })
    })

  })

  describe('findMedicos', function () {

    it('retorna un array con todos los medicos existentes si se le pasa un string vacio', function (done) {
      db.findMedicos('')
      .then(function(medicos) {
        medicos.should.be.an('array')
        medicos.should.have.lengthOf(2)
        done()
      })
    })

    it('puede buscar clientes por nombre, si se le pasa un string no vacio como argumento', function (done) {
      db.findMedicos('William Hu')
      .then(function(medicos) {
        medicos.should.be.an('array')
        medicos.should.have.lengthOf(1)
        medicos[0].nombre.should.be.equal('Dr. William Hurtado')
        done()
      })
    })

  })

  const ventaExInsertada = {
    codigo: '0009991',
    ruc: cliente1.ruc,
    medico: medico1.nombre,
    paciente: 'Fabricio Encarnacion',
    fecha: '2017-01-01',
    autorizacion: 'fse4',
    formaPago: 'VISA',
    subtotal: 21.00,
    descuento: 3,
    productos: [
      {
        producto: 1,
        fechaExp: '2016-11-26',
        lote: '545f2',
        count: 1,
        precioVenta: 10,
      },
    ],
  }

  describe('insertarVentaExamen', function() {

    const {
      codigo,
      ruc,
      fecha,
      autorizacion,
      formaPago,
      subtotal,
      descuento,
      productos,
      medico,
      paciente,
    } = ventaExInsertada

    it('persiste una nueva venta en la base y agrega las unidades vendidas a la base',
      function (done) {
        db.insertarVentaExamen(codigo, ruc, fecha, autorizacion, formaPago,
          descuento, subtotal, productos, medico, paciente)
        .then(function (res) {
          const lasInsertedId = res[0]
          lasInsertedId.should.be.a('number')
          done()
        })
        .catch(function (err) {
          done(err)
        })
      })
  })


  const ventaInsertada = {
    codigo: '0009993',
    empresa: 'TECOGRAM',
    ruc: cliente1.ruc,
    fecha: '2017-01-01',
    autorizacion: 'fse4',
    formaPago: 'VISA',
    subtotal: 21.00,
    descuento: 3,
    iva: 12,
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
      empresa,
      ruc,
      fecha,
      autorizacion,
      formaPago,
      subtotal,
      descuento,
      iva,
      productos,
    } = ventaInsertada

    it('persiste una nueva venta en la base y agrega las unidades vendidas a la base',
      function (done) {
        db.insertarVenta(codigo, empresa, ruc, fecha, autorizacion, formaPago,
          descuento, iva, subtotal, productos)
        .then(function (res) {
          const lasInsertedId = res[0]
          lasInsertedId.should.be.a('number')
          done()
        })
        .catch(function (err) {
          done(err)
        })
      })
  })


  describe('findVentas', function () {
    it ('devuelve las ultimas ventas si se le pasa un string vacio', function (done) {
      db.findVentas('')
        .then(function (results) {
          results.length.should.be.equal(1)

          const ultimaVenta = results[0]
          ultimaVenta.codigo.should.be.equal(ventaInsertada.codigo)
          ultimaVenta.empresa.should.be.equal(ventaInsertada.empresa)
          ultimaVenta.subtotal.should.be.equal(ventaInsertada.subtotal)
          ultimaVenta.fecha.should.be.equal(ventaInsertada.fecha)
          ultimaVenta.ruc.should.be.equal(cliente1.ruc)
          ultimaVenta.nombre.should.be.equal(cliente1.nombre)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it ('devuelve las ultimas ventas cuyo nombre de cliente coincide con el string pasado como argumento', function (done) {
      db.findVentas('Juan P')
        .then(function (results) {
          results.length.should.be.equal(1)

          const ultimaVenta = results[0]
          ultimaVenta.codigo.should.be.equal(ventaInsertada.codigo)
          ultimaVenta.empresa.should.be.equal(ventaInsertada.empresa)
          ultimaVenta.subtotal.should.be.equal(ventaInsertada.subtotal)
          ultimaVenta.fecha.should.be.equal(ventaInsertada.fecha)
          ultimaVenta.ruc.should.be.equal(cliente1.ruc)
          ultimaVenta.nombre.should.be.equal(cliente1.nombre)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it ('devuelve array vacio si no encuentra ventas con ese cliente', function (done) {
      db.findVentas('xxyz')
        .then(function (results) {
          results.length.should.be.equal(0)
          done()
        })
    })
  })

  describe('findVentasExamen', function () {
    it ('devuelve las ultimas ventas de examen si se le pasa un string vacio', function (done) {
      db.findVentasExamen('')
        .then(function (results) {
          results.length.should.be.equal(1)

          const ultimaVentaEx = results[0]
          ultimaVentaEx.codigo.should.be.equal(ventaExInsertada.codigo)
          ultimaVentaEx.subtotal.should.be.equal(ventaExInsertada.subtotal)
          ultimaVentaEx.fecha.should.be.equal(ventaExInsertada.fecha)
          ultimaVentaEx.paciente.should.be.equal(ventaExInsertada.paciente)
          ultimaVentaEx.ruc.should.be.equal(cliente1.ruc)
          ultimaVentaEx.nombre.should.be.equal(cliente1.nombre)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it ('devuelve las ultimas ventas examen cuyo nombre de cliente coincide con el string pasado como argumento', function (done) {
      db.findVentasExamen('Juan P')
        .then(function (results) {
          results.length.should.be.equal(1)

          const ultimaVentaEx = results[0]
          ultimaVentaEx.codigo.should.be.equal(ventaExInsertada.codigo)
          ultimaVentaEx.subtotal.should.be.equal(ventaExInsertada.subtotal)
          ultimaVentaEx.fecha.should.be.equal(ventaExInsertada.fecha)
          ultimaVentaEx.paciente.should.be.equal(ventaExInsertada.paciente)
          ultimaVentaEx.ruc.should.be.equal(cliente1.ruc)
          ultimaVentaEx.nombre.should.be.equal(cliente1.nombre)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it ('devuelve las ultimas ventas examen cuyo nombre de paciente coincide con el string pasado como argumento', function (done) {
      db.findVentasExamen('Fabri')
        .then(function (results) {
          results.length.should.be.equal(1)

          const ultimaVentaEx = results[0]
          ultimaVentaEx.codigo.should.be.equal(ventaExInsertada.codigo)
          ultimaVentaEx.subtotal.should.be.equal(ventaExInsertada.subtotal)
          ultimaVentaEx.fecha.should.be.equal(ventaExInsertada.fecha)
          ultimaVentaEx.paciente.should.be.equal(ventaExInsertada.paciente)
          ultimaVentaEx.ruc.should.be.equal(cliente1.ruc)
          ultimaVentaEx.nombre.should.be.equal(cliente1.nombre)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })
    it ('devuelve array vacio si no encuentra ventas examen con ese cliente', function (done) {
      db.findVentas('xxyz')
        .then(function (results) {
          results.length.should.be.equal(0)
          done()
        })
    })
  })

  describe('getFacturaData', function () {
    it('busca en la base de datos la fila de la venta, y los productos vendidos',
    function (done) {
      const {
        codigo,
        empresa,
        ruc,
        fecha,
        autorizacion,
        formaPago,
        subtotal,
        descuento,
        iva,
        productos,
      } = ventaInsertada

      db.getFacturaData(codigo, empresa) //datos del test anterior 'insertarVenta'
      .then (function (resp) {
        const {
          ventaRow,
          cliente,
        } = resp

        ventaRow.formaPago.should.equal('VISA')
        ventaRow.cliente.should.equal(ruc)
        ventaRow.subtotal.should.equal(subtotal)
        ventaRow.productos.length.should.equal(2)

        cliente.nombre.should.equal(cliente1.nombre)
        cliente.direccion.should.equal(cliente1.direccion)
        cliente.telefono1.should.equal(cliente1.telefono1)

        const producto1 = ventaRow.productos[0]
        const producto2 = ventaRow.productos[1]

        producto1.precioVenta.should.equal(10)
        producto1.producto.should.equal(1)
        producto1.count.should.equal(1)
        producto1.fechaExp.should.equal('2016-11-26')
        producto2.precioVenta.should.equal(7)
        producto2.producto.should.equal(2)
        producto2.count.should.equal(2)
        producto2.fechaExp.should.equal('2016-11-26')
        done()
      })
      .catch(done)

    })

    it ('rechaza la promesa si no encuentra la factura', function (done) {
      db.getFacturaData('2016-11-03', 'VER') //inexistente
      .then( undefined, function (error) {
        error.errorCode.should.equal(404)
        error.text.should.equal("factura no encontrada")
        done()
      })
    })
  })


  describe('updateVenta', function() {

    const {
      codigo,
      empresa,
      ruc,
      fecha,
      autorizacion,
      formaPago,
      subtotal,
      descuento,
      iva,
      productos,
    } = ventaInsertada

    const formaPagoUpdated = 'CHEQUE'
    const autorizacionUpdated ="qwe4"

    it('actualiza una venta y las unidades vendidas en la base',
      function (done) {
        db.updateVenta(codigo, empresa, ruc, fecha, autorizacionUpdated,
          formaPagoUpdated, descuento, iva, subtotal, productos)
        .then(function (res) {
          const lasInsertedId = res[0]
          //test api ya inserto 2 unidades, mas estas 2, la nueva debe de ser 4
          lasInsertedId.should.be.a('number')
          return db.getFacturaData(codigo, empresa)
        })
        .then(function (resp) {
          const { ventaRow, cliente } = resp
          ventaRow.formaPago.should.be.equal(formaPagoUpdated)
          ventaRow.autorizacion.should.be.equal(autorizacionUpdated)
          ventaRow.productos.length.should.be.equal(2)
          done()
        })
        .catch(function (err) {
          done(err)
        })
      })

    it('Permite modificar la lista de productos vendidos',
      function (done) {
        const productosUpdated = [
          {
            producto: 1,
            fechaExp: '2016-11-26',
            lote: '545f2',
            count: 1,
            precioVenta: 10,
          },
        ]
        db.updateVenta(codigo, empresa, ruc, fecha, autorizacionUpdated, formaPagoUpdated,
          descuento, iva, subtotal, productosUpdated)
        .then(function (res) {
          const lasInsertedId = res[0]
          lasInsertedId.should.be.a('number')
          return db.getFacturaData(codigo, empresa)
        })
        .then(function (resp) {
          const { ventaRow, cliente } = resp
          ventaRow.formaPago.should.be.equal(formaPagoUpdated)
          ventaRow.autorizacion.should.be.equal(autorizacionUpdated)
          ventaRow.productos.length.should.be.equal(1)

          done()
        })
        .catch(done)
      })
  })

  describe('updateVentaExamen', function() {

    const {
      codigo,
      ruc,
      fecha,
      autorizacion,
      formaPago,
      subtotal,
      descuento,
      medico,
      paciente,
      productos,
    } = ventaExInsertada

    const formaPagoUpdated = 'EXPRESS'
    const pacienteUpdated = "Julio Fuentes"

    it('actualiza una venta y las unidades vendidas en la base',
      function (done) {
        db.updateVentaExamen(codigo, ruc, fecha, autorizacion, formaPagoUpdated,
          descuento, subtotal, productos, medico, pacienteUpdated)
        .then(function (res) {
          const lasInsertedId = res[0]
          lasInsertedId.should.be.a('number')
          return db.getFacturaExamenData(codigo)
        })
        .then(function (resp) {
          const { ventaRow, cliente } = resp
          ventaRow.formaPago.should.be.equal(formaPagoUpdated)
          ventaRow.productos.length.should.be.equal(1)
          return db.findVentasExamen(pacienteUpdated)
        })
        .then(function (resp) {
          resp.should.be.an('array')
          resp.length.should.be.equal(1)
          done()
        })
        .catch(function (err) {
          done(err)
        })
      })

    it('Permite modificar la lista de productos vendidos',
      function (done) {
        const productosUpdated = [
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
            lote: '545f2',
            count: 1,
            precioVenta: 20,
          },
        ]
        db.updateVentaExamen(codigo, ruc, fecha, autorizacion, formaPagoUpdated,
          descuento, subtotal, productosUpdated, medico, pacienteUpdated)
        .then(function (res) {
          const lasInsertedId = res[0]
          lasInsertedId.should.be.a('number')
          return db.getFacturaExamenData(codigo)
        })
        .then(function (resp) {
          const { ventaRow, cliente } = resp
          ventaRow.formaPago.should.be.equal(formaPagoUpdated)
          ventaRow.productos.length.should.be.equal(2)
          done()
        })
        .catch(function (err) {
          done(err)
        })
      })
  })

  describe('deleteVenta', function () {
    it('borra una venta de la db y todas las unidades asociadas', function (done) {
      db.getUnidadesVenta(ventaInsertada.codigo, ventaInsertada.empresa)
        .then(function (rows) {
          rows.should.have.lengthOf(1)
          return db.deleteVenta(ventaInsertada.codigo, ventaInsertada.empresa)
        })
        .then(function () {
          return db.getFacturaData(ventaInsertada.codigo, ventaInsertada.empresa)
        })
        .then(undefined, function (err) {
          err.errorCode.should.be.equal(404)
          return db.getUnidadesVenta(ventaInsertada.codigo, ventaInsertada.empresa)
        })
        .then(function (rows) {
          rows.should.be.empty
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })
  })

  describe('deleteVentaExamen', function () {
    it('borra una venta examen de la db y todas las unidades asociadas', function (done) {
      db.getUnidadesVentaExamen(ventaExInsertada.codigo)
        .then(function (rows) {
          rows.should.have.lengthOf(2)
          return db.deleteVentaExamen(ventaExInsertada.codigo)
        })
        .then(function () {
          return db.getFacturaExamenData(ventaExInsertada.codigo)
        })
        .then(undefined, function (err) {
          err.errorCode.should.be.equal(404)
          return db.getUnidadesVentaExamen(ventaExInsertada.fecha, ventaExInsertada.codigo)
        })
        .then(function (rows) {
          rows.should.be.empty
          return db.getExamenInfo(ventaExInsertada.codigo)
        })
        .then(function (rows) {
          rows.should.be.empty
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })
  })

})
