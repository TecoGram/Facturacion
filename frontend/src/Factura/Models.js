const deepFreeze = require('deep-freeze');
const { oneYearFromToday, toReadableDate } = require('../DateParser.js');
const { calcularValoresTotales, calcularSubtotal } = require('./Math.js');
const Money = require('./Money.js');

const FormasDePago = deepFreeze({
  efectivo: 'EFECTIVO',
  cheque: 'CHEQUE',
  dinero_electronico_ec: 'DINERO ELECTRÓNICO',
  debito_cuenta_bancaria: 'DEBITO CTA. BANCARIA',
  transferencia: 'TRANSFERENCIA',
  deposito_cuenta_bancaria: 'DEPÓSITO CTA. BANCARIA',
  tarjeta_debito: 'TARJETA DE DÉBITO',
  tarjeta_credito: 'TARJETA DE CRÉDITO',
  tarjeta_legacy: 'TARJETA DE CRÉDITO/DÉBITO',
  otros: 'OTRO'
});

const TiposID = deepFreeze({
  ruc: 'RUC',
  cedula: 'CEDULA',
  consumidor_final: 'CONSUMIDOR FINAL'
});

const crearUnidadesRows = facturables =>
  facturables.reduce(
    (acc, facturable) =>
      acc.concat(
        Array(facturable.count).fill({
          producto: facturable.rowid,
          lote: facturable.lote,
          fechaExp: facturable.lote
        })
      ),
    []
  );

const productoAFacturable = producto => {
  const facturable = Object.assign({}, producto);
  facturable.producto = producto.rowid;
  delete facturable.rowid;
  delete facturable.precioDist;
  delete facturable.nombreAscii;
  facturable.lote = '';
  facturable.count = '1';
  facturable.precio = Money.print(producto.precioVenta);
  facturable.fechaExp = toReadableDate(oneYearFromToday());
  return facturable;
};

const facturableAUnidad = facturable => {
  const unidad = Object.assign({}, facturable);
  delete unidad.pagaIva;
  delete unidad.nombre;
  delete unidad.codigo;
  delete unidad.marca;
  return unidad;
};

const crearVentaRow = ({
  clienteRow,
  medicoRow,
  facturaData,
  facturables,
  unidades,
  empresa,
  isExamen,
  iva
}) => {
  const { descuento, formaPago } = facturaData;
  const flete = facturaData.flete || 0;
  const subtotal = calcularSubtotal(facturables);
  const { total: valor } = calcularValoresTotales(
    subtotal,
    flete,
    iva,
    descuento
  );
  return {
    cliente: (clienteRow || {}).rowid,
    medico: (medicoRow || {}).rowid,
    codigo: facturaData.codigo,
    descuento: descuento,
    empresa: empresa,
    autorizacion: facturaData.autorizacion,
    pagos: [{ formaPago, valor }],
    fecha: toReadableDate(facturaData.fecha),
    detallado: isExamen ? false : facturaData.detallado,
    flete: flete,
    iva: isExamen ? 0 : iva,
    subtotal: subtotal,
    unidades: unidades,
    paciente: facturaData.paciente
  };
};

module.exports = {
  crearUnidadesRows,
  crearVentaRow,
  facturableAUnidad,
  FormasDePago,
  productoAFacturable,
  TiposID
};
