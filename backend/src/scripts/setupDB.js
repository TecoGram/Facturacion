/* eslint-disable no-console */
const knex = require('../db.js');
const {
  borrarTablaClientes,
  borrarTablaExamenInfo,
  borrarTablaMedicos,
  borrarTablaProductos,
  borrarTablaStock,
  borrarTablaUnidades,
  borrarTablaVentas,

  crearTablaClientes,
  crearTablaExamenInfo,
  crearTablaMedicos,
  crearTablaProductos,
  crearTablaStock,
  crearTablaUnidades,
  crearTablaVentas
} = require('../dbTables.js');

const crearTablas = () =>
  knex.schema
    .createTable('productos', crearTablaProductos)
    .createTable('clientes', crearTablaClientes)
    .createTable('medicos', crearTablaMedicos)
    .createTable('ventas', crearTablaVentas)
    .createTable('stock', crearTablaStock)
    .createTable('examen_info', crearTablaExamenInfo)
    .createTable('unidades', crearTablaUnidades);

const borrarTodasLasFilas = () =>
  borrarTablaUnidades()
    .then(borrarTablaExamenInfo)
    .then(borrarTablaStock)
    .then(borrarTablaVentas)
    .then(borrarTablaProductos)
    .then(borrarTablaClientes)
    .then(borrarTablaMedicos);

module.exports = () => {
  return knex.schema.hasTable('productos').then(exists => {
    if (!exists) return crearTablas();
    else return borrarTodasLasFilas();
  });
};

if (require.main === module)
  module.exports().then(() => {
    knex.destroy();
  });
