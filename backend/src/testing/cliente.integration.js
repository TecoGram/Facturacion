const api = require('../../../frontend/src/api.js');
const server = require('../server.js');
const setup = require('../scripts/setupDB.js');

describe('/cliente/ endpoints', () => {
  beforeAll(setup);
  afterAll(server.destroy);

  describe('/cliente/new', () => {
    it('retorna 200 al ingresar datos correctos', async () => {
      const resp = await api.insertarCliente({
        ruc: '0937816882001',
        nombre: 'Dr. Julio Mendoza',
        direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
        email: 'julio_mendoza@yahoo.com.ec',
        telefono1: '2645422',
        telefono2: '2876357',
        descDefault: '0',
        tipo: 1
      });
      expect(resp.status).toBe(200);
    });

    it('retorna 422 al ingresar cliente con un ruc ya existente', () => {
      const cliente = {
        ruc: '0914816792001',
        nombre: 'Eduardo Villacreses',
        direccion:
          'Via a Samborondon km. 7.5 Urbanizacion Tornasol mz. 5 villa 20',
        email: 'edu_vc@outlook.com',
        telefono1: '2854345',
        telefono2: '28654768',
        descDefault: '5',
        tipo: 1
      };
      return api
        .insertarCliente(cliente)
        .then(res => {
          expect(res.status).toBe(200);
          return api.insertarCliente(cliente);
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
      const res1 = await api.insertarCliente({
        ruc: '0931816898001',
        nombre: 'Xavier Jaramillo',
        direccion: 'Pedro Carbo y Sucre',
        email: 'xjaramillo@gmail.com',
        telefono1: '2854345',
        telefono2: '28654768',
        descDefault: '5',
        tipo: 1
      });
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
    let rowid;
    beforeAll(async () => {
      const res = await api.insertarCliente({
        ruc: '0957126889001',
        nombre: 'Dr. Julio Mendoza',
        direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
        email: 'julio_mendoza@yahoo.com.ec',
        telefono1: '2645422',
        telefono2: '2876357',
        descDefault: '0',
        tipo: 1
      });
      expect(res.status).toBe(200);
      rowid = res.body.rowid;
    });

    it('retorna 200 al actualizar un cliente exitosamente', async () => {
      const res = await api.updateCliente({
        rowid,
        ruc: '0957126889001',
        nombre: 'Dr. Julian Mendoza',
        direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
        email: 'julio_mendoza@yahoo.com.ec',
        telefono1: '2645422',
        telefono2: '2876357',
        descDefault: '0',
        tipo: 1
      });
      expect(res.status).toBe(200);
    });

    it('retorna 404 al tratar de actualizar un producto inexistente', () =>
      api
        .updateCliente({
          rowid,
          ruc: '0837126889001',
          nombre: 'Dr. Julian Mendoza',
          direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
          email: 'julio_mendoza@yahoo.com.ec',
          telefono1: '2645422',
          telefono2: '2876357',
          descDefault: '0',
          tipo: 1
        })
        .then(() => Promise.reject('Expected to fail'))
        .catch(({ response: res }) => expect(res.status).toBe(404)));
  });

  describe('/cliente/delete', () => {
    beforeAll(async () => {
      const res = await api.insertarCliente({
        ruc: '0927326569001',
        nombre: 'Dr. Julio Mendoza',
        direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
        email: 'julio_mendoza@yahoo.com.ec',
        telefono1: '2645422',
        telefono2: '2876357',
        descDefault: '0',
        tipo: 1
      });
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
