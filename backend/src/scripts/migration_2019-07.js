const knex = require('../db.js');

const {
  crearTablaProductos,
  crearTablaProductosFtsRaw
} = require('../dbTables.js');

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

const insertAsChunks = (trx, { array, tableName, maxSize }) => {
  const chunks = splitIntoChunks(array, maxSize);
  const promises = chunks.map(values => trx(tableName).insert(values));
  return Promise.all(promises);
};

const copyProductos = async trx => {
  const oldRows = await trx.select().from('productos');
  const newRows = [];
  for (let i = 0; i < oldRows.length; i++) {
    const { nombreAscii, nombre, marca, ...row } = oldRows[i];
    const [ftsid] = await trx('productosFts').insert({ nombre, marca });
    newRows.push({ ...row, ftsid, nombreUnique: nombre });
  }

  await insertAsChunks(trx, {
    array: newRows,
    tableName: 'temp_productos',
    maxSize: 120
  });
};
/* eslint-enable fp/no-let, fp/no-loops, fp/no-mutation */

const crearTablaUnidades = table => {
  table.integer('producto');
  table.integer('ventaId');
  table.string('lote', 10);
  table.integer('precioVenta');
  table.integer('count');
  table.date('fechaExp');

  table.foreign('producto').references('temp_productos.rowid');
  table
    .foreign('ventaId')
    .references('rowid')
    .inTable('ventas')
    .onDelete('CASCADE');
};

const copyUnidades = async trx => {
  const rows = await trx.select().from('unidades');
  await insertAsChunks(trx, {
    array: rows,
    tableName: 'temp_unidades',
    maxSize: 160
  });
};

const run = async trx => {
  await trx.schema
    .raw(crearTablaProductosFtsRaw)
    .raw('DROP INDEX temp_productos_nombre_unique;')
    .createTable('temp_productos', crearTablaProductos);

  await trx.schema.createTable('temp_unidades', crearTablaUnidades);

  await copyProductos(trx);
  await copyUnidades(trx);

  await trx.schema
    .dropTable('unidades')
    .dropTable('productos')
    .renameTable('temp_unidades', 'unidades')
    .renameTable('temp_productos', 'productos');
};

knex
  .transaction(run)
  .then(() => console.log('ok'))
  .catch(err => console.log('failed: ' + err))
  .then(() => knex.destroy());
