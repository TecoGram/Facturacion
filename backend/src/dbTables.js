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

const crearTablaClientes = table => {
  table.string('ruc', 13).primary();
  table.string('nombreAscii', 50).index();
  table.string('nombre', 50);
  table.string('direccion', 60);
  table.string('email', 10);
  table.string('telefono1', 10);
  table.string('telefono2', 10);
  table.int('descDefault');
};

const crearTablaMedicos = table => {
  table.string('nombreAscii', 50).primary();
  table.string('nombre', 50);
  table.string('direccion', 60);
  table.string('email', 10);
  table.integer('comision');
  table.string('telefono1', 10);
  table.string('telefono2', 10);
};

const crearTablaVentas = table => {
  table.string('codigo', 10);
  table.string('empresa', 10);
  table.string('cliente', 13);
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
  table.float('subtotal');

  table.primary('codigo', 'empresa');
  table.foreign('cliente').references('clientes.ruc');
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

const crearTablaExamenInfo = table => {
  table.string('medico_id', 50);
  table.string('codigoVenta', 10);
  table.string('empresaVenta', 10);
  table.string('paciente', 50);
  table.string('pacienteAscii', 50);

  table.foreign('medico_id').references('medicos.nombreAscii');
  table
    .foreign(['codigoVenta', 'empresaVenta'])
    .references(['codigo', 'empresa'])
    .inTable('ventas')
    .onDelete('CASCADE');
};

const crearTablaUnidades = table => {
  table.integer('producto');
  table.string('codigoVenta', 10);
  table.string('empresaVenta', 10);
  table.string('lote', 10);
  table.float('precioVenta');
  table.integer('count');
  table.date('fechaExp');

  table.foreign('producto').references('productos.rowid');
  table
    .foreign(['codigoVenta', 'empresaVenta'])
    .references(['codigo', 'empresa'])
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
