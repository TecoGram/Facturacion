jest.mock('facturacion_common/src/api.js', () => {
  return {
    insertarVenta: jest.fn()
  };
});
import * as Actions from './EditorActions.js';
import { createReducer } from './EditorReducers.js';
const API = require('facturacion_common/src/api.js');
const Money = require('facturacion_common/src/Money.js');
const {
  validateFormWithSchema,
  ventaInsertSchema
} = require('facturacion_common/src/Validacion.js');
import { assertWithSchema, runActions } from '../TestingUtils.js';

describe('EditorReducers', () => {
  it('crea una factura de productos correctamente', async () => {
    API.insertarVenta.mockReturnValueOnce(
      Promise.resolve({ status: 200, body: { rowid: 5 } })
    );

    const config = {
      iva: 12,
      isExamen: false,
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
        type: Actions.agregarPago,
        formaPago: 'efectivo',
        valor: 128128
      },
      {
        type: Actions.updatePagos,
        pagos: [
          {
            key: 0,
            formaPagoText: 'EFECTIVO',
            formaPago: 'efectivo',
            valor: 128128
          }
        ]
      },
      {
        type: Actions.guardarFactura,
        config,
        subtotal: 128128,
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
        guardando: false,
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
        descuento: 0,
        flete: 0,
        iva: 12,
        subtotal: 128128,
        pagos: [
          {
            formaPago: 'efectivo',
            valor: 128128
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
});
