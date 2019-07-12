jest.mock('../../../datil.config.js', () => require('./utils.js').datilConfig);
jest.mock(
  '../../../system.config.js',
  () => require('./utils.js').systemConfig
);

const api = require('facturacion_common/src/api.js');

const server = require('../server.js');
const setup = require('../scripts/setupDB.js');

describe('/producto/ endpoints', () => {
  beforeAll(setup);
  afterAll(server.destroy);

  describe('/producto/new', () => {
    it('retorna 200 al ingresar datos correctos', async () => {
      const res = await api.insertarProducto({
        codigo: 'rytertg663433g',
        nombre: 'Glyco',
        precioDist: 399900,
        precioVenta: 499900,
        pagaIva: true
      });
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(1);
    });

    it('retorna 422 al ingresar producto con un nombre ya existente', () =>
      api
        .insertarProducto({
          codigo: 'rytertg663433g',
          nombre: 'Glyco',
          precioDist: 399900,
          precioVenta: 499900,
          pagaIva: true
        })
        .then(
          () => Promise.reject(new Error('expected to fail')),
          ({ response: res }) => {
            expect(res.status).toBe(422);
            expect(res.body.code).toEqual('SQLITE_CONSTRAINT');
          }
        ));
  });

  describe('/producto/find', () => {
    beforeAll(async () => {
      const responses = await Promise.all([
        api.insertarProducto({
          codigo: 'rytertg663433g',
          nombre: 'TGO 8x50',
          marca: 'TECO',
          precioDist: 399900,
          precioVenta: 499900,
          pagaIva: true
        }),
        api.insertarProducto({
          codigo: 'rytertg663433g',
          nombre: 'TGP 8x50',
          marca: 'TECO',
          precioDist: 399900,
          precioVenta: 499900,
          pagaIva: true
        })
      ]);

      responses.forEach(res => expect(res.status).toBe(200));
    });

    it('retorna 200 al encontrar productos', async () => {
      const res = await api.findProductos('TG');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it('puede limitar el numero de resultados con el segundo argumento', async () => {
      const res = await api.findProductos('TG', 1);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('retorna 404 si no encuentra productos', () =>
      api.findProductos('xyz').then(
        () => Promise.reject('Expected to fail'),
        ({ response: res }) => {
          expect(res.status).toBe(404);
          expect(res.text).toEqual(expect.any(String));
        }
      ));
  });

  describe('/producto/update', () => {
    let productoId;
    beforeAll(async () => {
      const res = await api.insertarProducto({
        codigo: 'ryt126s4',
        nombre: 'HCG',
        marca: 'TECO',
        precioDist: 399900,
        precioVenta: 499900,
        pagaIva: true
      });
      expect(res.status).toBe(200);
      productoId = res.body[0];
    });

    it('retorna 200 al actualizar un producto exitosamente', async () => {
      const res = await api.updateProducto({
        rowid: productoId,
        codigo: 'ryt126s4',
        nombre: 'HCG',
        marca: 'TECO',
        precioDist: 399900,
        precioVenta: 599900,
        pagaIva: true
      });
      expect(res.status).toBe(200);
    });

    it('retorna 404 al tratar de actualizar un producto inexistente', () =>
      api
        .updateProducto({
          rowid: 889,
          codigo: 'ryt126s4',
          nombre: 'HCG',
          marca: 'TECO',
          precioDist: 399900,
          precioVenta: 599900,
          pagaIva: true
        })
        .then(() => Promise.reject('Expected to fail'))
        .catch(({ response: res }) => expect(res.status).toBe(404)));
  });

  describe('/producto/delete', () => {
    let productoId;
    beforeAll(async () => {
      const res = await api.insertarProducto({
        codigo: 'ryt126s4',
        nombre: 'HCG Tirilla',
        marca: 'TECO',
        precioDist: 399900,
        precioVenta: 499900,
        pagaIva: true
      });
      expect(res.status).toBe(200);
      productoId = res.body[0];
    });

    it('retorna 200 al borrar un producto exitosamente', async () => {
      const res = await api.deleteProducto(productoId);
      expect(res.status).toBe(200);
    });

    it('retorna 404 al borrar un producto inexistente', () =>
      api
        .deleteProducto(productoId)
        .then(() => Promise.reject('Expected to fail'))
        .catch(({ response: res }) => expect(res.status).toBe(404)));
  });
});
