const PDFDocument = require('pdfkit')
const fs = require('fs')

const writePDF = (doc) => {
  const topTableStart = {x: 115, y: 185}

  const fecha = '11-11-2017'
  const nombre = 'Laboratorios Alcivar'
  const direccion = 'Avenida 9 de Octubre y Boyacá'
  const telefono = '2-837290'
  const RUC = '00000000000000'
  const valorPalabras = 'MIL DOSCIENTOS CINCUENTA Y CUATRO CON 51/100 DOLARES'
  const descuento = 23.99

  const products = [
    {
      i: '1',
      cant: '99',
      nombre: 'Acido Urico 20x12ml 2s35fasdg de asdgsdr ser g5dfgseg sfdsfgdfhd',
      precioVenta: '149.99',
      precioTotal: '1219.99',
    },
    {
      i: '2',
      cant: '21',
      nombre: 'TGO 8x50 250ml',
      precioVenta: '11.99',
      precioTotal: '2005.11',
    },
  ]

  const spaceBetweenLines = 5
  const RUCLeftMargin = 180

  doc.text(fecha, topTableStart.x, topTableStart.y)
  doc.text(nombre, doc.x, doc.y + spaceBetweenLines)
  doc.text(direccion, doc.x, doc.y + spaceBetweenLines)

  const RUCPhoneLinePos = doc.y + spaceBetweenLines

  doc.text(telefono, doc.x, RUCPhoneLinePos, {width:100})
  doc.text(RUC, doc.x + RUCLeftMargin, RUCPhoneLinePos, {width: 120})

  const productTableLeftMargin = 65
  const productTableTopMargin = 50
  const spaceBetweenColumns = 50
  const firstLinePos = doc.y + productTableTopMargin

  let linePos = firstLinePos
  const productNameWidth = 250
  const countColPosition = productTableTopMargin + spaceBetweenColumns
  const nameColPosition = countColPosition + spaceBetweenColumns * 1.25
  const precioColPosition = nameColPosition + productNameWidth + 25
  const valoresColPosition = precioColPosition + 75

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    doc.text(product.i, productTableLeftMargin, linePos, {align: 'right', width: 10})
    doc.text(product.cant, countColPosition, linePos, {align: 'right', width: 15})
    doc.text(product.nombre, nameColPosition, linePos, {width: productNameWidth})
    const nextLinePos = doc.y
    doc.text(product.precioVenta, precioColPosition, linePos, {align: 'right', width: 40})
    doc.text(product.precioTotal, valoresColPosition, linePos, {align: 'right', width: 50})
    linePos = nextLinePos + spaceBetweenLines
  }

  const palabrasLinePos = firstLinePos + 340
  const palabrasLeftMargin = 85
  doc.text(valorPalabras, palabrasLeftMargin, palabrasLinePos, {width: 280})

  const valoresLinePos = firstLinePos + 335
  const valoresLeftMargin = 510
  doc.text(descuento, valoresColPosition, valoresLinePos, {width: 50, align: 'right'})
}

class PDFWriter {

  constructor(codigo, fecha, writeFunc) {
    this.codigo = codigo
    this.fecha = fecha
    this.writeFunc = writeFunc
    const doc = new PDFDocument()
    this.doc = doc
  }


  then (res, rej) {
    const {
      codigo,
      fecha,
      doc,
    } = this
    this.writeFunc(doc)
    return new Promise(function (resolve, reject) {
      const stream = fs.createWriteStream(codigo + '_' + fecha + '.pdf')
      doc.on('error', reject)
      doc.on('end', resolve)
      doc.pipe(stream)
      doc.end()
    }).then(res, rej)
  }

}

module.exports = PDFWriter

const prom = new PDFWriter('10344', "2017-01-01", writePDF)
prom.then(() => console.log('es6'))
