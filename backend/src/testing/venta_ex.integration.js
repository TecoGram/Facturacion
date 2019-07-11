jest.mock('../HTTPClient.js', () => ({
  postRequest: jest.fn()
}));
jest.mock('../../../datil.config.js', () => require('./utils.js').datilConfig);

const request = require('superagent');
const api = require('facturacion_common/src/api.js');

const HTTPClient = require('../HTTPClient.js');
const server = require('../server.js');
const setup = require('../scripts/setupDB.js');
const { fetchUnidad } = require('./utils.js');

const baseVentaEx = Object.freeze({
  codigo: '',
  empresa: 'TecoGram S.A.',
  cliente: 1,
  medico: 1,
  tipo: 1,
  paciente: 'Carlos Armijos',
  fecha: '2016-11-26T17:28:12.000Z',
  autorizacion: '',
  contable: false,
  pagos: [{ formaPago: 'efectivo', valor: 199900 }],
  subtotal: 199900,
  descuento: 0
});

const insertarNuevaFacturaContable = async () => {
  HTTPClient.postRequest.mockReturnValueOnce(
    Promise.resolve({
      id: '__datil_id__',
      clave_acceso: '__clave__'
    })
  );

  const unidad = await fetchUnidad('examen');
  const newVentaRow = {
    ...baseVentaEx,
    contable: true,
    unidades: [unidad]
  };

  const res = await api.insertarVenta(newVentaRow);
  expect(res.status).toBe(200);
  expect(HTTPClient.postRequest).toHaveBeenCalledTimes(1);

  const [[issueReq]] = HTTPClient.postRequest.mock.calls;
  return issueReq;
};

describe('/venta_ex/ endpoints', () => {
  beforeAll(async () => {
    await setup();
    const responses = await Promise.all([
      api.insertarProducto({
        codigo: 'rytertg663433g',
        nombre: 'examen',
        marca: 'TECO',
        precioDist: 0,
        precioVenta: 199900,
        pagaIva: false
      }),
      api.insertarCliente({
        id: '0937816882001',
        nombre: 'Eduardo Almeida',
        direccion: 'Boyaca y Sucre 112',
        email: 'ealmeida@yahoo.com.mx',
        telefono1: '2645422',
        telefono2: '2876357',
        descDefault: '0',
        tipo: 'ruc'
      }),
      api.insertarMedico({
        nombre: 'Dr. Juan Coronel',
        direccion: 'Avenida Leopoldo Carrera Calvo 493',
        email: 'jcoronel23@yahoo.com.ec',
        comision: '20',
        telefono1: '2448272',
        telefono2: '2885685'
      })
    ]).catch(err => console.log('setup error: ' + err));
    responses.forEach(res => expect(res.status).toEqual(200));
  });

  afterAll(server.destroy);

  describe('/venta_ex/new', () => {
    it('genera comprobantes correctamente', async () => {
      const issueReq = await insertarNuevaFacturaContable();
      expect(issueReq).toEqual({
        host: 'https://link.datil.co',
        path: '/invoices/issue',
        headers: [
          { key: 'X-Key', value: '__MI_API_KEY_SECRETO__' },
          { key: 'X-Password', value: '__MI_PASS__' }
        ],
        body: {
          secuencial: 1,
          fecha_emision: '2016-11-26T17:28:12.000Z',
          emisor: {
            ruc: '0999999999001',
            razon_social: '__nombre__',
            nombre_comercial: '__nombre__',
            direccion: '__direccion__',
            contribuyente_especial: '',
            obligado_contabilidad: true,
            establecimiento: {
              codigo: '001',
              punto_emision: '001',
              direccion: '__direccion__'
            }
          },
          moneda: 'USD',
          ambiente: 1,
          totales: {
            total_sin_impuestos: 19.99,
            descuento_adicional: 0,
            descuento: 0,
            propina: 0,
            importe_total: 19.99,
            impuestos: [
              {
                codigo: '2',
                codigo_porcentaje: '0',
                base_imponible: 19.99,
                valor: 0
              }
            ]
          },
          comprador: {
            razon_social: 'Eduardo Almeida',
            identificacion: '0937816882001',
            tipo_identificacion: '04',
            email: 'ealmeida@yahoo.com.mx',
            telefono: '2645422',
            direccion: 'Boyaca y Sucre 112'
          },
          tipo_emision: 1,
          items: [
            {
              descripcion: 'examen',
              cantidad: 1,
              precio_unitario: 19.99,
              precio_total_sin_impuestos: 19.99,
              descuento: 0,
              impuestos: [
                {
                  codigo: '2',
                  codigo_porcentaje: '0',
                  base_imponible: 19.99,
                  valor: 0,
                  tarifa: 0
                }
              ]
            }
          ],
          pagos: [{ medio: 'efectivo', total: 19.99 }]
        }
      });
    });
  });

  describe('/venta_ex/update', () => {
    it('retorna 200 al ingresar datos correctos', async () => {
      const unidad = await fetchUnidad('examen');
      const newVentaRow = {
        ...baseVentaEx,
        unidades: [unidad]
      };

      const res1 = await api.insertarVenta(newVentaRow);
      expect(res1.status).toBe(200);
      const rowid = res1.body.rowid;

      const editedVenta = {
        ...newVentaRow,
        rowid,
        autorizacion: '12345679',
        paciente: 'Vicente Hernandez'
      };
      const res2 = await api.updateVenta(editedVenta);
      expect(res2.status).toBe(200);
    });
  });

  describe('/venta/ver/:id', () => {
    const ventaRow = {
      ...baseVentaEx
    };
    let insertedRowid;

    beforeAll(async () => {
      const unidad = await fetchUnidad('examen');

      const newVentaRow = { ...ventaRow, unidades: [unidad] };
      const res1 = await api.insertarVenta(newVentaRow);
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
      const res = await api.verVenta(insertedRowid);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        ventaRow: expect.objectContaining({
          codigo: ventaRow.codigo,
          empresa: ventaRow.empresa,
          fecha: ventaRow.fecha
        }),
        clienteRow: expect.objectContaining({
          rowid: expect.any(Number),
          nombre: 'Eduardo Almeida'
        }),
        medicoRow: expect.objectContaining({
          rowid: expect.any(Number),
          nombre: 'Dr. Juan Coronel'
        }),
        unidades: [
          expect.objectContaining({
            producto: expect.any(Number),
            nombre: 'examen',
            count: 1,
            precioVenta: 199900
          })
        ],
        pagos: [
          expect.objectContaining({
            formaPago: 'efectivo',
            valor: 199900
          })
        ],
        paciente: 'Carlos Armijos'
      });
    });

    it('retorna json correcto si el medico es null', async () => {
      // insertar venta sin medico
      const newVentaRow = {
        ...ventaRow,
        unidades: [await fetchUnidad('examen')],
        medico: null
      };
      const res1 = await api.insertarVenta(newVentaRow);
      expect(res1.status).toBe(200);

      const res = await api.verVenta(res1.body.rowid);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        ventaRow: expect.objectContaining({
          codigo: ventaRow.codigo,
          empresa: ventaRow.empresa,
          fecha: ventaRow.fecha
        }),
        clienteRow: expect.objectContaining({
          rowid: expect.any(Number),
          nombre: 'Eduardo Almeida'
        }),
        medicoRow: null,
        unidades: [
          expect.objectContaining({
            producto: expect.any(Number),
            nombre: 'examen',
            count: 1,
            precioVenta: 199900
          })
        ],
        pagos: [
          expect.objectContaining({
            formaPago: 'efectivo',
            valor: 199900
          })
        ],
        paciente: 'Carlos Armijos'
      });
    });
  });

  describe('/venta/delete', () => {
    const ventaRow = {
      ...baseVentaEx
    };
    let insertedRowid;

    beforeAll(async () => {
      const unidad = await fetchUnidad('examen');

      const newVentaRow = { ...ventaRow, unidades: [unidad] };
      const res1 = await api.insertarVenta(newVentaRow);
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
