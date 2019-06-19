const { calcularTotalVentaRow } = require('facturacion_common/src/Math.js');
const { FormasDePago } = require('facturacion_common/src/Models.js');
const Money = require('facturacion_common/src/Money.js');

const parsearBooleanSQLite = bool => {
  if (typeof bool === 'boolean') return bool;
  if (typeof bool === 'number') return bool !== 0;
  throw Error('Unexpected type ' + typeof bool);
};

const stringifyNumerosEnUnidades = unidades =>
  unidades.map(unidad => ({
    ...unidad,
    count: '' + unidad.count,
    precioVenta: Money.print(unidad.precioVenta)
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
    subtotal: Money.print(subtotal),
    autorizacion: autorizacion,
    flete: Money.print(flete),
    formaPago: FormasDePago[formaPago],
    total: Money.print(calcularTotalVentaRow(ventaRow))
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
