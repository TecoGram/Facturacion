const knex = require('./db.js')

const colocarVentaID = (unidades, fecha, codigo) => {
  const len = unidades.length
  for (let i = 0; i < len; i++) {
    unidades[i].codigoVenta = codigo
    unidades[i].fechaVenta = fecha
  }
}

const insertarVenta = (builder, codigo, cliente, fecha, autorizacion, formaPago,
    subtotal, descuento, iva, total) => {
  return builder.table('ventas').insert({
    codigo: codigo,
    cliente: cliente,
    fecha: fecha,
    autorizacion: autorizacion,
    formaPago: formaPago,
    subtotal: subtotal,
    descuento: descuento,
    iva: iva,
    total: total,
  })
}

const updateVenta = (builder, codigo, cliente, fecha, autorizacion, formaPago,
    subtotal, descuento, iva, total) => {
  return builder('ventas')
    .where({codigo, fecha}).update({
      codigo: codigo,
      cliente: cliente,
      fecha: fecha,
      autorizacion: autorizacion,
      formaPago: formaPago,
      subtotal: subtotal,
      descuento: descuento,
      iva: iva,
      total: total,
    })
}

const deleteVenta = (codigo, fecha) => {
  return knex('ventas')
    .where({codigo, fecha})
    .del()
}


const deleteUnidadesVenta = (builder, codigo, fecha) => {
  return builder('unidades')
    .where({ codigoVenta: codigo, fechaVenta: fecha})
    .del()
}

const insertarNuevasUnidades = (builder, listaDeUnidades) => {
  return builder.table('unidades').insert(listaDeUnidades)
}

const getVenta = (fecha, codigo) => {
  return knex.select('*')
  .from('ventas')
  .where({fecha: fecha, codigo: codigo})
}

const findVentas = (nombreCliente) => {
  return knex.select('codigo', 'fecha', 'ruc', 'nombre', 'total')
    .from('ventas')
    .join('clientes', {'ventas.cliente' : 'clientes.ruc' })
    .where('nombre', 'like', `%${nombreCliente}%`)
    .orderBy('fecha', 'desc')
    .limit(20)
}

const getCliente = (ruc) => {
  return knex.select('*')
  .from('clientes')
  .where('ruc', ruc)
}

const getUnidadesVenta = (fecha, codigo) => {
  return knex.select('productos.nombre', 'unidades.producto', 'unidades.count',
  'unidades.precioVenta', 'unidades.lote', 'unidades.fechaExp')
  .from('unidades')
  .join('productos', {'unidades.producto' : 'productos.rowid' })
  .where({fechaVenta: fecha, codigoVenta: codigo})
}

module.exports = {
  close: () => { knex.destroy() },
  insertarProducto: (codigo, nombre, precioDist, precioVenta) => {
    return knex.table('productos').insert({
      codigo: codigo,
      nombre: nombre,
      precioDist: precioDist,
      precioVenta: precioVenta,
    })
  },

  findProductos: (queryString) => {
    const queries = queryString.split(' ')
    const queryObject = knex.select('*')
      .from('productos')
      .where('nombre', 'like', `%${queries[0]}%`)

    for(let i = 1; i < queries.length; i++)
      queryObject.orWhere('nombre', 'like', `%${queries[i]}%`)

    return queryObject.limit(5)
  },

  insertarCliente: (ruc, nombre, direccion, email, telefono1, telefono2) => {
    return knex.table('clientes').insert({
      ruc: ruc,
      nombre: nombre,
      direccion: direccion,
      email: email,
      telefono1: telefono1,
      telefono2: telefono2,
    })
  },

  findClientes: (queryString) => {
    const queries = queryString.split(' ')
    const queryObject = knex.select('*')
      .from('clientes')
      .where('nombre', 'like', `%${queries[0]}%`)

    for(let i = 1; i < queries.length; i++)
      queryObject.orWhere('nombre', 'like', `%${queries[i]}%`)

    return queryObject.limit(5)
  },

  insertarMedico: (nombre, direccion, email, comision, telefono1, telefono2) => {
    return knex.table('medicos').insert({
      nombre: nombre,
      direccion: direccion,
      email: email,
      comision: comision,
      telefono1: telefono1,
      telefono2: telefono2,
    })
  },

  findMedicos: (queryString) => {
    const queries = queryString.split(' ')
    const queryObject = knex.select('*')
      .from('medicos')
      .where('nombre', 'like', `%${queries[0]}%`)

    for(let i = 1; i < queries.length; i++)
      queryObject.orWhere('nombre', 'like', `%${queries[i]}%`)

    return queryObject.limit(5)
  },

  insertarVenta: (codigo, cliente, fecha, autorizacion, formaPago,
    subtotal, descuento, iva, total, unidades) => {
    return knex.transaction ((trx) => {
      return insertarVenta(trx, codigo, cliente, fecha, autorizacion, formaPago,
    subtotal, descuento, iva, total)
      .then((ids) => {
        colocarVentaID(unidades, fecha, codigo)
        return insertarNuevasUnidades(trx, unidades)
      }, (err) => {
        return Promise.reject(err)
      })
    })
  },

  updateVenta: (codigo, cliente, fecha, autorizacion, formaPago,
    subtotal, descuento, iva, total, unidades) => {
    return knex.transaction ((trx) => {
      return updateVenta(trx, codigo, cliente, fecha, autorizacion, formaPago,
    subtotal, descuento, iva, total)
      .then((ids) => {
        return deleteUnidadesVenta(trx, codigo, fecha)
      })
      .then((ids) => {
        colocarVentaID(unidades, fecha, codigo)
        return insertarNuevasUnidades(trx, unidades)
      })
    })
  },

  getFacturaData: (fecha, codigo) => {
    let ventaRow, cliente;
    return getVenta(fecha, codigo)
    .then((ventas) => {
      if (ventas.length > 0) {
        ventaRow = ventas[0]
        return getCliente(ventaRow.cliente)
      } else {
        return Promise.reject({errorCode: 404, text:"factura no encontrada"})
      }
    }, () => {
      return Promise.reject({errorCode: 500,
        text: "error de base de datos al buscar factura"})
    })
    .then((clientes) => {
      if (clientes.length > 0) {
        cliente = clientes[0]
        return getUnidadesVenta(fecha, codigo)
      } else {
        return Promise.reject({errorCode: 404, text: "cliente no encontrado"})
      }
    }, (error) => {
      if(error)
        return Promise.reject(error)
      else
        return Promise.reject({errorCode: 500,
          text: "error de base de datos al buscar cliente"})
    })
    .then ((productos) => {
      ventaRow.productos = productos
      return Promise.resolve({ventaRow: ventaRow, cliente: cliente})
    }, (error) => {
      return Promise.reject(error)
    })
  },

  findVentas,
  deleteVenta,
  getUnidadesVenta,

}
