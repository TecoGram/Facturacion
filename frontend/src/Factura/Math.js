const limitTo2decimals = value => Math.round(value * 100) / 100;

const calcularRebaja = (subtotal, porcentajeDescuento) => {
  return limitTo2decimals((subtotal * porcentajeDescuento) / 100);
};

const calcularImpuestos = (subtotal, rebaja, porcentajeIVA) => {
  return limitTo2decimals(((subtotal - rebaja) * porcentajeIVA) / 100);
};
const calcularTotal = (subtotal, flete, impuestos, rebaja) => {
  return limitTo2decimals(subtotal + flete + impuestos - rebaja);
};

const calcularTotalVentaRow = ventaRow => {
  const {
    subtotal,
    flete,
    iva: porcentajeIVA,
    descuento: porcentajeDescuento
  } = ventaRow;
  const rebaja = calcularRebaja(subtotal, porcentajeDescuento);
  const impuestos = calcularImpuestos(subtotal, rebaja, porcentajeIVA);
  return calcularTotal(subtotal, flete, impuestos, rebaja);
};

const calcularSubtotal = facturables => {
  const subtotal = facturables.reduce((sub, facturable) => {
    const precioVenta = parseFloat(facturable.precioVenta);
    const count = parseInt(facturable.count, 10);
    return sub + precioVenta * count;
  }, 0);
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
    total
  });
};

const calcularValoresFacturables = (
  facturables,
  flete,
  porcentajeIVA,
  porcentajeDescuento
) => {
  const subtotal = calcularSubtotal(facturables);
  return calcularValoresTotales(
    subtotal,
    flete,
    porcentajeIVA,
    porcentajeDescuento
  );
};

module.exports = {
  calcularSubtotal,
  calcularTotalVentaRow,
  calcularValoresFacturables,
  calcularValoresTotales
};
