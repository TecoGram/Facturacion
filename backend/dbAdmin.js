const knex = require('./db.js')

const insertarVenta = (builder, codigo, cliente, fecha, subtotal, descuento, iva, total) => {
  return builder.table('ventas').insert({
    codigo: codigo,
    cliente: cliente,
    fecha: fecha,
    subtotal: subtotal,
    descuento: descuento,
    iva: iva,
    total: total,
  })
}

const crearListaDeUnidades = (productosVendidos, ventaId) => {
  const listaDeUnidades = []
  productosVendidos.forEach((prod) => {
    if(!prod.servicio) {
      for(let i = 0; i < prod.cantidad; i++) {
        listaDeUnidades.push({
          producto: prod.rowid,
          venta: ventaId,
          expiracion: prod.expiracion,
        })
      }
    }
  })
  return listaDeUnidades
}

const insertarNuevasUnidades = (builder, listaDeUnidades) => {
  return builder.table('unidades').insert(listaDeUnidades)
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

  insertarCliente: (ruc, nombre, direccion, telefono1, telefono2) => {
    return knex.table('clientes').insert({
      ruc: ruc,
      nombre: nombre,
      direccion: direccion,
      telefono1: telefono1,
      telefono2: telefono2,
    })
  },

  insertarVenta: (codigo, cliente, fecha, subtotal, descuento, iva, total,
      productosVendidos) => {
    return knex.transaction ((trx) => {
      return insertarVenta(trx, codigo, cliente, fecha, subtotal, descuento, iva, total)
      .then((ids) => {
        const ventaId = ids[0]
        const unidades = crearListaDeUnidades(productosVendidos, ventaId)
        return insertarNuevasUnidades(trx, unidades)
      })
    })
  },


}
