const valorPalabras =require('../pdf/pdfutils.js').valorPalabras

const MAIN_BOX_X = 27
const MAIN_BOX_WIDTH = 519

const BOX1_POS = { x: MAIN_BOX_X, y: 150 }
const BOX1_SIZE = { x: MAIN_BOX_WIDTH, y: 89 }
const BOX2_POS = { x: MAIN_BOX_X, y: 248 }
const BOX2_SIZE = { x: MAIN_BOX_WIDTH, y: 482 }

const BOX2_END_X = BOX2_POS.x + BOX2_SIZE.x
const BOX2_END_Y = BOX2_POS.y + BOX2_SIZE.y

const X1_LINE = 416
const X2_LINE = 350
const X3_LINE = (X2_LINE - MAIN_BOX_X)/2 + MAIN_BOX_X
const Y1_LINE = 160
//const Y2_LINE = 211
const Y3_LINE = 265
const Y4_LINE = 590
const Y5_LINE = 670

const paymentMethodValueBoxY = BOX2_END_Y + 15

const itemColumnWidth = 50
const itemColumnSeparator = BOX2_POS.x + itemColumnWidth
const cantColumnWidth = 50
const cantColumnSeparator = itemColumnSeparator + cantColumnWidth
const descriptionColumnWidth = 260
const descriptionColumnSeparator = cantColumnSeparator + descriptionColumnWidth
const unitPriceColumnWidth = 65
const unitPriceColumnSeparator = descriptionColumnSeparator + unitPriceColumnWidth

const paymentAgreementString = 'Declaro expresamente haver recibido la mercadería'
  + ' y/o servicio detallado en esta factura y me comprometo a pagar integramente'
  + ' el valor total de la misma a TECO-GRAM S.A., en el plazo establecido en caso'
  + ' de mora en el pago de la factura me comprometo a pagar el interés legal por'
  + ' mora y comisiones por cobranza, desde el vencimiento hasta el mismo día de'
  + ' pago. Para toda acción legal, renuncio a domicilio y me someto a los jueces'
  + ' de esta jurisdicción o al que elija el acreedor.'

const drawInvoiceInfoContents = (doc, fecha, cliente) => {
  const {
    nombre,
    telefono1,
    direccion,
    ruc,
  } = cliente

  const topTableStart = {x: BOX1_POS.x + 8, y: BOX1_POS.y + 16}
  const tableContentRowPos = 95
  doc.fontSize(11)
  doc.lineGap(3)
  doc.text("Guayaquil: ", topTableStart.x, topTableStart.y)
    .text("Nombre: ")
    .text("Dirección: ")
    .text("Teléfono: ")

  doc.text(fecha, tableContentRowPos, topTableStart.y)
    .text(nombre)
    .text(direccion)

  const RUCTitleLeftMargin = 240
  const RUCLeftMargin = 275
  const RUCPhoneLinePos = doc.y

  doc.text(telefono1, doc.x, RUCPhoneLinePos)
    .text("RUC: ", RUCTitleLeftMargin, RUCPhoneLinePos)
    .text(ruc, RUCLeftMargin, RUCPhoneLinePos)
  doc.lineGap(0) //restore default
}

const drawInvoiceInfo = (doc, ventaRow, cliente) => {
  const {
    fecha,
  } = ventaRow

  drawInvoiceInfoContents(doc, fecha, cliente)

}

const drawFacturableDescription = (doc, facturable, detallado, linePos) => {
  const descriptionOptions = {
    width: descriptionColumnWidth - 10,
  }
  const descriptionStartX = cantColumnSeparator + 5
  doc.text(facturable.nombre, descriptionStartX, linePos, descriptionOptions)
  if (detallado) {
    const detalleString = facturable.lote !== ''
      ? `MARCA: ${facturable.marca} LOTE: ${facturable.lote} FECHA: ${facturable.fechaExp}`
      : `MARCA: ${facturable.marca} FECHA: ${facturable.fechaExp}`
    doc.text(detalleString, descriptionStartX, doc.y, descriptionOptions)
  }
}

const drawFacturableLine = (doc, facturable, detallado, pos) => {
  const linePos = doc.y
  doc.text(pos, BOX2_POS.x + 5, linePos, {
    align: 'right',
    width: itemColumnWidth - 10,
  })
  doc.text(facturable.count, itemColumnSeparator + 5, linePos, {
    align: 'right',
    width: cantColumnWidth - 10,
  })
  doc.text(facturable.precioVenta, descriptionColumnSeparator + 5, linePos, {
    align: 'right',
    width: unitPriceColumnWidth - 10,
  })

  const precioTotal = Number(facturable.count * facturable.precioVenta).toFixed(2)
  doc.text(precioTotal, unitPriceColumnSeparator + 5, linePos, {
    align: 'right',
    width: BOX2_END_X - unitPriceColumnSeparator - 10})

  drawFacturableDescription(doc, facturable, detallado, linePos)

}

const drawRemainingFacturablesOnNextPage = (doc, detallado, facturables, startPos) => {
  doc.addPage({
    margins: {
      left: 72,
      top: 72,
      right: 72,
      bottom: 72,
    },
  })

  for (let i = startPos; i < facturables.length; i++) {
    const facturable = facturables[i]
    drawFacturableLine(doc, facturable, detallado, i + 1)
  }
}

const drawFacturablesDetails = (doc, facturables, detallado) => {
  doc.y = Y3_LINE + 5
  try {
    doc.fontSize(8)
    for (let i = 0; i < facturables.length; i++) {
      const facturable = facturables[i]
      const heightFactor = detallado ? 4 : 2
      const facturableSeDesborda = doc.y + doc.currentLineHeight() * heightFactor > Y4_LINE
      if (facturableSeDesborda) throw { indiceDeDesborde: i }
      drawFacturableLine(doc, facturable, detallado, i + 1)
    }
  } catch (err) {
    if (err.indiceDeDesborde)
      return err.indiceDeDesborde
    else throw err
  } finally {
    doc.fontSize(12)
  }
}

const drawValueLine = (doc, valueLabel, valueSymbol, valueNumber) => {
  const labelColumnX = X2_LINE + 15
  const symbolColumnWidth = unitPriceColumnSeparator - X2_LINE
  const valueColumnWidth = BOX2_END_X - unitPriceColumnSeparator - 10
  const valueColumnX = unitPriceColumnSeparator + 5
  const linePos = doc.y

  doc.text(valueLabel, labelColumnX, linePos)
  doc.text(valueSymbol, X2_LINE, linePos, {
    align: 'right',
    width: symbolColumnWidth,
  })
  if (valueNumber !== '')
    doc.text(valueNumber, valueColumnX, linePos, {
      align: 'right',
      width: valueColumnWidth,
    })
}

const drawTotalValues = (doc, facturaPDFData) => {
  doc.lineGap(7)
  doc.y = Y4_LINE + 15

  const drawValueLineArgs = facturaPDFData.matrizValoresTotales
  drawValueLineArgs.forEach((args) => {
    drawValueLine(doc, ...args)
  })

  doc.lineGap(0) //restore default
}

const drawTotalPalabras = (doc, palabras) => {
  const textStartX = BOX2_POS.x + 5
  const options = { width: X2_LINE - BOX2_POS.x - 10 }
  doc.fontSize(9)
    .text(palabras, textStartX, Y4_LINE + 30, options)
    .fontSize(12)
}

const drawPaymentMethodColumn = (doc, boxHeight, methodName, totalPayed) => {
  const textY = paymentMethodValueBoxY + 5
  const boxWidth = 35

  doc.text(methodName, doc.x, textY)
  doc.x = doc.x + doc.widthOfString(methodName) + 5
  doc.rect(doc.x, paymentMethodValueBoxY, boxWidth, boxHeight)
    .stroke()

  if (totalPayed) {
    doc.fontSize(7)
      .text(totalPayed, doc.x, textY, {
        width: boxWidth - 3,
        align: 'right',
      })
      .fontSize(6)
  }

  doc.x = doc.x + boxWidth + 3
}

const drawPaymentAgreement = (doc, boxHeight) => {
  const textY = paymentMethodValueBoxY + boxHeight + 5
  doc.fontSize(8)
    .text(paymentAgreementString, BOX2_POS.x, textY, {
      width: BOX2_SIZE.x,
    })
    .fontSize(12)
}

const drawPaymentMethodSubtitle = (doc) => {
  const textY = paymentMethodValueBoxY + 5
  doc.text('FORMA DE PAGO:', doc.x, textY)
  doc.x = doc.x + doc.widthOfString('FORMA DE PAGO:') + 3
}

const drawPaymentMethodFooter = (doc, paymentMethods) => {
  const startX = BOX2_POS.x
  const valueBoxHeight = doc.currentLineHeight() + 4

  doc.fontSize(6)

  doc.x = startX
  drawPaymentMethodSubtitle(doc)
  paymentMethods.forEach((args) => {
    drawPaymentMethodColumn(doc, valueBoxHeight, ...args)
  })
  drawPaymentAgreement(doc, valueBoxHeight)

  doc.fontSize(12) //restore default
}


module.exports = {
  biocled: (facturaPDFData, cliente) => {
    const writeFunc = (doc) => {

      const {
        detallado,
        total,
        formasDePago,
        facturables,
      } = facturaPDFData

      drawInvoiceInfo(doc, facturaPDFData, cliente)
      const remainingFacturablesIndex = drawFacturablesDetails(doc, facturables,
        detallado)
      drawTotalPalabras(doc, "SON: " + valorPalabras(total))
      drawTotalValues(doc, facturaPDFData)
      drawPaymentMethodFooter(doc, formasDePago)

      if (remainingFacturablesIndex) {
        drawRemainingFacturablesOnNextPage(doc, detallado, facturables, remainingFacturablesIndex)
      }
    }

    return writeFunc
  },
}
