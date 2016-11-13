
const Express = require('express')
const bodyParser = require('body-parser');

const db = require('./dbAdmin.js')

const port = process.env.PORT || 8192

const app = Express()
app.use(bodyParser.json()); // for parsing application/json

app.post('/cliente/new', function (req, res) {
  const {
    ruc,
    nombre,
    direccion,
    telefono1,
    telefono2,
  } = req.body

  db.insertarCliente(ruc, nombre, direccion, telefono1, telefono2)
  .then(function (data) {//OK!
    res.status(200)
    .send('OK')
  }, function (err) {//ERROR!
    res.status(500)
    res.send(err)
  })

});

app.listen(port, function () {
  //eslint-disable-next-line 
  console.log('Application listening on  port ' + port);
});
