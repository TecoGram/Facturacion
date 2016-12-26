/* eslint-disable no-console */
const knex = require('../db.js')

knex.schema.hasTable('productos')
.then((exists) => {
  if(!exists)
    return knex.schema.createTable('productos', (table) => {
      console.log('create productos')
      table.string('codigo', 10)
      table.string('nombre', 50)
      table.float('precioDist')
      table.float('precioVenta')

      table.unique('nombre')
    })
  else return Promise.resolve()
})
.then(() => {
  return knex.schema.hasTable('clientes')
})
.then((exists) => {
  if(!exists)
    return knex.schema.createTable('clientes', (table) => {
      console.log('create clientes')
      table.string('ruc', 13).primary()
      table.string('nombre', 50).index()
      table.string('direccion', 60)
      table.string('email', 10)
      table.string('telefono1', 10)
      table.string('telefono2', 10)
    })
  else return Promise.resolve()
}).then(() => {
  return knex.schema.hasTable('ventas')
})
.then((exists) => {
  if (!exists)
    return knex.schema.createTable('ventas', (table) => {
      console.log('create ventas')
      table.string('codigo')
      table.string('cliente').unsigned()
      table.date('fecha').index()
      table.string('autorizacion')
      table.string('formaPago')
      table.float('subtotal')
      table.float('descuento')
      table.float('iva')
      table.float('total')

      table.unique('codigo', 'fecha')
      table.foreign('cliente').references('clientes.ruc')
    })
  else return Promise.resolve()
}).then(() => {
  return knex.schema.hasTable('stock')
})
.then((exists) => {
  if (!exists)
    return knex.schema.createTable('stock', (table) => {
      console.log('create stock')
      table.integer('producto').unsigned().index()
      table.string('lote')
      table.date('fechaExp')

      table.foreign('producto').references('productos.rowid')
    })
  else return Promise.resolve()
}).then(() => {
  return knex.schema.hasTable('unidades')
})
.then((exists) => {
  if (!exists)
    return knex.schema.createTable('unidades', (table) => {
      console.log('create unidades')
      table.integer('producto').unsigned()
      table.integer('venta').unsigned().index()
      table.string('lote')
      table.float('precioVenta')
      table.integer('count')
      table.date('fechaExp')

      table.foreign('producto').references('productos.rowid')
      table.foreign('venta').references('ventas.rowid')
    })
  else return Promise.resolve()
}).then(() => { knex.destroy()})
