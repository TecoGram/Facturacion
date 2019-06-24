const { calcularValoresTotales } = require('facturacion_common/src/Math.js');
const Money = require('facturacion_common/src/Money.js');

const generarDetalleOpcionesDePago = pagos => {
  const tarjetaOptions = [
    'tarjeta_legacy',
    'tarjeta_debito',
    'tarjeta_credito'
  ];

  const efectivoPayment = pagos.find(i => i.formaPago === 'efectivo') || {
    valor: null
  };
  const dineroElecPayment = pagos.find(
    i => i.formaPago === 'dinero_electronico_ec'
  ) || { valor: null };
  const tarjetaPayment = pagos
    .filter(i => tarjetaOptions.includes(i.formaPago))
    .reduce(
      (acc, i) => ({
        valor: acc.valor != null ? acc.valor + i.valor : i.valor
      }),
      { valor: null }
    );

  const transferPayment = pagos.find(i => i.formaPago === 'transferencia') || {
    valor: null
  };
  const otrosPayment = pagos.find(i => i.formaPago === 'otros') || {
    valor: null
  };

  return [
    ['EFECTIVO', efectivoPayment.valor],
    ['DINERO ELECTRÓNICO', dineroElecPayment.valor],
    ['TARJETA DE CRÉDITO/DÉBITO', tarjetaPayment.valor],
    ['TRANSFERENCIA', transferPayment.valor],
    ['OTRO', otrosPayment.valor]
  ];
};

const crearMatrizValoresTotales = ({ subtotal, flete, iva, descuento }) => {
  const { rebaja, impuestos, total } = calcularValoresTotales(
    subtotal,
    flete,
    iva,
    descuento
  );

  const matrix = [];
  matrix.push(['Sub-Total', '$', Money.print(subtotal)]);
  matrix.push(['Descuento', `${descuento}%`, Money.print(rebaja)]);
  if (iva === 0) matrix.push(['IVA', '0%', '0.00']);
  else matrix.push(['IVA', '%', '']);
  matrix.push(['Flete', '$', Money.print(flete)]);
  if (iva > 0) matrix.push(['IVA', `${iva}%`, Money.print(impuestos)]);
  else matrix.push(['IVA', '%', '']);
  matrix.push(['Total US', '$', Money.print(total)]);
  return matrix;
};

const fromVentaRow = ventaRow => {
  const { subtotal, iva, descuento, flete, formaPago } = ventaRow;
  const { rebaja, impuestos, total } = calcularValoresTotales(
    subtotal,
    flete,
    iva,
    descuento
  );

  return {
    ...ventaRow,
    total,
    formasDePago: generarDetalleOpcionesDePago(formaPago, total),
    matrizValoresTotales: crearMatrizValoresTotales(
      subtotal,
      flete,
      iva,
      descuento,
      impuestos,
      rebaja,
      total
    )
  };
};

module.exports = {
  generarDetalleOpcionesDePago,
  crearMatrizValoresTotales,
  fromVentaRow
};
