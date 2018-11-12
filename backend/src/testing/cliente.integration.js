const api = require('../../../frontend/src/api.js');
const server = require('../server.js');
const setup = require('../scripts/setupDB.js');

describe('/cliente/ endpoints', () => {
  beforeAll(setup);
  afterAll(server.destroy);

  describe('/cliente/new', () => {
    it('retorna 200 al ingresar datos correctos', async () => {
      const resp = await api.insertarCliente(
        '0937816882001',
        'Dr. Julio Mendoza',
        'Avenida Juan Tanca Marengo y Gomez Gould',
        'julio_mendoza@yahoo.com.ec',
        '2645422',
        '2876357',
        '0'
      );
      expect(resp.status).toBe(200);
    });

    it('retorna 422 al ingresar cliente con un ruc ya existente', () => {
      const ruc = '0937826892001';
      return api
        .insertarCliente(
          ruc,
          'Eduardo Villacreses',
          'Via a Samborondon km. 7.5 Urbanizacion Tornasol mz. 5 villa 20',
          'edu_vc@outlook.com',
          '2854345',
          '28654768',
          '5'
        )
        .then(res => {
          expect(res.status).toBe(200);
          return api.insertarCliente(
            ruc,
            'Eduardo Villacreses',
            'Via a Samborondon km. 7.5 Urbanizacion Tornasol mz. 5 villa 20',
            'edu_vc@outlook.com',
            '2854345',
            '28654768',
            '5'
          );
        })
        .then(() => Promise.reject(new Error('Expected to fail')))
        .catch(err => {
          const statusCode = err.status;
          expect(statusCode).toBe(422);

          const resp = err.response;
          const db_error = JSON.parse(resp.text);
          expect(db_error.code).toEqual('SQLITE_CONSTRAINT');
        });
    });
  });

  describe('/cliente/find', () => {
    it('retorna 200 al encontrar clientes', async () => {
      return api
        .insertarCliente(
          '0931816898001',
          'Xavier Jaramillo',
          'Pedro Carbo y Sucre',
          'xjaramillo@gmail.com',
          '2854345',
          '28654768',
          '5'
        )
        .then(res => {
          expect(res.status).toBe(200);
          return api.findClientes('xa');
        })
        .then(res => {
          expect(res.status).toBe(200);

          const clientes = res.body;
          expect(clientes).toHaveLength(1);
          expect(clientes[0].nombre).toEqual('Xavier Jaramillo');
        });
    });

    it('retorna 404 si no encuentra clientes', () =>
      api.findClientes('xyz').then(
        () => {
          throw unexpectedError;
        },
        res => {
          expect(res.status).toEqual(404);
          expect(res.response.text).toEqual(expect.any(String));
        }
      ));
  });
});
