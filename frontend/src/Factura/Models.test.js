/* eslint-env node, jest */
const Immutable = require('immutable');

const FacturacionModels = require('./Models.js');
const FacturacionMath = require('./Math.js');
const DateParser = require('../DateParser.js');

describe('Facturacion Models', () => {
  describe('crearVentaRow', () => {
    const clienteObj = {
      ruc: '09455867443001',
    };
    const medicoObj = {
      nombre: 'John Smith',
    };

    const facturaData = Immutable.Map({
      codigo: '0003235',
      descuento: '10',
      autorizacion: '5962',
      formaPago: 'CONTADO',
      detallado: true,
      flete: '',
      fecha: new Date(2016, 10, 26),
    });

    const facturables = Immutable.List.of(
      Immutable.Map({
        producto: 1,
        lote: 'asd3',
        fechaExp: DateParser.parseDBDate('2017-02-02'), //Fecha como la pone la DB
        count: 1,
        precioVenta: 10,
        pagaIva: true,
      }),
      Immutable.Map({
        producto: 2,
        lote: 'asd5',
        fechaExp: DateParser.oneYearFromToday(), //fecha como la pone FacturarView por default
        count: 2,
        precioVenta: 20,
        pagaIva: true,
      })
    );
    const unidades = [
      {
        producto: 1,
        lote: 'asd3',
        fechaExp: DateParser.parseDBDate('2017-02-02'), //Fecha como la pone la DB
        count: 1,
        precioVenta: 10,
        pagaIva: true,
      },
      {
        producto: 2,
        lote: 'asd5',
        fechaExp: DateParser.oneYearFromToday(), //fecha como la pone FacturarView por default
        count: 2,
        precioVenta: 20,
        pagaIva: true,
      },
    ];

    const empresa = 'TecoGram';

    it('Genera la fila de una venta a partir de un mapa inmutable', () => {
      const ventaRow = FacturacionModels.crearVentaRow(
        clienteObj,
        medicoObj,
        facturaData,
        facturables,
        unidades,
        empresa,
        false,
        14
      );

      
      expect(ventaRow.cliente).toEqual('09455867443001');
      expect(ventaRow.codigo).toEqual('0003235');
      expect(ventaRow.subtotal).toEqual(50);
      expect(ventaRow.descuento).toEqual('10');
      expect(ventaRow.empresa).toEqual(empresa);
      expect(ventaRow.iva).toEqual(14);
      expect(ventaRow.autorizacion).toEqual('5962');
      expect(ventaRow.flete).toEqual('');
      expect(ventaRow.detallado).toBe(true);
      expect(ventaRow.formaPago).toEqual('CONTADO');
      expect(ventaRow.fecha).toEqual('2016-11-26');

      const venta_unidades = ventaRow.unidades;
      expect(venta_unidades).toHaveLength(unidades.length);

      const primerItem = venta_unidades[0];
      expect(primerItem.producto).toEqual(1);
      expect(primerItem.lote).toEqual('asd3');
      expect(primerItem.fechaExp).toEqual(unidades[0].fechaExp);
      expect(primerItem.precioVenta).toEqual(10);
      expect(primerItem.count).toEqual(1);

      const segundoItem = venta_unidades[1];
      expect(segundoItem.producto).toEqual(2);
      expect(segundoItem.lote).toEqual('asd5');
      expect(segundoItem.fechaExp).toEqual(unidades[1].fechaExp);
      expect(segundoItem.precioVenta).toEqual(20);
      expect(segundoItem.count).toEqual(2);
    });

    it('Genera la fila de una venta con cero iva y detallado = false si es examen', () => {
      const ventaRow = FacturacionModels.crearVentaRow(
        clienteObj,
        medicoObj,
        facturaData,
        facturables,
        unidades,
        empresa,
        true,
        14
      );
      expect(ventaRow.detallado).toBe(false);
      expect(ventaRow.iva).toEqual(0);
    });
  });

  describe('crearUnidadesRows', () => {
    it(
      'Expande la lista de productos facturados para generar ' +
        'filas de unidades vendidas',
      () => {
        const productos = Immutable.List.of(
          Immutable.Map({
            rowid: 1,
            count: 3,
            lote: '3456f',
            fechaExp: '2017-11-26',
          }),
          Immutable.Map({
            rowid: 4,
            count: 2,
            lote: '3tf6f',
            fechaExp: '2017-11-26',
          })
        );

        const rows = FacturacionModels.crearUnidadesRows(productos);
        expect(rows.length).toEqual(5);
        rows.forEach((row, i) => {
          expect(row.producto).toBe(i < 3 ? 1 : 4);
          expect(row.lote).toBeTruthy();
          expect(row.fechaExp).toBeTruthy();
        });
      }
    );
  });

  describe('calcularValores', () => {
    it('agrega los precio de venta multiplicado por la cantidad para calcular rubros de factura', () => {
      const productos = Immutable.List.of(
        Immutable.Map({
          rowid: 1,
          count: 3,
          precioVenta: '25.99',
          pagaIva: true,
        }),
        Immutable.Map({
          rowid: 4,
          count: 2,
          precioVenta: '17.99',
          pagaIva: true,
        })
      );

      const {
        subtotal,
        rebaja,
        impuestos,
        total,
      } = FacturacionMath.calcularValoresFacturablesImm(
        productos,
        2.99,
        14,
        10
      );

      expect(subtotal).toEqual(113.95);
      expect(rebaja).toEqual(11.4);
      expect(impuestos).toEqual(14.36);
      expect(total).toEqual(119.9);
    });
  });

  describe('productoAFacturable', () => {
    it('convierte una fila de producto a un objeto facturable con valores por defecto', () => {
      const producto = {
        rowid: 14,
        nombre: 'Acido Urico',
        nombreAscii: 'acido urico',
        pagaIva: true,
        precioDist: 19.99,
        precioVenta: 29.99,
        codigo: 'asdf',
      };

      const facturable = FacturacionModels.productoAFacturable(producto);

      expect(facturable).toHaveProperty('producto', producto.rowid);
      expect(facturable).not.toHaveProperty('rowid');
      expect(facturable).not.toHaveProperty('precioDist');
      expect(facturable).not.toHaveProperty('nombreAscii');
      expect(facturable).toHaveProperty('codigo');
      expect(facturable).toHaveProperty('nombre');
      expect(facturable).toHaveProperty('precioVenta', '' + producto.precioVenta);
      expect(facturable).toHaveProperty('fechaExp');
      expect(facturable).toHaveProperty('count', '1');
      expect(facturable).toHaveProperty('lote', '');
    });
  });

  describe('facturable', () => {
    it('convierte un objeto facturable a una fila de unidad con valores por defecto', () => {
      const facturable = {
        producto: 1,
        nombre: 'Acido Urico',
        pagaIva: true,
        precioVenta: 29.99,
        codigo: 'asdf',
        fechaExp: new Date(),
        count: 1,
        lote: '',
      };

      const unidad = FacturacionModels.facturableAUnidad(facturable);

      expect(unidad).toHaveProperty('producto');
      expect(unidad).not.toHaveProperty('pagaIva');
      expect(unidad).not.toHaveProperty('codigo');
      expect(unidad).not.toHaveProperty('nombre');
      expect(unidad).toHaveProperty('precioVenta', facturable.precioVenta);
      expect(unidad).toHaveProperty('fechaExp');
      expect(unidad).toHaveProperty('count', 1);
      expect(unidad).toHaveProperty('lote', '');
    });
  });
});
