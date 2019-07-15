jest.mock('facturacion_common/src/api.js', () => {
  return {
    insertarVenta: jest.fn(),
    updateVenta: jest.fn()
  };
});
import * as Actions from './EditorActions.js';
import { createReducer } from './EditorReducers.js';
const API = require('facturacion_common/src/api.js');
const Money = require('facturacion_common/src/Money.js');
const {
  validateFormWithSchema,
  ventaInsertSchema,
  ventaUpdateSchema,
  ventaExamenInsertSchema
} = require('facturacion_common/src/Validacion.js');
import { assertWithSchema, runActions } from '../TestingUtils.js';

describe('EditorReducers', () => {
  beforeEach(() => {
    API.insertarVenta.mockReset();
  });

  describe('Si los pagos no cuadran', () => {
    it('valida pagos insuficientes', async () => {
      const config = {
        iva: 12,
        isExamen: false,
        editar: false,
        empresa: 'Teco'
      };
      const callback = jest.fn();

      const actions = [
        { type: Actions.getDefaultState },
        {
          type: Actions.setCliente,
          clienteRow: {
            rowid: 1,
            id: '0945537385',
            nombre: 'Carlos Salazar',
            nombre: 'carlos salazar',
            direccion: 'Pedro Carbo 41',
            telefono1: '099123123',
            telefono2: '099456456',
            email: 'carlos@gmail.com',
            descDefault: 0,
            tipo: 'cedula'
          }
        },
        {
          type: Actions.agregarProducto,
          productoRow: {
            rowid: 1,
            codigo: '0945',
            nombre: 'HCG Cassette',
            nombreAscii: 'hcg cassette',
            marca: 'TECO',
            precioDist: 9900,
            precioVenta: 19900,
            pagaIva: true
          }
        },
        {
          type: Actions.updatePagos,
          pagos: [
            {
              key: 0,
              formaPagoText: 'EFECTIVO',
              formaPago: 'efectivo',
              valor: 10000
            },
            {
              key: 0,
              formaPagoText: 'TARJETA DE DEBITO',
              formaPago: 'tarjeta_debito',
              valor: 9900
            }
          ]
        },
        {
          type: Actions.guardarFactura,
          config,
          callback
        }
      ];

      const finalState = await runActions(createReducer, actions);

      expect(finalState.emitiendo).toEqual(false);

      // verificar callback ejecutado
      expect(callback.mock.calls).toEqual([
        [{ success: false, msg: 'Por favor revisa los pagos. Faltan $0.24' }]
      ]);
      expect(API.insertarVenta).not.toHaveBeenCalled();
    });

    it('valida pagos abundantes', async () => {
      const config = {
        iva: 12,
        isExamen: false,
        editar: false,
        empresa: 'Teco'
      };
      const callback = jest.fn();

      const actions = [
        { type: Actions.getDefaultState },
        {
          type: Actions.setCliente,
          clienteRow: {
            rowid: 1,
            id: '0945537385',
            nombre: 'Carlos Salazar',
            nombre: 'carlos salazar',
            direccion: 'Pedro Carbo 41',
            telefono1: '099123123',
            telefono2: '099456456',
            email: 'carlos@gmail.com',
            descDefault: 0,
            tipo: 'cedula'
          }
        },
        {
          type: Actions.agregarProducto,
          productoRow: {
            rowid: 1,
            codigo: '0945',
            nombre: 'HCG Cassette',
            nombreAscii: 'hcg cassette',
            marca: 'TECO',
            precioDist: 9900,
            precioVenta: 19900,
            pagaIva: true
          }
        },
        {
          type: Actions.updatePagos,
          pagos: [
            {
              key: 0,
              formaPagoText: 'EFECTIVO',
              formaPago: 'efectivo',
              valor: 10000
            },
            {
              key: 1,
              formaPagoText: 'TARJETA DE DEBITO',
              formaPago: 'tarjeta_debito',
              valor: 20000
            }
          ]
        },
        {
          type: Actions.guardarFactura,
          config,
          callback
        }
      ];

      const finalState = await runActions(createReducer, actions);

      expect(finalState.emitiendo).toEqual(false);

      // verificar callback ejecutado
      expect(callback.mock.calls).toEqual([
        [{ success: false, msg: 'Por favor revisa los pagos. Sobran $0.77' }]
      ]);
      expect(API.insertarVenta).not.toHaveBeenCalled();
    });

    it('Completa la diferencia cuando es muy pequeña', async () => {
      API.insertarVenta.mockReturnValueOnce(
        Promise.resolve({ status: 200, body: { rowid: 5 } })
      );
      const config = {
        iva: 12,
        isExamen: false,
        editar: false,
        empresa: 'Teco'
      };
      const callback = jest.fn();

      const actions = [
        { type: Actions.getDefaultState },
        {
          type: Actions.setCliente,
          clienteRow: {
            rowid: 1,
            id: '0945537385',
            nombre: 'Carlos Salazar',
            nombre: 'carlos salazar',
            direccion: 'Pedro Carbo 41',
            telefono1: '099123123',
            telefono2: '099456456',
            email: 'carlos@gmail.com',
            descDefault: 0,
            tipo: 'cedula'
          }
        },
        {
          type: Actions.agregarProducto,
          productoRow: {
            rowid: 1,
            codigo: '0945',
            nombre: 'HCG Cassette',
            nombreAscii: 'hcg cassette',
            marca: 'TECO',
            precioDist: 9900,
            precioVenta: 19900,
            pagaIva: true
          }
        },
        {
          type: Actions.updatePagos,
          pagos: [
            {
              key: 0,
              formaPagoText: 'EFECTIVO',
              formaPago: 'efectivo',
              valor: 10000
            },
            {
              key: 0,
              formaPagoText: 'TARJETA DE DEBITO',
              formaPago: 'efectivo',
              valor: 12200
            }
          ]
        },
        {
          type: Actions.guardarFactura,
          config,
          callback
        }
      ];

      const finalState = await runActions(createReducer, actions);

      expect(finalState.emitiendo).toEqual(false);

      // verificar callback ejecutado
      expect(callback.mock.calls).toEqual([[{ success: true, rowid: 5 }]]);
    });
  });

  it('crea una factura de productos correctamente', async () => {
    API.insertarVenta.mockReturnValueOnce(
      Promise.resolve({ status: 200, body: { rowid: 5 } })
    );

    const config = {
      iva: 12,
      isExamen: false,
      editar: false,
      empresa: 'Teco'
    };
    const callback = jest.fn();

    const actions = [
      { type: Actions.getDefaultState },
      {
        type: Actions.setCliente,
        clienteRow: {
          rowid: 1,
          id: '0945537385',
          nombre: 'Carlos Salazar',
          nombre: 'carlos salazar',
          direccion: 'Pedro Carbo 41',
          telefono1: '099123123',
          telefono2: '099456456',
          email: 'carlos@gmail.com',
          descDefault: 0,
          tipo: 'cedula'
        }
      },
      {
        type: Actions.agregarProducto,
        productoRow: {
          rowid: 1,
          codigo: '0945',
          nombre: 'HCG Cassette',
          nombreAscii: 'hcg cassette',
          marca: 'TECO',
          precioDist: 9900,
          precioVenta: 19900,
          pagaIva: true
        }
      },
      {
        type: Actions.agregarProducto,
        productoRow: {
          rowid: 2,
          codigo: '0436',
          nombre: 'HCG Tirillas',
          nombreAscii: 'hcg tirillas',
          marca: 'TECO',
          precioDist: 9900,
          precioVenta: 19900,
          pagaIva: true
        }
      },
      {
        type: Actions.updateUnidadInput,
        index: 0,
        key: 'count',
        value: '5'
      },
      {
        type: Actions.updateUnidadInput,
        index: 1,
        key: 'precioVenta',
        value: '1.49'
      },
      {
        type: Actions.updatePagos,
        pagos: [
          {
            key: 0,
            formaPagoText: 'EFECTIVO',
            formaPago: 'efectivo',
            valor: 100000
          },
          {
            key: 0,
            formaPagoText: 'CHEQUE',
            formaPago: 'cheque',
            valor: 28128
          }
        ]
      },
      {
        type: Actions.guardarFactura,
        config,
        callback
      }
    ];

    const finalState = await runActions(createReducer, actions);

    // verificar callback ejecutado
    expect(callback.mock.calls).toEqual([[{ success: true, rowid: 5 }]]);

    // verificar state reseteado
    expect(finalState).toEqual(
      expect.objectContaining({
        clienteRow: null,
        medicoRow: null,
        emitiendo: false,
        unidades: []
      })
    );

    // verificar request enviado
    expect(API.insertarVenta).toHaveBeenCalledTimes(1);
    const [[insertarVentaBody]] = API.insertarVenta.mock.calls;
    assertWithSchema(ventaInsertSchema, insertarVentaBody);
    expect(insertarVentaBody).toEqual(
      expect.objectContaining({
        codigo: '',
        empresa: 'Teco',
        cliente: 1,
        fecha: expect.any(String),
        autorizacion: '',
        guia: '',
        detallado: true,
        contable: false,
        descuento: 0,
        flete: 0,
        iva: 12,
        subtotal: 114400,
        pagos: [
          {
            formaPago: 'efectivo',
            valor: 100000
          },
          {
            formaPago: 'cheque',
            valor: 28128
          }
        ],
        unidades: [
          {
            lote: '',
            count: 5,
            producto: 1,
            precioVenta: 19900,
            fechaExp: expect.any(String)
          },
          {
            lote: '',
            count: 1,
            producto: 2,
            precioVenta: 14900,
            fechaExp: expect.any(String)
          }
        ]
      })
    );
  });

  it('crea una factura contable de productos correctamente', async () => {
    API.insertarVenta.mockReturnValueOnce(
      Promise.resolve({ status: 200, body: { rowid: 5 } })
    );

    const config = {
      iva: 12,
      isExamen: false,
      editar: false,
      empresa: 'Teco'
    };
    const callback = jest.fn();

    const actions = [
      { type: Actions.getDefaultState },
      {
        type: Actions.setCliente,
        clienteRow: {
          rowid: 1,
          id: '0945537385',
          nombre: 'Carlos Salazar',
          nombre: 'carlos salazar',
          direccion: 'Pedro Carbo 41',
          telefono1: '099123123',
          telefono2: '099456456',
          email: 'carlos@gmail.com',
          descDefault: 0,
          tipo: 'cedula'
        }
      },
      {
        type: Actions.agregarProducto,
        productoRow: {
          rowid: 1,
          codigo: '0945',
          nombre: 'HCG Cassette',
          nombreAscii: 'hcg cassette',
          marca: 'TECO',
          precioDist: 9900,
          precioVenta: 19900,
          pagaIva: true
        }
      },
      {
        type: Actions.agregarProducto,
        productoRow: {
          rowid: 2,
          codigo: '0436',
          nombre: 'HCG Tirillas',
          nombreAscii: 'hcg tirillas',
          marca: 'TECO',
          precioDist: 9900,
          precioVenta: 19900,
          pagaIva: true
        }
      },
      {
        type: Actions.updateUnidadInput,
        index: 0,
        key: 'count',
        value: '5'
      },
      {
        type: Actions.updateUnidadInput,
        index: 1,
        key: 'precioVenta',
        value: '1.49'
      },
      {
        type: Actions.updateFacturaInput,
        key: 'contable',
        value: true
      },
      {
        type: Actions.updatePagos,
        pagos: [
          {
            key: 0,
            formaPagoText: 'EFECTIVO',
            formaPago: 'efectivo',
            valor: 100000
          },
          {
            key: 0,
            formaPagoText: 'CHEQUE',
            formaPago: 'cheque',
            valor: 28128
          }
        ]
      },
      {
        type: Actions.guardarFactura,
        config,
        callback
      }
    ];

    const finalState = await runActions(createReducer, actions);

    // verificar callback NO ejecutado
    expect(callback).not.toHaveBeenCalled();

    // verificar state emitiendo
    expect(finalState.emitiendo).toEqual({ ventaId: 5 });

    // verificar request enviado
    expect(API.insertarVenta).toHaveBeenCalledTimes(1);
    const [[insertarVentaBody]] = API.insertarVenta.mock.calls;
    assertWithSchema(ventaInsertSchema, insertarVentaBody);
    expect(insertarVentaBody).toEqual(
      expect.objectContaining({
        codigo: '',
        empresa: 'Teco',
        cliente: 1,
        fecha: expect.any(String),
        autorizacion: '',
        guia: '',
        detallado: true,
        contable: true,
        descuento: 0,
        flete: 0,
        iva: 12,
        subtotal: 114400,
        pagos: [
          {
            formaPago: 'efectivo',
            valor: 100000
          },
          {
            formaPago: 'cheque',
            valor: 28128
          }
        ],
        unidades: [
          {
            lote: '',
            count: 5,
            producto: 1,
            precioVenta: 19900,
            fechaExp: expect.any(String)
          },
          {
            lote: '',
            count: 1,
            producto: 2,
            precioVenta: 14900,
            fechaExp: expect.any(String)
          }
        ]
      })
    );
  });

  it('crea una factura de examenes correctamente', async () => {
    API.insertarVenta.mockReturnValueOnce(
      Promise.resolve({ status: 200, body: { rowid: 5 } })
    );

    const config = {
      iva: 12,
      isExamen: true,
      editar: false,
      empresa: 'Teco'
    };
    const callback = jest.fn();

    const actions = [
      { type: Actions.getDefaultState },
      {
        type: Actions.setCliente,
        clienteRow: {
          rowid: 22,
          id: '0945537385',
          nombre: 'Carlos Salazar',
          descDefault: 0,
          tipo: 'cedula'
        }
      },
      {
        type: Actions.agregarProducto,
        productoRow: {
          rowid: 6,
          codigo: '0945',
          nombre: 'Examenes Especiales',
          precioVenta: 149900,
          pagaIva: true
        }
      },
      {
        type: Actions.updateFacturaInput,
        key: 'paciente',
        value: 'Ernesto Salazar'
      },
      {
        type: Actions.updatePagos,
        pagos: [
          {
            key: 0,
            formaPagoText: 'TARJETA DE DEBITO',
            formaPago: 'tarjeta_debito'
          }
        ]
      },
      {
        type: Actions.guardarFactura,
        config,
        callback
      }
    ];

    const finalState = await runActions(createReducer, actions);

    // verificar callback ejecutado
    expect(callback.mock.calls).toEqual([[{ success: true, rowid: 5 }]]);

    // verificar state reseteado
    expect(finalState).toEqual(
      expect.objectContaining({
        clienteRow: null,
        medicoRow: null,
        emitiendo: false,
        unidades: []
      })
    );

    // verificar request enviado
    expect(API.insertarVenta).toHaveBeenCalledTimes(1);
    const [[insertarVentaBody]] = API.insertarVenta.mock.calls;
    assertWithSchema(ventaExamenInsertSchema, insertarVentaBody);
    expect(insertarVentaBody).toEqual(
      expect.objectContaining({
        codigo: '',
        empresa: 'Teco',
        cliente: 22,
        fecha: expect.any(String),
        autorizacion: '',
        guia: '',
        descuento: 0,
        flete: 0,
        subtotal: 149900,
        paciente: 'Ernesto Salazar',
        pagos: [
          {
            formaPago: 'tarjeta_debito',
            valor: 149900
          }
        ],
        unidades: [
          {
            lote: '',
            count: 1,
            producto: 6,
            precioVenta: 149900,
            fechaExp: expect.any(String)
          }
        ]
      })
    );
  });

  it('edita una factura de productos correctamente', async () => {
    API.updateVenta.mockReturnValueOnce(
      Promise.resolve({ status: 200, body: { rowid: 5 } })
    );

    const config = {
      iva: 12,
      isExamen: false,
      editar: true,
      empresa: 'TecoGram S.A.'
    };
    const callback = jest.fn();

    const actions = [
      {
        type: Actions.editarFactura,
        venta: {
          ventaRow: {
            rowid: 1109,
            codigo: '',
            empresa: 'TecoGram S.A.',
            cliente: 184,
            fecha: '2019-06-25',
            autorizacion: '',
            guia: '',
            detallado: 1,
            tipo: 0,
            descuento: 0,
            iva: 12,
            flete: 0,
            subtotal: 10000
          },
          clienteRow: {
            rowid: 184,
            id: '999999999',
            nombreAscii: 'consumidor final',
            nombre: 'Consumidor Final',
            direccion: 'Guayaquil',
            email: 'none@gmail.com',
            telefono1: '555555',
            telefono2: '',
            descDefault: 0,
            tipo: 'consumidor_final'
          },
          unidades: [
            {
              nombre: 'HCG TIRAS TEST ORINA/SUERO',
              producto: 191,
              count: 4,
              precioVenta: 2500,
              codigo: 'AD-438-07-12',
              pagaIva: 1,
              marca: 'BIOPROBA',
              lote: '',
              fechaExp: '2020-06-25'
            }
          ],
          pagos: [
            {
              ventaId: 1109,
              formaPago: 'efectivo',
              valor: 11200
            }
          ],
          comprobanteRow: null
        }
      },
      {
        type: Actions.agregarProducto,
        productoRow: {
          rowid: 126,
          codigo: '822-RBE-0216',
          nombreAscii: 'hcg cassette 50 pcs toyo ',
          nombre: 'HCG CASSETTE 50 PCS TOYO ',
          marca: 'TOYO',
          precioDist: 195000,
          precioVenta: 350000,
          pagaIva: 1
        }
      },
      {
        type: Actions.updatePagos,
        pagos: [
          {
            ventaId: 1109,
            formaPago: 'efectivo',
            valor: 403200,
            formaPagoText: 'EFECTIVO',
            valorText: '40.32'
          }
        ]
      },
      {
        type: Actions.updateUnidadInput,
        index: 1,
        key: 'fechaExp',
        value: '2020-06-25'
      },
      {
        type: Actions.setCliente,
        clienteRow: null
      },
      {
        type: Actions.setCliente,
        clienteRow: {
          rowid: 3,
          id: '1102371802001',
          nombreAscii: 'dr luis sarango',
          nombre: 'DR LUIS SARANGO',
          direccion: 'FLORIDA NORTE MZ. 601 V. 15',
          email: '',
          telefono1: '2258945',
          telefono2: '0999871757',
          descDefault: 0,
          tipo: 'ruc'
        }
      },
      {
        type: Actions.guardarFactura,
        config,
        callback
      }
    ];

    const finalState = await runActions(createReducer, actions);

    // verificar callback ejecutado
    expect(callback.mock.calls).toEqual([[{ success: true, rowid: 5 }]]);

    // verificar state reseteado
    expect(finalState).toEqual(
      expect.objectContaining({
        clienteRow: null,
        medicoRow: null,
        emitiendo: false,
        unidades: []
      })
    );

    // verificar request enviado
    expect(API.updateVenta).toHaveBeenCalledTimes(1);
    const [[updateVentaBody]] = API.updateVenta.mock.calls;
    assertWithSchema(ventaUpdateSchema, updateVentaBody);
    expect(updateVentaBody).toEqual(
      expect.objectContaining({
        codigo: '',
        empresa: 'TecoGram S.A.',
        cliente: 3,
        fecha: '2019-06-25T05:00:00.000Z',
        autorizacion: '',
        guia: '',
        detallado: true,
        descuento: 0,
        flete: 0,
        iva: 12,
        rowid: 1109,
        subtotal: 360000,
        tipo: 0,
        pagos: [
          {
            formaPago: 'efectivo',
            valor: 403200
          }
        ],
        unidades: [
          {
            producto: 191,
            count: 4,
            precioVenta: 2500,
            lote: '',
            fechaExp: '2020-06-25'
          },
          {
            producto: 126,
            fechaExp: '2020-06-25',
            count: 1,
            lote: '',
            precioVenta: 350000
          }
        ]
      })
    );
  });

  it('crea una factura de examenes correctamente', async () => {
    API.insertarVenta.mockReturnValueOnce(
      Promise.resolve({ status: 200, body: { rowid: 5 } })
    );

    const config = {
      iva: 12,
      isExamen: true,
      editar: false,
      empresa: 'Teco'
    };
    const callback = jest.fn();

    const actions = [
      { type: Actions.getDefaultState },
      {
        type: Actions.setCliente,
        clienteRow: {
          rowid: 1,
          id: '0945537385',
          nombre: 'Carlos Salazar',
          nombre: 'carlos salazar',
          direccion: 'Pedro Carbo 41',
          telefono1: '099123123',
          telefono2: '099456456',
          email: 'carlos@gmail.com',
          descDefault: 0,
          tipo: 'cedula'
        }
      },
      {
        type: Actions.updateFacturaInput,
        key: 'paciente',
        value: 'Carlos Salazar'
      },
      {
        type: Actions.agregarProducto,
        productoRow: {
          rowid: 1,
          codigo: '-',
          nombre: 'Examenes especiales',
          nombreAscii: 'examenes especiales',
          marca: '',
          precioDist: 0,
          precioVenta: 99900,
          pagaIva: false
        }
      },
      {
        type: Actions.updatePagos,
        pagos: [
          {
            key: 0,
            formaPagoText: 'EFECTIVO',
            formaPago: 'efectivo',
            valor: 99900
          }
        ]
      },
      {
        type: Actions.guardarFactura,
        config,
        callback
      }
    ];

    const finalState = await runActions(createReducer, actions);

    // verificar callback ejecutado
    expect(callback.mock.calls).toEqual([[{ success: true, rowid: 5 }]]);

    // verificar state reseteado
    expect(finalState).toEqual(
      expect.objectContaining({
        clienteRow: null,
        medicoRow: null,
        emitiendo: false,
        unidades: []
      })
    );

    // verificar request enviado
    expect(API.insertarVenta).toHaveBeenCalledTimes(1);
    const [[insertarVentaBody]] = API.insertarVenta.mock.calls;
    assertWithSchema(ventaExamenInsertSchema, insertarVentaBody);
    expect(insertarVentaBody).toEqual(
      expect.objectContaining({
        codigo: '',
        empresa: 'Teco',
        cliente: 1,
        paciente: 'Carlos Salazar',
        fecha: expect.any(String),
        autorizacion: '',
        guia: '',
        descuento: 0,
        flete: 0,
        subtotal: 99900,
        pagos: [
          {
            formaPago: 'efectivo',
            valor: 99900
          }
        ],
        unidades: [
          {
            lote: '',
            count: 1,
            producto: 1,
            precioVenta: 99900,
            fechaExp: expect.any(String)
          }
        ]
      })
    );
  });
});
