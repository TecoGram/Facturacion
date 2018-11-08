const Validacion = require('./Validacion.js');

describe('Validacion', () => {
  describe('validarCliente', () => {
    it('retorna unicamente "inputs" si el cliente es correcto', () => {
      const cliente = {
        ruc: '0954678865001',
        nombre: 'Gustavo Quinteros',
        telefono1: '566543',
        direccion: 'calle 34',
      };

      const { errors, inputs } = Validacion.validarCliente(cliente);

      expect(errors).toBeNull();
      expect(inputs.ruc).toEqual(expect.any(String));
      expect(inputs.nombre).toEqual(expect.any(String));
      expect(inputs.telefono1).toEqual(expect.any(String));
      expect(inputs.telefono2).toEqual(expect.any(String));
      expect(inputs.direccion).toEqual(expect.any(String));
      expect(inputs.email).toEqual(expect.any(String));
      expect(inputs.descDefault).toEqual(expect.any(String));
    });
  });

  describe('validarMedico', () => {
    it('retorna unicamente "inputs" si el medico es correcto', () => {
      const cliente = {
        nombre: 'Gustavo Quinteros',
        telefono1: '566543',
        direccion: 'calle 34',
        comision: '10',
      };

      const { errors, inputs } = Validacion.validarMedico(cliente);

      expect(errors).toBeNull();
      expect(inputs.nombre).toEqual(expect.any(String));
      expect(inputs.telefono1).toEqual(expect.any(String));
      expect(inputs.telefono2).toEqual(expect.any(String));
      expect(inputs.direccion).toEqual(expect.any(String));
      expect(inputs.email).toEqual(expect.any(String));
      expect(inputs.comision).toEqual(expect.any(String));
    });
  });

  describe('validarProducto', () => {
    it('retorna unicamente "inputs" si el producto es correcto', () => {
      const producto = {
        nombre: 'Producto A',
        marca: 'TECO',
        codigo: 'AD-434',
        precioVenta: '12.99',
        precioFab: '5.99',
        pagaIva: true,
      };

      const { errors, inputs } = Validacion.validarProducto(producto);

      expect(errors).toBeNull();
      expect(inputs.nombre).toEqual(expect.any(String));
      expect(inputs.codigo).toEqual(expect.any(String));
      expect(inputs.marca).toEqual(expect.any(String));
      expect(inputs.precioVenta).toEqual(expect.any(String));
      expect(inputs.precioDist).toEqual(expect.any(String));
      expect(inputs.pagaIva).toEqual(expect.any(Boolean));
    });

    it('no altera el valor de "pagaIva"', () => {
      const producto1 = {
        nombre: 'Producto A',
        codigo: 'AD-434',
        precioVenta: '12.99',
        precioFab: '5.99',
        pagaIva: true,
      };
      const res1 = Validacion.validarProducto(producto1);
      expect(res1.inputs.pagaIva).toBe(true);

      const producto2 = {
        nombre: 'Producto B',
        codigo: 'AD-434',
        precioVenta: '12.99',
        precioFab: '5.99',
        pagaIva: false,
      };
      const res2 = Validacion.validarProducto(producto2);
      expect(res2.inputs.pagaIva).toBe(false);
    });
  });

  describe('validarBusqueda', () => {
    it('retorna null los parametros son incorrectos', () => {
      let errors = Validacion.validarBusqueda('ar', 'e4');
      expect(errors).not.toBeNull();
      errors = Validacion.validarBusqueda(5, 4);
      expect(errors).not.toBeNull();
      errors = Validacion.validarBusqueda('ar', '4');
      expect(errors).toBeNull();
    });
  });

  describe('validarUnidad', () => {
    it('permite fechas de expiracion mayores al año 2020', () => {
      const unidad = {
        producto: 23,
        fechaExp: '2020-01-01',
        lote: 'AD-434',
        count: '1',
        precioVenta: '12.99',
      };

      const error = Validacion.validarUnidad(unidad);

      expect(error).toBeUndefined();
    });
    it('NO permite fechas de expiracion mayores al año 2029', () => {
      const unidad = {
        producto: 23,
        fechaExp: '2030-01-01',
        lote: 'AD-434',
        count: '1',
        precioVenta: '12.99',
      };

      const error = Validacion.validarUnidad(unidad);

      expect(error).toEqual(expect.any(String));
    });
  });
});
