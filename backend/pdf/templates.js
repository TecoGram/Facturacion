const valorPalabras =require('../pdf/pdfutils.js').valorPalabras
module.exports = {
  biocled: (ventaRow) => {
    const writeFunc = (doc) => {

      const {
        fecha,
        nombre,
        direccion,
        telefono,
        RUC,
        iva,
        subtotal,
        total,
        descuento,
        productos,
      } = ventaRow

      const topTableStart = {x: 115, y: 185}

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

      for (let i = 0; i < productos.length; i++) {
        const product = productos[i]
        doc.text(product.i, productTableLeftMargin, linePos, {align: 'right', width: 10})
        doc.text(product.count, countColPosition, linePos, {align: 'right', width: 15})
        doc.text(product.nombre, nameColPosition, linePos, {width: productNameWidth})
        const nextLinePos = doc.y
        doc.text(product.precioVenta, precioColPosition, linePos, {align: 'right', width: 40})
        doc.text(product.precioTotal, valoresColPosition, linePos, {align: 'right', width: 50})
        linePos = nextLinePos + spaceBetweenLines
      }

      const palabrasLinePos = firstLinePos + 340
      const palabrasLeftMargin = 85
      doc.text(valorPalabras(total), palabrasLeftMargin, palabrasLinePos, {width: 280})

      const valoresLinePos = firstLinePos + 335
      const valoresLeftMargin = 510
      const spaceBetweenValues = 8
      doc.text(Number(descuento).toFixed(2), valoresColPosition, valoresLinePos, {width: 50, align: 'right'})
      doc.text(Number(subtotal).toFixed(2), valoresColPosition, doc.y + spaceBetweenValues, {width: 50, align: 'right'})
      const emptySpace = 45
      doc.text(Number(iva).toFixed(2), valoresColPosition, doc.y + emptySpace, {width: 50, align: 'right'})
      doc.text(Number(total).toFixed(2), valoresColPosition, doc.y + spaceBetweenValues, {width: 50, align: 'right'})
    }

    return writeFunc
  },
}
