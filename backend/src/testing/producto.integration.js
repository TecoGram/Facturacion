const api = require('../../../frontend/src/api.js');
const server = require('../server.js');
const setup = require('../scripts/setupDB.js');

describe('/producto/ endpoints', () => {
  beforeAll(setup);
  afterAll(server.destroy);

  describe('/producto/new', () => {
    it('retorna 200 al ingresar datos correctos', async () => {
      const res = await api.insertarProducto(
        'rytertg663433g',
        'Glyco',
        'TECO',
        39.99,
        49.99,
        true
      );
      expect(res.status).toEqual(200);
      expect(res.body).toHaveLength(1);
    });

    it('retorna 422 al ingresar producto con un nombre ya existente', async () => {
      api.insertarProducto('34tger5', 'Glyco', 'TECO', 39.99, 49.99, true).then(
        () => Promise.reject(new Error('expected to fail')),
        ({ response: res }) => {
          expect(res.status).toBe(422);
          expect(res.body.code).toEqual('SQLITE_CONSTRAINT');
        }
      );
    });
  });

  describe('/producto/find', () => {
    beforeAll(async () => {
      const responses = await Promise.all([
        api.insertarProducto(
          'rytertg663433g',
          'TGO 8x50',
          'TECO',
          39.99,
          49.99,
          true
        ),
        api.insertarProducto(
          'rytertg663433g',
          'TGP 8x50',
          'TECO',
          39.99,
          49.99,
          true
        )
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

    it('retorna 404 si no encuentra productos', async () => {
      api.findProductos('xyz').then(
        () => Promise.reject('Expected to fail'),
        ({ response: res }) => {
          expect(res.status).toBe(404);
          expect(res.text).toEqual(expect.any(String));
        }
      );
    });
  });
});
