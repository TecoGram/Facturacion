const { calcularTotalVentaRow } = require('facturacion_common/src/Math.js');

const parsearBooleanSQLite = bool => {
  if (typeof bool === 'boolean') return bool;
  if (typeof bool === 'number') return bool !== 0;
  throw Error('Unexpected type ' + typeof bool);
};

const formatVentaRowIntoFacturaData = ventaRow => {
  const {
    rowid,
    codigo,
    empresa,
    fecha,
    flete,
    descuento,
    detallado,
    autorizacion,
    paciente,
    medico,
    subtotal
  } = ventaRow;

  return {
    rowid,
    codigo,
    empresa,
    paciente,
    medico,
    detallado: parsearBooleanSQLite(detallado), //examenes no tienen detallado
    fecha: fecha,
    descuento,
    subtotal,
    autorizacion,
    flete: flete,
    total: calcularTotalVentaRow(ventaRow)
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
    }))
};
