/* eslint-env node, mocha */
const api = require('../../src/api.js');
require('../../backend/server.js');
const fs = require('fs');
const request = require('superagent');

const chai = require('chai');
chai.should();

const setup = require('../../backend/scripts/setupDB.js');
const FacturacionModels = require('../../src/Factura/Models');
const unexpectedError = Error('Ocurrio algo inesperado');
const facturaDir = '/tmp/facturas/';

if (process.env.NODE_ENV !== 'integration') {
  //Por el amor de dios solo ejecutar esto en ambiente de prueba
  console.error(
    'QUE CHUCHA CREES QUE HACES?',
    'QUIERES BORRAR TODA LA BASE DE PRODUCCION?',
    'DEBES DE EJECUTAR ESTO CON NODE_ENV=test'
  );
  process.exit(1);
}

const cliente1 = {
  ruc: '0937816882001',
  nombre: 'Dr. Julio Mendoza',
  direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
  email: 'julio_mendoza@yahoo.com.ec',
  telefono1: '2645422',
  telefono2: '2876357',
  descDefault: '0'
};

describe('endpoints disponibles para el cliente', () => {
  const medico1 = {
    nombre: 'Dr. Juan Coronel',
    direccion: 'Avenida Leopoldo Carrera Calvo 493',
    correo: 'jcoronel23@yahoo.com.ec',
    comision: '20',
    telefono1: '2448272',
    telefono2: '2885685'
  };
  const mi_producto = 'TGO 8x50';
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
    iva: 12
  };

  const newVentaExRow = Object.assign({}, newVentaRow);
  newVentaExRow.codigo = '0099945';
  newVentaExRow.medico = medico1.nombre;
  newVentaExRow.paciente = 'Juan Pesantes';
  delete newVentaExRow.iva;
  delete newVentaExRow.detallado;
  delete newVentaExRow.flete;
  describe('/venta_ex/new', () => {
    it('retorna 200 al ingresar datos correctos', async () => {
      api
        .findProductos('TGO 8x50')
        .then(function(resp) {
          const products = resp.body;
          const unidades = [
            FacturacionModels.facturableAUnidad(
              FacturacionModels.productoAFacturable(products[0])
            )
          ];
          newVentaExRow.unidades = unidades;
          return api.insertarVentaExamen(newVentaExRow);
        })
        .then(
          function(resp) {
            const statusCode = resp.status;
            statusCode.should.equal(200);
            done();
          },
          function(err) {
            console.error('test fail ' + JSON.stringify(err));
            done(err);
          }
        );
    });

    it('retorna 400 al ingresar datos duplicados', async () => {
      api.insertarVentaExamen(newVentaExRow).then(
        function(resp) {
          console.error('test fail ' + JSON.stringify(resp));
          done(resp);
        },
        function(err) {
          const statusCode = err.status;
          err.response.text.should.equal(
            'Ya existe una factura con ese código.'
          );
          statusCode.should.equal(400);
          done();
        }
      );
    });
  });

  const formaPagoUpdated = 'TRANSFERENCIA';
  const autorizacionUpdated = '1235';

  const pacienteUpdated = 'Renato Gomez';
  describe('/venta_ex/update', () => {
    it('retorna 200 al ingresar datos correctos', async () => {
      const editedVenta = Object.assign({}, newVentaExRow);
      const autorizacionUpdated = '1235';
      editedVenta.autorizacion = autorizacionUpdated;
      editedVenta.paciente = pacienteUpdated;
      api.updateVentaExamen(editedVenta).then(
        function(resp) {
          const statusCode = resp.status;
          statusCode.should.equal(200);
          done();
        },
        function(err) {
          done(err);
        }
      );
    });
  });

  describe('/venta_ex/ver/:empresa/:codigo', () => {
    it('descarga el pdf de una factura existente', async () => {
      const url = api.getFacturaExamenURL(
        newVentaExRow.codigo,
        newVentaExRow.empresa
      );
      request.get(url).end(function(err, res) {
        res.status.should.equal(200);
        res.header['content-type'].should.equal('application/pdf');
        done();
      });
    });

    it("retorna json si el header 'Accept' es igual a 'application/json'", async () => {
      api
        .verVentaExamen(newVentaExRow.codigo, newVentaExRow.empresa)
        .then(function(resp) {
          const { facturaData, facturables, cliente } = resp.body;
          facturaData.codigo.should.equal(newVentaExRow.codigo);
          facturaData.empresa.should.equal(newVentaExRow.empresa);
          facturaData.fecha.should.equal(newVentaExRow.fecha);
          facturaData.paciente.should.equal(pacienteUpdated);
          facturaData.autorizacion.should.equal(autorizacionUpdated);

          facturables.length.should.equal(newVentaExRow.unidades.length);

          cliente.ruc.should.equal(cliente1.ruc);
          cliente.nombre.should.equal(cliente1.nombre);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('retorna 404 si la factura solicitada no existe', async () => {
      request
        .get(`localhost:8192/venta_ex/ver/CAPCOM/000123`)
        .end(function(err, res) {
          res.status.should.equal(404);
          res.text.should.equal('factura no encontrada');
          done();
        });
    });
  });

  describe('/venta_ex/find', () => {
    it('retorna 200 al encontrar facturas de examenes', async () => {
      api.findVentasExamen('ren').then(
        function(resp) {
          const statusCode = resp.status;
          statusCode.should.equal(200);
          const ventas = resp.body;
          ventas.should.be.an('array');
          ventas.length.should.equal(1);
          done();
        },
        function(err) {
          console.error('test fail ' + JSON.stringify(err));
          done(err);
        }
      );
    });

    it('retorna 404 si no encuentra facturas de examenes', async () => {
      api.findVentasExamen('xyz').then(
        () => {
          throw unexpectedError;
        },
        function(err) {
          const statusCode = err.status;
          const resp = err.response;
          statusCode.should.equal(404);
          resp.text.should.be.a('string');
          done();
        }
      );
    });
  });

  describe('/venta/findAll', () => {
    it('retorna 200 al encontrar facturas de ambos tipos', async () => {
      api.findAllVentas('').then(
        function(resp) {
          const statusCode = resp.status;
          statusCode.should.equal(200);
          const ventas = resp.body;
          ventas.should.be.an('array');
          ventas.length.should.equal(3);
          done();
        },
        function(err) {
          console.error('test fail ' + JSON.stringify(err));
          done(err);
        }
      );
    });

    it('retorna 404 si no encuentra facturas', async () => {
      api.findAllVentas('xyz').then(
        () => {
          throw unexpectedError;
        },
        function(err) {
          const statusCode = err.status;
          const resp = err.response;
          statusCode.should.equal(404);
          resp.text.should.be.a('string');
          done();
        }
      );
    });
  });

  describe('/venta_ex/delete', () => {
    it('retorna 200 al borrar factura examen exitosamente', async () => {
      api
        .deleteVentaExamen(newVentaExRow.codigo, newVentaExRow.empresa)
        .then(function(resp) {
          const statusCode = resp.status;
          statusCode.should.equal(200);
          return api.findVentasExamen('');
        })
        .then(undefined, function(resp) {
          const statusCode = resp.status;
          statusCode.should.equal(404);
          done();
        })
        .catch(done);
    });

    it('retorna 404 al intentar borrar una factura de examen no encontrad0', async () => {
      api
        .deleteVenta('111', 'EA')
        .then(undefined, function(resp) {
          const statusCode = resp.status;
          statusCode.should.equal(404);
          done();
        })
        .catch(done);
    });
  });

  describe('/producto/update', () => {
    const updateArgs = ['trhbi3', 'prod XYZ', 'BIO', 19.99, 79.99, false];
    it('retorna 200 al actualizar un producto exitosamente', async () => {
      api
        .updateProducto(2, ...updateArgs)
        .then(function(resp) {
          const statusCode = resp.status;
          statusCode.should.equal(200);
          done();
        })
        .catch(done);
    });

    it('retorna 404 al tratar de actualizar un producto inexistente', async () => {
      api.updateProducto(15, ...updateArgs).then(done, function(resp) {
        const statusCode = resp.status;
        statusCode.should.equal(404);
        done();
      });
    });
  });

  describe('/producto/delete', () => {
    it('retorna 200 al borrar un producto exitosamente', async () => {
      api
        .deleteProducto(2)
        .then(function(resp) {
          const statusCode = resp.status;
          statusCode.should.equal(200);
          done();
        })
        .catch(done);
    });

    it('retorna 404 al tratar de borrar un producto inexistente', async () => {
      api.deleteProducto(15).then(done, function(resp) {
        const statusCode = resp.status;
        statusCode.should.equal(404);
        done();
      });
    });
  });

  describe('/cliente/update', () => {
    const updateArgs = [
      'Julio Plaza',
      'Ceibos Norte 123',
      'you@somewhere.com',
      '555555',
      '666666',
      8
    ];
    it('retorna 200 al actualizar un cliente exitosamente', async () => {
      api
        .updateCliente(cliente1.ruc, ...updateArgs)
        .then(function(resp) {
          const statusCode = resp.status;
          statusCode.should.equal(200);
          return api.findClientes('Julio');
        })
        .then(function(resp) {
          const cliente = resp.body[0];
          cliente.nombre.should.equal(updateArgs[0]);
          cliente.direccion.should.equal(updateArgs[1]);
          cliente.email.should.equal(updateArgs[2]);
          cliente.telefono1.should.equal(updateArgs[3]);
          cliente.telefono2.should.equal(updateArgs[4]);
          cliente.descDefault.should.equal(updateArgs[5]);
          done();
        })
        .catch(done);
    });

    it('retorna 404 al tratar de actualizar un cliente inexistente', async () => {
      api.updateCliente('546889', ...updateArgs).then(done, function(resp) {
        const statusCode = resp.status;
        statusCode.should.equal(404);
        done();
      });
    });
  });

  describe('/cliente/delete', () => {
    it('retorna 200 al borrar un cliente exitosamente', async () => {
      api
        .deleteVenta(newVentaRow.codigo, 'BIOCLED') //primero borrar ventas asociadas
        .then(() => {
          return api.deleteCliente(cliente1.ruc);
        })
        .then(function(resp) {
          const statusCode = resp.status;
          statusCode.should.equal(200);
          done();
        })
        .catch(done);
    });

    it('retorna 404 al tratar de borrar un cliente inexistente', async () => {
      api.deleteCliente('12345').then(done, function(resp) {
        const statusCode = resp.status;
        statusCode.should.equal(404);
        done();
      });
    });
  });
});
