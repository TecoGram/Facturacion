const { calcularTotalVentaRow } = require('../src/Factura/Math.js');
const { FormasDePago } = require('../src/Factura/Models.js');

const parsearBooleanSQLite = bool => {
  if (typeof bool === 'boolean') return bool;
  if (typeof bool === 'number') return bool !== 0;
  throw Error('Unexpected type ' + typeof bool);
};

const stringifyNumerosEnUnidades = unidades => {
  const _unidades = unidades.slice();
  for (let i = 0; i < _unidades.length; i++) {
    const unidad = _unidades[i];
    unidad.count = '' + unidad.count;
    unidad.precioVenta = '' + unidad.precioVenta;
  }
  return _unidades;
};
const formatVentaRowIntoFacturaData = ventaRow => {
  const {
    codigo,
    empresa,
    fecha,
    flete,
    descuento,
    detallado,
    autorizacion,
    paciente,
    medico,
    subtotal,
    formaPago,
  } = ventaRow;

  return {
    codigo: codigo,
    empresa: empresa,
    paciente: paciente,
    medico: medico,
    detallado: parsearBooleanSQLite(detallado), //examenes no tienen detallado
    fecha: fecha,
    descuento: '' + descuento,
    subtotal: subtotal,
    autorizacion: autorizacion,
    flete: '' + flete,
    formaPago: FormasDePago[formaPago],
    total: new Number(calcularTotalVentaRow(ventaRow)).toFixed(2),
  };
};

module.exports = {
  calcularTotalVentaRow,
  findVentas: ventas => {
    if (ventas.length > 0) {
      const newVentas = [];
      let i;
      for (i = 0; i < ventas.length; i++) {
        const ventaRow = ventas[i];
        const facturaData = formatVentaRowIntoFacturaData(ventaRow);
        facturaData.ruc = ventaRow.ruc;
        facturaData.nombre = ventaRow.nombre;
        facturaData.tipo = ventaRow.tipo;
        newVentas.push(facturaData);
      }
      return newVentas;
    }
    return ventas;
  },

  verVenta: ventaQueryResp => {
    const { facturables } = ventaQueryResp.ventaRow;

    let medicoObj;
    if (ventaQueryResp.medico)
      medicoObj = Object.assign({}, ventaQueryResp.medico);

    const facturablesFormateados = stringifyNumerosEnUnidades(facturables);
    return {
      cliente: Object.assign({}, ventaQueryResp.cliente),
      medico: medicoObj,
      facturaData: formatVentaRowIntoFacturaData(ventaQueryResp.ventaRow),
      facturables: facturablesFormateados,
    };
  },
};
