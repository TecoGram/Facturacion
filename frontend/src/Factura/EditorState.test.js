const Immutable = require('immutable');
const FacturaEditor = require('./EditorState.js');
const Models = require('./Models.js');
const getState = FacturaEditor.getDefaultState;

const crearProducto = () => {
  return {
    rowid: 1,
    codigo: 'AA',
    nombre: 'A',
    marca: 'TECO',
    precioDist: '0.99',
    precioVenta: '1.99',
    pagaIva: true
  };
};

describe('Factura Editor State', () => {
  describe('agregarProductoComoFacturable', () => {
    it('devuelve funcion que agrega un facturable a la lista inmutable del state', () => {
      const state = getState();
      const newProduct = crearProducto();
      const modificacion = FacturaEditor.agregarProductoComoFacturable(
        newProduct
      );
      expect(typeof modificacion).toEqual('function');
      const cambios = modificacion(state);
      expect(cambios.facturables.length).toEqual(1);
    });
  });

  describe('calcularValoresTotales', () => {
    let state;
    beforeEach(() => {
      state = getState();
      const newProduct = crearProducto();
      const modificacion = FacturaEditor.agregarProductoComoFacturable(
        newProduct
      );
      state.facturables = modificacion(state).facturables;
    });

    it('parsea los stings de flete y descuento y calcula los valores de la factura', () => {
      const {
        subtotal,
        rebaja,
        impuestos,
        total
      } = FacturaEditor.calcularValoresTotales(
        state.facturables,
        '0.25',
        14,
        '3'
      );

      expect(subtotal).toEqual(19900);
      expect(impuestos).toEqual(2702);
      expect(total).toEqual(24505);
    });

    it('asume cero flete si es un string vacio y cero descuento si es un string vacio', () => {
      const {
        subtotal,
        rebaja,
        impuestos,
        total
      } = FacturaEditor.calcularValoresTotales(state.facturables, '', 14, '');

      expect(subtotal).toEqual(19900);
      expect(rebaja).toEqual(0);
      expect(impuestos).toEqual(2786);
      expect(total).toEqual(22686);
    });
  });

  describe('editarFacturaExistente', () => {
    it('modifica el estado para editar una factura a partir de la respuesta de "verVenta"', () => {
      const state = getState();
      const verVentaResp = {
        body: {
          cliente: { rowid: 1 },
          facturaData: {
            codigo: '004356',
            fecha: '2017-03-02'
          },
          facturables: [
            {
              nombre: 'A',
              count: 2,
              fechaExp: '2018-03-02'
            }
          ]
        }
      };
      const modificacion = FacturaEditor.editarFacturaExistente(verVentaResp);
      expect(typeof modificacion).toEqual('function');

      const cambios = modificacion(state);
      expect(cambios.cliente).toEqual(verVentaResp.body.cliente);
      expect(cambios.facturaData).toEqual(expect.any(Object));
      expect(cambios.facturables).toEqual(expect.any(Array));
    });
  });

  describe('modificarValorEnFacturable', () => {
    let state;

    const assertModificacion = (propKey, newPropValue) => {
      const modificacion = FacturaEditor.modificarValorEnFacturable(
        0,
        propKey,
        newPropValue
      );
      expect(typeof modificacion).toEqual('function');
      const cambios = modificacion(state);
      expect(cambios.facturables[0][propKey]).toEqual(newPropValue);
    };

    beforeEach(() => {
      state = getState();
      const newProduct = crearProducto();
      const agregarMod = FacturaEditor.agregarProductoComoFacturable(
        newProduct
      );
      const cambios = agregarMod(state);
      state.facturables = cambios.facturables;
    });

    it('modifica lista de facturables si se le pasa un valor valido de count', () => {
      assertModificacion('count', '5');
    });

    it('retorna null si se le pasa un valor invalido de count', () => {
      const modificacion = FacturaEditor.modificarValorEnFacturable(
        0,
        'count',
        's'
      );
      expect(modificacion).toBeNull();
    });

    it('modifica lista de facturables si se le pasa un valor valido de precioVenta', () => {
      assertModificacion('precioVenta', '19.99');
    });

    it('retorna null si se le pasa un valor invalido de count', () => {
      const modificacion = FacturaEditor.modificarValorEnFacturable(
        0,
        'precioVenta',
        's'
      );
      expect(modificacion).toBeNull();
    });
  });

  describe('modificarValorEnFacturaData', () => {
    it('modifica facturaData si se le pasa un valor valido de descuento', () => {
      const state = getState();
      const modificacion = FacturaEditor.modificarValorEnFacturaData(
        'descuento',
        '50'
      );
      expect(typeof modificacion).toEqual('function');
      const cambios = modificacion(state);
      expect(cambios.facturaData.descuento).toEqual('50');
    });

    it('retorna null si se le pasa un valor invalido de descuento', () => {
      const modificacion = FacturaEditor.modificarValorEnFacturaData(
        'descuento',
        's'
      );
      expect(modificacion).toBeNull();
    });
  });

  describe('puedeGuardarFactura', () => {
    it('retorna true si tiene cliente y por lo menos 1 item facturable', () => {
      const state = getState();
      expect(FacturaEditor.puedeGuardarFactura(state, false)).toBe(false);
      state.clienteRow = { rowid: 1 };
      expect(FacturaEditor.puedeGuardarFactura(state, false)).toBe(false);
      state.facturables = Immutable.List.of(crearProducto());
      expect(FacturaEditor.puedeGuardarFactura(state, false)).toBe(true);
    });

    it('en facturas examen, retorna true si tiene cliente, medico y por lo menos 1 item facturable', () => {
      const state = getState();
      expect(FacturaEditor.puedeGuardarFactura(state, true)).toBe(false);
      state.clienteRow = { rowid: 1 };
      expect(FacturaEditor.puedeGuardarFactura(state, true)).toEqual(false);
      state.facturables = [crearProducto()];
      expect(FacturaEditor.puedeGuardarFactura(state, true)).toEqual(false);
      state.medicoRow = { rowid: 1 };
      expect(FacturaEditor.puedeGuardarFactura(state, true)).toEqual(true);
    });
  });

  describe('prepararFacturaParaGuardar', () => {
    let state;

    beforeEach(() => {
      state = getState();
      const newProduct = crearProducto();
      const modificacion = FacturaEditor.agregarProductoComoFacturable(
        newProduct
      );
      expect(typeof modificacion).toEqual('function');
      const cambios = modificacion(state);
      state.facturables = cambios.facturables;
      state.clienteRow = { rowid: 1 };
    });

    const testAnioInvalido = fechaExp => {
      const facturable = Models.productoAFacturable(crearProducto());
      facturable.fechaExp = fechaExp;
      state.facturaData.formaPago = 'EFECTIVO';
      state.facturables = [facturable];

      const {
        errors,
        ventaRow,
        prom,
        msg
      } = FacturaEditor.prepararFacturaParaGuardar({
        state,
        editar: false,
        empresa: 'emp',
        iva: 12
      });

      expect(ventaRow).toEqual(null);
      expect(prom).toEqual(null);
      expect(msg).toEqual(null);
      expect(errors).toEqual(expect.any(Object));
      expect(errors.unidades).toBeTruthy();
    };

    const testAnioValido = fechaExp => {
      const facturable = Models.productoAFacturable(crearProducto());
      facturable.fechaExp = fechaExp;
      state.facturaData.formaPago = 'efectivo';
      state.facturables = [facturable];
      const { errors } = FacturaEditor.prepararFacturaParaGuardar({
        state,
        editar: false,
        empresa: 'emp',
        iva: 12
      });

      expect(errors).toBe(null);
    };

    it('retorna unicamente errores si el anio de fecha exp es muy alto', () => {
      testAnioInvalido('20178-01-01');
    });

    it('retorna unicamente errors si el anio de fecha exp es muy bajo', () => {
      testAnioInvalido('2001-01-01');
    });

    it('no reporta errores de unidades si el anio de fecha exp esta en el rango adecuado', () => {
      testAnioValido('2016-02-21');
      testAnioValido('2026-03-10');
    });

    it('retorna unicamente errores si fracasa al validar factura', () => {
      const {
        errors,
        ventaRow,
        prom,
        msg
      } = FacturaEditor.prepararFacturaParaGuardar({
        state,
        editar: false,
        empresa: 'emp'
      });

      expect(ventaRow).toEqual(null);
      expect(prom).toEqual(null);
      expect(msg).toEqual(null);
      expect(errors).toEqual(
        expect.objectContaining({
          iva: expect.any(String)
        })
      );
    });

    it('retorna unicamente prom, msg y ventaRow si logra validar factura nueva', () => {
      const facturables = [
        {
          producto: 1,
          count: '2',
          lote: 'AA',
          fechaExp: '2018-03-02',
          precioVenta: '12.99'
        }
      ];

      state.facturaData = state.facturaData;
      state.facturaData.codigo = '00657';
      state.facturaData.formaPago = 'efectivo';
      state.facturaData.paciente = 'Paul Vaso';

      state.facturables = facturables;
      state.medicoRow = { rowid: 1 };

      const {
        errors,
        ventaRow,
        prom,
        msg
      } = FacturaEditor.prepararFacturaParaGuardar({
        state,
        editar: false,
        empresa: 'emp',
        isExamen: true,
        iva: 12
      });

      expect(errors).toBeNull();
      expect(prom.url.endsWith('/venta_ex/new')).toBe(true);
      expect(ventaRow.empresa).toEqual('emp');
      expect(ventaRow.detallado).toBe(false);
      expect(ventaRow.iva).toEqual(0);
      expect(msg).toEqual('La factura se generó exitosamente.');
    });

    it('retorna unicamente prom, msg y ventaRow si logra validar factura editada', () => {
      state.facturaData.codigo = '00657';
      state.facturaData.formaPago = 'efectivo';
      state.medicoRow = { rowid: 1 };

      const {
        errors,
        ventaRow,
        prom,
        msg
      } = FacturaEditor.prepararFacturaParaGuardar({
        state,
        editar: true,
        empresa: 'emp',
        isExamen: false,
        iva: 14
      });

      expect(errors).toBeNull();
      expect(prom.url.endsWith('/venta/update')).toBe(true);
      expect(ventaRow.empresa).toEqual('emp');
      expect(ventaRow.detallado).toBe(true);
      expect(ventaRow.iva).toEqual(14);

      expect(msg).toEqual('La factura se editó exitosamente.');
    });
  });
});
