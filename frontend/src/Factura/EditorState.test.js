const Immutable = require('immutable')
const FacturaEditor = require('./EditorState.js');
const Models = require('./Models.js');
const getState = FacturaEditor.getDefaultState;

const crearProducto = () => {
  return {
    rowid: 0,
    codigo: 'AA',
    nombre: 'A',
    marca: 'TECO',
    precioDist: 0.99,
    precioVenta: 1.99,
    pagaIva: true,
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
      expect(cambios.facturables.size).toEqual(1);
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
        total,
      } = FacturaEditor.calcularValoresTotales(
        state.facturables,
        '0.25',
        14,
        '3'
      );

      expect(subtotal).toEqual(1.99);
      //rebaja.should.be.closeTo(0.0597, 0.001);
      expect(impuestos).toEqual(0.27);
      expect(total).toEqual(2.45);
    });

    it('asume cero flete si es un string vacio y cero descuento si es un string vacio', () => {
      const {
        subtotal,
        rebaja,
        impuestos,
        total,
      } = FacturaEditor.calcularValoresTotales(state.facturables, '', 14, '');

      expect(subtotal).toEqual(1.99);
      expect(rebaja).toEqual(0);
      expect(impuestos).toEqual(0.28);
      expect(total).toEqual(2.27);
    });
  });

  describe('editarFacturaExistente', () => {
    it('modifica el estado para editar una factura a partir de la respuesta de "verVenta"', () => {
      const state = getState();
      const verVentaResp = {
        body: {
          cliente: '0956658756',
          facturaData: {
            codigo: '004356',
            fecha: '2017-03-02',
          },
          facturables: [
            {
              nombre: 'A',
              count: 2,
              fechaExp: '2018-03-02',
            },
          ],
        },
      };
      const modificacion = FacturaEditor.editarFacturaExistente(verVentaResp);
      expect(typeof modificacion).toEqual('function');

      const cambios = modificacion(state);
      expect(cambios.cliente).toEqual(verVentaResp.body.cliente);
      expect(cambios.facturaData).toEqual(expect.any(Immutable.Map));
      expect(cambios.facturables).toEqual(expect.any(Immutable.List));
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
      expect(cambios.facturables.get(0).get(propKey)).toEqual(newPropValue);
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
      expect(cambios.facturaData.get('descuento')).toEqual('50');
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
      state.cliente = { ruc: '0956676546' };
      expect(FacturaEditor.puedeGuardarFactura(state, false)).toBe(false);
      state.facturables = Immutable.List.of(crearProducto());
      expect(FacturaEditor.puedeGuardarFactura(state, false)).toBe(true);
    });

    it('en facturas examen, retorna true si tiene cliente, medico y por lo menos 1 item facturable', () => {
      const state = getState();
      expect(FacturaEditor.puedeGuardarFactura(state, true)).toBe(false);
      state.cliente = { ruc: '0956676546' };
      expect(FacturaEditor.puedeGuardarFactura(state, true)).toEqual(false);
      state.facturables = Immutable.List.of(crearProducto());
      expect(FacturaEditor.puedeGuardarFactura(state, true)).toEqual(false);
      state.medico = { nombre: 'Noguchi' };
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
      state.cliente = { ruc: '0956676546' };
    });

    const testAnioInvalido = fechaExp => {
      const facturable = Models.productoAFacturable(crearProducto());
      facturable.fechaExp = fechaExp;
      state.facturables = state.facturables.push(Immutable.Map(facturable));
      const {
        errors,
        ventaRow,
        prom,
        msg,
      } = FacturaEditor.prepararFacturaParaGuardar(state, false, 'emp');

      expect(ventaRow).toEqual(null);
      expect(prom).toEqual(null);
      expect(msg).toEqual(null);
      expect(errors).toEqual(expect.any(Object));
      expect(errors.unidades).toBeTruthy();
    };

    const testAnioValido = fechaExp => {
      const facturable = Models.productoAFacturable(crearProducto());
      facturable.fechaExp = fechaExp;
      state.facturables = state.facturables.push(Immutable.Map(facturable));
      const { errors } = FacturaEditor.prepararFacturaParaGuardar(
        state,
        false,
        'emp'
      );

      expect(errors).toEqual(expect.any(Object));
      expect(errors.unidades).toBeUndefined();
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
        msg,
      } = FacturaEditor.prepararFacturaParaGuardar(state, false, 'emp');

      expect(ventaRow).toEqual(null);
      expect(prom).toEqual(null);
      expect(msg).toEqual(null);
      expect(errors).toEqual(expect.any(Object));
      expect(errors.formaPago).toBeTruthy();
      expect(errors.codigo).toBeTruthy();
    });

    it('retorna unicamente prom, msg y ventaRow si logra validar factura nueva', () => {
      const facturables = Immutable.List.of(
        Immutable.Map({
          producto: 1,
          count: '2',
          lote: 'AA',
          fechaExp: '2018-03-02',
          precioVenta: '12.99',
        })
      );

      state.facturaData = state.facturaData
        .set('codigo', '00657')
        .set('formaPago', 'EFECTIVO')
        .set('paciente', 'Paul Vaso');
      state.facturables = facturables;
      state.medico = { nombre: 'John Smith' };

      const {
        errors,
        ventaRow,
        prom,
        msg,
      } = FacturaEditor.prepararFacturaParaGuardar(
        state,
        false,
        'emp',
        true,
        14
      );

      expect(errors).toBeNull();
      expect(prom.url.endsWith('/venta_ex/new')).toBe(true);
      expect(ventaRow.empresa).toEqual('emp');
      expect(ventaRow.detallado).toBe(false);
      expect(ventaRow.iva).toEqual(0);
      expect(msg).toEqual('La factura se generó exitosamente.');
    });

    it('retorna unicamente prom, msg y ventaRow si logra validar factura editada', () => {
      state.facturaData = state.facturaData
        .set('codigo', '00657')
        .set('formaPago', 'EFECTIVO');

      const {
        errors,
        ventaRow,
        prom,
        msg,
      } = FacturaEditor.prepararFacturaParaGuardar(
        state,
        true,
        'emp',
        false,
        14
      );

      expect(errors).toBeNull();
      expect(prom.url.endsWith('/venta/update')).toBe(true);
      expect(ventaRow.empresa).toEqual('emp');
      expect(ventaRow.detallado).toBe(true);
      expect(ventaRow.iva).toEqual(14);

      expect(msg).toEqual('La factura se editó exitosamente.');
    });
  });
});
