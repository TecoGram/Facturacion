const deepFreeze = require('deep-freeze');
const { oneYearFromToday, toReadableDate } = require('../DateParser.js');
const { calcularSubtotal } = require('./Math.js');

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
  facturable.precioVenta = '' + producto.precioVenta;
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
  porcentajeIVA
}) => {
  const subtotal = calcularSubtotal(facturables);
  return {
    cliente: (clienteRow || {}).rowid,
    medico: (medicoRow || {}).rowid,
    codigo: facturaData.codigo,
    descuento: facturaData.descuento,
    empresa: empresa,
    autorizacion: facturaData.autorizacion,
    formaPago: facturaData.formaPago,
    fecha: toReadableDate(facturaData.fecha),
    detallado: isExamen ? false : facturaData.detallado,
    flete: facturaData.flete,
    iva: isExamen ? 0 : porcentajeIVA,
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
  productoAFacturable
};
