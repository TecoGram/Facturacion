/* eslint-disable no-console */
const knex = require('../db.js');
const {
  borrarTablaClientes,
  borrarTablaExamenInfo,
  borrarTablaMedicos,
  borrarTablaProductos,
  borrarTablaProductosFts,
  borrarTablaUnidades,
  borrarTablaVentas,
  borrarTablaComprobantes,

  crearTablaClientes,
  crearTablaExamenInfo,
  crearTablaMedicos,
  crearTablaPagos,
  crearTablaProductos,
  crearTablaProductosFtsRaw,
  crearTablaUnidades,
  crearTablaVentas,
  crearTablaComprobantes
} = require('../dbTables.js');

const crearTablas = () =>
  knex.schema
    .raw(crearTablaProductosFtsRaw)
    .createTable('productos', crearTablaProductos)
    .createTable('clientes', crearTablaClientes)
    .createTable('medicos', crearTablaMedicos)
    .createTable('ventas', crearTablaVentas)
    .createTable('examen_info', crearTablaExamenInfo)
    .createTable('pagos', crearTablaPagos)
    .createTable('unidades', crearTablaUnidades)
    .createTable('comprobantes', crearTablaComprobantes);

const borrarTodasLasFilas = () =>
  borrarTablaUnidades()
    .then(borrarTablaExamenInfo)
    .then(borrarTablaVentas)
    .then(borrarTablaProductos)
    .then(borrarTablaProductosFts)
    .then(borrarTablaClientes)
    .then(borrarTablaMedicos)
    .then(borrarTablaComprobantes);

module.exports = () => {
  return knex.schema.hasTable('productos').then(exists => {
    if (!exists) return crearTablas();
    return borrarTodasLasFilas();
  });
};

if (require.main === module)
  module.exports().then(() => {
    knex.destroy();
  });
