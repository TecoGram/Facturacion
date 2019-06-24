jest.mock('../HTTPClient.js', () => ({
  postRequest: jest.fn()
}));
jest.mock('../../../datil.config.js', () => require('./utils.js').datilConfig);

const HTTPClient = require('../HTTPClient.js');
const request = require('superagent');
const api = require('facturacion_common/src/api.js');
const server = require('../server.js');
const setup = require('../scripts/setupDB.js');
const { fetchUnidad, fetchCliente } = require('./utils.js');
const { getComprobanteFromVenta } = require('../dbAdmin.js');

const consumidorFinal = Object.freeze({
  id: '99999999999',
  nombre: 'CONSUMIDOR FINAL',
  direccion: '-',
  email: 'none@gmail.com',
  telefono1: '999999',
  telefono2: '',
  descDefault: '0',
  tipo: 'consumidor_final'
});

const baseClienteRow = Object.freeze({
  id: '0937816882001',
  nombre: 'Dr. Julio Mendoza',
  direccion: 'Via a Samborondon km. 7.5 Vista Sol',
  email: 'julio_mendoza@yahoo.com.ec',
  telefono1: '2645422',
  telefono2: '2876357',
  descDefault: '0',
  tipo: 'ruc'
});

const baseVentaRow = Object.freeze({
  empresa: 'TecoGram S.A.',
  cliente: 1,
  fecha: '2016-11-26',
  autorizacion: '',
  detallado: false,
  flete: 0,
  subtotal: 499900,
  contable: false,
  descuento: 0,
  iva: 12,
  pagos: [{ formaPago: 'efectivo', valor: 559888 }]
});

const insertarNuevaFacturaContable = async ventaRow => {
  HTTPClient.postRequest.mockReturnValueOnce(
    Promise.resolve({
      id: '__datil_id__',
      clave_acceso: '__clave__'
    })
  );

  const newVentaRow = ventaRow
    ? { ...ventaRow, contable: true }
    : {
        ...baseVentaRow,
        contable: true,
        unidades: [await fetchUnidad('Glyco')]
      };

  const res = await api.insertarVenta(newVentaRow);
  expect(res.status).toBe(200);
  expect(HTTPClient.postRequest).toHaveBeenCalledTimes(1);

  const [comprobante] = await getComprobanteFromVenta(res.body.rowid);
  expect(comprobante).toEqual({
    id: '__datil_id__',
    clave_acceso: '__clave__',
    secuencial: expect.any(Number),
    ventaId: res.body.rowid
  });

  const [[issueReq]] = HTTPClient.postRequest.mock.calls;
  return issueReq;
};

describe('/venta/ endpoints', () => {
  beforeAll(async () => {
    await setup();
    const responses = await Promise.all([
      api.insertarProducto('AD-12-21', 'Glyco', 'TECO', 399900, 499900, true),
      api.insertarCliente(baseClienteRow),
      api.insertarCliente(consumidorFinal)
    ]);
    responses.forEach(res => expect(res.status).toEqual(200));
  });
  afterAll(server.destroy);

  describe('/venta/new', () => {

    it ('genera facturas sin comprobantes', async () => {
      const newVentaRow = {
          ...baseVentaRow,
          unidades: [await fetchUnidad('Glyco')]
        };

      const res = await api.insertarVenta(newVentaRow);

      expect(res.status).toBe(200);
      expect(HTTPClient.postRequest).toHaveBeenCalledTimes(0);
    })

    describe('al generar facturas contables', () => {
      beforeEach(() => {
        HTTPClient.postRequest.mockReset();
      });


      it('genera comprobante usando cliente normal', async () => {
        const issueReq = await insertarNuevaFacturaContable();
        expect(issueReq).toEqual({
          host: 'https://link.datil.co',
          path: '/invoices/issue',
          headers: [
            { key: 'X-Key', value: '__MI_API_KEY_SECRETO__' },
            { key: 'X-Password', value: '__MI_PASS__' }
          ],
          body: {
            secuencial: expect.any(Number),
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
              totales_sin_impuestos: 49.99,
              descuento_adicional: 0,
              descuento: 0,
              propina: 0,
              importe_total: 55.99,
              impuestos: [
                {
                  codigo: 2,
                  codigo_porcentaje: 2,
                  base_imponible: 49.99,
                  valor: 6
                }
              ]
            },
            comprador: {
              razon_social: 'Dr. Julio Mendoza',
              identificacion: '0937816882001',
              tipo_identificacion: '04',
              email: 'julio_mendoza@yahoo.com.ec',
              telefono: '2645422',
              direccion: 'Via a Samborondon km. 7.5 Vista Sol'
            },
            tipo_emision: 1,
            items: [
              {
                descripcion: 'Glyco',
                cantidad: 1,
                precio_unitario: 49.99,
                precio_total_sin_impuestos: 49.99,
                impuestos: [
                  {
                    codigo: 2,
                    codigo_porcentaje: 2,
                    base_imponible: 49.99,
                    valor: 6
                  }
                ]
              }
            ],
            pagos: [{ medio: 'efectivo', total: 55.99 }]
          }
        });
      });

      it('genera comprobante usando consumidor final', async () => {
        const issueReq = await insertarNuevaFacturaContable({
          ...baseVentaRow,
          cliente: await fetchCliente('CONSUMIDOR FINAL'),
          contable: true,
          subtotal: 1499700,
          flete: 30000,
          pagos: [
            {
              formaPago: 'efectivo',
              valor: 1000000
            },
            {
              formaPago: 'tarjeta_credito',
              valor: 709664
            }
          ],
          unidades: [{ ...(await fetchUnidad('Glyco')), count: 3 }]
        });

        expect(issueReq).toEqual({
          host: 'https://link.datil.co',
          path: '/invoices/issue',
          headers: [
            { key: 'X-Key', value: '__MI_API_KEY_SECRETO__' },
            { key: 'X-Password', value: '__MI_PASS__' }
          ],
          body: {
            secuencial: expect.any(Number),
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
              totales_sin_impuestos: 152.97,
              descuento_adicional: 0,
              descuento: 0,
              propina: 0,
              importe_total: 170.97,
              impuestos: [
                {
                  codigo: 2,
                  codigo_porcentaje: 2,
                  base_imponible: 149.97,
                  valor: 18
                },
                {
                  codigo: 2,
                  codigo_porcentaje: 0,
                  base_imponible: 3,
                  valor: 0
                }
              ]
            },
            comprador: {
              razon_social: 'CONSUMIDOR FINAL',
              identificacion: '99999999999',
              tipo_identificacion: '07',
              email: 'none@gmail.com',
              telefono: '999999',
              direccion: '-'
            },
            tipo_emision: 1,
            items: [
              {
                descripcion: 'Glyco',
                cantidad: 3,
                precio_unitario: 49.99,
                precio_total_sin_impuestos: 149.97,
                impuestos: [
                  {
                    codigo: 2,
                    codigo_porcentaje: 2,
                    base_imponible: 149.97,
                    valor: 18
                  }
                ]
              },
              {
                descripcion: 'Manejo de carga',
                cantidad: 1,
                precio_unitario: 3,
                precio_total_sin_impuestos: 3,
                impuestos: [
                  {
                    base_imponible: 3,
                    codigo: 2,
                    codigo_porcentaje: 0,
                    valor: 0
                  }
                ]
              }
            ],
            pagos: [
              { medio: 'efectivo', total: 100 },
              { medio: 'tarjeta_credito', total: 70.97 }
            ]
          }
        });
      });

      it('genera comprobante con descuento', async () => {
        const issueReq = await insertarNuevaFacturaContable({
          ...baseVentaRow,
          subtotal: 999800,
          descuento: 10,
          pagos: [
            {
              formaPago: 'efectivo',
              valor: 1007798
            }
          ],
          unidades: [{ ...(await fetchUnidad('Glyco')), count: 2 }]
        });

        expect(issueReq).toEqual({
          host: 'https://link.datil.co',
          path: '/invoices/issue',
          headers: [
            { key: 'X-Key', value: '__MI_API_KEY_SECRETO__' },
            { key: 'X-Password', value: '__MI_PASS__' }
          ],
          body: {
            secuencial: expect.any(Number),
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
              totales_sin_impuestos: 99.98,
              descuento_adicional: 10,
              descuento: 10,
              propina: 0,
              importe_total: 100.78,
              impuestos: [
                {
                  codigo: 2,
                  codigo_porcentaje: 2,
                  base_imponible: 89.98,
                  valor: 10.8
                }
              ]
            },
            comprador: {
              razon_social: 'Dr. Julio Mendoza',
              identificacion: '0937816882001',
              tipo_identificacion: '04',
              email: 'julio_mendoza@yahoo.com.ec',
              telefono: '2645422',
              direccion: 'Via a Samborondon km. 7.5 Vista Sol'
            },
            tipo_emision: 1,
            items: [
              {
                descripcion: 'Glyco',
                cantidad: 2,
                precio_unitario: 49.99,
                precio_total_sin_impuestos: 99.98,
                impuestos: [
                  {
                    codigo: 2,
                    codigo_porcentaje: 2,
                    base_imponible: 99.98,
                    valor: 12
                  }
                ]
              }
            ],
            pagos: [{ medio: 'efectivo', total: 100.78 }]
          }
        });
      });
    });

  });

  describe('/venta/update', () => {
    it('retorna 200 al ingresar datos correctos', async () => {
      const unidad = await fetchUnidad('Glyco');
      const newVentaRow = {
        ...baseVentaRow,
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

  describe('/venta/ver/:id', () => {
    const ventaRow = {
      ...baseVentaRow
    };
    let insertedRowid;
    beforeAll(async () => {
      const unidad = await fetchUnidad('Glyco');

      const newVentaRow = { ...ventaRow, unidades: [unidad] };
      const res1 = await api.insertarVenta(newVentaRow);
      expect(res1.status).toBe(200);
      insertedRowid = res1.body.rowid;
    });

    beforeEach(() => {
      HTTPClient.postRequest.mockReset();
    });

    afterAll(() => {
      HTTPClient.postRequest.mockReset();
    });

    it('descarga el pdf de una factura existente', async () => {
      const url = api.getFacturaURL(insertedRowid);
      const res = await request.get(url);
      expect(res.status).toBe(200);
      expect(res.header['content-type']).toEqual('application/pdf');
    });

    describe("si el header 'Accept' es igual a 'application/json'", () => {
      it('retorna json', async () => {
        const res = await api.verVenta(insertedRowid);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          ventaRow: expect.objectContaining({
            codigo: '',
            empresa: ventaRow.empresa,
            fecha: ventaRow.fecha
          }),
          clienteRow: expect.objectContaining({
            rowid: expect.any(Number)
          }),
          unidades: [
            expect.objectContaining({
              producto: expect.any(Number),
              nombre: 'Glyco',
              count: 1,
              precioVenta: 499900
            })
          ],
          pagos: [
            expect.objectContaining({
              formaPago: 'efectivo',
              valor: 559888
            })
          ]
        });
      });

      it('retorna json con campo comprobante si es contable', async () => {
        HTTPClient.postRequest.mockReturnValueOnce(
          Promise.resolve({ id: '__datil_id__', clave_acceso: '__clave__' })
        );

        // insertar nueva venta contable
        const unidad = await fetchUnidad('Glyco');
        const ventaContable = {
          ...ventaRow,
          contable: true,
          unidades: [unidad]
        };
        const res1 = await api.insertarVenta(ventaContable);
        expect(res1.status).toBe(200);
        const ventaContableId = res1.body.rowid;

        // obtener json
        const res = await api.verVenta(ventaContableId);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          ventaRow: expect.objectContaining({
            codigo: '',
            empresa: ventaRow.empresa,
            fecha: ventaRow.fecha
          }),
          clienteRow: expect.objectContaining({
            rowid: expect.any(Number)
          }),
          comprobanteRow: expect.objectContaining({
            secuencial: expect.any(Number),
            id: '__datil_id__',
            clave_acceso: '__clave__'
          }),
          unidades: [
            expect.objectContaining({
              producto: expect.any(Number),
              nombre: 'Glyco',
              count: 1,
              precioVenta: 499900
            })
          ],
          pagos: [
            expect.objectContaining({
              formaPago: 'efectivo',
              valor: 559888
            })
          ]
        });
      });

      it('retorna 404 si la factura solicitada no existe', () =>
        api
          .verVenta(9952368)
          .then(() => Promise.reject('Expected to fail'))
          .catch(({ response: res }) => {
            expect(res.status).toBe(404);
          }));
    });
  });

  describe('tras guardar venta', () => {
    beforeAll(async () => {
      const unidad = await fetchUnidad('Glyco');
      const newVentaRow = {
        ...baseVentaRow,
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
      ...baseVentaRow
    };
    let insertedRowid;

    beforeAll(async () => {
      const unidad = await fetchUnidad('Glyco');

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
        .deleteVenta(9975475)
        .then(() => Promise.reject('Expected to fail'))
        .catch(({ response: res }) => {
          expect(res.status).toBe(404);
        });
    });
  });
});
