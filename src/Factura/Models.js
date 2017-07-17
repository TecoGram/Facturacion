const deepFreeze = require('deep-freeze');
const { oneYearFromToday, toReadableDate } = require('../DateParser.js');
const { calcularSubtotalImm } = require('./Math.js');

const FormasDePago = deepFreeze([
  'EFECTIVO',
  'DINERO ELECTRÓNICO',
  'TARJETA DE CRÉDITO/DÉBITO',
  'TRANSFERENCIA',
  'OTRO',
]);

const crearUnidadesRows = facturablesImm => {
  const len = facturablesImm.size;
  const unidades = [];
  for (let i = 0; i < len; i++) {
    const facturableImm = facturablesImm.get(i);
    const count = facturableImm.get('count');
    for (let j = 0; j < count; j++)
      unidades.push({
        producto: facturableImm.get('rowid'),
        lote: facturableImm.get('lote'),
        fechaExp: facturableImm.get('fechaExp'),
      });
  }
  return unidades;
};

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

const crearVentaRow = (
  clienteObj,
  medicoObj,
  facturaDataImm,
  facturablesImm,
  unidades,
  empresa,
  isExamen,
  porcentajeIVA
) => {
  const subtotal = calcularSubtotalImm(facturablesImm);
  let medicoId;
  if (medicoObj) medicoId = medicoObj.nombre;
  return {
    cliente: clienteObj.ruc,
    codigo: facturaDataImm.get('codigo'),
    descuento: facturaDataImm.get('descuento'),
    empresa: empresa,
    autorizacion: facturaDataImm.get('autorizacion'),
    formaPago: facturaDataImm.get('formaPago'),
    fecha: toReadableDate(facturaDataImm.get('fecha')),
    detallado: isExamen ? false : facturaDataImm.get('detallado'),
    flete: facturaDataImm.get('flete'),
    iva: isExamen ? 0 : porcentajeIVA,
    subtotal: subtotal,
    unidades: unidades,
    medico: medicoId,
    paciente: facturaDataImm.get('paciente'),
  };
};

module.exports = {
  crearUnidadesRows,
  crearVentaRow,
  facturableAUnidad,
  FormasDePago,
  productoAFacturable,
};
