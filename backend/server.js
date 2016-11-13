
const Express = require('express')
const bodyParser = require('body-parser');

const db = require('./dbAdmin.js')

const port = process.env.PORT || 8192

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
    res.status(500)
    .send(err)
  })

});

const server = app.listen(port, function () {
  //eslint-disable-next-line
  console.log('Application listening on  port ' + port);
});

server.good_night = function () {
  db.close()
  server.close()
}

module.exports = server
