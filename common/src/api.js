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

  findProductos: (queryString, limit) => {
    const url =
      prefix +
      (limit
        ? `/producto/find?q=${queryString}&limit=${limit}`
        : `/producto/find?q=${queryString}`);
    return request.get(url).send();
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
