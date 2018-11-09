const { calcularTotalVentaRow } = require('../../frontend/src/Factura/Math.js');
const { FormasDePago } = require('../../frontend/src/Factura/Models.js');

const parsearBooleanSQLite = bool => {
  if (typeof bool === 'boolean') return bool;
  if (typeof bool === 'number') return bool !== 0;
  throw Error('Unexpected type ' + typeof bool);
};

const stringifyNumerosEnUnidades = unidades =>
  unidades.map(unidad => ({
    ...unidad,
    count: '' + unidad.count,
    precioVenta: '' + unidad.precioVenta
  }));

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
    formaPago
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
    total: new Number(calcularTotalVentaRow(ventaRow)).toFixed(2)
  };
};

module.exports = {
  calcularTotalVentaRow,
  findVentas: ventas =>
    ventas.map(ventaRow => ({
      ...formatVentaRowIntoFacturaData(ventaRow),
      ruc: ventaRow.ruc,
      nombre: ventaRow.nombre,
      tipo: ventaRow.tipo
    })),

  verVenta: ventaQueryResp => {
    const { facturables } = ventaQueryResp.ventaRow;
    const facturablesFormateados = stringifyNumerosEnUnidades(facturables);

    return {
      cliente: Object.assign({}, ventaQueryResp.cliente),
      medico: ventaQueryResp.medico && { ...ventaQueryResp.medico },
      facturaData: formatVentaRowIntoFacturaData(ventaQueryResp.ventaRow),
      facturables: facturablesFormateados
    };
  }
};
