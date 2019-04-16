const knex = require('../db.js');
const {
  crearTablaClientes,
  crearTablaMedicos,
  crearTablaVentas,
  crearTablaExamenInfo,
  crearTablaUnidades,
  crearTablaComprobantes
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
/* eslint-enable fp/no-let, fp/no-loops, fp/no-mutation */

const insertAsChunks = ({ array, tableName, maxSize }) => {
  const chunks = splitIntoChunks(array, maxSize);
  const promises = chunks.map(values => knex(tableName).insert(values));
  return Promise.all(promises);
};

const copyClientes = async () => {
  const oldClientes = await knex.select().from('clientes');
  const newClientes = oldClientes.map(o => ({
    ...o,
    tipo: o.ruc.length === 13 ? 'ruc' : 'cedula'
  }));

  await insertAsChunks({
    array: newClientes,
    tableName: 'temp_clientes',
    maxSize: 80
  });

  const insertedClientes = await knex
    .select(['rowid', 'id'])
    .from('temp_clientes');
  const clientesMap = insertedClientes.reduce((res, row) => {
    return { ...res, [row.ruc]: row.rowid };
  }, {});

  return clientesMap;
};

const convertFormaPagoIndexToKey = index => {
  switch (index) {
    case 0:
      return 'efectivo';
    case 1:
      return 'dinero_electronico_ec';
    case 2:
      return 'tarjeta_legacy';
    case 3:
      return 'transferencias';
  }
  return 'otros';
};

const copyVentas = async clientesMap => {
  const oldVentas = await knex.select().from('ventas');
  const newVentas = oldVentas.map(v => ({
    ...v,
    cliente: clientesMap[v.cliente],
    formaPago: convertFormaPagoIndexToKey(v.formaPago)
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
    .createTable('temp_unidades', crearTablaUnidades)
    .createTable('comprobantes', crearTablaComprobantes);
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
