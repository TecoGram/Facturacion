const knex = require('../db.js')

knex.schema.createTableIfNotExists('productos', (table) => {
  console.log('create productos')
  table.string('codigo', 10)
  table.string('nombre', 50)
  table.float('precioDist')
  table.float('precioVenta')

  table.unique('nombre')
}).then(() => {
  return knex.schema.createTableIfNotExists('clientes', (table) => {
    console.log('create clientes')
    table.string('ruc', 13).primary()
    table.string('nombre', 50).index()
    table.string('direccion', 60)
    table.string('email', 10)
    table.string('telefono1', 10)
    table.string('telefono2', 10)
  })
}).then(() => {
  return knex.schema.createTableIfNotExists('ventas', (table) => {
    console.log('create clientes')
    table.string('codigo')
    table.integer('cliente').unsigned()
    table.date('fecha').index()
    table.float('subtotal')
    table.float('descuento')
    table.float('iva')
    table.float('total')

    table.foreign('cliente').references('clientes.ruc')
  })
}).then(() => {
  return knex.schema.createTableIfNotExists('unidades', (table) => {
    console.log('create unidades')
    table.integer('producto').unsigned().index()
    table.integer('venta').unsigned()
    table.date('expiracion')

    table.foreign('producto').references('productos.rowid')
    table.foreign('venta').references('ventas.rowid')
  })
}).then(() => { knex.destroy()})
