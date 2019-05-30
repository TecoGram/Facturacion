/* eslint-env node, jest */
const DateParser = require('./DateParser.js');

describe('DateParser', () => {
  describe('toReadableDate', () => {
    it('convierte la fecha un Date object a String sin importar la zona horaria', () => {
      const dbDate = '2016-12-25';
      const parsedDate = DateParser.parseDBDate(dbDate);
      const result = DateParser.toReadableDate(parsedDate);
      expect(result).toEqual(dbDate);
    });
  });

  describe('verVenta', () => {
    it(
      'Recibe el resultado del query que busca la informacion de una venta y' +
        ' retorna un nuevo objeto con la fecha de la venta convertida a objeto Date',
      () => {
        const queryResp = {
          cliente: {
            ruc: '0937816882001',
            nombre: 'Dr. Julio Mendoza',
            email: 'julio_mendoza@yahoo.com.ec',
            direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
            telefono1: '2645422',
            telefono2: '2876357',
          },
          facturaData: {
            codigo: 9999999,
            fecha: '2017-01-06',
            autorizacion: '',
            descuento: 0,
            formaPago: 'CONTADO',
          },
          facturables: [
            {
              nombre: 'TGO 8x50',
              count: 1,
              precioVenta: 11,
              lote: 'ert3',
              fechaExp: '2017-04-04',
            },
          ],
        };

        const desiredResp = {
          cliente: {
            ruc: '0937816882001',
            nombre: 'Dr. Julio Mendoza',
            email: 'julio_mendoza@yahoo.com.ec',
            direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
            telefono1: '2645422',
            telefono2: '2876357',
          },
          medico: undefined,
          facturaData: {
            codigo: 9999999,
            fecha: new Date('2017/01/06'),
            autorizacion: '',
            descuento: 0,
            formaPago: 'CONTADO',
          },
          facturables: [
            {
              nombre: 'TGO 8x50',
              count: 1,
              precioVenta: 11,
              lote: 'ert3',
              fechaExp: '2017-04-04',
            },
          ],
        };
        const formattedResp = DateParser.verVenta(queryResp);
        expect(formattedResp).toEqual(desiredResp);

        const fechaVenta = formattedResp.facturaData.fecha;
        expect(fechaVenta.toString()).toContain('Jan 06 2017');

        const readableDate = DateParser.toReadableDate(fechaVenta);
        expect(readableDate).toEqual('2017-01-06');

        const p1FechaExp = formattedResp.facturables[0].fechaExp;
        expect(p1FechaExp).toEqual('2017-04-04');
      }
    );

    it('En ventas examen tambien coloca el objeto medico de la misma forma que con cliente', () => {
      const queryResp = {
        cliente: {
          ruc: '0937816882001',
          nombre: 'Carlos Sanchez',
          email: 'julio_mendoza@yahoo.com.ec',
          direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
          telefono1: '2645422',
          telefono2: '2876357',
        },
        medico: {
          nombre: 'Noguchi',
        },
        facturaData: {
          codigo: 9999999,
          fecha: '2017-01-06',
          autorizacion: '',
          descuento: 0,
          formaPago: 'CONTADO',
          paciente: 'Carlos Sanchez',
        },
        facturables: [
          {
            nombre: 'Examenes Especiales',
            count: 1,
            precioVenta: 11,
            lote: 'ert3',
            fechaExp: '2017-04-04',
          },
        ],
      };

      const desiredResp = {
        cliente: {
          ruc: '0937816882001',
          nombre: 'Carlos Sanchez',
          email: 'julio_mendoza@yahoo.com.ec',
          direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
          telefono1: '2645422',
          telefono2: '2876357',
        },
        medico: {
          nombre: 'Noguchi',
        },
        facturaData: {
          codigo: 9999999,
          fecha: new Date('2017/01/06'),
          autorizacion: '',
          descuento: 0,
          formaPago: 'CONTADO',
          paciente: 'Carlos Sanchez',
        },
        facturables: [
          {
            nombre: 'Examenes Especiales',
            count: 1,
            precioVenta: 11,
            lote: 'ert3',
            fechaExp: '2017-04-04',
          },
        ],
      };
      const formattedResp = DateParser.verVenta(queryResp);
      expect(formattedResp).toEqual(desiredResp);
    });
  });
});
