const knex = require('./db.js');
const convertToAscii = require('normalize-for-search');

const colocarVentaID = (unidades, ventaId) =>
  unidades.map(u => ({ ...u, ventaId }));

const insertarVentaBase = (builder, row) => {
  const q = builder.table('ventas').insert(row);
  return q;
};

const updateVenta = (builder, row) => {
  const { rowid } = row;
  return builder('ventas')
    .where({ rowid })
    .update(row);
};

const updateVentaExamen = (
  builder,
  codigo,
  empresa,
  cliente,
  fecha,
  autorizacion,
  formaPago,
  descuento,
  subtotal
) => {
  return updateVenta(
    builder,
    codigo,
    empresa,
    cliente,
    fecha,
    autorizacion,
    formaPago,
    false,
    descuento,
    0,
    0,
    subtotal
  );
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

const getExamenInfo = ventaId => {
  return knex
    .select('nombre', 'nombreAscii', 'paciente')
    .from('examen_info')
    .join('medicos', { 'examen_info.medicoId': 'medicos.rowid' })
    .where({ ventaId });
};

const deleteVenta = (codigo, empresa) => {
  return knex('ventas')
    .where({ codigo, empresa })
    .del();
};

const deleteProducto = rowid => {
  return knex('productos')
    .where({ rowid })
    .del();
};

const deleteCliente = ruc => {
  return knex('clientes')
    .where({ ruc })
    .del();
};

const deleteUnidadesVenta = (builder, ventaId) => {
  return builder('unidades')
    .where({ ventaId })
    .del();
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

const getVenta = (codigo, empresa) => {
  return knex
    .select('*')
    .from('ventas')
    .where({ codigo: codigo, empresa: empresa, tipo: 0 });
};

const getVentaExamen = (codigo, empresa) => {
  return knex
    .select('*')
    .from('ventas')
    .where({ empresa: empresa, codigo: codigo, tipo: 1 });
};

const findVentas = nombreCliente => {
  const nombreClienteAscii = convertToAscii(nombreCliente);
  return knex
    .select(
      'ventas.rowid',
      'codigo',
      'empresa',
      'fecha',
      'ruc',
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
    .where('nombreAscii', 'like', `%${nombreClienteAscii}%`)
    .where('ventas.tipo', 0)
    .orderBy('fecha', 'desc')
    .limit(50);
};

const findAllVentas = nombreCliente => {
  const nombreClienteAscii = convertToAscii(nombreCliente);
  return knex
    .select(
      'codigo',
      'empresa',
      'fecha',
      'ruc',
      'nombre',
      'iva',
      'descuento',
      'autorizacion',
      'flete',
      'detallado',
      'subtotal',
      'tipo'
    )
    .from('ventas')
    .join('clientes', { 'ventas.cliente': 'clientes.ruc' })
    .where('nombreAscii', 'like', `%${nombreClienteAscii}%`)
    .orderBy('fecha', 'desc')
    .limit(50);
};

const findVentasExamen = nombre => {
  const nombreAscii = convertToAscii(nombre);
  return knex
    .select(
      'codigo',
      'fecha',
      'cliente',
      'nombre',
      'subtotal',
      'descuento',
      'iva',
      'paciente',
      'medicoId',
      'detallado'
    )
    .from('ventas')
    .join('clientes', { 'ventas.cliente': 'clientes.rowid' })
    .join('examen_info', { 'ventas.rowid': 'examen_info.ventaId' })
    .orWhere('pacienteAscii', 'like', `%${nombreAscii}%`)
    .orWhere('clientes.nombreAscii', 'like', `%${nombreAscii}%`)
    .where('ventas.tipo', 1)
    .orderBy('fecha', 'desc')
    .limit(50);
};

const getCliente = rowid => {
  return knex
    .select('*')
    .from('clientes')
    .where({ rowid });
};

const getFacturablesVenta = ventaId => {
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

const getVentaPorTipo = (codigo, empresa, tipo) => {
  switch (tipo) {
    case 0:
      return getVenta(codigo, empresa);
    case 1:
      return getVentaExamen(codigo, empresa);
    default:
      throw Error('Tipo de venta desconocido');
  }
};

const getFacturaData = (codigo, empresa, tipo) => {
  const p = getVentaPorTipo(codigo, empresa, tipo)
    .then(([ventaRow]) => {
      if (ventaRow)
        return getCliente(ventaRow.cliente).then(([cliente]) => ({
          ventaRow,
          cliente
        }));
      return Promise.reject({
        errorCode: 404,
        text: 'factura no encontrada'
      });
    })
    .then(({ cliente, ventaRow }) => {
      if (cliente)
        return getFacturablesVenta(ventaRow.rowid).then(facturables => ({
          ventaRow: { ...ventaRow, facturables },
          cliente
        }));

      return Promise.reject({
        errorCode: 404,
        text: 'cliente no encontrado'
      });
    });

  if (tipo === 0) return p;
  return p.then(({ ventaRow, cliente }) => {
    return getExamenInfo(ventaRow.rowid).then(([exInfo]) => {
      if (exInfo)
        return {
          ventaRow: { ...ventaRow, paciente: exInfo.paciente },
          cliente,
          medico: { nombre: exInfo.nombre, nombreAscii: exInfo.nombreAscii }
        };
      return Promise.reject({
        errorCode: 404,
        text: 'examen no encontrado'
      });
    });
  });
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

const updateCliente = (
  ruc,
  nombre,
  direccion,
  email,
  telefono1,
  telefono2,
  descDefault
) => {
  const nombreAscii = convertToAscii(nombre);
  return knex
    .table('clientes')
    .where({ ruc })
    .update({
      nombreAscii: nombreAscii,
      nombre: nombre,
      direccion: direccion,
      email: email,
      telefono1: telefono1,
      telefono2: telefono2,
      descDefault: descDefault
    });
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
      const { unidades, ...ventaRow } = venta;
      const [ventaId] = await insertarVentaBase(trx, { ...ventaRow, tipo: 0 });

      const unidadesConID = colocarVentaID(unidades, ventaId);
      await insertarNuevasUnidades(trx, unidadesConID);
      return ventaId;
    }),

  insertarVentaExamen: ventaEx =>
    knex.transaction(async trx => {
      const { unidades, medico: medicoId, paciente, ...venta } = ventaEx;
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
      await insertarNuevasUnidades(trx, unidadesConID);
      return ventaId;
    }),

  updateVenta: args => {
    const { unidades, ...row } = args;
    const ventaId = row.rowid;
    return knex.transaction(trx => {
      return updateVenta(trx, row)
        .then(() => {
          return deleteUnidadesVenta(trx, ventaId);
        })
        .then(() => {
          return insertarNuevasUnidades(trx, colocarVentaID(unidades, ventaId));
        });
    });
  },

  updateVentaExamen: ventaEx => {
    return knex.transaction(async trx => {
      const { unidades, medico: medicoId, paciente, ...ventaExRow } = ventaEx;
      const { rowid: ventaId } = ventaExRow;
      await updateVentaExamen(trx, ventaExRow);
      await deleteUnidadesVenta(trx, ventaId);
      await updateExamenInfo(trx, { medicoId, paciente, ventaId });
      insertarNuevasUnidades(trx, colocarVentaID(unidades, ventaId));
    });
  },

  findAllVentas,
  findVentas: (keywords, tipo) => {
    if (tipo === 0) return findVentas(keywords);
    return findVentasExamen(keywords);
  },

  getFacturaData,

  getExamenInfo,
  getFacturablesVenta,
  deleteCliente,
  deleteVenta,
  deleteProducto,
  updateCliente,
  updateProducto
};
