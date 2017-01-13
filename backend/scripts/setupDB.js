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
        table.string('nombre', 50).primary()
        table.string('direccion', 60)
        table.string('email', 10)
        table.integer('comision')
        table.string('telefono1', 10)
        table.string('telefono2', 10)

        table.unique('nombre')
      })
      .createTable('ventas', (table) => {
        table.string('codigo', 8)
        table.string('cliente', 13)
        table.date('fecha').index()
        table.string('autorizacion', 10)
        table.string('formaPago', 10)
        //tipo 0 para productos, 1 para examenes
        table.integer('tipo')
        table.float('subtotal')
        table.float('descuento')
        table.float('iva')
        table.float('total')

        table.primary('fecha', 'codigo')
        table.foreign('cliente').references('clientes.ruc')
      })
      .createTable('stock', (table) => {
        table.integer('producto').unsigned().index()
        table.string('lote', 10)
        table.date('fechaExp')

        table.foreign('producto').references('productos.rowid')
      })
    else return Promise.reject()
  })
  .then(() => {//Knex no soporta composite foreign keys. Raw queries SMH
    console.log('examen info')
    return knex.raw('create table "examen_info" ("rowid" integer, "medico_id" integer, '
      + '"fechaVenta" date, "codigoVenta" varchar(10), "paciente" varchar(50), foreign '
      + 'key("fechaVenta", "codigoVenta") references "ventas"("fecha", "codigo") '
      + 'on delete CASCADE, primary key ("rowid"))')
  }, (err) => Promise.reject(err))
  .then(() => {
    console.log('unidades info')
    return knex.raw('create table "unidades" ("rowid" integer, "producto" integer, '
      + '"fechaVenta" date, "codigoVenta" varchar(8), "lote" varchar(10), '
      + '"precioVenta" float, "count" integer, "fechaExp" date, foreign key("producto") '
      + 'references "productos"("rowid"), foreign key("fechaVenta", "codigoVenta") '
      + 'references "ventas"("fecha", "codigo") on delete CASCADE, primary key ("rowid"))')
  }, () => {//rejection, clear tables instead
    return knex('unidades').truncate()
      .then(() => {return knex('examen_info').truncate() })
      .then(() => {return knex('stock').truncate() })
      .then(() => {return knex('ventas').truncate() })
      .then(() => {return knex('productos').truncate() })
      .then(() => {return knex('clientes').truncate() })
      .then(() => {return knex('medicos').truncate() })
  })
}

if (require.main === module)
  module.exports().then(() => { knex.destroy() })
