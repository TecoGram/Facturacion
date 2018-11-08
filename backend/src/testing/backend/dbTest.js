/* eslint-env node, mocha */
/* eslint-disable no-console */

if (process.env.NODE_ENV !== 'test') {
  //Por el amor de dios solo ejecutar esto en ambiente de prueba
  console.error(
    'QUE CHUCHA CREES QUE HACES?',
    'QUIERES BORRAR TODA LA BASE DE PRODUCCION?',
    'DEBES DE EJECUTAR ESTO CON NODE_ENV=test'
  );
  process.exit(1);
}

const chai = require('chai');
chai.should();

const db = require('../../backend/dbAdmin.js');
const setup = require('../../backend/scripts/setupDB.js');

describe('metodos de dbAdmin.js', function() {
  before('borrar base de datos de prueba', function(done) {
    this.timeout(5000);
    setup()
      .then(() => done(), () => done())
      .catch(err => done(err));
  });

  describe('insertarProducto', function() {
    it('persiste varios productos en la base encadenando con promise', function(done) {
      db.insertarProducto('fsers4', 'producto Á', 'TECO', 9.99, 14.99, true)
        .then(function(ids) {
          ids.should.not.be.empty;
          ids[0].should.be.a('number');
          return db.insertarProducto(
            'gfdtt',
            'producto B',
            'TECO',
            19.99,
            24.99,
            false
          );
        })
        .then(function(ids) {
          ids.should.not.be.empty;
          ids[0].should.be.a('number');
          return db.insertarProducto(
            'gfgtb4',
            'producto C',
            'TECO',
            14.99,
            18.99,
            true
          );
        })
        .then(function(ids) {
          ids.should.not.be.empty;
          ids[0].should.be.a('number');
          done();
        });
    });
  });

  const cliente1 = {
    ruc: '0954236576001',
    nombre: 'Dr. Juan Pérez',
    email: 'jperez@gmail.com',
    direccion: 'Av. Pedro Carbo y Sucre 512',
    telefono1: '2645987',
    telefono2: '2978504',
    descDefault: 0
  };

  describe('insertarCliente', function() {
    it('persiste varios clientes en la base encadenando con promise', function(done) {
      db.insertarCliente(
        cliente1.ruc,
        cliente1.nombre,
        cliente1.direccion,
        cliente1.email,
        cliente1.telefono1,
        cliente1.telefono2,
        cliente1.descDefault
      )
        .then(function(ids) {
          ids.should.not.be.empty;
          ids[0].should.be.a('number');
          return db.insertarCliente(
            '0934233576001',
            'Carlos Sánchez',
            'Av. Brasil y la del ejercito',
            'carlos-sanchez84@live.com',
            '2353477',
            '2375980',
            5
          );
        })
        .then(function(ids) {
          ids.should.not.be.empty;
          ids[0].should.be.a('number');
          done();
        });
    });
  });

  describe('findClientes', function() {
    it('retorna un array con todos los clientes existentes si se le pasa un string vacio', function(done) {
      db.findClientes('').then(function(clientes) {
        clientes.should.be.an('array');
        clientes.should.not.be.empty;
        done();
      });
    });

    it('puede buscar clientes por nombre, si se le pasa un string no vacio como argumento', function(done) {
      db.findClientes('Juan').then(function(clientes) {
        clientes.should.be.an('array');
        clientes.length.should.be.equal(1);
        clientes[0].nombre.should.be.equal('Dr. Juan Pérez');
        done();
      });
    });

    it('puede buscar clientes por nombre, sin tener que escribir las tildes', function(done) {
      db.findClientes('sanchez').then(function(clientes) {
        clientes.should.be.an('array');
        clientes.length.should.be.equal(1);
        clientes[0].nombre.should.be.equal('Carlos Sánchez');
        done();
      });
    });
  });

  const medico1 = {
    nombre: 'Dr. William Hurtado',
    email: 'whurtado@gmail.com',
    direccion: 'Av. Boyaca y 10 de Agosto 332',
    comision: 10,
    telefono1: '2434566',
    telefono2: '2885855'
  };

  describe('insertarMedico', function() {
    it('inserta una nueva fila a la tabla medicos', function(done) {
      db.insertarMedico(
        medico1.nombre,
        medico1.direccion,
        medico1.email,
        medico1.comision,
        medico1.telefono1,
        medico1.telefono2
      )
        .then(function(ids) {
          ids.should.not.be.empty;
          ids[0].should.be.a('number');
          return db.insertarMedico(
            'Verónica Jaramillo',
            'Av. Brasil 546',
            'carlos-jm@live.com',
            5,
            '2353477',
            '2375980'
          );
        })
        .then(function(ids) {
          ids.should.not.be.empty;
          ids[0].should.be.a('number');
          done();
        });
    });
  });

  describe('findMedicos', function() {
    it('retorna un array con todos los medicos existentes si se le pasa un string vacio', function(done) {
      db.findMedicos('').then(function(medicos) {
        medicos.should.be.an('array');
        medicos.should.have.lengthOf(2);
        done();
      });
    });

    it('puede buscar clientes por nombre, si se le pasa un string no vacio como argumento', function(done) {
      db.findMedicos('William Hu').then(function(medicos) {
        medicos.should.be.an('array');
        medicos.should.have.lengthOf(1);
        medicos[0].nombre.should.be.equal('Dr. William Hurtado');
        done();
      });
    });

    it('puede buscar clientes por nombre, sin tener que escribir tildes', function(done) {
      db.findMedicos('vero').then(function(medicos) {
        medicos.should.be.an('array');
        medicos.should.have.lengthOf(1);
        medicos[0].nombre.should.be.equal('Verónica Jaramillo');
        done();
      });
    });
  });

  const ventaExInsertada = {
    codigo: '0009991',
    empresa: 'TecoGram S.A.',
    ruc: cliente1.ruc,
    medico: medico1.nombre,
    paciente: 'Fabricio Encarnación',
    fecha: '2017-01-01',
    autorizacion: 'fse4',
    formaPago: 'VISA',
    subtotal: 21.0,
    descuento: 3,
    unidades: [
      {
        producto: 1,
        fechaExp: '2016-11-26',
        lote: '545f2',
        count: 1,
        precioVenta: 10
      }
    ]
  };

  describe('insertarVentaExamen', function() {
    const {
      codigo,
      empresa,
      ruc,
      fecha,
      autorizacion,
      formaPago,
      subtotal,
      descuento,
      unidades,
      medico,
      paciente
    } = ventaExInsertada;

    it('persiste una nueva venta en la base y agrega las unidades vendidas a la base', function(done) {
      db.insertarVentaExamen(
        codigo,
        empresa,
        ruc,
        fecha,
        autorizacion,
        formaPago,
        descuento,
        subtotal,
        unidades,
        medico,
        paciente
      )
        .then(function(res) {
          const lasInsertedId = res[0];
          lasInsertedId.should.be.a('number');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });
  });

  const ventaInsertada = {
    codigo: '0009993',
    empresa: 'TECOGRAM',
    ruc: cliente1.ruc,
    fecha: '2017-01-01',
    autorizacion: 'fse4',
    formaPago: 'VISA',
    detallado: false,
    subtotal: 21.0,
    flete: 0,
    descuento: 3,
    iva: 12,
    unidades: [
      {
        producto: 1,
        fechaExp: '2016-11-26',
        lote: '545f2',
        count: 1,
        precioVenta: 10
      },
      {
        producto: 2,
        fechaExp: '2016-11-26',
        lote: '5453s',
        count: 2,
        precioVenta: 7
      }
    ]
  };

  describe('insertarVenta', function() {
    const {
      codigo,
      empresa,
      ruc,
      fecha,
      autorizacion,
      formaPago,
      detallado,
      flete,
      subtotal,
      descuento,
      iva,
      unidades
    } = ventaInsertada;

    it('persiste una nueva venta en la base y agrega las unidades vendidas a la base', function(done) {
      db.insertarVenta(
        codigo,
        empresa,
        ruc,
        fecha,
        autorizacion,
        formaPago,
        detallado,
        descuento,
        iva,
        flete,
        subtotal,
        unidades
      )
        .then(function(res) {
          const lasInsertedId = res[0];
          lasInsertedId.should.be.a('number');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('No se permite borrar productos despues de facturarlos', function(done) {
      db.deleteProducto(unidades[0].producto).then(
        function(res) {
          done(res);
        },
        function(err) {
          err.code.should.equal('SQLITE_CONSTRAINT');
          done();
        }
      );
    });

    it('No se permite borrar un cliente que tenga una factura asociada', function(done) {
      db.deleteProducto(ventaInsertada.ruc).then(
        function(res) {
          done(res);
        },
        function(err) {
          err.code.should.equal('SQLITE_CONSTRAINT');
          done();
        }
      );
    });
  });

  describe('findVentas', function() {
    it('devuelve las ultimas ventas si se le pasa un string vacio', function(done) {
      db.findVentas('', 0)
        .then(function(results) {
          results.length.should.be.equal(1);

          const ultimaVenta = results[0];
          ultimaVenta.codigo.should.be.equal(ventaInsertada.codigo);
          ultimaVenta.empresa.should.be.equal(ventaInsertada.empresa);
          ultimaVenta.subtotal.should.be.equal(ventaInsertada.subtotal);
          ultimaVenta.fecha.should.be.equal(ventaInsertada.fecha);
          ultimaVenta.ruc.should.be.equal(cliente1.ruc);
          ultimaVenta.nombre.should.be.equal(cliente1.nombre);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('devuelve las ultimas ventas cuyo nombre de cliente coincide con el string pasado como argumento', function(done) {
      db.findVentas('Juan P', 0)
        .then(function(results) {
          results.length.should.be.equal(1);

          const ultimaVenta = results[0];
          ultimaVenta.codigo.should.be.equal(ventaInsertada.codigo);
          ultimaVenta.empresa.should.be.equal(ventaInsertada.empresa);
          ultimaVenta.subtotal.should.be.equal(ventaInsertada.subtotal);
          ultimaVenta.fecha.should.be.equal(ventaInsertada.fecha);
          ultimaVenta.ruc.should.be.equal(cliente1.ruc);
          ultimaVenta.nombre.should.be.equal(cliente1.nombre);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });
    it('encuentra ventas por cliente sin tener que escribir tildes', function(done) {
      db.findVentas('perez', 0)
        .then(function(results) {
          results.length.should.be.equal(1);

          const ultimaVenta = results[0];
          ultimaVenta.nombre.should.be.equal(cliente1.nombre);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });
    it('devuelve array vacio si no encuentra ventas con ese cliente', function(done) {
      db.findVentas('xxyz', 0).then(function(results) {
        results.length.should.be.equal(0);
        done();
      });
    });
  });

  describe('findVentasExamen', function() {
    it('devuelve las ultimas ventas de examen si se le pasa un string vacio', function(done) {
      db.findVentas('', 1)
        .then(function(results) {
          results.length.should.be.equal(1);

          const ultimaVentaEx = results[0];
          ultimaVentaEx.codigo.should.be.equal(ventaExInsertada.codigo);
          ultimaVentaEx.subtotal.should.be.equal(ventaExInsertada.subtotal);
          ultimaVentaEx.fecha.should.be.equal(ventaExInsertada.fecha);
          ultimaVentaEx.paciente.should.be.equal(ventaExInsertada.paciente);
          ultimaVentaEx.ruc.should.be.equal(cliente1.ruc);
          ultimaVentaEx.nombre.should.be.equal(cliente1.nombre);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('devuelve las ultimas ventas examen cuyo nombre de cliente coincide con el string pasado como argumento', function(done) {
      db.findVentas('Juan P', 1)
        .then(function(results) {
          results.length.should.be.equal(1);

          const ultimaVentaEx = results[0];
          ultimaVentaEx.codigo.should.be.equal(ventaExInsertada.codigo);
          ultimaVentaEx.subtotal.should.be.equal(ventaExInsertada.subtotal);
          ultimaVentaEx.fecha.should.be.equal(ventaExInsertada.fecha);
          ultimaVentaEx.paciente.should.be.equal(ventaExInsertada.paciente);
          ultimaVentaEx.ruc.should.be.equal(cliente1.ruc);
          ultimaVentaEx.nombre.should.be.equal(cliente1.nombre);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('encuentra ventas por cliente sin tener que escribir tildes', function(done) {
      db.findVentas('perez', 1)
        .then(function(results) {
          results.length.should.be.equal(1);

          const ultimaVentaEx = results[0];
          ultimaVentaEx.nombre.should.be.equal(cliente1.nombre);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });
    it('devuelve las ultimas ventas examen cuyo nombre de paciente coincide con el string pasado como argumento', function(done) {
      db.findVentas('Fabri', 1)
        .then(function(results) {
          results.length.should.be.equal(1);

          const ultimaVentaEx = results[0];
          ultimaVentaEx.codigo.should.be.equal(ventaExInsertada.codigo);
          ultimaVentaEx.subtotal.should.be.equal(ventaExInsertada.subtotal);
          ultimaVentaEx.fecha.should.be.equal(ventaExInsertada.fecha);
          ultimaVentaEx.paciente.should.be.equal(ventaExInsertada.paciente);
          ultimaVentaEx.ruc.should.be.equal(cliente1.ruc);
          ultimaVentaEx.nombre.should.be.equal(cliente1.nombre);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });
    it('encuentra ventas por paciente sin tener que escribir tildes', function(done) {
      db.findVentas('encarnacion', 1)
        .then(function(results) {
          results.length.should.be.equal(1);

          const ultimaVentaEx = results[0];
          ultimaVentaEx.paciente.should.be.equal(ventaExInsertada.paciente);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });
    it('devuelve array vacio si no encuentra ventas examen con ese paciente', function(done) {
      db.findVentas('xxyz', 1).then(function(results) {
        results.length.should.be.equal(0);
        done();
      });
    });
  });

  describe('findAllVentas', function() {
    it('obtiene ventas de ambos tipos', function() {
      db.findAllVentas('').then(function(rows) {
        rows.length.should.equal(2);
      });
    });
    it('obtiene ventas de ambos tipos, sin tener que escribir tildes', function() {
      db.findAllVentas('perez').then(function(rows) {
        rows.length.should.equal(2);
      });
    });
  });

  describe('getFacturaData', function() {
    it('busca en la base de datos la fila de la venta, y los productos vendidos', function(done) {
      const { codigo, empresa, ruc, subtotal } = ventaInsertada;

      db.getFacturaData(codigo, empresa, 0) //datos del test anterior 'insertarVenta'
        .then(function(resp) {
          const { ventaRow, cliente } = resp;

          ventaRow.formaPago.should.equal('VISA');
          ventaRow.cliente.should.equal(ruc);
          ventaRow.subtotal.should.equal(subtotal);
          ventaRow.facturables.length.should.equal(2);

          cliente.nombre.should.equal(cliente1.nombre);
          cliente.direccion.should.equal(cliente1.direccion);
          cliente.telefono1.should.equal(cliente1.telefono1);

          const unidad1 = ventaRow.facturables[0];
          const unidad2 = ventaRow.facturables[1];

          unidad1.precioVenta.should.equal(10);
          unidad1.producto.should.equal(1);
          unidad1.count.should.equal(1);
          unidad1.fechaExp.should.equal('2016-11-26');
          unidad2.precioVenta.should.equal(7);
          unidad2.producto.should.equal(2);
          unidad2.count.should.equal(2);
          unidad2.fechaExp.should.equal('2016-11-26');
          done();
        })
        .catch(done);
    });

    it('busca en la base de datos la fila de la venta examen, y los productos vendidos', function(done) {
      const { codigo, empresa, subtotal } = ventaExInsertada;

      db.getFacturaData(codigo, empresa, 1) //datos del test anterior 'insertarVentaExamen'
        .then(function(resp) {
          const { ventaRow, cliente, medico } = resp;

          ventaRow.subtotal.should.equal(subtotal);
          ventaRow.facturables.length.should.equal(1);

          cliente.nombre.should.equal(cliente1.nombre);
          medico.nombre.should.equal(medico1.nombre);
          medico.nombreAscii.should.equal('dr. william hurtado');

          done();
        })
        .catch(done);
    });

    it('rechaza la promesa si no encuentra la factura', function(done) {
      db.getFacturaData('2016-11-03', 'VER', 0) //inexistente
        .then(undefined, function(error) {
          error.errorCode.should.equal(404);
          error.text.should.equal('factura no encontrada');
          done();
        });
    });
  });

  describe('updateVenta', function() {
    const {
      codigo,
      empresa,
      ruc,
      fecha,
      subtotal,
      detallado,
      flete,
      descuento,
      iva,
      unidades
    } = ventaInsertada;

    const formaPagoUpdated = 'CHEQUE';
    const autorizacionUpdated = 'qwe4';
    const detalladoUpdated = true;
    const fleteUpdated = 6.99;

    it('actualiza una venta y las unidades vendidas en la base', function(done) {
      db.updateVenta(
        codigo,
        empresa,
        ruc,
        fecha,
        autorizacionUpdated,
        formaPagoUpdated,
        detalladoUpdated,
        descuento,
        iva,
        fleteUpdated,
        subtotal,
        unidades
      )
        .then(function(res) {
          const lasInsertedId = res[0];
          //test api ya inserto 2 unidades, mas estas 2, la nueva debe de ser 4
          lasInsertedId.should.be.a('number');
          return db.getFacturaData(codigo, empresa, 0);
        })
        .then(function(resp) {
          const { ventaRow } = resp;
          ventaRow.formaPago.should.be.equal(formaPagoUpdated);
          ventaRow.autorizacion.should.be.equal(autorizacionUpdated);
          ventaRow.flete.should.be.equal(fleteUpdated);
          ventaRow.detallado.should.be.equal(1);
          ventaRow.facturables.length.should.be.equal(2);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('Permite modificar la lista de productos vendidos', function(done) {
      const unidadesUpdated = [
        {
          producto: 1,
          fechaExp: '2016-11-26',
          lote: '545f2',
          count: 1,
          precioVenta: 10
        }
      ];
      db.updateVenta(
        codigo,
        empresa,
        ruc,
        fecha,
        autorizacionUpdated,
        formaPagoUpdated,
        detallado,
        descuento,
        iva,
        flete,
        subtotal,
        unidadesUpdated
      )
        .then(function(res) {
          const lasInsertedId = res[0];
          lasInsertedId.should.be.a('number');
          return db.getFacturaData(codigo, empresa, 0);
        })
        .then(function(resp) {
          const { ventaRow } = resp;
          ventaRow.formaPago.should.be.equal(formaPagoUpdated);
          ventaRow.autorizacion.should.be.equal(autorizacionUpdated);
          ventaRow.facturables.length.should.be.equal(1);

          done();
        })
        .catch(done);
    });
  });

  describe('updateVentaExamen', function() {
    const {
      codigo,
      empresa,
      ruc,
      fecha,
      autorizacion,
      subtotal,
      descuento,
      medico,
      unidades
    } = ventaExInsertada;

    const formaPagoUpdated = 'EXPRESS';
    const pacienteUpdated = 'Julio Fuentes';
    const subtotalUpdated = 26.44;

    it('actualiza una venta y las unidades vendidas en la base', function(done) {
      db.updateVentaExamen(
        codigo,
        empresa,
        ruc,
        fecha,
        autorizacion,
        formaPagoUpdated,
        descuento,
        subtotalUpdated,
        unidades,
        medico,
        pacienteUpdated
      )
        .then(function(res) {
          const lasInsertedId = res[0];
          lasInsertedId.should.be.a('number');
          return db.getFacturaData(codigo, empresa, 1);
        })
        .then(function(resp) {
          const { ventaRow } = resp;
          ventaRow.formaPago.should.be.equal(formaPagoUpdated);
          ventaRow.subtotal.should.be.equal(subtotalUpdated);
          ventaRow.facturables.length.should.be.equal(1);
          return db.findVentas(pacienteUpdated, 1);
        })
        .then(function(resp) {
          resp.should.be.an('array');
          resp.length.should.be.equal(1);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('Permite modificar la lista de productos vendidos', function(done) {
      const unidadesUpdated = [
        {
          producto: 1,
          fechaExp: '2016-11-26',
          lote: '545f2',
          count: 1,
          precioVenta: 10
        },
        {
          producto: 2,
          fechaExp: '2016-11-26',
          lote: '545f2',
          count: 1,
          precioVenta: 20
        }
      ];
      db.updateVentaExamen(
        codigo,
        empresa,
        ruc,
        fecha,
        autorizacion,
        formaPagoUpdated,
        descuento,
        subtotal,
        unidadesUpdated,
        medico,
        pacienteUpdated
      )
        .then(function(res) {
          const lasInsertedId = res[0];
          lasInsertedId.should.be.a('number');
          return db.getFacturaData(codigo, empresa, 1);
        })
        .then(function(resp) {
          const { ventaRow } = resp;
          ventaRow.formaPago.should.be.equal(formaPagoUpdated);
          ventaRow.facturables.length.should.be.equal(2);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });
  });

  describe('deleteVenta', function() {
    it('borra una venta de la db y todas las unidades asociadas', function(done) {
      db.getFacturablesVenta(ventaInsertada.codigo, ventaInsertada.empresa)
        .then(function(rows) {
          rows.should.have.lengthOf(1);
          return db.deleteVenta(
            ventaInsertada.codigo,
            ventaInsertada.empresa,
            0
          );
        })
        .then(function() {
          return db.getFacturaData(
            ventaInsertada.codigo,
            ventaInsertada.empresa,
            0
          );
        })
        .then(undefined, function(err) {
          err.errorCode.should.be.equal(404);
          return db.getFacturablesVenta(
            ventaInsertada.codigo,
            ventaInsertada.empresa
          );
        })
        .then(function(rows) {
          rows.should.be.empty;
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });
    it('borra una venta examen de la db y todas las unidades asociadas', function(done) {
      const { codigo, empresa } = ventaExInsertada;
      db.getFacturablesVenta(codigo, empresa)
        .then(function(rows) {
          rows.should.have.lengthOf(2);
          return db.deleteVenta(codigo, empresa, 1);
        })
        .then(function() {
          return db.getFacturaData(codigo, empresa, 1);
        })
        .then(undefined, function(err) {
          err.errorCode.should.be.equal(404);
          return db.getFacturablesVenta(codigo, empresa);
        })
        .then(function(rows) {
          rows.should.be.empty;
          return db.getExamenInfo(codigo, empresa);
        })
        .then(function(rows) {
          rows.should.be.empty;
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });
  });

  describe('updateCliente', function() {
    const updateArgs = [
      cliente1.ruc,
      'Alvar Ortiz',
      'Samborondon 123',
      'me@url.com',
      '2345678',
      '2987765',
      3
    ];
    it('actualiza un cliente en la base de datos', function(done) {
      db.updateCliente(...updateArgs).then(function(ids) {
        ids.should.equal(1);
        done();
      });
    });
    it('retorna 0 en el callback si no encuentra un cliente a actualizar', function(done) {
      const wrongArgs = [...updateArgs];
      wrongArgs[0] = '999333';
      db.updateCliente(...wrongArgs).then(function(ids) {
        ids.should.equal(0);
        done();
      });
    });
  });

  describe('deleteCliente', function() {
    it('elimina un cliente de la base de datos, si no tiene facturas', function(done) {
      const clienteABorrar = ventaInsertada.ruc;
      db.deleteCliente(clienteABorrar).then(function(id) {
        id.should.equal(1);
        done();
      });
    });
    it('retorna 0 en el callback si no encuentra un cliente a borrar', function(done) {
      const clienteABorrar = '12345';
      db.deleteProducto(clienteABorrar).then(function(id) {
        id.should.equal(0);
        done();
      });
    });
  });
});
