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
      const res1 = await api.insertarCliente(
        '0931816898001',
        'Xavier Jaramillo',
        'Pedro Carbo y Sucre',
        'xjaramillo@gmail.com',
        '2854345',
        '28654768',
        '5'
      );
      expect(res1.status).toBe(200);

      const res2 = await api.findClientes('xa');
      expect(res2.status).toBe(200);

      const clientes = res2.body;
      expect(clientes).toHaveLength(1);
      expect(clientes[0].nombre).toEqual('Xavier Jaramillo');
    });

    it('retorna 404 si no encuentra clientes', () =>
      api.findClientes('xyz').then(
        () => Promise.reject('Expected to fail'),
        res => {
          expect(res.status).toEqual(404);
          expect(res.response.text).toEqual(expect.any(String));
        }
      ));
  });

  describe('/cliente/update', () => {
    beforeAll(async () => {
      const res = await api.insertarCliente(
        '0957126889001',
        'Dr. Julio Mendoza',
        'Avenida Juan Tanca Marengo y Gomez Gould',
        'julio_mendoza@yahoo.com.ec',
        '2645422',
        '2876357',
        '0'
      );
      expect(res.status).toBe(200);
    });

    it('retorna 200 al actualizar un cliente exitosamente', async () => {
      const res = await api.updateCliente(
        '0957126889001',
        'Dr. Julian Mendoza',
        'Avenida Juan Tanca Marengo y Gomez Gould',
        'julio_mendoza@yahoo.com.ec',
        '2645422',
        '2876357',
        '0'
      );
      expect(res.status).toBe(200);
    });

    it('retorna 404 al tratar de actualizar un producto inexistente', () =>
      api
        .updateCliente(
          '0837126889001',
          'Dr. Julian Mendoza',
          'Avenida Juan Tanca Marengo y Gomez Gould',
          'julio_mendoza@yahoo.com.ec',
          '2645422',
          '2876357',
          '0'
        )
        .then(() => Promise.reject('Expected to fail'))
        .catch(({ response: res }) => expect(res.status).toBe(404)));
  });

  describe('/cliente/delete', () => {
    beforeAll(async () => {
      const res = await api.insertarCliente(
        '0927326569001',
        'Dr. Julio Mendoza',
        'Avenida Juan Tanca Marengo y Gomez Gould',
        'julio_mendoza@yahoo.com.ec',
        '2645422',
        '2876357',
        '0'
      );
      expect(res.status).toBe(200);
    });

    it('retorna 200 al borrar un cliente exitosamente', async () => {
      const res = await api.deleteCliente('0927326569001');
      expect(res.status).toBe(200);
    });

    it('retorna 404 al borrar un cliente inexistente', () =>
      api
        .deleteCliente('0933333333001')
        .then(() => Promise.reject('Expected to fail'))
        .catch(({ response: res }) => expect(res.status).toBe(404)));
  });
});
