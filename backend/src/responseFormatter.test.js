const formatter = require('./responseFormatter.js');

describe('responseFormatter', () => {
  describe('formatFindVentas', () => {
    it("Recibe un array de objetos con campo 'subtotal' y formatea este campo para mostrar dolares con 2 numeros decimales.", () => {
      const arr = [
        { subtotal: 233459, iva: 12, descuento: 0, flete: 0, detallado: 0 },
        {
          subtotal: 125612,
          iva: 12,
          descuento: 0,
          flete: 0,
          detallado: false
        },
        { subtotal: 6579998, iva: 12, descuento: 0, flete: 0, detallado: 1 }
      ];
      const formatted = formatter.findVentas(arr);

      expect(formatted).toEqual(expect.any(Array));
      expect(formatted).not.toEqual(arr);

      expect(formatted[0].total).toEqual('26.15');
      expect(formatted[1].total).toEqual('14.07');
      expect(formatted[2].total).toEqual('736.96');
    });

    it('Si recibe un array vacio, devuelve lo mismo', () => {
      const arr = [];
      const formatted = formatter.findVentas(arr);
      expect(formatted).toEqual(arr);
    });
  });

  describe('verVenta', () => {
    const queryResp = {
      ventaRow: {
        codigo: 9999999,
        empresa: 'NAMCO',
        cliente: '0937816882001',
        fecha: '2016-11-26',
        autorizacion: '',
        formaPago: 'efectivo',
        subtotal: 199900,
        detallado: 1,
        descuento: 0,
        iva: 2,
        flete: 0,
        facturables: [
          {
            nombre: 'TGO 8x50',
            count: 1,
            precioVenta: 110000,
            lote: 'ert3',
            fechaExp: '2017-04-04'
          }
        ]
      },
      cliente: {
        ruc: '0937816882001',
        nombre: 'Dr. Julio Mendoza',
        email: 'julio_mendoza@yahoo.com.ec',
        direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
        telefono1: '2645422',
        telefono2: '2876357'
      }
    };

    const desiredResp = {
      facturaData: {
        codigo: 9999999,
        empresa: 'NAMCO',
        fecha: '2016-11-26',
        autorizacion: '',
        descuento: '0',
        detallado: true,
        flete: '0.00',
        formaPago: 'EFECTIVO',
        subtotal: '19.99',
        total: '20.39',
        medico: undefined,
        paciente: undefined
      },
      cliente: {
        ruc: '0937816882001',
        nombre: 'Dr. Julio Mendoza',
        email: 'julio_mendoza@yahoo.com.ec',
        direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
        telefono1: '2645422',
        telefono2: '2876357'
      },
      medico: undefined,
      facturables: [
        {
          nombre: 'TGO 8x50',
          count: '1',
          precioVenta: '11.00',
          lote: 'ert3',
          fechaExp: '2017-04-04'
        }
      ]
    };

    it(
      'Recibe el resultado del query que busca la informacion de una venta y' +
        ' retorna un objeto de la forma del state de FacturaEditor',
      () => {
        const formattedResp = formatter.verVenta(queryResp);
        expect(formattedResp).toEqual(desiredResp);
      }
    );

    it('devuelve nombres de paciente y medico cuando se trata de una factura examen', () => {
      const examenQueryResp = Object.assign({}, queryResp);
      examenQueryResp.ventaRow = Object.assign({}, queryResp.ventaRow);
      const medico1 = 'Dr. Benavides';
      const paciente1 = 'Edgar Bazurto';
      examenQueryResp.medico = { nombre: medico1 };
      examenQueryResp.ventaRow.paciente = paciente1;

      const examenDesiredResp = Object.assign({}, desiredResp);
      examenDesiredResp.facturaData = Object.assign(
        {},
        examenDesiredResp.facturaData
      );
      examenDesiredResp.medico = { nombre: medico1 };
      examenDesiredResp.facturaData.paciente = paciente1;

      const formattedResp = formatter.verVenta(examenQueryResp);
      expect(formattedResp).toEqual(examenDesiredResp);
    });
  });
});
