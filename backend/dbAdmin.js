const knex = require('./db.js')

const colocarVentaID = (unidades, ventaId) => {
  const len = unidades.length
  for (let i = 0; i < len; i++)
    unidades[i].venta = ventaId
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
    subtotal, descuento, iva, total) => {
    return knex.table('ventas').insert({
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
  },


}
