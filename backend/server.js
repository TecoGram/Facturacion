
const Express = require('express')
const bodyParser = require('body-parser');
const PDFWriter = require('./pdf/PDFWriter.js')
const pdfutils = require('./pdf/pdfutils.js')
const facturaTemplates = require('./pdf/templates.js')
const fs = require('fs')
const util = require('util')

const db = require('./dbAdmin.js')
const formatter = require('./responseFormatter.js')

const port = process.env.PORT || 8192
//crear directorio donde almacenar facturas en pdf.
const facturaDir = pdfutils.createTemporaryDir('facturas/')



const printError = (errorString) => {
  //don't print errors in tests. Tests should print errors from the response
  if(process.env.NODE_ENV !== 'test') console.error(errorString)
}

const app = Express()
app.use(bodyParser.json()); // for parsing application/json

app.post('/cliente/new', function (req, res) {
  const {
    ruc,
    nombre,
    direccion,
    email,
    telefono1,
    telefono2,
    descDefault,
  } = req.body

  db.insertarCliente(ruc, nombre, email, direccion, telefono1, telefono2, descDefault)
  .then(function (data) {//OK!
    res.status(200)
    .send('OK')
  }, function (err) {//ERROR!
    printError('db error: ' + err)
    res.status(422)
    .send(err)
  })

});

app.get('/cliente/find', function (req,res) {
  const q = req.query.q || ''
  db.findClientes(q)
  .then(function(clientes) {
    if(clientes.length === 0)
      res.status(404)
      .send('No existen clientes con esa cadena de caracteres')
    else
      res.status(200)
      .send(clientes)
  }, function (err) {//ERROR!
    res.status(500)
    .send(err)
  })

});


app.post('/medico/new', function (req, res) {
  const {
    nombre,
    direccion,
    email,
    comision,
    telefono1,
    telefono2,
  } = req.body

  db.insertarMedico(nombre, email, direccion, comision, telefono1, telefono2)
  .then(function (data) {//OK!
    res.status(200)
    .send('OK')
  }, function (err) {//ERROR!
    printError('db error: ' + err)
    res.status(422)
    .send(err)
  })

});

app.get('/medico/find', function (req,res) {
  const q = req.query.q || ''
  db.findMedicos(q)
  .then(function(medicos) {
    if(medicos.length === 0)
      res.status(404)
      .send('No existen clientes con esa cadena de caracteres')
    else
      res.status(200)
      .send(medicos)
  }, function (err) {//ERROR!
    res.status(500)
    .send(err)
  })

});

app.post('/producto/new', function (req, res) {
  const {
    codigo,
    nombre,
    precioDist,
    precioVenta,
    pagaIva,
  } = req.body

  db.insertarProducto(codigo, nombre, precioDist, precioVenta, pagaIva)
  .then(function(id) {
    res.status(200)
    .send(id)
  }, function (err) {//ERROR!
    printError('db error: ' + JSON.stringify(err))
    res.status(422)
    .send(err)
  })
})

app.get('/producto/find', function (req,res) {
  const q = req.query.q || ''
  db.findProductos(q)
  .then(function(productos) {
    if(productos.length === 0)
      res.status(404)
      .send('No existen productos con esa cadena de caracteres')
    else
      res.status(200)
      .send(productos)
  }, function (err) {//ERROR!
    res.status(500)
    .send(err)
  })

});

function verVenta(req, res, tipo) {
  const {
    codigo,
    empresa,
  } = req.params
  const facturaFileName = codigo + empresa + '.pdf'

  if (req.headers.accept === 'application/json') //send json
    db.getFacturaData(codigo, empresa, tipo)
      .then(function (resp) {//OK!!
        res.status(200)
        .send(formatter.verVenta(resp))
      }, function (error) { //ERROR!
        res.status(error.errorCode)
        .send(error.text)
      })
  else //send pdf
    db.getFacturaData(codigo, empresa, tipo)
      .then(function (resp) {//OK!!
        const {
          ventaRow,
          cliente,
        } = resp

        const writeFunc = facturaTemplates.biocled(ventaRow, cliente)
        return new PDFWriter(facturaDir + facturaFileName, writeFunc)
      }, function (error) { //ERROR!
        return Promise.reject(error)
      })
      .then(function () {
        fs.readFile(facturaDir + facturaFileName, function (err, data) {
          JSON.stringify(err)
          res.contentType("application/pdf")
          res.send(data)
        })
      }, function (error) {
        res.status(error.errorCode)
        .send(error.text)

      })
}

app.get('/venta/ver/:empresa/:codigo', function (req, res) {
  verVenta(req, res, 0)
})

app.get('/venta_ex/ver/:empresa/:codigo', function (req, res) {
  verVenta(req, res, 1)
})

function deleteVenta(req, res, tipo) {
  const {
    codigo,
    empresa,
  } = req.params

  db.deleteVenta(codigo, empresa, tipo)
  .then(function(deletions) {
    if (deletions === 0)
      res.status(404)
      .send(`Factura con codigo: ${codigo} y empresa: ${empresa} no encontrada}`)
    else
      res.status(200)
      .send('OK')
  }, function (err) {//ERROR!
    res.status(500)
    .send(err)
  })}

app.get('/venta/delete/:empresa/:codigo', function (req, res) {
  deleteVenta(req, res, 0)
});

app.get('/venta_ex/delete/:empresa/:codigo', function (req, res) {
  deleteVenta(req, res, 1)
});

function findVentas (req, res, tipo) {
  const q = req.query.q || ''
  db.findVentas(q, tipo)
  .then(function(ventas) {
    if(ventas.length === 0)
      res.status(404)
      .send('No existen facturas con esa cadena de caracteres')
    else
      res.status(200)
      .send(formatter.findVentas(ventas))
  }, function (err) {//ERROR!
    res.status(500)
    .send(err)
  })
}

app.get('/venta/find', function (req, res) {
  findVentas(req, res, 0)
});

app.get('/venta_ex/find', function (req, res) {
  findVentas(req, res, 1)
});

app.post('/venta/new', function (req, res) {
  const {
    codigo,
    cliente,
    empresa,
    fecha,
    autorizacion,
    formaPago,
    subtotal,
    descuento,
    iva,
    productos,

  } = req.body
  db.insertarVenta(codigo, empresa, cliente, fecha, autorizacion, formaPago,
    descuento, iva, subtotal, productos)
  .then(function (data) {  //OK!
    res.status(200)
    .send("OK")
  }, function (error) {//ERROR!
    res.status(500)
    res.send(error)
  })
})

app.post('/venta_ex/new', function (req, res) {
  const {
    codigo,
    cliente,
    fecha,
    autorizacion,
    formaPago,
    subtotal,
    descuento,
    total,
    productos,
    medico,
    paciente,

  } = req.body
  db.insertarVentaExamen(codigo, cliente, fecha, autorizacion, formaPago,
    descuento, subtotal, productos, medico, paciente)
  .then(function (data) {  //OK!
    res.status(200)
    .send("OK")
  }, function (error) {//ERROR!
    res.status(500)
    res.send(error)
  })
})

app.post('/venta/update', function (req, res) {
  const {
    codigo,
    empresa,
    cliente,
    fecha,
    autorizacion,
    formaPago,
    subtotal,
    descuento,
    iva,
    productos,

  } = req.body

  db.updateVenta(codigo, empresa, cliente, fecha, autorizacion, formaPago,
    descuento, iva, subtotal, productos)
  .then(function (data) {  //OK!
    res.status(200)
    .send("OK")
  })
  .catch(function (error) {//ERROR!
    res.status(500)
    res.send(error)
  })
})

app.post('/venta_ex/update', function (req, res) {
  const {
    codigo,
    cliente,
    fecha,
    autorizacion,
    formaPago,
    subtotal,
    descuento,
    productos,
    medico,
    paciente,

  } = req.body

  db.updateVentaExamen(codigo, cliente, fecha, autorizacion, formaPago,
    descuento, subtotal, productos, medico, paciente)
  .then(function (data) {  //OK!
    res.status(200)
    .send("OK")
  })
  .catch(function (error) {//ERROR!
    res.status(500)
    res.send(error)
  })
})
const server = app.listen(port, function () {
  //eslint-disable-next-line
  console.log('Application listening on  port ' + port);
});

module.exports = server
