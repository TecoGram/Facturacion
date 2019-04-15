const fs = require('fs');
const path = require('path');

const Express = require('express');
const bodyParser = require('body-parser');

const PDFWriter = require('./pdf/PDFWriter.js');
const pdfutils = require('./pdf/pdfutils.js');
const facturaTemplate = require('./pdf/template.js');
const db = require('./dbAdmin.js');
const formatter = require('./responseFormatter.js');
const {
  validarBusqueda,
  validarCliente,
  validarClienteUpdate,
  validarMedico,
  validarProducto,
  validarVenta,
  validarVentaUpdate,
  validarVentaExamen,
  validarVentaExamenUpdate
} = require('./sanitizationMiddleware.js');
const { serveTecogram, serveBiocled } = require('./empresaMiddleware.js');
const CONSTRAINT_ERROR_SQLITE = 19;
const port = process.env.PORT || 8192;
//crear directorio donde almacenar facturas en pdf.
const facturaDir = pdfutils.createTemporaryDir('facturas/');

const printError = errorString => {
  //don't print errors in tests. Tests should print errors from the response
  if (process.env.NODE_ENV !== 'test') console.error(errorString);
};

const app = Express();
app.get('/', (req, res) => {
  res.redirect('/teco');
});
app.use('/', Express.static(path.join(__dirname, '../../frontend/build')));
app.use(bodyParser.json()); // for parsing application/json

app.get('/teco', serveTecogram);
app.get('/biocled', serveBiocled);

app.post('/cliente/new', validarCliente, (req, res) => {
  db.insertarCliente(req.safeData).then(
    rowid => {
      //OK!
      res.status(200).send({ rowid });
    },
    err => {
      //ERROR!
      printError('db error: ' + err);
      res.status(422).send(err);
    }
  );
});

app.get('/cliente/find', (req, res) => {
  const q = req.query.q || '';
  db.findClientes(q).then(
    function(clientes) {
      if (clientes.length === 0)
        res
          .status(404)
          .send('No existen clientes con esa cadena de caracteres');
      else res.status(200).send(clientes);
    },
    function(err) {
      //ERROR!
      res.status(500).send(err);
    }
  );
});

app.post('/cliente/update', validarClienteUpdate, (req, res) => {
  const {
    ruc,
    nombre,
    direccion,
    email,
    telefono1,
    telefono2,
    descDefault
  } = req.safeData;

  const handleSuccess = function(updateCount) {
    if (updateCount === 0) res.status(404).send('Cliente no encontrado');
    else res.status(200).send('Cliente actualizado');
  };

  const handleFailiure = function(err) {
    console.log(err);
    res.status(500).send(err);
  };

  db.updateCliente(
    ruc,
    nombre,
    direccion,
    email,
    telefono1,
    telefono2,
    descDefault
  ).then(handleSuccess, handleFailiure);
});

app.post('/cliente/delete/:id', (req, res) => {
  const ruc = req.params.id;

  const handleSuccess = function(deleteCount) {
    if (deleteCount === 0) res.status(404).send('Cliente no encontrado');
    else res.status(200).send('Cliente eliminado');
  };

  const handleFailiure = function(err) {
    if (err.errno === CONSTRAINT_ERROR_SQLITE)
      res
        .status(400)
        .send('Error: Borrar este cliente dañaría una factura existente.');
    else res.status(422).send(err);
  };

  db.deleteCliente(ruc).then(handleSuccess, handleFailiure);
});

app.post('/medico/new', validarMedico, (req, res) => {
  const {
    nombre,
    direccion,
    email,
    comision,
    telefono1,
    telefono2
  } = req.safeData;

  db.insertarMedico(
    nombre,
    direccion,
    email,
    comision,
    telefono1,
    telefono2
  ).then(
    function() {
      //OK!
      res.status(200).send('OK');
    },
    function(err) {
      //ERROR!
      printError('db error: ' + err);
      res.status(422).send(err);
    }
  );
});

app.get('/medico/find', (req, res) => {
  const q = req.query.q || '';
  db.findMedicos(q).then(
    function(medicos) {
      if (medicos.length === 0)
        res
          .status(404)
          .send('No existen clientes con esa cadena de caracteres');
      else res.status(200).send(medicos);
    },
    function(err) {
      //ERROR!
      res.status(500).send(err);
    }
  );
});

app.post('/producto/new', validarProducto, (req, res) => {
  const {
    codigo,
    nombre,
    marca,
    precioDist,
    precioVenta,
    pagaIva
  } = req.safeData;

  db.insertarProducto(
    codigo,
    nombre,
    marca,
    precioDist,
    precioVenta,
    pagaIva
  ).then(
    function(id) {
      res.status(200).send(id);
    },
    function(err) {
      //ERROR!
      printError('db error: ' + JSON.stringify(err));
      res.status(422).send(err);
    }
  );
});

app.get('/producto/find', validarBusqueda, (req, res) => {
  const q = req.query.q || '';
  db.findProductos(q, req.query.limit).then(
    function(productos) {
      if (productos.length === 0)
        res
          .status(404)
          .send('No existen productos con esa cadena de caracteres');
      else res.status(200).send(productos);
    },
    function(err) {
      //ERROR!
      res.status(500).send(err);
    }
  );
});

app.post('/producto/update', validarProducto, (req, res) => {
  const {
    rowid,
    codigo,
    nombre,
    marca,
    precioDist,
    precioVenta,
    pagaIva
  } = req.safeData;

  const handleSuccess = function(updateCount) {
    if (updateCount === 0) res.status(404).send('Producto no encontrado');
    else res.status(200).send('Producto actualizado');
  };

  const handleFailiure = function(err) {
    res.status(500).send(err);
  };

  db.updateProducto(
    rowid,
    codigo,
    nombre,
    marca,
    precioDist,
    precioVenta,
    pagaIva
  ).then(handleSuccess, handleFailiure);
});

app.post('/producto/delete/:id', (req, res) => {
  const id = req.params.id;

  const handleSuccess = function(deleteCount) {
    if (deleteCount === 0) res.status(404).send('Producto no encontrado');
    else res.status(200).send('Producto eliminado');
  };

  const handleFailiure = function(err) {
    if (err.errno === CONSTRAINT_ERROR_SQLITE)
      res
        .status(400)
        .send('Error: Borrar este producto dañaría una factura existente.');
    else res.status(422).send(err);
  };

  db.deleteProducto(id).then(handleSuccess, handleFailiure);
});

function verVenta(req, res, tipo) {
  const { codigo, empresa } = req.params;
  const facturaFileName = codigo + empresa + '.pdf';

  if (
    req.headers.accept === 'application/json' //send json
  )
    db.getFacturaData(codigo, empresa, tipo).then(
      function(resp) {
        //OK!!
        res.status(200).send(formatter.verVenta(resp));
      },
      function(error) {
        //ERROR!
        res.status(error.errorCode).send(error.text);
      }
    );
  //send pdf
  else
    db.getFacturaData(codigo, empresa, tipo)
      .then(
        function(resp) {
          //OK!!
          const { ventaRow, cliente } = resp;

          const pdfData = pdfutils.ventaRowToPDFData(ventaRow);
          const writeFunc = facturaTemplate(pdfData, cliente);
          return new PDFWriter(facturaDir + facturaFileName, writeFunc);
        },
        function(error) {
          //ERROR!
          return Promise.reject(error);
        }
      )
      .then(
        function() {
          fs.readFile(facturaDir + facturaFileName, function(err, data) {
            JSON.stringify(err);
            res.contentType('application/pdf');
            res.send(data);
          });
        },
        function(error) {
          res.status(error.errorCode).send(error.text);
        }
      );
}

app.get('/venta/ver/:empresa/:codigo', (req, res) => {
  verVenta(req, res, 0);
});

app.get('/venta_ex/ver/:empresa/:codigo', (req, res) => {
  verVenta(req, res, 1);
});

function deleteVenta(req, res) {
  const { codigo, empresa } = req.params;
  db.deleteVenta(codigo, empresa).then(
    function(deletions) {
      if (deletions === 0)
        res
          .status(404)
          .send(
            `Factura con codigo: ${codigo} y empresa: ${empresa} no encontrada}`
          );
      else res.status(200).send('OK');
    },
    function(err) {
      //ERROR!
      res.status(500).send(err);
    }
  );
}

app.post('/venta/delete/:empresa/:codigo', (req, res) => {
  deleteVenta(req, res);
});

app.post('/venta_ex/delete/:empresa/:codigo', (req, res) => {
  deleteVenta(req, res);
});

function findVentas(req, res, tipo, all) {
  const q = req.query.q || '';
  const promise = all ? db.findAllVentas(q) : db.findVentas(q, tipo);
  promise.then(
    function(ventas) {
      if (ventas.length === 0)
        res
          .status(404)
          .send('No existen facturas con esa cadena de caracteres');
      else res.status(200).send(formatter.findVentas(ventas));
    },
    function(err) {
      //ERROR!
      res.status(500).send(err);
    }
  );
}

app.get('/venta/find', (req, res) => {
  findVentas(req, res, 0);
});

app.get('/venta_ex/find', (req, res) => {
  findVentas(req, res, 1);
});

app.get('/venta/findAll', (req, res) => {
  findVentas(req, res, null, true);
});

const handleValidData = fn => async (req, res) => {
  try {
    const { status, resp } = await fn(req.safeData);
    res.status(status).send(resp);
  } catch (err) {
    res.status(500).send(err);
  }
};

app.post(
  '/venta/new',
  validarVenta,
  handleValidData(data =>
    db
      .insertarVenta(data)
      .then(rowid => ({ status: 200, resp: { rowid } }))
      .catch(err => {
        if (err.errno === CONSTRAINT_ERROR_SQLITE)
          return { status: 400, resp: 'Ya existe una factura con ese código.' };
        throw err;
      })
  )
);

app.post(
  '/venta_ex/new',
  validarVentaExamen,
  handleValidData(data =>
    db
      .insertarVentaExamen(data)
      .then(rowid => ({ status: 200, resp: { rowid } }))
      .catch(err => {
        console.log('error ', err);
        if (err.errno === CONSTRAINT_ERROR_SQLITE)
          return { status: 400, resp: 'Ya existe una factura con ese código.' };
        throw err;
      })
  )
);

app.post('/venta/update', validarVentaUpdate, (req, res) => {
  db.updateVenta(req.safeData)
    .then(function() {
      //OK!
      res.status(200).send('OK');
    })
    .catch(function(error) {
      //ERROR!
      console.log(error);
      res.status(500);
      res.send(error);
    });
});

app.post('/venta_ex/update', validarVentaExamenUpdate, (req, res) => {
  db.updateVentaExamen(req.safeData)
    .then(function() {
      //OK!
      res.status(200).send('OK');
    })
    .catch(function(error) {
      //ERROR!
      console.log('error', error);
      res.status(500);
      res.send(error);
    });
});

const server = app.listen(port, function() {
  //eslint-disable-next-line
  console.log('Application listening on  port ' + port);
});

module.exports = {
  destroy: () => {
    server.close();
    db.close();
  }
};
