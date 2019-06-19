const {
  calcularValoresTotales
} = require('facturacion_common/src/Math.js');
const Money = require('facturacion_common/src/Money.js');

const generarDetalleOpcionesDePago = (selectedFPKey, totalNumber) => {
  const total = Money.print(totalNumber);
  const tarjetaOptions = [
    'tarjeta_legacy',
    'tarjeta_debito',
    'tarjeta_credito'
  ];
  return [
    ['EFECTIVO', 'efectivo' === selectedFPKey ? total : null],
    [
      'DINERO ELECTRÓNICO',
      'dinero_electronico_ec' === selectedFPKey ? total : null
    ],
    [
      'TARJETA DE CRÉDITO/DÉBITO',
      tarjetaOptions.includes(selectedFPKey) ? total : null
    ],
    ['TRANSFERENCIA', 'transferencia' === selectedFPKey ? total : null],
    ['OTRO', 'otros' === selectedFPKey ? total : null]
  ];
};

const crearMatrizValoresTotales = (
  subtotal,
  flete,
  iva,
  descuento,
  impuestos,
  rebaja,
  total
) => {
  const matrix = [];
  matrix.push(['Sub-Total', '$', Money.print(subtotal)]);
  matrix.push(['Descuento', `${descuento}%`, Money.print(rebaja)]);
  if (iva === 0) matrix.push(['IVA', '0%', '0.00']);
  else matrix.push(['IVA', '%', '']);
  matrix.push(['Flete', '$', Money.print(flete)]);
  if (iva > 0)
    matrix.push(['IVA', `${iva}%`, Money.print(impuestos)]);
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
  crearMatrizValoresTotales,
  fromVentaRow
};
