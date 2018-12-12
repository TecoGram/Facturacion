const knex = require('../db.js');

/* eslint-disable fp/no-let, fp/no-loops, fp/no-mutation */
const splitIntoChunks = (array, maxSize) => {
  let copied = 0;
  let index = 0;
  const res = [];

  while (copied < array.length) {
    res[index] = array.slice(copied, copied + maxSize);
    copied += maxSize;
    index++;
  }
  return res;
};
/* eslint-enable fp/no-let, fp/no-loops, fp/no-mutation */

const insertAsChunks = ({ array, tableName, maxSize }) => {
  const chunks = splitIntoChunks(array, maxSize);
  const promises = chunks.map(values => knex(tableName).insert(values));
  return Promise.all(promises);
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
  // 1 para ruc, 2 para cedula, 3 para pasaporte
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
  table.foreign('cliente').references('temp_clientes.rowid');
};

const crearTablaExamenInfo = table => {
  table.integer('medicoId');
  table.integer('ventaId');
  table.string('paciente', 50);
  table.string('pacienteAscii', 50);

  table.foreign('medicoId').references('temp_medicos.rowid');
  table
    .foreign('ventaId')
    .references('rowid')
    .inTable('temp_ventas')
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
    .inTable('temp_ventas')
    .onDelete('CASCADE');
};

const copyClientes = async () => {
  const oldClientes = await knex.select().from('clientes');
  const newClientes = oldClientes.map(o => ({
    ...o,
    tipo: o.ruc.endsWith('001') ? 1 : 2
  }));

  await insertAsChunks({
    array: newClientes,
    tableName: 'temp_clientes',
    maxSize: 80
  });

  const insertedClientes = await knex
    .select(['rowid', 'ruc'])
    .from('temp_clientes');
  const clientesMap = insertedClientes.reduce((res, row) => {
    return { ...res, [row.ruc]: row.rowid };
  }, {});

  return clientesMap;
};

const copyVentas = async clientesMap => {
  const oldVentas = await knex.select().from('ventas');
  const newVentas = oldVentas.map(v => ({
    ...v,
    cliente: clientesMap[v.cliente]
  }));

  await insertAsChunks({
    array: newVentas,
    tableName: 'temp_ventas',
    maxSize: 80
  });

  const insertedVentas = await knex
    .select(['rowid', 'empresa', 'codigo'])
    .from('temp_ventas');
  const ventasMap = insertedVentas.reduce((res, row) => {
    return { ...res, [row.empresa + row.codigo]: row.rowid };
  }, {});
  return ventasMap;
};

const copyExamenInfoRows = async ventasMap => {
  const oldRows = await knex.select().from('examen_info');
  const newRows = oldRows.map(oldRow => {
    const { medico_id, codigoVenta, empresaVenta, ...o } = oldRow;
    const ventaId = ventasMap[empresaVenta + codigoVenta];
    return {
      ...o,
      ventaId,
      medicoId: medico_id
    };
  });

  await insertAsChunks({
    array: newRows,
    tableName: 'temp_examen_info',
    maxSize: 140
  });
};

const copyUnidades = async ventasMap => {
  const oldRows = knex.select().from('unidades');
  const newRows = oldRows.map(oldRow => {
    const { codigoVenta, empresaVenta, ...o } = oldRow;
    const ventaId = ventasMap[empresaVenta + codigoVenta];
    return {
      ...o,
      ventaId
    };
  });
  await insertAsChunks({
    array: newRows,
    tableName: 'temp_unidades',
    maxSize: 140
  });
};

const run = async () => {
  await knex.schema
    .createTable('temp_clientes', crearTablaClientes)
    .createTable('temp_medicos', crearTablaMedicos)
    .createTable('temp_ventas', crearTablaVentas)
    .createTable('temp_examen_info', crearTablaExamenInfo)
    .createTable('temp_unidades', crearTablaUnidades);
  const clientesMap = await copyClientes();
  const ventasMap = await copyVentas(clientesMap);
  await Promise.all([copyExamenInfoRows(ventasMap), copyUnidades(ventasMap)]);

  await knex.schema
    .dropTable('unidades')
    .dropTable('examen_info')
    .dropTable('ventas')
    .dropTable('medicos')
    .dropTable('clientes')
    .renameTable('temp_unidades', 'unidades')
    .renameTable('temp_examen_info', 'examen_info')
    .renameTable('temp_ventas', 'ventas')
    .renameTable('temp_medicos', 'medicos')
    .renameTable('temp_clientes', 'clientes');
};

run()
  .then(() => console.log('ok'))
  .catch(err => console.log('failed: ' + err))
  .then(() => knex.destroy());
