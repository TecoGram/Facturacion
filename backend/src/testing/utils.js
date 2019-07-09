const Models = require('facturacion_common/src/Models.js');
const api = require('facturacion_common/src/api.js');
const db = require('../db.js');

const deleteVentas = () => db('ventas').del();

const fetchUnidad = async name => {
  const res = await api.findProductos(name);

  const products = res.body;
  const { nombre, codigo, ...unidad } = Models.facturableAUnidad(
    Models.productoAFacturable(products[0])
  );
  return unidad;
};

const fetchCliente = async name => {
  const res = await api.findClientes(name);

  return res.body[0].rowid;
};

const datilConfig = {
  apiKey: '__MI_API_KEY_SECRETO__',
  password: '__MI_PASS__',
  codigoIVA: '2', // 12%
  emision: {
    ambiente: 1, // pruebas
    moneda: 'USD',
    tipo_emision: 1, // normal
    emisor: {
      ruc: '0999999999001',
      razon_social: '__nombre__',
      nombre_comercial: '__nombre__',
      direccion: '__direccion__',
      contribuyente_especial: '',
      obligado_contabilidad: true,
      establecimiento: {
        codigo: '001',
        punto_emision: '001',
        direccion: '__direccion__'
      }
    }
  }
};

module.exports = { deleteVentas, fetchUnidad, fetchCliente, datilConfig };
