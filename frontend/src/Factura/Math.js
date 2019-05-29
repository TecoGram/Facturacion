const Money = require('./Money.js');

const calcularValoresItem = ({ count, precioVenta, iva, descuento }) => {
  const preImporte = count * precioVenta;
  const rebaja = Math.floor((preImporte * descuento) / 100);
  const importe = Math.floor(preImporte - rebaja);
  const impuesto = Math.floor((importe * iva) / 100);
  return { importe, impuesto, rebaja };
};

const calcularTotalVentaRow = ventaRow => {
  const { subtotal, flete, iva, descuento } = ventaRow;
  const rebaja = Math.floor((subtotal * descuento) / 100);
  const impuestos = Math.floor(((subtotal - rebaja) * iva) / 100);
  return subtotal + flete + impuestos - rebaja;
};

const calcularSubtotal = facturables => {
  const subtotal = facturables.reduce((sub, facturable) => {
    const precioVenta = Money.fromString(facturable.precioVenta);
    const count = parseInt(facturable.count, 10);
    return sub + precioVenta * count;
  }, 0);
  return Math.floor(subtotal);
};

const calcularValoresTotales = (subtotal, flete, iva, descuento) => {
  const rebaja = Math.floor((subtotal * descuento) / 100);
  const impuestos = Math.floor(((subtotal - rebaja) * iva) / 100);
  const total = subtotal + flete + impuestos - rebaja;

  return Object.freeze({
    subtotal,
    rebaja,
    flete,
    impuestos,
    total
  });
};

const calcularValoresFacturables = (facturables, flete, iva, descuento) => {
  const subtotal = calcularSubtotal(facturables);
  return calcularValoresTotales(subtotal, flete, iva, descuento);
};

const calcularImporteFacturable = facturable =>
  Money.print(facturable.precioVenta * facturable.count);

module.exports = {
  calcularImporteFacturable,
  calcularSubtotal,
  calcularTotalVentaRow,
  calcularValoresItem,
  calcularValoresFacturables,
  calcularValoresTotales
};
