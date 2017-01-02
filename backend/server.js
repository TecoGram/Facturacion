
const Express = require('express')
const bodyParser = require('body-parser');
const PDFWriter = require('./pdf/PDFWriter.js')
const pdfutils = require('./pdf/pdfutils.js')
const facturaTemplates = require('./pdf/templates.js')
const fs = require('fs')
const util = require('util')

const db = require('./dbAdmin.js')

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
  } = req.body

  db.insertarCliente(ruc, nombre, email, direccion, telefono1, telefono2)
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

app.post('/producto/new', function (req, res) {
  const {
    codigo,
    nombre,
    precioDist,
    precioVenta,
  } = req.body

  db.insertarProducto(codigo, nombre, precioDist, precioVenta)
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

app.get('/venta/ver/:fecha/:codigo', function (req, res) {
  const {
    fecha,
    codigo,
  } = req.params
  const facturaFileName = codigo + fecha + '.pdf'
  db.getFacturaData(fecha, codigo)
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
})

app.get('/venta/find', function (req,res) {
  const q = req.query.q || ''
  db.findVentas(q)
  .then(function(ventas) {
    if(ventas.length === 0)
      res.status(404)
      .send('No existen facturas con esa cadena de caracteres')
    else
      res.status(200)
      .send(ventas)
  }, function (err) {//ERROR!
    res.status(500)
    .send(err)
  })
});

app.post('/venta/new', function (req, res) {
  const {
    codigo,
    cliente,
    fecha,
    autorizacion,
    formaPago,
    subtotal,
    descuento,
    iva,
    total,
    productos,

  } = req.body
  let facturaFileName = codigo + fecha + '.pdf'

  db.insertarVenta(codigo, cliente, fecha, autorizacion, formaPago, subtotal,
    descuento, iva, total, productos)
  .then(function (data) {  //OK!
    res.status(200)
    .send("OK")
  }, function (error) {//ERROR!
    res.status(500)
    res.send(error)
  })
})

const server = app.listen(port, function () {
  //eslint-disable-next-line
  console.log('Application listening on  port ' + port);
});

server.good_night = function () {
  db.close()
  server.close()
}

module.exports = server
