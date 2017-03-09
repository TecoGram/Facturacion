/* eslint-env node, mocha */

const chai = require('chai')
  , expect = chai.expect

chai.use(require('chai-string'));

const Validacion = require('../../src/Validacion.js')

describe('Validacion', function () {

  describe('validarCliente', function () {
    it('retorna unicamente "inputs" si el cliente es correcto', function () {
      const cliente = {
        ruc: "0954678865001",
        nombre: "Gustavo Quinteros",
        telefono1: "566543",
        direccion: "calle 34",
      }

      const { errors, inputs } = Validacion.validarCliente(cliente)

      expect(errors).to.be.null
      inputs.ruc.should.be.a('string')
      inputs.nombre.should.be.a('string')
      inputs.telefono1.should.be.a('string')
      inputs.telefono2.should.be.a('string')
      inputs.direccion.should.be.a('string')
      inputs.email.should.be.a('string')
      inputs.descDefault.should.be.a('string')
    })
  })

  describe('validarMedico', function () {
    it('retorna unicamente "inputs" si el medico es correcto', function () {
      const cliente = {
        nombre: "Gustavo Quinteros",
        telefono1: "566543",
        direccion: "calle 34",
        comision: "10",
      }

      const { errors, inputs } = Validacion.validarMedico(cliente)

      expect(errors).to.be.null
      inputs.nombre.should.be.a('string')
      inputs.telefono1.should.be.a('string')
      inputs.telefono2.should.be.a('string')
      inputs.direccion.should.be.a('string')
      inputs.email.should.be.a('string')
      inputs.comision.should.be.a('string')
    })
  })

  describe('validarProducto', function () {
    it('retorna unicamente "inputs" si el producto es correcto', function () {
      const producto = {
        nombre: "Producto A",
        codigo: "AD-434",
        precioVenta: "12.99",
        precioFab: "5.99",
        pagaIva: true,
      }

      const { errors, inputs } = Validacion.validarProducto(producto)

      expect(errors).to.be.null
      inputs.nombre.should.be.a('string')
      inputs.codigo.should.be.a('string')
      inputs.precioVenta.should.be.a('string')
      inputs.precioFab.should.be.a('string')
      inputs.pagaIva.should.be.a('boolean')
    })
  })
})
