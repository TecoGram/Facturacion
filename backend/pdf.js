const PDFWriter = require('./pdf/PDFWriter.js')
const biocled = require('./pdf/templates.js').biocled

const writeFunc = biocled({
  fecha: '2017-02-01',
  nombre: 'Dr.Julio Hurtado',
  direccion: 'Av boyaca y 9 de Octubre 501',
  RUC: '0934576854001',
  telefono: '042-654979',
  descuento: 5.99,
  iva: 4,
  subtotal: 21,
  total: 25,
  productos: [
    {
      i: '1',
      count: '99',
      nombre: 'Acido Urico 20x12ml 2s35fasdg de asdgsdr ser g5dfgseg sfdsfgdfhd',
      precioVenta: '149.99',
      precioTotal: '1219.99',
    },
    {
      i: '2',
      count: '21',
      nombre: 'TGO 8x50 250ml',
      precioVenta: '11.99',
      precioTotal: '2005.11',
    },
  ],
}, 'MIL DOSCIENTOS CINCUENTA Y CUATRO CON 51/100 DOLARES')
const prom = new PDFWriter('./pdf/facturas/test.pdf', writeFunc)
prom.then(() => console.log('es6'))
