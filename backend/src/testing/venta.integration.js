const request = require('superagent');
const api = require('../../../frontend/src/api.js');
const server = require('../server.js');
const setup = require('../scripts/setupDB.js');
const FacturacionModels = require('../../../frontend/src/Factura/Models');

const fetchUnidad = async name => {
  const res = await api.findProductos(name);
  expect(res.status).toBe(200);

  const products = res.body;
  const { nombre, codigo, ...unidad } = FacturacionModels.facturableAUnidad(
    FacturacionModels.productoAFacturable(products[0])
  );
  return unidad;
};

const baseClienteRow = Object.freeze({
  id: '0937816882001',
  nombre: 'Dr. Julio Mendoza',
  direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
  email: 'julio_mendoza@yahoo.com.ec',
  telefono1: '2645422',
  telefono2: '2876357',
  descDefault: '0',
  tipo: 'ruc'
});
const baseVentaRow = Object.freeze({
  codigo: '9999999',
  empresa: 'TecoGram S.A.',
  cliente: 1,
  fecha: '2016-11-26',
  autorizacion: '',
  detallado: false,
  flete: 0,
  subtotal: 19.99,
  descuento: 0,
  iva: 12,
  pagos: [{ formaPago: 'efectivo', valor: 22.39 }]
});

describe('/venta/ endpoints', () => {
  beforeAll(async () => {
    await setup();
    const responses = await Promise.all([
      api.insertarProducto(
        'rytertg663433g',
        'Glyco',
        'TECO',
        39.99,
        49.99,
        true
      ),
      api.insertarCliente(baseClienteRow)
    ]);
    responses.forEach(res => expect(res.status).toEqual(200));
  });
  afterAll(server.destroy);

  describe('/venta/new', () => {
    it('retorna 200 al ingresar datos correctos', async () => {
      const unidad = await fetchUnidad('Glyco');
      const newVentaRow = {
        ...baseVentaRow,
        unidades: [unidad]
      };

      const res = await api.insertarVenta(newVentaRow);
      expect(res.status).toBe(200);
    });

    it('permite ingresar 2 facturas con mismo codigo pero diferente empresa', async () => {
      const unidad = await fetchUnidad('Glyco');
      const newVentaRow = {
        ...baseVentaRow,
        codigo: '9999998',
        unidades: [unidad]
      };

      const res1 = await api.insertarVenta(newVentaRow);
      expect(res1.status).toBe(200);

      const res2 = await api.insertarVenta({
        ...newVentaRow,
        empresa: 'BIOCLED'
      });
      expect(res2.status).toBe(200);
    });
  });

  describe('/venta/update', () => {
    it('retorna 200 al ingresar datos correctos', async () => {
      const unidad = await fetchUnidad('Glyco');
      const newVentaRow = {
        ...baseVentaRow,
        codigo: '9999996',
        unidades: [unidad]
      };

      const res1 = await api.insertarVenta(newVentaRow);
      expect(res1.status).toBe(200);

      const editedVentaRow = {
        ...newVentaRow,
        rowid: res1.body.rowid,
        autorization: '12345',
        formaPago: 'transferencia'
      };
      const res2 = await api.updateVenta(editedVentaRow);
      expect(res2.status).toBe(200);
    });
  });

  describe('/venta/ver/:empresa/:codigo', () => {
    const ventaRow = {
      ...baseVentaRow,
      codigo: '9999995'
    };
    beforeAll(async () => {
      const unidad = await fetchUnidad('Glyco');

      const newVentaRow = { ...ventaRow, unidades: [unidad] };
      const res1 = await api.insertarVenta(newVentaRow);
      expect(res1.status).toBe(200);
    });

    it('descarga el pdf de una factura existente', async () => {
      const url = api.getFacturaURL(ventaRow.codigo, ventaRow.empresa);
      const res = await request.get(url);
      expect(res.status).toBe(200);
      expect(res.header['content-type']).toEqual('application/pdf');
    });

    it("retorna json si el header 'Accept' es igual a 'application/json'", async () => {
      const res = await api.verVenta(ventaRow.codigo, ventaRow.empresa);
      expect(res.status).toBe(200);
      const { facturaData, facturables, cliente } = res.body;
      expect(facturaData).toEqual(
        expect.objectContaining({
          codigo: ventaRow.codigo,
          empresa: ventaRow.empresa,
          fecha: ventaRow.fecha
        })
      );
      expect(facturables).toHaveLength(1);
      expect(cliente.rowid).toEqual(ventaRow.cliente);
    });

    it('retorna 404 si la factura solicitada no existe', () =>
      api
        .verVenta(ventaRow.codigo, 'CAPCOM')
        .then(() => Promise.reject('Expected to fail'))
        .catch(({ response: res }) => {
          expect(res.status).toBe(404);
        }));
  });

  describe('tras guardar venta', () => {
    beforeAll(async () => {
      const unidad = await fetchUnidad('Glyco');
      const newVentaRow = {
        ...baseVentaRow,
        codigo: '9999994',
        unidades: [unidad]
      };

      const res2 = await api.insertarVenta(newVentaRow);
      expect(res2.status).toBe(200);
    });

    it('no permite borrar productos facturados', () =>
      api
        .deleteProducto(1)
        .then(() => Promise.reject('Expected to fail'))
        .catch(({ response: res }) => expect(res.status).toBe(400)));

    it('no permite borrar clientes facturados', () =>
      api
        .deleteCliente('ruc', '0937816882001')
        .then(() => Promise.reject('Expected to fail'))
        .catch(({ response: res }) => {
          expect(res.status).toBe(400);
        }));
  });

  describe('/venta/find', () => {
    beforeAll(async () => {
      const unidad = await fetchUnidad('Glyco');
      const codigos = ['9999992', '9999991'];
      const responses = await Promise.all(
        codigos.map(codigo =>
          api.insertarVenta({
            ...baseVentaRow,
            codigo,
            unidades: [unidad]
          })
        )
      );
      responses.forEach(res => expect(res.status).toBe(200));
    });

    it('retorna 200 al encontrar facturas', async () => {
      const res = await api.findVentas('Jul');
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    it('retorna 404 si no encuentra ventas', () =>
      api
        .findVentas('xyz')
        .then(() => Promise.reject('expected to fail'))
        .catch(({ response: res }) => {
          expect(res.status).toBe(404);
        }));
  });

  describe('/venta/delete', () => {
    const ventaRow = {
      ...baseVentaRow,
      codigo: '9999990'
    };
    beforeAll(async () => {
      const unidad = await fetchUnidad('Glyco');

      const newVentaRow = { ...ventaRow, unidades: [unidad] };
      const res1 = await api.insertarVenta(newVentaRow);
      expect(res1.status).toBe(200);
    });
    it('retorna 200 al borrar factura exitosamente', async () => {
      const res = await api.deleteVenta(ventaRow.codigo, ventaRow.empresa);
      expect(res.status).toBe(200);
    });

    it('retorna 404 al intentar borrar una factura no encontrada', () => {
      return api
        .deleteVenta('111', 'EA')
        .then(() => Promise.reject('Expected to fail'))
        .catch(({ response: res }) => {
          expect(res.status).toBe(404);
        });
    });
  });
});
