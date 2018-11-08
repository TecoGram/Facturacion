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
const { clearTestDB } = require('../dbTestUtils.js');
const { borrarTablaProductos } = require('../../backend/dbTables.js');

const insertarProductoConNombre = nombre => {
  return db.insertarProducto('fsers4', nombre, 'TECO', 9.99, 14.99, true);
};

const borrarProductos = done => {
  borrarTablaProductos().then(done);
};

describe('CRUD Productos dbAdmin.js', function() {
  before('borrar base de datos de prueba', clearTestDB);

  describe('insertarProducto', function() {
    before('vaciar tabla productos', borrarProductos);

    it('Retorna un promise cuyo resultado es un array de ids insertados', function() {
      insertarProductoConNombre('producto Á').then(function(ids) {
        ids.should.not.be.empty;
        ids[0].should.be.a('number');
      });
    });
  });

  describe('findProductos', function() {
    before('insertar productos a buscar', function(done) {
      borrarTablaProductos()
        .then(function() {
          return insertarProductoConNombre('producto Á');
        })
        .then(function() {
          return insertarProductoConNombre('producto B');
        })
        .then(function() {
          return insertarProductoConNombre('producto X');
        })
        .then(function() {
          done();
        });
    });

    it('retorna un array con todos los productos si el input es string vacio', function(done) {
      db.findProductos('').then(function(productos) {
        productos.should.be.an('array');
        productos.length.should.equal(3);
        done();
      });
    });

    it('retorna un array con los productos cuyo nombre contenga el input string', function(done) {
      db.findProductos('X').then(function(productos) {
        productos.should.be.an('array');
        productos.length.should.be.equal(1);
        productos[0].nombre.should.be.equal('producto X');
        done();
      });
    });

    it('puede buscar prodctos por nombre, sin tener que escribir las tildes ni mayusculas', function(done) {
      db.findProductos('producto a').then(function(productos) {
        productos.should.be.an('array');
        productos.length.should.be.equal(1);
        productos[0].nombre.should.be.equal('producto Á');
        done();
      });
    });

    it('permite controlar el limite con el segundo argumento', function(done) {
      db.findProductos('', 2).then(function(productos) {
        productos.should.be.an('array');
        productos.length.should.be.equal(2);
        done();
      });
    });
  });

  describe('updateProducto', function() {
    before('insertar producto a editar', function(done) {
      borrarTablaProductos()
        .then(function() {
          return db.insertarProducto(
            'ftv4',
            'item A',
            'TECO',
            4.99,
            12.99,
            true
          );
        })
        .then(function() {
          done();
        });
    });

    it('puede modificar cualquier campo de Producto', function(done) {
      db.updateProducto(1, 'xxx', 'item B', 'NIPRO', 1.99, 3.99, false)
        .then(ids => {
          ids.should.equal(1);
          return db.findProductos('');
        })
        .then(function(productos) {
          productos.should.be.an('array');
          productos.length.should.be.equal(1);
          const modificado = productos[0];
          modificado.should.eql({
            rowid: 1,
            codigo: 'xxx',
            nombreAscii: 'item b',
            nombre: 'item B',
            marca: 'NIPRO',
            precioDist: 1.99,
            precioVenta: 3.99,
            pagaIva: 0
          });
          done();
        });
    });
  });

  describe('deleteProducto', function() {
    before('insertar productos a buscar', function(done) {
      borrarTablaProductos()
        .then(function() {
          return insertarProductoConNombre('producto Á');
        })
        .then(function() {
          done();
        });
    });

    it('elimina un producto de la base de datos, si no ha sido facturado', function(done) {
      db.deleteProducto(1)
        .then(function(id) {
          id.should.equal(1);
          return db.findProductos('');
        })
        .then(function(productos) {
          productos.should.be.empty;
          done();
        });
    });
  });
});
