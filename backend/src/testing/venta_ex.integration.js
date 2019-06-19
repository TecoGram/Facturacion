const request = require('superagent');
const api = require('facturacion_common/src/api.js');
const FacturacionModels = require('facturacion_common/src/Models.js');

const server = require('../server.js');
const setup = require('../scripts/setupDB.js');

const fetchUnidad = async name => {
  const res = await api.findProductos(name);
  expect(res.status).toBe(200);

  const products = res.body;
  const { nombre, codigo, ...unidad } = FacturacionModels.facturableAUnidad(
    FacturacionModels.productoAFacturable(products[0])
  );
  return unidad;
};

const baseVentaEx = Object.freeze({
  codigo: '9999999',
  empresa: 'TecoGram S.A.',
  cliente: 1,
  medico: 1,
  paciente: 'Carlos Armijos',
  fecha: '2016-11-26',
  autorizacion: '',
  pagos: [{ formaPago: 'efectivo', valor: 22.39 }],
  subtotal: 19.99,
  descuento: 0
});

describe('/venta_ex/ endpoints', () => {
  beforeAll(async () => {
    await setup();
    const responses = await Promise.all([
      api.insertarProducto(
        'rytertg663433g',
        'examen',
        'TECO',
        39.99,
        49.99,
        false
      ),
      api.insertarCliente({
        id: '0937816882001',
        nombre: 'Dr. Julio Mendoza',
        direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
        email: 'julio_mendoza@yahoo.com.ec',
        telefono1: '2645422',
        telefono2: '2876357',
        descDefault: '0',
        tipo: 'ruc'
      }),
      api.insertarMedico(
        'Dr. Juan Coronel',
        'Avenida Leopoldo Carrera Calvo 493',
        'jcoronel23@yahoo.com.ec',
        '20',
        '2448272',
        '2885685'
      )
    ]).catch(err => console.log('setup error: ' + err));
    responses.forEach(res => expect(res.status).toEqual(200));
  });
  afterAll(server.destroy);

  describe('/venta_ex/new', () => {
    it('retorna 200 al ingresar datos correctos', async () => {
      const unidad = await fetchUnidad('examen');
      const newVentaRow = {
        ...baseVentaEx,
        unidades: [unidad]
      };

      const res = await api.insertarVentaExamen(newVentaRow);
      expect(res.status).toBe(200);
    });

    it('retorna 400 al ingresar datos duplicados', async () => {
      const unidad = await fetchUnidad('examen');
      const newVentaRow = {
        ...baseVentaEx,
        codigo: '9999998',
        unidades: [unidad]
      };

      const res1 = await api.insertarVentaExamen(newVentaRow);
      expect(res1.status).toBe(200);

      return api
        .insertarVenta(newVentaRow)
        .then(() => Promise.reject('Expected to fail'))
        .catch(({ response: res }) => expect(res.status).toBe(400));
    });
  });

  describe('/venta_ex/update', () => {
    it('retorna 200 al ingresar datos correctos', async () => {
      const unidad = await fetchUnidad('examen');
      const newVentaRow = {
        ...baseVentaEx,
        codigo: '9999997',
        unidades: [unidad]
      };

      const res1 = await api.insertarVentaExamen(newVentaRow);
      expect(res1.status).toBe(200);
      const rowid = res1.body.rowid;

      const editedVenta = {
        ...newVentaRow,
        rowid,
        autorizacion: '12345679',
        paciente: 'Vicente Hernandez'
      };
      const res2 = await api.updateVentaExamen(editedVenta);
      expect(res2.status).toBe(200);
    });
  });

  describe('/venta_ex/ver/:id', () => {
    const ventaRow = {
      ...baseVentaEx,
      codigo: '9999996'
    };
    let insertedRowid;

    beforeAll(async () => {
      const unidad = await fetchUnidad('examen');

      const newVentaRow = { ...ventaRow, unidades: [unidad] };
      const res1 = await api.insertarVentaExamen(newVentaRow);
      expect(res1.status).toBe(200);
      insertedRowid = res1.body.rowid;
    });

    it('descarga el pdf de una factura existente', async () => {
      const url = api.getFacturaURL(insertedRowid);
      const res = await request.get(url);
      expect(res.status).toBe(200);
      expect(res.header['content-type']).toEqual('application/pdf');
    });

    it("retorna json si el header 'Accept' es igual a 'application/json'", async () => {
      const res = await api.verVentaExamen(insertedRowid);
      expect(res.status).toBe(200);
      const { facturaData, facturables, cliente } = res.body;
      expect(facturaData).toEqual(
        expect.objectContaining({
          codigo: ventaRow.codigo,
          fecha: ventaRow.fecha,
          paciente: ventaRow.paciente
        })
      );
      expect(facturables).toHaveLength(1);
      expect(cliente.rowid).toEqual(ventaRow.cliente);
    });

    it('retorna 404 si la factura solicitada no existe', () =>
      api
        .verVentaExamen(999643)
        .then(() => Promise.reject('Expected to fail'))
        .catch(({ response: res }) => {
          expect(res.status).toBe(404);
        }));
  });

  describe('/venta_ex/find', () => {
    beforeAll(async () => {
      const unidad = await fetchUnidad('examen');
      const codigos = ['9999992', '9999991'];
      const responses = await Promise.all(
        codigos.map(codigo =>
          api.insertarVentaExamen({
            ...baseVentaEx,
            codigo,
            unidades: [unidad]
          })
        )
      );
      responses.forEach(res => expect(res.status).toBe(200));
    });

    it('retorna 200 al encontrar facturas', async () => {
      const res = await api.findVentasExamen('Arm');
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    it('retorna 404 si no encuentra ventas', () =>
      api
        .findVentasExamen('xyz')
        .then(() => Promise.reject('expected to fail'))
        .catch(({ response: res }) => {
          expect(res.status).toBe(404);
        }));
  });

  describe('/venta_ex/delete', () => {
    const ventaRow = {
      ...baseVentaEx,
      codigo: '9999990'
    };
    let insertedRowid;

    beforeAll(async () => {
      const unidad = await fetchUnidad('examen');

      const newVentaRow = { ...ventaRow, unidades: [unidad] };
      const res1 = await api.insertarVentaExamen(newVentaRow);
      expect(res1.status).toBe(200);
      insertedRowid = res1.body.rowid;
    });

    it('retorna 200 al borrar factura exitosamente', async () => {
      const res = await api.deleteVenta(insertedRowid);
      expect(res.status).toBe(200);
    });

    it('retorna 404 al intentar borrar una factura no encontrada', () => {
      return api
        .deleteVenta(997347)
        .then(() => Promise.reject('Expected to fail'))
        .catch(({ response: res }) => {
          expect(res.status).toBe(404);
        });
    });
  });
});
