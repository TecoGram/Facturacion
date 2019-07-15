const request = require('superagent');

const prefix =
  process.env.NODE_ENV === 'integration' ? 'http://localhost:8192' : '';

const getFacturaURL = id => {
  return `${prefix}/venta/ver/${id}`;
};

module.exports = {
  insertarCliente: row => {
    return request
      .post(prefix + '/cliente/new')
      .send(row)
      .set('Accept', 'application/json');
  },

  updateCliente: row => {
    return request
      .post(prefix + '/cliente/update')
      .send(row)
      .set('Accept', 'application/json');
  },

  findClientes: queryString => {
    return request.get(prefix + '/cliente/find?q=' + queryString).send();
  },

  deleteCliente: (tipo, id) => {
    return request.post(prefix + `/cliente/delete/${tipo}/${id}`).send();
  },

  insertarMedico: medico => {
    return request
      .post(prefix + '/medico/new')
      .send(medico)
      .set('Accept', 'application/json');
  },

  findMedicos: queryString => {
    return request.get(prefix + '/medico/find?q=' + queryString).send();
  },

  insertarProducto: producto => {
    return request
      .post(prefix + '/producto/new')
      .send(producto)
      .set('Accept', 'application/json');
  },

  updateProducto: producto => {
    return request
      .post(prefix + '/producto/update')
      .send(producto)
      .set('Accept', 'application/json');
  },

  findProductos: ({ pagaIva, queryString, limit }) => {
    let path = `/producto/find?queryString=${queryString}`;
    if (limit && typeof pagaIva === 'boolean') {
      path = `/producto/find?pagaIva=${
        pagaIva ? 1 : 0
      }&queryString=${queryString}&limit=${limit}`;
    } else if (limit) {
      path = `/producto/find?queryString=${queryString}&limit=${limit}`;
    } else if (typeof pagaIva === 'boolean') {
      path = `/producto/find?pagaIva=${
        pagaIva ? 1 : 0
      }&queryString=${queryString}`;
    }

    return request.get(prefix + path).send();
  },

  deleteProducto: rowid => {
    return request.post(prefix + `/producto/delete/${rowid}`).send();
  },

  insertarVenta: ventaRow => {
    return request
      .post(prefix + '/venta/new')
      .send(ventaRow)
      .set('Accept', 'application/json');
  },

  emitirComprobante: rowid => {
    return request.post(prefix + `/venta/emitir/${rowid}`).send();
  },

  updateVenta: ventaRow => {
    return request
      .post(prefix + '/venta/update')
      .send(ventaRow)
      .set('Accept', 'application/json');
  },

  findAllVentas: (empresa, cliente) => {
    return request
      .get(`${prefix}/venta/find?empresa=${empresa}&cliente=${cliente}`)
      .send();
  },

  verVenta: id => {
    return request
      .get(prefix + `/venta/ver/${id}`)
      .send()
      .set('Accept', 'application/json');
  },

  deleteVenta: id => {
    return request
      .post(prefix + `/venta/delete/${id}`)
      .send()
      .set('Accept', 'application/json');
  },

  getFacturaURL
};
