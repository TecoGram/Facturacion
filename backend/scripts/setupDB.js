/* eslint-disable no-console */
const knex = require('../db.js');
module.exports = () => {
  return knex.schema
    .hasTable('productos')
    .then(exists => {
      if (!exists)
        return knex.schema
          .createTable('productos', table => {
            table.integer('rowid').primary();
            table.string('codigo', 10);
            table.string('nombreAscii', 50);
            table.string('nombre', 50);
            table.string('marca', 30);
            table.float('precioDist');
            table.float('precioVenta');
            table.boolean('pagaIva');

            table.unique('nombre');
          })
          .createTable('clientes', table => {
            table.string('ruc', 13).primary();
            table.string('nombreAscii', 50).index();
            table.string('nombre', 50);
            table.string('direccion', 60);
            table.string('email', 10);
            table.string('telefono1', 10);
            table.string('telefono2', 10);
            table.int('descDefault');
          })
          .createTable('medicos', table => {
            table.string('nombreAscii', 50).primary();
            table.string('nombre', 50);
            table.string('direccion', 60);
            table.string('email', 10);
            table.integer('comision');
            table.string('telefono1', 10);
            table.string('telefono2', 10);
          })
          .createTable('ventas', table => {
            table.string('codigo', 10);
            table.string('empresa', 10);
            table.string('cliente', 13);
            table.date('fecha').index();
            table.string('autorizacion', 10);
            //el valor es un indice de Factura/Models.FormasDePago
            table.integer('formaPago');
            table.boolean('detallado');
            //tipo 0 para productos, 1 para examenes
            table.integer('tipo');
            table.integer('descuento');
            table.integer('iva');
            table.float('flete');
            table.float('subtotal');

            table.primary('codigo', 'empresa');
            table.foreign('cliente').references('clientes.ruc');
          })
          .createTable('stock', table => {
            table.integer('producto').unsigned().index();
            table.string('lote', 10);
            table.date('fechaExp');

            table.foreign('producto').references('productos.rowid');
          });
      else return Promise.reject();
    })
    .then(
      () => {
        //Knex no soporta composite foreign keys. Raw queries SMH
        return knex.raw(
          'create table "examen_info" ("rowid" integer, "medico_id" varchar(50), ' +
            '"codigoVenta" varchar(10), "empresaVenta" varchar(10), "paciente" ' +
            'varchar(50), "pacienteAscii" varchar(50), foreign key("medico_id") ' +
            'references "medicos"("nombreAscii"), foreign key("codigoVenta", "empresaVenta") ' +
            'references "ventas"("codigo", "empresa") on delete CASCADE, primary key ("rowid"))'
        );
      },
      err => Promise.reject(err)
    )
    .then(
      () => {
        return knex.raw(
          'create table "unidades" ("rowid" integer, "producto" integer, ' +
            '"codigoVenta" varchar(10), "empresaVenta" varchar(10), "lote" varchar(10), ' +
            '"precioVenta" float, "count" integer, "fechaExp" date, foreign key("producto") ' +
            'references "productos"("rowid"), foreign key("codigoVenta", "empresaVenta") ' +
            'references "ventas"("codigo", "empresa") on delete CASCADE, primary key ("rowid"))'
        );
      },
      () => {
        //rejection, clear tables instead
        return knex('unidades')
          .truncate()
          .then(() => {
            return knex('examen_info').truncate();
          })
          .then(() => {
            return knex('stock').truncate();
          })
          .then(() => {
            return knex('ventas').truncate();
          })
          .then(() => {
            return knex('productos').truncate();
          })
          .then(() => {
            return knex('clientes').truncate();
          })
          .then(() => {
            return knex('medicos').truncate();
          });
      }
    );
};

if (require.main === module)
  module.exports().then(() => {
    knex.destroy();
  });
