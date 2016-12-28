const knex = require('./db.js')

const colocarVentaID = (unidades, fecha, codigo) => {
  const len = unidades.length
  for (let i = 0; i < len; i++) {
    unidades[i].codigo = codigo
    unidades[i].fecha = fecha
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

const insertarNuevasUnidades = (builder, listaDeUnidades) => {
  return builder.table('unidades').insert(listaDeUnidades)
}
const getVenta = (fecha, codigo) => {
  return knex.select('*')
  .from('ventas')
  .where({fecha: fecha, codigo: codigo})
}

const getUnidadesVenta = (fecha, codigo) => {
  return knex.select('*')
  .from('unidades')
  .where({fecha: fecha, codigo})
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

  insertarVenta: (codigo, cliente, fecha, autorizacion, formaPago,
    subtotal, descuento, iva, total, unidades) => {
    return knex.transaction ((trx) => {
      return insertarVenta(trx, codigo, cliente, fecha, autorizacion, formaPago,
    subtotal, descuento, iva, total)
      .then((ids) => {
        const ventaId = ids[0]
        colocarVentaID(unidades, fecha, codigo)
        return insertarNuevasUnidades(trx, unidades)
      }, (err) => {
        return Promise.reject(err)
      })
    })
  },

  getFacturaData: (fecha, codigo) => {
    let ventaRow;
    return getVenta(fecha, codigo)
    .then((ventas) => {
      if (ventas.length > 0) {
        ventaRow = ventas[0]
        return getUnidadesVenta(fecha, codigo)
      } else {
        return Promise.reject(404)
      }
    }, (err) => {
      return Promise.reject(500)
    })
    .then ((productos) => {
      ventaRow.productos = productos
      return Promise.resolve(ventaRow)
    }, (errorCode) => {
      return Promise.reject(errorCode)
    })
  },
}
