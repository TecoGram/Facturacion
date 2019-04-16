const {
  calcularValoresTotales
} = require('../../../frontend/src/Factura/Math.js');

const generarDetalleOpcionesDePago = (selectedFPKey, totalNumber) => {
  const total = Number(totalNumber).toFixed(2);
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
