const knex = require('./db.js');

const crearTablaProductos = table => {
  table.integer('rowid').primary();
  table.string('codigo', 10);
  table.string('nombreAscii', 50);
  table.string('nombre', 50);
  table.string('marca', 30);
  table.float('precioDist');
  table.float('precioVenta');
  table.boolean('pagaIva');

  table.unique('nombre');
};

const crearTablaStock = table => {
  table
    .integer('producto')
    .unsigned()
    .index();
  table.string('lote', 10);
  table.date('fechaExp');

  table.foreign('producto').references('productos.rowid');
};

const crearTablaClientes = table => {
  table.integer('rowid').primary();
  table
    .string('ruc', 13)
    .unique()
    .notNullable();
  table
    .string('nombreAscii', 50)
    .notNullable()
    .index();
  table.string('nombre', 50).notNullable();
  table.string('direccion', 60);
  table.string('email', 10);
  table.string('telefono1', 10);
  table.string('telefono2', 10);
  table.int('descDefault');
  // 1 para ruc, 2 para cedula
  table.int('tipo').notNullable();
};

const crearTablaMedicos = table => {
  table.integer('rowid').primary();
  table.string('nombreAscii', 50).unique();
  table.string('nombre', 50);
  table.string('direccion', 60);
  table.string('email', 10);
  table.integer('comision');
  table.string('telefono1', 10);
  table.string('telefono2', 10);
};

const crearTablaVentas = table => {
  table.integer('rowid').primary();
  table.string('codigo', 10);
  table.string('empresa', 10).notNullable();
  table.integer('cliente');
  table.date('fecha').index();
  table.string('autorizacion', 10);
  //el valor es un indice de Factura/Models.FormasDePago
  table.integer('formaPago');
  table.boolean('detallado');
  //tipo 0 para productos, 1 para examenes
  table.integer('tipo');
  table.integer('descuento');
  table.integer('iva');
  table.float('flete');
  table.float('subtotal').notNullable();

  table.index(['codigo', 'empresa']);
  table.foreign('cliente').references('clientes.rowid');
};

const crearTablaExamenInfo = table => {
  table.integer('medicoId');
  table.integer('ventaId');
  table.string('paciente', 50);
  table.string('pacienteAscii', 50);

  table.foreign('medicoId').references('medicos.rowid');
  table
    .foreign('ventaId')
    .references('rowid')
    .inTable('ventas')
    .onDelete('CASCADE');
};

const crearTablaUnidades = table => {
  table.integer('producto');
  table.integer('ventaId');
  table.string('lote', 10);
  table.float('precioVenta');
  table.integer('count');
  table.date('fechaExp');

  table.foreign('producto').references('productos.rowid');
  table
    .foreign('ventaId')
    .references('rowid')
    .inTable('ventas')
    .onDelete('CASCADE');
};
const borrarTablaClientes = () => knex('clientes').truncate();
const borrarTablaExamenInfo = () => knex('examen_info').truncate();
const borrarTablaMedicos = () => knex('medicos').truncate();
const borrarTablaProductos = () => knex('productos').truncate();
const borrarTablaStock = () => knex('stock').truncate();
const borrarTablaUnidades = () => knex('unidades').truncate();
const borrarTablaVentas = () => knex('ventas').truncate();

module.exports = {
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
};
