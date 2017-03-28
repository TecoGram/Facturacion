const knex = require('./db.js')
const convertToAscii = require('normalize-for-search')

const colocarVentaID = (unidades, codigo, empresa) => {
  const len = unidades.length
  for (let i = 0; i < len; i++) {
    unidades[i].codigoVenta = codigo
    unidades[i].empresaVenta = empresa
  }
}

const insertarVentaBase = (builder, codigo, empresa, cliente, fecha, autorizacion,
  formaPago, detallado, tipo, descuento, iva, flete, subtotal) => {
  const q = builder.table('ventas').insert({
    codigo: codigo,
    empresa: empresa,
    cliente: cliente,
    fecha: fecha,
    autorizacion: autorizacion,
    formaPago: formaPago,
    detallado: detallado,
    tipo: tipo,
    descuento: descuento,
    iva: iva,
    flete: flete,
    subtotal: subtotal,
  })
  return q
}

const updateVenta = (builder, codigo, empresa, cliente, fecha, autorizacion,
    formaPago, detallado, descuento, iva, flete, subtotal) => {
  return builder('ventas')
    .where({codigo, empresa}).update({
      cliente: cliente,
      fecha: fecha,
      autorizacion: autorizacion,
      formaPago: formaPago,
      detallado: detallado,
      flete: flete,
      descuento: descuento,
      iva: iva,
      subtotal: subtotal,
    })
}

const updateVentaExamen = (builder, codigo, empresa, cliente, fecha, autorizacion, formaPago,
    descuento, subtotal) => {
  return updateVenta(builder, codigo, empresa, cliente, fecha, autorizacion,
    formaPago, false, descuento, 0, 0, subtotal)
}

const updateExamenInfo = (builder, medico, paciente, codigo, empresa) => {
  const medicoAscii = convertToAscii(medico)
  const pacienteAscii = convertToAscii(paciente)
  return builder('examen_info')
    .where({codigoVenta: codigo, empresaVenta: empresa}).update({
      medico_id: medicoAscii,
      paciente: paciente,
      pacienteAscii: pacienteAscii,
    })
}

const getExamenInfo = (codigo, empresa) => {
  return knex.select('nombre', 'nombreAscii', 'paciente')
    .from('examen_info')
    .join('medicos', { 'examen_info.medico_id' : 'medicos.nombreAscii' })
    .where({codigoVenta: codigo, empresaVenta: empresa})
}

const deleteVenta = (codigo, empresa) => {
  return knex('ventas')
    .where({codigo, empresa})
    .del()
}

const deleteProducto = (rowid) => {
  return knex('productos')
    .where({rowid})
    .del()
}

const deleteCliente = (ruc) => {
  return knex('clientes')
    .where({ ruc })
    .del()
}

const deleteUnidadesVenta = (builder, codigo, empresa) => {
  return builder('unidades')
    .where({ codigoVenta: codigo, empresaVenta: empresa})
    .del()
}

const insertarNuevasUnidades = (builder, listaDeUnidades) => {
  return builder.table('unidades').insert(listaDeUnidades)
}

const insertarExamenInfo = (builder, medico, paciente, codigo, empresa) => {
  const medicoAscii = convertToAscii(medico)
  const pacienteAscii = convertToAscii(paciente)
  return builder.table('examen_info').insert({
    medico_id: medicoAscii,
    paciente: paciente,
    pacienteAscii: pacienteAscii,
    codigoVenta: codigo,
    empresaVenta: empresa,
  })
}

const getVenta = (codigo, empresa) => {
  return knex.select('*')
  .from('ventas')
  .where({codigo: codigo, empresa: empresa, tipo: 0})
}

const getVentaExamen = (codigo, empresa) => {
  return knex.select('*')
  .from('ventas')
  .where({empresa: empresa, codigo: codigo, tipo: 1})
}

const findVentas = (nombreCliente) => {
  const nombreClienteAscii = convertToAscii(nombreCliente)
  return knex.select('codigo', 'empresa', 'fecha', 'ruc', 'nombre', 'iva',
    'descuento', 'autorizacion', 'flete', 'detallado', 'subtotal', 'tipo')
    .from('ventas')
    .join('clientes', {'ventas.cliente' : 'clientes.ruc' })
    .where('nombreAscii', 'like', `%${nombreClienteAscii}%`)
    .where('tipo', 0)
    .orderBy('fecha', 'desc')
    .limit(50)
}

const findAllVentas = (nombreCliente) => {
  const nombreClienteAscii = convertToAscii(nombreCliente)
  return knex.select('codigo', 'empresa', 'fecha', 'ruc', 'nombre', 'iva',
    'descuento', 'autorizacion', 'flete', 'detallado', 'subtotal', 'tipo')
    .from('ventas')
    .join('clientes', {'ventas.cliente' : 'clientes.ruc' })
    .where('nombreAscii', 'like', `%${nombreClienteAscii}%`)
    .orderBy('fecha', 'desc')
    .limit(50)
}

const findVentasExamen = (nombre) => {
  const nombreAscii = convertToAscii(nombre)
  return knex.select('codigo', 'fecha', 'ruc', 'nombre', 'subtotal',
    'descuento', 'iva', 'paciente', 'medico_id', 'detallado')
    .from('ventas')
    .join('clientes', {'ventas.cliente' : 'clientes.ruc' })
    .join('examen_info', {
      'ventas.codigo' : 'examen_info.codigoVenta',
      'ventas.empresa' : 'examen_info.empresaVenta',
    })
    .where('nombreAscii', 'like', `%${nombreAscii}%`)
    .orWhere('pacienteAscii', 'like', `%${nombreAscii}%`)
    .where('tipo', 1)
    .orderBy('fecha', 'desc')
    .limit(50)
}

const getCliente = (ruc) => {
  return knex.select('*')
  .from('clientes')
  .where('ruc', ruc)
}

const getFacturablesVenta = (codigo, empresa) => {
  return knex.select('productos.nombre', 'unidades.producto', 'unidades.count',
  'unidades.precioVenta', 'productos.codigo', 'productos.pagaIva',
  'productos.marca', 'unidades.lote', 'unidades.fechaExp')
  .from('unidades')
  .join('productos', {'unidades.producto' : 'productos.rowid' })
  .where({codigoVenta: codigo, empresaVenta: empresa})
}

const getVentaPorTipo = (codigo, empresa, tipo) => {
  switch (tipo) {
    case 0:
      return getVenta(codigo, empresa)
    case 1:
      return getVentaExamen(codigo, empresa)
    default:
      throw Error('Tipo de venta desconocido')
  }
}

const getFacturaData = (codigo, empresa, tipo) => {
  let ventaRow, cliente;
  const p = getVentaPorTipo(codigo, empresa, tipo)
  .then((ventas) => {
    if (ventas.length > 0) {
      ventaRow = ventas[0]
      return getCliente(ventaRow.cliente)
    } else {
      return Promise.reject({errorCode: 404, text:"factura no encontrada"})
    }
  })
  .then((clientes) => {
    if (clientes.length > 0) {
      cliente = clientes[0]
      return getFacturablesVenta(codigo, empresa)
    } else {
      return Promise.reject({errorCode: 404, text: "cliente no encontrado"})
    }
  })

  if (tipo === 0)
    return p.then ((facturables) => {
      ventaRow.facturables = facturables
      return Promise.resolve({ventaRow: ventaRow, cliente: cliente})
    })
  else
    return p.then((facturables) => {
      ventaRow.facturables = facturables
      return getExamenInfo(codigo, empresa)
    })
    .then((rows) => {
      if (rows.length > 0) {
        const exInfo = rows[0]
        const medico = { nombre: exInfo.nombre, nombreAscii: exInfo.nombreAscii }
        ventaRow.paciente = exInfo.paciente
        return Promise.resolve({ventaRow, cliente, medico})
      } else {
        return Promise.reject({errorCode: 404, text: 'examen no encontrado'})
      }
    })
}

const buscarEnTabla = (tabla, columna, queryString, limit) => {
  const limitValue = limit || 5
  const query = knex.select('*')
    .from(tabla)
    .limit(limitValue)
  if (queryString !== '')
    return query.where(columna, 'like', `%${queryString}%`)
  return query
}

module.exports = {
  close: () => { knex.destroy() },
  insertarProducto: (codigo, nombre, marca, precioDist, precioVenta, pagaIva) => {
    const nombreAscii = convertToAscii(nombre)
    return knex.table('productos').insert({
      codigo: codigo,
      nombreAscii: nombreAscii,
      nombre: nombre,
      marca: marca,
      precioDist: precioDist,
      precioVenta: precioVenta,
      pagaIva: pagaIva,
    })
  },

  findProductos: (queryString, limit) => {
    const queryStringAscii = convertToAscii(queryString)
    return buscarEnTabla('productos', 'nombreAscii', queryStringAscii, limit)
  },

  insertarCliente: (ruc, nombre, direccion, email, telefono1, telefono2, descDefault) => {
    const nombreAscii = convertToAscii(nombre)
    return knex.table('clientes').insert({
      ruc: ruc,
      nombreAscii: nombreAscii,
      nombre: nombre,
      direccion: direccion,
      email: email,
      telefono1: telefono1,
      telefono2: telefono2,
      descDefault: descDefault,
    })
  },

  findClientes: (queryString) => {
    const queryStringAscii = convertToAscii(queryString)
    return buscarEnTabla('clientes', 'nombreAscii', queryStringAscii)
  },

  insertarMedico: (nombre, direccion, email, comision, telefono1, telefono2) => {
    const nombreAscii = convertToAscii(nombre)
    return knex.table('medicos').insert({
      nombreAscii: nombreAscii,
      nombre: nombre,
      direccion: direccion,
      email: email,
      comision: comision,
      telefono1: telefono1,
      telefono2: telefono2,
    })
  },

  findMedicos: (queryString) => {
    const queryStringAscii = convertToAscii(queryString)
    return buscarEnTabla('medicos', 'nombreAscii', queryStringAscii)
  },

  insertarVenta: (codigo, empresa, cliente, fecha, autorizacion, formaPago,
    detallado, descuento, iva, flete, subtotal, unidades) => {
    return knex.transaction ((trx) => {
      return insertarVentaBase(trx, codigo, empresa, cliente, fecha, autorizacion,
        formaPago, detallado, 0, descuento, iva, flete, subtotal)
      .then(() => {
        colocarVentaID(unidades, codigo, empresa)
        return insertarNuevasUnidades(trx, unidades)
      }, (err) => {
        return Promise.reject(err)
      })
    })
  },

  insertarVentaExamen: (codigo, empresa, cliente, fecha, autorizacion, formaPago,
    descuento, subtotal, unidades, medico, paciente) => {
    return knex.transaction ((trx) => {
      return insertarVentaBase(trx, codigo, empresa, cliente, fecha,
        autorizacion, formaPago, false, 1, descuento, 0, 0, subtotal)
      .then(() => {
        return insertarExamenInfo(trx, medico, paciente, codigo, empresa)
      })
      .then(() => {
        colocarVentaID(unidades, codigo, empresa)
        return insertarNuevasUnidades(trx, unidades)
      })
    })
  },


  updateVenta: (codigo, empresa, cliente, fecha, autorizacion, formaPago,
    detallado, descuento, iva, flete, subtotal, unidades) => {
    return knex.transaction ((trx) => {
      return updateVenta(trx, codigo, empresa, cliente, fecha, autorizacion,
        formaPago, detallado, descuento, iva, flete, subtotal)
      .then(() => {
        return deleteUnidadesVenta(trx, codigo, empresa)
      })
      .then(() => {
        colocarVentaID(unidades, codigo, empresa)
        return insertarNuevasUnidades(trx, unidades)
      })
    })
  },

  updateVentaExamen: (codigo, empresa, cliente, fecha, autorizacion, formaPago,
    descuento, subtotal, unidades, medico, paciente) => {
    return knex.transaction ((trx) => {
      return updateVentaExamen(trx, codigo, empresa, cliente, fecha, autorizacion,
        formaPago, descuento, subtotal)
      .then(() => {
        return deleteUnidadesVenta(trx, codigo, empresa)
      })
      .then(() => {
        return updateExamenInfo(trx, medico, paciente, codigo, empresa)
      })
      .then(() => {
        colocarVentaID(unidades, codigo, empresa)
        return insertarNuevasUnidades(trx, unidades)
      })
    })
  },

  findAllVentas,
  findVentas: (keywords, tipo) => {
    if (tipo === 0)
      return findVentas(keywords)
    else
      return findVentasExamen(keywords)
  },

  getFacturaData,

  getExamenInfo,
  deleteCliente,
  deleteVenta,
  deleteProducto,
  getFacturablesVenta,
}
