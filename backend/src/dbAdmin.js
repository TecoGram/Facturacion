const knex = require('./db.js');
const convertToAscii = require('normalize-for-search');

const colocarVentaID = (unidades, codigoVenta, empresaVenta) =>
  unidades.map(u => ({
    ...u,
    codigoVenta,
    empresaVenta
  }));

const insertarVentaBase = (builder, row) => {
  const q = builder.table('ventas').insert(row);
  return q;
};

const updateVenta = (
  builder,
  codigo,
  empresa,
  cliente,
  fecha,
  autorizacion,
  formaPago,
  detallado,
  descuento,
  iva,
  flete,
  subtotal
) => {
  return builder('ventas')
    .where({ codigo, empresa })
    .update({
      cliente: cliente,
      fecha: fecha,
      autorizacion: autorizacion,
      formaPago: formaPago,
      detallado: detallado,
      flete: flete,
      descuento: descuento,
      iva: iva,
      subtotal: subtotal
    });
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

const updateExamenInfo = (builder, medico, paciente, codigo, empresa) => {
  const medicoAscii = convertToAscii(medico);
  const pacienteAscii = convertToAscii(paciente);
  return builder('examen_info')
    .where({ codigoVenta: codigo, empresaVenta: empresa })
    .update({
      medico_id: medicoAscii,
      paciente: paciente,
      pacienteAscii: pacienteAscii
    });
};

const getExamenInfo = (codigo, empresa) => {
  return knex
    .select('nombre', 'nombreAscii', 'paciente')
    .from('examen_info')
    .join('medicos', { 'examen_info.medico_id': 'medicos.nombreAscii' })
    .where({ codigoVenta: codigo, empresaVenta: empresa });
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

const deleteUnidadesVenta = (builder, codigo, empresa) => {
  return builder('unidades')
    .where({ codigoVenta: codigo, empresaVenta: empresa })
    .del();
};

const insertarNuevasUnidades = (builder, listaDeUnidades) => {
  return builder.table('unidades').insert(listaDeUnidades);
};

const insertarExamenInfo = (builder, medico, paciente, codigo, empresa) => {
  const medicoAscii = convertToAscii(medico);
  const pacienteAscii = convertToAscii(paciente);
  return builder.table('examen_info').insert({
    medico_id: medicoAscii,
    paciente: paciente,
    pacienteAscii: pacienteAscii,
    codigoVenta: codigo,
    empresaVenta: empresa
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
    .where('tipo', 0)
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
      'ruc',
      'nombre',
      'subtotal',
      'descuento',
      'iva',
      'paciente',
      'medico_id',
      'detallado'
    )
    .from('ventas')
    .join('clientes', { 'ventas.cliente': 'clientes.ruc' })
    .join('examen_info', {
      'ventas.codigo': 'examen_info.codigoVenta',
      'ventas.empresa': 'examen_info.empresaVenta'
    })
    .where('nombreAscii', 'like', `%${nombreAscii}%`)
    .orWhere('pacienteAscii', 'like', `%${nombreAscii}%`)
    .where('tipo', 1)
    .orderBy('fecha', 'desc')
    .limit(50);
};

const getCliente = ruc => {
  return knex
    .select('*')
    .from('clientes')
    .where('ruc', ruc);
};

const getFacturablesVenta = (codigo, empresa) => {
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
    .where({ codigoVenta: codigo, empresaVenta: empresa });
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
        return getFacturablesVenta(codigo, empresa).then(facturables => ({
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
    return getExamenInfo(codigo, empresa).then(([exInfo]) => {
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

  insertarCliente: (
    ruc,
    nombre,
    direccion,
    email,
    telefono1,
    telefono2,
    descDefault
  ) => {
    const nombreAscii = convertToAscii(nombre);
    return knex.table('clientes').insert({
      ruc: ruc,
      nombreAscii: nombreAscii,
      nombre: nombre,
      direccion: direccion,
      email: email,
      telefono1: telefono1,
      telefono2: telefono2,
      descDefault: descDefault
    });
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
      await insertarVentaBase(trx, { ...ventaRow, tipo: 0 });

      const { codigo, empresa } = ventaRow;
      const unidadesConID = colocarVentaID(unidades, codigo, empresa);
      return insertarNuevasUnidades(trx, unidadesConID);
    }),

  insertarVentaExamen: (
    ventaEx
  ) =>
    knex.transaction(async trx => {
      const { unidades, medico, paciente, ...venta } = ventaEx;
      const ventaRow = {
        ...venta,
        detallado: false,
        tipo: 1,
        iva: 0,
        flete: 0
      };
      await insertarVentaBase(trx, ventaRow);

      const { codigo, empresa } = ventaRow;
      const unidadesConID = colocarVentaID(unidades, codigo, empresa);
      await insertarExamenInfo(trx, medico, paciente, codigo, empresa);
      return insertarNuevasUnidades(trx, unidadesConID);
    }),

  updateVenta: (
    codigo,
    empresa,
    cliente,
    fecha,
    autorizacion,
    formaPago,
    detallado,
    descuento,
    iva,
    flete,
    subtotal,
    unidades
  ) => {
    return knex.transaction(trx => {
      return updateVenta(
        trx,
        codigo,
        empresa,
        cliente,
        fecha,
        autorizacion,
        formaPago,
        detallado,
        descuento,
        iva,
        flete,
        subtotal
      )
        .then(() => {
          return deleteUnidadesVenta(trx, codigo, empresa);
        })
        .then(() => {
          return insertarNuevasUnidades(
            trx,
            colocarVentaID(unidades, codigo, empresa)
          );
        });
    });
  },

  updateVentaExamen: (
    codigo,
    empresa,
    cliente,
    fecha,
    autorizacion,
    formaPago,
    descuento,
    subtotal,
    unidades,
    medico,
    paciente
  ) => {
    return knex.transaction(trx => {
      return updateVentaExamen(
        trx,
        codigo,
        empresa,
        cliente,
        fecha,
        autorizacion,
        formaPago,
        descuento,
        subtotal
      )
        .then(() => {
          return deleteUnidadesVenta(trx, codigo, empresa);
        })
        .then(() => {
          return updateExamenInfo(trx, medico, paciente, codigo, empresa);
        })
        .then(() => {
          return insertarNuevasUnidades(
            trx,
            colocarVentaID(unidades, codigo, empresa)
          );
        });
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
