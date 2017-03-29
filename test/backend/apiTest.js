/* eslint-env node, mocha */
const api = require('../../src/api.js')
require('../../backend/server.js')
const fs = require('fs')
const request = require('superagent')

const chai = require('chai')
chai.should();

const setup = require('../../backend/scripts/setupDB.js')
const FacturacionModels = require('../../src/custom/Factura/Models')
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
  telefono1: '2645422', telefono2: '2876357', descDefault: '0',
}

describe('endpoints disponibles para el cliente', function () {

  describe('/cliente/new', function () {
    it('retorna 200 al ingresar datos correctos', function (done) {
      api.insertarCliente(
        cliente1.ruc,
        cliente1.nombre,
        cliente1.direccion,
        cliente1.correo,
        cliente1.telefono1, cliente1.telefono2, cliente1.descDefault)
      .then(function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(200)
        done()
      }, function (err) {
        console.error('test fail ' + JSON.stringify(err))
        done(err)
      })
    })

    it('retorna 422 al ingresar cliente con un ruc ya existente', function (done) {
      api.insertarCliente(
        cliente1.ruc,
        'Eduardo Villacreses',
        'Via a Samborondon km. 7.5 Urbanizacion Tornasol mz. 5 villa 20',
        'edu_vc@outlook.com',
        '2854345', '28654768', '5')
      .then(undefined)
      .catch(function (err) {
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
      .then(function () {
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

  const medico1 = {
    nombre: 'Dr. Juan Coronel',
    direccion: 'Avenida Leopoldo Carrera Calvo 493',
    correo: 'jcoronel23@yahoo.com.ec', comision: '20',
    telefono1: '2448272', telefono2: '2885685',
  }
  describe('/medico/new', function () {
    it('retorna 200 al ingresar datos correctos', function (done) {
      api.insertarMedico(
        medico1.nombre,
        medico1.direccion,
        medico1.correo, medico1.comision,
        medico1.telefono1, medico1.telefono2)
      .then(function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(200)
        done()
      }, function (err) {
        console.error('test fail ' + JSON.stringify(err))
        done(err)
      })
    })

    it('retorna 500 al ingresar medico con un nombre ya existente', function (done) {
      api.insertarMedico(
        medico1.nombre,
        'Via a Samborondon km. 7.5 Urbanizacion Tornasol mz. 5 villa 20',
        'edu_vc@outlook.com', 10,
        '2854345', '28654768')
      .then(undefined, function (err) {
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

  describe('/medico/find', function () {

    it('retorna 200 al encontrar medicos', function (done) {
      api.findMedicos('ju')
      .then(function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(200)
        const clientes = resp.body
        clientes.should.be.a('array')
        clientes.length.should.equal(1)
        done()
      }, function (err) {
        console.error('test fail ' + JSON.stringify(err))
        done(err)
      })
    })

    it('retorna 404 si no encuentra medicos', function (done) {
      api.findMedicos('xyz')
      .then(undefined, function (err) {
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
        mi_producto, "TECO",
        39.99, 49.99, true)
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
        mi_producto, "TECO",
        39.99, 49.99, true)
      .then(function () {
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

    it('puede limitar el numero de resultados con el segundo argumento', function (done) {
      api.insertarProducto('34tger5', 'TGPx20x12', "TECO", 39.99, 49.99, true)
        .then(function (){
          return api.findProductos('TG', 1)
        })
        .then(function (resp) {
          const statusCode = resp.status
          statusCode.should.equal(200)
          const productos = resp.body
          productos.should.be.a('array')
          productos.length.should.equal(1)
          return api.findProductos('TG')
        })
        .then(function (resp) {
          const statusCode = resp.status
          statusCode.should.equal(200)
          const productos = resp.body
          productos.should.be.a('array')
          productos.length.should.equal(2)
          done()
        })
        .catch(function (err) {
          console.error('test fail ' + JSON.stringify(err))
          done(err)
        })
    })
    it('retorna 404 si no encuentra productos', function (done) {
      api.findProductos('xyz')
      .then(function () {
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
    empresa: 'TecoGram S.A.',
    cliente: cliente1.ruc,
    fecha: '2016-11-26',
    autorizacion: '',
    formaPago: 'EFECTIVO',
    detallado: false,
    flete: 0,
    subtotal: 19.99,
    descuento: 0,
    iva: 12,
  }

  describe('/venta/new', function () {
    it('retorna 200 al ingresar datos correctos', function (done) {

      api.findProductos('TGO 8x50')
        .then(function (resp) {
          const products = resp.body
          const unidades = [ FacturacionModels.facturableAUnidad(
            FacturacionModels.productoAFacturable(products[0])) ]
          //knex.js no acepta keys que no corresponden a columnas de la tabla. borralas
          delete unidades[0].nombre
          delete unidades[0].codigo
          newVentaRow.unidades = unidades
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

    it('permite ingresar 2 facturas con mismo codigo pero diferente empresa', function (done) {
      const ventaRowCopy = Object.assign({}, newVentaRow)
      ventaRowCopy.empresa = 'BIOCLED'
      api.insertarVenta(ventaRowCopy)
      .then(function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(200)
        done()
      }, function (err) {
        done(err)
      })
    })

    it('retorna 400 al ingresar datos duplicados', function (done) {
      api.insertarVenta(newVentaRow)
      .then(function (resp) {
        console.error('test fail ' + JSON.stringify(resp))
        done(resp)
      }, function (err) {
        const statusCode = err.status
        err.response.text.should.equal('Ya existe una factura con ese código.')
        statusCode.should.equal(400)
        done()
      })
    })

    it('no permite borrar productos facturados', function (done) {
      api.deleteProducto(1)
      .then(done, function (err) {
        const statusCode = err.status
        statusCode.should.equal(400)
        done()
      })
    })

    it('no permite borrar clientes con facturas', function (done) {
      api.deleteCliente(cliente1.ruc)
      .then(done, function (err) {
        const statusCode = err.status
        statusCode.should.equal(400)
        done()
      })
    })

  })

  const newVentaExRow = Object.assign({}, newVentaRow)
  newVentaExRow.codigo = '0099945'
  newVentaExRow.medico = medico1.nombre
  newVentaExRow.paciente = 'Juan Pesantes'
  delete newVentaExRow.iva
  delete newVentaExRow.detallado
  delete newVentaExRow.flete
  describe('/venta_ex/new', function () {
    it('retorna 200 al ingresar datos correctos', function (done) {

      api.findProductos('TGO 8x50')
        .then(function (resp) {
          const products = resp.body
          const unidades = [ FacturacionModels.facturableAUnidad(
            FacturacionModels.productoAFacturable(products[0])) ]
          newVentaExRow.unidades = unidades
          return api.insertarVentaExamen(newVentaExRow)
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

    it('retorna 400 al ingresar datos duplicados', function (done) {
      api.insertarVentaExamen(newVentaExRow)
      .then(function (resp) {
        console.error('test fail ' + JSON.stringify(resp))
        done(resp)
      }, function (err) {
        const statusCode = err.status
        err.response.text.should.equal('Ya existe una factura con ese código.')
        statusCode.should.equal(400)
        done()
      })
    })
  })

  const formaPagoUpdated = 'TRANSFERENCIA'
  const autorizacionUpdated = "1235"
  describe('/venta/update', function () {
    it('retorna 200 al ingresar datos correctos', function (done) {
      const editedVenta = Object.assign({}, newVentaRow)
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

  const pacienteUpdated = 'Renato Gomez'
  describe('/venta_ex/update', function () {
    it('retorna 200 al ingresar datos correctos', function (done) {
      const editedVenta = Object.assign({}, newVentaExRow)
      const autorizacionUpdated = "1235"
      editedVenta.autorizacion = autorizacionUpdated
      editedVenta.paciente = pacienteUpdated
      api.updateVentaExamen(editedVenta)
        .then(function (resp) {
          const statusCode = resp.status
          statusCode.should.equal(200)
          done()
        }, function (err) {
          done(err)
        })
    })
  })

  describe('/venta/ver/:empresa/:codigo', function () {
    it('descarga el pdf de una factura existente', function(done) {
      const url = api.getFacturaURL(newVentaRow.codigo, newVentaRow.empresa)
      request.get(url)
      .end(function (err, res) {
        res.status.should.equal(200)
        res.header['content-type'].should.equal('application/pdf')
        done()
      })
    })

    it('retorna json si el header \'Accept\' es igual a \'application/json\'', function (done) {
      api.verVenta(newVentaRow.codigo, newVentaRow.empresa)
        .then(function (resp) {
          const { facturaData, facturables, cliente } = resp.body
          facturaData.codigo.should.equal(newVentaRow.codigo)
          facturaData.empresa.should.equal(newVentaRow.empresa)
          facturaData.fecha.should.equal(newVentaRow.fecha)
          facturaData.formaPago.should.equal(formaPagoUpdated)
          facturaData.detallado.should.be.false

          facturables.length.should.equal(newVentaRow.unidades.length)

          cliente.ruc.should.equal(cliente1.ruc)
          cliente.nombre.should.equal(cliente1.nombre)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it('retorna 404 si la factura solicitada no existe', function (done) {
      request.get(`localhost:8192/venta/ver/CAPCOM/000123`)
      .end(function (err, res) {
        res.status.should.equal(404)
        res.text.should.equal('factura no encontrada')
        done()
      })
    })

  })

  describe('/venta_ex/ver/:empresa/:codigo', function () {
    it('descarga el pdf de una factura existente', function(done) {
      const url = api.getFacturaExamenURL(newVentaExRow.codigo, newVentaExRow.empresa)
      request.get(url)
      .end(function (err, res) {
        res.status.should.equal(200)
        res.header['content-type'].should.equal('application/pdf')
        done()
      })
    })

    it('retorna json si el header \'Accept\' es igual a \'application/json\'', function (done) {
      api.verVentaExamen(newVentaExRow.codigo, newVentaExRow.empresa)
        .then(function (resp) {
          const { facturaData, facturables, cliente } = resp.body
          facturaData.codigo.should.equal(newVentaExRow.codigo)
          facturaData.empresa.should.equal(newVentaExRow.empresa)
          facturaData.fecha.should.equal(newVentaExRow.fecha)
          facturaData.paciente.should.equal(pacienteUpdated)
          facturaData.autorizacion.should.equal(autorizacionUpdated)

          facturables.length.should.equal(newVentaExRow.unidades.length)

          cliente.ruc.should.equal(cliente1.ruc)
          cliente.nombre.should.equal(cliente1.nombre)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it('retorna 404 si la factura solicitada no existe', function (done) {
      request.get(`localhost:8192/venta_ex/ver/CAPCOM/000123`)
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
      .then(function () {
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

  describe('/venta_ex/find', function () {
    it('retorna 200 al encontrar facturas de examenes', function (done) {
      api.findVentasExamen('ren')
      .then(function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(200)
        const ventas = resp.body
        ventas.should.be.an('array')
        ventas.length.should.equal(1)
        done()
      }, function (err) {
        console.error('test fail ' + JSON.stringify(err))
        done(err)
      })
    })

    it('retorna 404 si no encuentra facturas de examenes', function (done) {
      api.findVentasExamen('xyz')
      .then(function () {
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

  describe('/venta/findAll', function () {
    it('retorna 200 al encontrar facturas de ambos tipos', function (done) {
      api.findAllVentas('')
      .then(function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(200)
        const ventas = resp.body
        ventas.should.be.an('array')
        ventas.length.should.equal(3)
        done()
      }, function (err) {
        console.error('test fail ' + JSON.stringify(err))
        done(err)
      })
    })

    it('retorna 404 si no encuentra facturas', function (done) {
      api.findAllVentas('xyz')
      .then(function () {
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

  describe('/venta/delete', function () {
    it('retorna 200 al borrar factura exitosamente', function (done) {
      api.deleteVenta(newVentaRow.codigo, newVentaRow.empresa)
      .then(function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(200)
        return api.findVentas('')
      })
      .then(function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(200)
        resp.body.should.have.lengthOf(1)
        done()
      })
      .catch(done)
    })

    it('retorna 404 al intentar borrar una factura no encontrada', function (done) {
      api.deleteVenta('111', 'EA')
      .then(undefined, function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(404)
        done()
      })
      .catch(done)
    })
  })

  describe('/venta_ex/delete', function () {
    it('retorna 200 al borrar factura examen exitosamente', function (done) {
      api.deleteVentaExamen(newVentaExRow.codigo, newVentaExRow.empresa)
      .then(function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(200)
        return api.findVentasExamen('')
      })
      .then(undefined, function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(404)
        done()
      })
      .catch(done)
    })

    it('retorna 404 al intentar borrar una factura de examen no encontrad0', function (done) {
      api.deleteVenta('111', 'EA')
      .then(undefined, function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(404)
        done()
      })
      .catch(done)
    })
  })

  describe('/producto/update', function () {
    const updateArgs = ['trhbi3', 'prod XYZ', "BIO", 19.99, 79.99, false]
    it('retorna 200 al actualizar un producto exitosamente', function (done) {
      api.updateProducto(2, ...updateArgs)
      .then(function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(200)
        done()
      })
      .catch(done)
    })

    it('retorna 404 al tratar de actualizar un producto inexistente', function (done) {
      api.updateProducto(15, ...updateArgs)
      .then(done, function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(404)
        done()
      })
    })
  })

  describe('/producto/delete', function () {
    it('retorna 200 al borrar un producto exitosamente', function (done) {
      api.deleteProducto(2)
      .then(function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(200)
        done()
      })
      .catch(done)
    })

    it('retorna 404 al tratar de borrar un producto inexistente', function (done) {
      api.deleteProducto(15)
      .then(done, function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(404)
        done()
      })
    })
  })

  describe('/cliente/update', function () {
    const updateArgs = ['Julio Plaza', 'Ceibos Norte 123', 'you@somewhere.com',
        '555555','666666', 8]
    it('retorna 200 al actualizar un cliente exitosamente', function (done) {
      api.updateCliente(cliente1.ruc, ...updateArgs)
      .then(function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(200)
        done()
      })
      .catch(done)
    })

    it('retorna 404 al tratar de actualizar un cliente inexistente', function (done) {
      api.updateCliente('546889', ...updateArgs)
      .then(done, function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(404)
        done()
      })
    })
  })

  describe('/cliente/delete', function () {
    it('retorna 200 al borrar un cliente exitosamente', function (done) {

      api.deleteVenta(newVentaRow.codigo, 'BIOCLED') //primero borrar ventas asociadas
      .then(function () {
        return api.deleteCliente(cliente1.ruc)
      })
      .then(function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(200)
        done()
      })
      .catch(done)
    })

    it('retorna 404 al tratar de borrar un cliente inexistente', function (done) {
      api.deleteCliente('12345')
      .then(done, function (resp) {
        const statusCode = resp.status
        statusCode.should.equal(404)
        done()
      })
    })
  })
})
