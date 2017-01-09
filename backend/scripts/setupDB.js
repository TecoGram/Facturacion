/* eslint-disable no-console */
const knex = require('../db.js')
module.exports = () => {
  return knex.schema.hasTable('productos')
  .then((exists) => {
    if(!exists)
      return knex.schema.createTable('productos', (table) => {
        table.integer('rowid').primary()
        table.string('codigo', 10)
        table.string('nombre', 50)
        table.float('precioDist')
        table.float('precioVenta')

        table.unique('nombre')
      })
      .createTable('clientes', (table) => {
        table.string('ruc', 13).primary()
        table.string('nombre', 50).index()
        table.string('direccion', 60)
        table.string('email', 10)
        table.string('telefono1', 10)
        table.string('telefono2', 10)
      })
      .createTable('medicos', (table) => {
        table.integer('rowid').primary()
        table.string('nombre', 50)
        table.string('direccion', 60)
        table.string('email', 10)
        table.integer('comision')
        table.string('telefono1', 10)
        table.string('telefono2', 10)

        table.unique('nombre')
      })
      .createTable('ventas', (table) => {
        table.string('codigo')
        table.string('cliente')
        table.date('fecha').index()
        table.string('autorizacion')
        table.string('formaPago')
        table.float('subtotal')
        table.float('descuento')
        table.float('iva')
        table.float('total')

        table.primary('fecha', 'codigo')
        table.foreign('cliente').references('clientes.ruc')
      })
      .createTable('stock', (table) => {
        table.integer('producto').unsigned().index()
        table.string('lote')
        table.date('fechaExp')

        table.foreign('producto').references('productos.rowid')
      })
    else return Promise.reject()
  })
  .then(() => {
    return knex.raw('create table "unidades" ("rowid" integer, "producto" integer, '
      + '"fechaVenta" date, "codigoVenta" varchar(255), "lote" varchar(255), '
      + '"precioVenta" float, "count" integer, "fechaExp" date, foreign key("producto") '
      + 'references "productos"("rowid"), foreign key("fechaVenta", "codigoVenta") '
      + 'references "ventas"("fecha", "codigo") on delete CASCADE, primary key ("rowid"))')
  }, () => {//rejection, clear tables instead
    return knex('unidades').truncate()
      .then(() => {return knex('stock').truncate() })
      .then(() => {return knex('ventas').truncate() })
      .then(() => {return knex('productos').truncate() })
      .then(() => {return knex('clientes').truncate() })
      .then(() => {return knex('medicos').truncate() })
  })
}

if (require.main === module)
  module.exports().then(() => { knex.destroy() })
