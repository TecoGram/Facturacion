const knex = require('./db.js');

const crearTablaProductosFtsRaw =
  'CREATE VIRTUAL TABLE productosFts USING fts4(nombre, marca);';

const crearTablaProductos = table => {
  table.integer('rowid').primary();
  table.string('codigo', 10);
  table.string('nombreUnique', 50);
  table.integer('ftsid');
  table.integer('precioDist');
  table.integer('precioVenta');
  table.boolean('pagaIva');

  table.unique('nombreUnique');
};

const crearTablaClientes = table => {
  table.integer('rowid').primary();
  table.string('id', 13).notNullable();
  table
    .string('nombreAscii', 50)
    .notNullable()
    .index();
  table.string('nombre', 50).notNullable();
  table.string('direccion', 60);
  table.string('email', 10);
  table.string('telefono1', 10);
  table.string('telefono2', 10);
  table.integer('descDefault');
  // tipo es un valor de Models.tipoID
  table.string('tipo').notNullable();

  table.unique(['tipo', 'id']);
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
  table.string('guia', 20);
  table.boolean('detallado');
  //tipo 0 para productos, 1 para examenes
  table.integer('tipo');
  table.integer('descuento');
  table.integer('iva');
  table.integer('flete');
  table.integer('subtotal').notNullable();

  table.index(['empresa', 'codigo']);
  table.foreign('cliente').references('clientes.rowid');
};

const crearTablaPagos = table => {
  table.integer('ventaId').notNullable();
  //el valor es un codigo caracteres de datil
  table.string('formaPago', 15);
  table.integer('valor');

  table
    .foreign('ventaId')
    .references('ventas.rowid')
    .onDelete('CASCADE');
};

const crearTablaComprobantes = table => {
  table.increments('secuencial').primary();
  table
    .integer('ventaId')
    .notNullable()
    .unique();
  table.string('id');
  table.string('clave_acceso');

  table
    .foreign('ventaId')
    .references('ventas.rowid')
    .onDelete('CASCADE');
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
  table.integer('precioVenta');
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
const borrarTablaProductosFts = () => knex('productosFts').truncate();
const borrarTablaUnidades = () => knex('unidades').truncate();
const borrarTablaVentas = () => knex('ventas').truncate();
const borrarTablaComprobantes = () => knex('comprobantes').truncate();

module.exports = {
  borrarTablaClientes,
  borrarTablaExamenInfo,
  borrarTablaMedicos,
  borrarTablaProductos,
  borrarTablaProductosFts,
  borrarTablaUnidades,
  borrarTablaVentas,
  borrarTablaComprobantes,

  crearTablaClientes,
  crearTablaComprobantes,
  crearTablaExamenInfo,
  crearTablaMedicos,
  crearTablaProductos,
  crearTablaProductosFtsRaw,
  crearTablaPagos,
  crearTablaUnidades,
  crearTablaVentas
};
