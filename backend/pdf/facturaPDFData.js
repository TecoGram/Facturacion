const { calcularValoresTotales } = require('../../src/Factura/Math.js');
const { FormasDePago } = require('../../src/Factura/Models.js');

const crearOpciondePagoConTotalPagado = (formaPagoIndex, total) => {
  return (opcion, index) => {
    const nuevaOpcion = [opcion, null];
    if (formaPagoIndex === index) nuevaOpcion[1] = Number(total).toFixed(2);
    return nuevaOpcion;
  };
};

const generarDetalleOpcionesDePago = (formaPago, total) => {
  const func = crearOpciondePagoConTotalPagado(formaPago, total);
  return FormasDePago.map(func);
};

const crearMatrizValoresTotales = (
  subtotal,
  flete,
  porcentajeIVA,
  descuento,
  impuestos,
  rebaja,
  total
) => {
  const matrix = [];
  matrix.push(['Sub-Total', '$', Number(subtotal).toFixed(2)]);
  matrix.push(['Descuento', `${descuento}%`, Number(rebaja).toFixed(2)]);
  if (porcentajeIVA === 0) matrix.push(['IVA', '0%', '0.00']);
  else matrix.push(['IVA', '%', '']);
  matrix.push(['Flete', '$', Number(flete).toFixed(2)]);
  if (porcentajeIVA > 0)
    matrix.push(['IVA', `${porcentajeIVA}%`, Number(impuestos).toFixed(2)]);
  else matrix.push(['IVA', '%', '']);
  matrix.push(['Total US', '$', Number(total).toFixed(2)]);
  return matrix;
};

const fromVentaRow = ventaRow => {
  const facturaPDFData = Object.assign({}, ventaRow);
  const { subtotal, iva, descuento, flete, formaPago } = facturaPDFData;
  const { rebaja, impuestos, total } = calcularValoresTotales(
    subtotal,
    flete,
    iva,
    descuento
  );

  facturaPDFData.total = total;
  facturaPDFData.formasDePago = generarDetalleOpcionesDePago(formaPago, total);
  facturaPDFData.matrizValoresTotales = crearMatrizValoresTotales(
    subtotal,
    flete,
    iva,
    descuento,
    impuestos,
    rebaja,
    total
  );

  return facturaPDFData;
};

module.exports = {
  crearMatrizValoresTotales,
  fromVentaRow,
};
