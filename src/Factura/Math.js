const limitTo2decimals = value => Math.round(value * 100) / 100;

const calcularRebaja = (subtotal, porcentajeDescuento) => {
  return limitTo2decimals(subtotal * porcentajeDescuento / 100);
};

const calcularImpuestos = (subtotal, rebaja, porcentajeIVA) => {
  return limitTo2decimals((subtotal - rebaja) * porcentajeIVA / 100);
};
const calcularTotal = (subtotal, flete, impuestos, rebaja) => {
  return limitTo2decimals(subtotal + flete + impuestos - rebaja);
};

const calcularTotalVentaRow = ventaRow => {
  const {
    subtotal,
    flete,
    iva: porcentajeIVA,
    descuento: porcentajeDescuento,
  } = ventaRow;
  const rebaja = calcularRebaja(subtotal, porcentajeDescuento);
  const impuestos = calcularImpuestos(subtotal, rebaja, porcentajeIVA);
  return calcularTotal(subtotal, flete, impuestos, rebaja);
};

const calcularSubtotalImm = facturablesImm => {
  let subtotal = 0;
  const len = facturablesImm.size;
  for (let i = 0; i < len; i++) {
    const facturableImm = facturablesImm.get(i);
    const precioVenta = parseFloat(facturableImm.get('precioVenta'));
    const count = parseInt(facturableImm.get('count'), 10);
    const recargo = precioVenta * count;
    subtotal += recargo;
  }
  return limitTo2decimals(subtotal);
};

const calcularValoresTotales = (
  subtotal,
  flete,
  porcentajeIVA,
  porcentajeDescuento
) => {
  const rebaja = calcularRebaja(subtotal, porcentajeDescuento);
  const impuestos = calcularImpuestos(subtotal, rebaja, porcentajeIVA);
  const total = calcularTotal(subtotal, flete, impuestos, rebaja);

  return Object.freeze({
    subtotal,
    rebaja,
    flete,
    impuestos,
    total,
  });
};

const calcularValoresFacturablesImm = (
  facturablesImm,
  flete,
  porcentajeIVA,
  porcentajeDescuento
) => {
  const subtotal = calcularSubtotalImm(facturablesImm);
  return calcularValoresTotales(
    subtotal,
    flete,
    porcentajeIVA,
    porcentajeDescuento
  );
};

module.exports = {
  calcularSubtotalImm,
  calcularTotalVentaRow,
  calcularValoresFacturablesImm,
  calcularValoresTotales,
};
