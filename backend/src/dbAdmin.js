const knex = require('./db.js');
const convertToAscii = require('normalize-for-search');

const colocarVentaID = (unidades, ventaId) =>
  unidades.map(u => ({ ...u, ventaId }));

const insertarVentaBase = (builder, row) => {
  const q = builder.table('ventas').insert(row);
  return q;
};

const insertarNuevoComprobante = async ({ trx, ventaId, checkExists }) => {
  if (checkExists) {
    const [comprobanteRow] = await trx
      .select('secuencial')
      .from('comprobantes')
      .where({ ventaId });
    if (comprobanteRow) return [comprobanteRow.secuencial];
  }

  return trx
    .table('comprobantes')
    .insert({ ventaId, id: null, clave_acceso: null });
};

const updateVenta = (builder, row) => {
  const { rowid } = row;
  return builder('ventas')
    .where({ rowid })
    .update(row);
};

const updateExamenInfo = (builder, { ventaId, medicoId, paciente }) => {
  const pacienteAscii = convertToAscii(paciente);
  return builder('examen_info')
    .where({ ventaId })
    .update({
      medicoId,
      paciente,
      pacienteAscii: pacienteAscii
    });
};

const getExamenInfoFromVenta = ventaId => {
  return knex
    .select('medicoId', 'nombre', 'nombreAscii', 'paciente')
    .from('examen_info')
    .leftOuterJoin('medicos', { 'examen_info.medicoId': 'medicos.rowid' })
    .where({ ventaId });
};

const deleteVenta = rowid => {
  return knex('ventas')
    .where({ rowid })
    .del();
};

const deleteProducto = rowid => {
  return knex('productos')
    .where({ rowid })
    .del();
};

const deleteCliente = (tipo, id) => {
  return knex('clientes')
    .where({ tipo, id })
    .del();
};

const deleteUnidadesVenta = (builder, ventaId) => {
  return builder('unidades')
    .where({ ventaId })
    .del();
};

const deletePagosVenta = (builder, ventaId) => {
  return builder('pagos')
    .where({ ventaId })
    .del();
};

const insertarPagos = (builder, pagos) => {
  return builder.table('pagos').insert(pagos);
};

const insertarNuevasUnidades = (builder, listaDeUnidades) => {
  return builder.table('unidades').insert(listaDeUnidades);
};

const insertarExamenInfo = (builder, { medicoId, paciente, ventaId }) => {
  const pacienteAscii = convertToAscii(paciente);
  return builder.table('examen_info').insert({
    medicoId,
    paciente,
    pacienteAscii,
    ventaId
  });
};

const getVentaRow = rowid => {
  return knex
    .select('*')
    .from('ventas')
    .where({ rowid });
};

const findAllVentas = (empresa, nombreCliente) => {
  const nombreClienteAscii = convertToAscii(nombreCliente);
  return knex
    .select(
      'ventas.rowid',
      'comprobantes.id',
      'empresa',
      'fecha',
      'nombre',
      'iva',
      'descuento',
      'autorizacion',
      'flete',
      'detallado',
      'subtotal',
      'ventas.tipo'
    )
    .from('ventas')
    .join('clientes', { 'ventas.cliente': 'clientes.rowid' })
    .leftOuterJoin('comprobantes', { 'ventas.rowid': 'comprobantes.ventaId' })
    .where('nombreAscii', 'like', `%${nombreClienteAscii}%`)
    .where('empresa', empresa)
    .orderBy('fecha', 'desc')
    .limit(50);
};

const getCliente = rowid => {
  return knex
    .select('*')
    .from('clientes')
    .where({ rowid });
};

const getUnidadesFromVenta = ventaId => {
  return knex
    .select(
      'productos.nombre',
      'unidades.producto',
      'unidades.count',
      'unidades.precioVenta',
      'productos.codigo',
      'productos.pagaIva',
      'productos.marca',
      'unidades.lote',
      'unidades.fechaExp'
    )
    .from('unidades')
    .join('productos', { 'unidades.producto': 'productos.rowid' })
    .where({ ventaId });
};

const getComprobanteFromVenta = ventaId => {
  return knex
    .select('*')
    .from('comprobantes')
    .where({ ventaId });
};

const getPagosFromVenta = ventaId => {
  return knex
    .select('*')
    .from('pagos')
    .where({ ventaId });
};

const getFirstRow = ([row]) => row;

const getVentaById = async id => {
  const [ventaRow] = await getVentaRow(id);
  if (!ventaRow) throw { errorCode: 404, text: 'Factura no encontrada' };

  const [
    clienteRow,
    examenInfo,
    unidades,
    pagos,
    comprobanteRow
  ] = await Promise.all([
    getCliente(ventaRow.cliente).then(getFirstRow),
    getExamenInfoFromVenta(id).then(getFirstRow),
    getUnidadesFromVenta(id),
    getPagosFromVenta(id),
    getComprobanteFromVenta(id).then(getFirstRow)
  ]);

  if (!examenInfo) {
    return {
      ventaRow,
      clienteRow,
      unidades,
      pagos,
      comprobanteRow
    };
  }

  const medicoRow = examenInfo.medicoId
    ? {
        rowid: examenInfo.medicoId,
        nombre: examenInfo.nombre,
        nombreAscii: examenInfo.nombreAscii
      }
    : null;

  return {
    ventaRow,
    medicoRow,
    clienteRow,
    unidades,
    pagos,
    comprobanteRow,
    paciente: examenInfo.paciente
  };
};

const buscarEnTabla = (tabla, columna, queryString, limit) => {
  const limitValue = limit || 5;
  const query = knex
    .select('*')
    .from(tabla)
    .limit(limitValue);
  if (queryString !== '')
    return query.where(columna, 'like', `%${queryString}%`);
  return query;
};

const updateProducto = (
  rowid,
  codigo,
  nombre,
  marca,
  precioDist,
  precioVenta,
  pagaIva
) => {
  const nombreAscii = convertToAscii(nombre);
  return knex
    .table('productos')
    .where({ rowid })
    .update({
      codigo: codigo,
      nombreAscii: nombreAscii,
      nombre: nombre,
      marca: marca,
      precioDist: precioDist,
      precioVenta: precioVenta,
      pagaIva: pagaIva
    });
};

const updateCliente = row => {
  const { nombre, tipo, id } = row;
  const nombreAscii = convertToAscii(nombre);
  return knex
    .table('clientes')
    .where({ tipo, id })
    .update({ ...row, nombreAscii });
};

const colocarComprobante = ({ ventaId, id, clave_acceso }) => {
  return knex
    .table('comprobantes')
    .where({ ventaId })
    .update({ id, clave_acceso });
};

const insertarPagosPorVenta = (trx, ventaId, pagos) =>
  insertarPagos(trx, pagos.map(p => ({ ...p, ventaId })));

const tieneComprobante = async ventaId => {
  const results = await knex
    .select('id')
    .table('comprobantes')
    .where({ ventaId });

  return results.length > 0 && !!results[0].id;
};

const ventaExiste = async rowid => {
  const [{ count }] = await knex
    .select(knex.raw('COUNT(*) as count'))
    .table('ventas')
    .where({ rowid });
  return count > 0;
};

module.exports = {
  close: () => {
    knex.destroy();
  },
  insertarProducto: (
    codigo,
    nombre,
    marca,
    precioDist,
    precioVenta,
    pagaIva
  ) => {
    const nombreAscii = convertToAscii(nombre);
    return knex.table('productos').insert({
      codigo: codigo,
      nombreAscii: nombreAscii,
      nombre: nombre,
      marca: marca,
      precioDist: precioDist,
      precioVenta: precioVenta,
      pagaIva: pagaIva
    });
  },

  findProductos: (queryString, limit) => {
    const queryStringAscii = convertToAscii(queryString);
    return buscarEnTabla('productos', 'nombreAscii', queryStringAscii, limit);
  },

  insertarCliente: async row => {
    const nombreAscii = convertToAscii(row.nombre);
    const [rowid] = await knex.table('clientes').insert({
      ...row,
      nombreAscii
    });
    return rowid;
  },

  findClientes: queryString => {
    const queryStringAscii = convertToAscii(queryString);
    return buscarEnTabla('clientes', 'nombreAscii', queryStringAscii);
  },

  insertarMedico: (
    nombre,
    direccion,
    email,
    comision,
    telefono1,
    telefono2
  ) => {
    const nombreAscii = convertToAscii(nombre);
    return knex.table('medicos').insert({
      nombreAscii: nombreAscii,
      nombre: nombre,
      direccion: direccion,
      email: email,
      comision: comision,
      telefono1: telefono1,
      telefono2: telefono2
    });
  },

  findMedicos: queryString => {
    const queryStringAscii = convertToAscii(queryString);
    return buscarEnTabla('medicos', 'nombreAscii', queryStringAscii);
  },

  insertarVenta: venta =>
    knex.transaction(async trx => {
      const { unidades, pagos, contable, ...ventaRow } = venta;
      const [ventaId] = await insertarVentaBase(trx, { ...ventaRow, tipo: 0 });

      const unidadesConID = colocarVentaID(unidades, ventaId);
      await insertarPagosPorVenta(trx, ventaId, pagos);
      await insertarNuevasUnidades(trx, unidadesConID);
      if (contable) await insertarNuevoComprobante({ trx, ventaId });

      return ventaId;
    }),

  insertarVentaExamen: ventaEx =>
    knex.transaction(async trx => {
      const {
        unidades,
        medico: medicoId,
        paciente,
        pagos,
        contable,
        ...venta
      } = ventaEx;
      const ventaRow = {
        ...venta,
        detallado: false,
        tipo: 1,
        iva: 0,
        flete: 0
      };
      const [ventaId] = await insertarVentaBase(trx, ventaRow);
      const unidadesConID = colocarVentaID(unidades, ventaId);
      await insertarExamenInfo(trx, { medicoId, paciente, ventaId });
      await insertarPagosPorVenta(trx, ventaId, pagos);
      await insertarNuevasUnidades(trx, unidadesConID);
      if (contable) await insertarNuevoComprobante({ trx, ventaId });

      return ventaId;
    }),

  updateVenta: venta => {
    return knex.transaction(async trx => {
      const { unidades, pagos, contable, ...row } = venta;
      const ventaId = row.rowid;
      await updateVenta(trx, row);
      await deleteUnidadesVenta(trx, ventaId);
      await deletePagosVenta(trx, ventaId);
      await insertarNuevasUnidades(trx, colocarVentaID(unidades, ventaId));
      await insertarPagosPorVenta(trx, ventaId, pagos);

      if (contable)
        await insertarNuevoComprobante({ trx, ventaId, checkExists: true });
    });
  },

  updateVentaExamen: ventaEx => {
    return knex.transaction(async trx => {
      const {
        unidades,
        medico: medicoId,
        paciente,
        pagos,
        contable,
        ...ventaExRow
      } = ventaEx;
      const { rowid: ventaId } = ventaExRow;
      const ventaRow = {
        ...ventaExRow,
        detallado: false,
        tipo: 1,
        iva: 0,
        flete: 0
      };
      await updateVenta(trx, ventaRow);
      await deleteUnidadesVenta(trx, ventaId);
      await deletePagosVenta(trx, ventaId);
      await updateExamenInfo(trx, { medicoId, paciente, ventaId });
      await insertarNuevasUnidades(trx, colocarVentaID(unidades, ventaId));
      await insertarPagosPorVenta(trx, ventaId, pagos);

      if (contable)
        await insertarNuevoComprobante({ trx, ventaId, checkExists: true });
    });
  },

  findAllVentas,
  colocarComprobante,
  getVentaById,
  getComprobanteFromVenta,
  getExamenInfoFromVenta,
  getUnidadesFromVenta,
  deleteCliente,
  deleteVenta,
  deleteProducto,
  tieneComprobante,
  updateCliente,
  updateProducto,
  ventaExiste
};
