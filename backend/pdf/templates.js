const valorPalabras =require('../pdf/pdfutils.js').valorPalabras

const MAIN_BOX_X = 40
const MAIN_BOX_WIDTH = 520

const BOX1_POS = { x: MAIN_BOX_X, y: 120 }
const BOX1_SIZE = { x: MAIN_BOX_WIDTH, y: 81 }
const BOX2_POS = { x: MAIN_BOX_X, y: 210 }
const BOX2_SIZE = { x: MAIN_BOX_WIDTH, y: 520 }

const BOX2_END_X = BOX2_POS.x + BOX2_SIZE.x
const BOX2_END_Y = BOX2_POS.y + BOX2_SIZE.y

const X1_LINE = 380
const X2_LINE = 350
const X3_LINE = (X2_LINE - MAIN_BOX_X)/2 + MAIN_BOX_X
const Y1_LINE = 140
const Y2_LINE = 181
const Y3_LINE = 235
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

const chequeCruzadoString = 'FAVOR CANCELAR CON CHEQUE CRUZADO A NOMBRE DE'
  + ' TECO-GRAM S.A. AL HACER SUS PAGOS EN EFECTIVO EXIJA SU RECIBO'
const paymentAgreementString = 'Declaro expresamente haver recibido la mercadería'
  + ' y/o servicio detallado en esta factura y me comprometo a pagar integramente'
  + ' el valor total de la misma a TECO-GRAM S.A., en el plazo establecido en caso'
  + ' de mora en el pago de la factura me comprometo a pagar el interés legal por'
  + ' mora y comisiones por cobranza, desde el vencimiento hasta el mismo día de'
  + ' pago. Para toda acción legal, renuncio a domicilio y me someto a los jueces'
  + ' de esta jurisdicción o al que elija el acreedor.'

const drawContactInfo = (doc) => {
  const address = "Nueva Kennedy, Av. Del Periodista #428 y la 10ma. Este"
  const building = "Polimédico Costales"
  const addressReference = "Diagonal a la Clínica Kennedy"
  const phones = "Telfs.: 2396966 - 2397979"
  const fax = "Fax: 2396610"
  const email = "E-mail: info@tecogram.com, teco-gram@gye.satnet.net"
  const city = "Guayaquil - Ecuador"
  const elabDate = "F. Elab.: 22/Septiembre/2016"

  const infoPos = { x: 300, y: 30 }

  doc.save()
    .fontSize(9)
    .text(address, infoPos.x, infoPos.y)
    .text(building + ", " + addressReference)
    .text(phones)
    .text(fax)
    .text(email)
    .text(city)
    .text(elabDate)
    .restore()
}

const drawTitle = (doc) => {
  const titlePos = {x: 50, y: 30 }
  const title = "Teco Gram S.A."
  const subtitle = "Laboratorio Clínico"
  const subtitle2 = "Resultados confiables para su bienestar."
  const rucSubtitle = "R.U.C. # 0992218916001"

  doc.save()
    .fontSize(22)
    .text(title, titlePos.x, titlePos.y)
    .fontSize(12) //restore

  doc.text(subtitle)
    .text(subtitle2)
    .text(rucSubtitle)
}

const drawInvoiceInfoBox = (doc) => {

  doc.rect(BOX1_POS.x, BOX1_POS.y, BOX1_SIZE.x, BOX1_SIZE.y)

  doc.moveTo(X1_LINE, BOX1_POS.y)
    .lineTo(X1_LINE, BOX1_POS.y + BOX1_SIZE.y)

  doc.moveTo(X1_LINE, Y1_LINE)
    .lineTo(BOX1_POS.x + BOX1_SIZE.x, Y1_LINE)

  doc.moveTo(X1_LINE, Y2_LINE)
    .lineTo(BOX1_POS.x + BOX1_SIZE.x, Y2_LINE)
    .stroke()
}

const drawInvoiceInfoContents = (doc, fecha, cliente) => {
  const {
    nombre,
    telefono1,
    email,
    ruc,
  } = cliente

  const topTableStart = {x: 65, y: 130}
  const tableContentRowPos = 130
  doc.lineGap(3)
  doc.text("Guayaquil: ", topTableStart.x, topTableStart.y)
    .text("Nombre: ")
    .text("Dirección: ")
    .text("Teléfono: ")

  doc.text(fecha, tableContentRowPos, topTableStart.y)
    .text(nombre)
    .text(email)

  const RUCTitleLeftMargin = 240
  const RUCLeftMargin = 275
  const RUCPhoneLinePos = doc.y

  doc.text(telefono1, doc.x, RUCPhoneLinePos)
    .text("RUC: ", RUCTitleLeftMargin, RUCPhoneLinePos)
    .text(ruc, RUCLeftMargin, RUCPhoneLinePos)
  doc.lineGap(0) //restore default
}

const drawInvoiceCode = (doc, code) => {
  const facturaTextPos = { x: X1_LINE, y: BOX1_POS.y + 5 }
  const boxOptions = {
    width: MAIN_BOX_X + MAIN_BOX_WIDTH - X1_LINE,
    align: 'center',
  }

  doc.text("FACTURA", facturaTextPos.x, facturaTextPos.y, boxOptions)
  const serieTextY = 145
  const codigoTextY = 160
  const autSRITextY = 185
  doc.fontSize(10)
    .text("Serie 001-001", facturaTextPos.x, serieTextY, boxOptions)
  doc.fontSize(16)
    .text(code, facturaTextPos.x, codigoTextY, boxOptions)
  doc.fontSize(12) //Restore default
    .text("Aut. SRI # 1119500334", facturaTextPos.x, autSRITextY, boxOptions)
}

const drawInvoiceInfo = (doc, ventaRow, cliente) => {
  const {
    codigo,
    fecha,
  } = ventaRow

  drawInvoiceInfoBox(doc)
  drawInvoiceCode(doc, codigo)
  drawInvoiceInfoContents(doc, fecha, cliente)

}

const drawInvoiceDetailsHeader = (doc) => {

  doc.moveTo(itemColumnSeparator, BOX2_POS.y)
    .lineTo(itemColumnSeparator, Y3_LINE)

  doc.moveTo(cantColumnSeparator, BOX2_POS.y)
    .lineTo(cantColumnSeparator, Y3_LINE)

  doc.moveTo(descriptionColumnSeparator, BOX2_POS.y)
    .lineTo(descriptionColumnSeparator, Y3_LINE)

  doc.moveTo(unitPriceColumnSeparator, BOX2_POS.y)
    .lineTo(unitPriceColumnSeparator, Y3_LINE)
    .stroke()

  const textY = BOX2_POS.y + 8
  doc.text('ITEM', BOX2_POS.x, textY, {
    width: itemColumnWidth,
    align: 'center',
  })
  doc.text('CANT.', itemColumnSeparator, textY, {
    width: cantColumnWidth,
    align: 'center',
  })
  doc.text('DESCRIPCIÓN', cantColumnSeparator, textY, {
    width: descriptionColumnWidth,
    align: 'center',
  })
  doc.text('V.UNIT.', descriptionColumnSeparator, textY, {
    width: unitPriceColumnWidth,
    align: 'center',
  })
  doc.text('TOTAL', unitPriceColumnSeparator, textY, {
    width: BOX2_POS.x + BOX2_SIZE.x - unitPriceColumnSeparator,
    align: 'center',
  })
}

const drawSignaturePlaceholders = (doc) => {
  const signatureLineHorizontalMargin = 25
  const signatureLineY = BOX2_END_Y - 20

  const drawPlaceholders = (upperText, lowerText, leftX, rightX) => {
    const options = {
      width: rightX - leftX,
      align: 'center',
    }
    doc.text(upperText, leftX, Y5_LINE + 5, options)
      .text(lowerText, leftX, signatureLineY + 5, options)
      .moveTo(leftX + signatureLineHorizontalMargin, signatureLineY)
      .lineTo(rightX - signatureLineHorizontalMargin, signatureLineY)
      .stroke()
  }

  doc.fontSize(9)
  drawPlaceholders("APROBADO POR", "CLIENTE", BOX2_POS.x, X3_LINE)
  drawPlaceholders("ENTREGADO POR", "FIRMA Y SELLO", X3_LINE, X2_LINE)
  doc.fontSize(12)
}
const drawInvoiceDetailsBox = (doc) => {


  doc.rect(BOX2_POS.x, BOX2_POS.y, BOX2_SIZE.x, BOX2_SIZE.y)

  doc.moveTo(BOX2_POS.x, Y3_LINE)
    .lineTo(BOX2_END_X, Y3_LINE)

  doc.moveTo(BOX2_POS.x, Y4_LINE)
    .lineTo(BOX2_END_X, Y4_LINE)

  doc.moveTo(X2_LINE, Y4_LINE)
    .lineTo(X2_LINE, BOX2_END_Y)

  doc.moveTo(BOX2_POS.x, Y5_LINE)
    .lineTo(X2_LINE, Y5_LINE)

  doc.moveTo(X3_LINE, Y5_LINE)
    .lineTo(X3_LINE, BOX2_END_Y)
    .stroke()


  drawInvoiceDetailsHeader(doc)
  drawSignaturePlaceholders(doc)
}

const drawFacturableLine = (doc, facturable, pos) => {
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

  doc.text(facturable.nombre, cantColumnSeparator + 5, linePos, {
    width: descriptionColumnWidth - 10,
  })
}

const drawFacturablesDetails = (doc, facturables) => {
  drawInvoiceDetailsBox(doc)

  doc.y = Y3_LINE + 5

  for (let i = 0; i < facturables.length; i++) {
    const facturable = facturables[i]
    drawFacturableLine(doc, facturable, i + 1)
  }

}

const drawValueLine = (doc, valueLabel, valueSymbol, valueNumber) => {
  const labelColumnX = X2_LINE + 25
  const symbolColumnWidth = unitPriceColumnSeparator - X2_LINE
  const valueColumnWidth = BOX2_END_X - unitPriceColumnSeparator - 10
  const valueColumnX = unitPriceColumnSeparator + 5
  const linePos = doc.y
  const valueAsFormattedString = new Number(valueNumber).toFixed(2)

  doc.text(valueLabel, labelColumnX, linePos)
  doc.text(valueSymbol, X2_LINE, linePos, {
    align: 'right',
    width: symbolColumnWidth,
  })
  doc.text(valueAsFormattedString, valueColumnX, linePos, {
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
  doc.fontSize(10)
    .text(chequeCruzadoString, textStartX, Y4_LINE + 5, options)
    .fontSize(12) //restore default

  doc.text(palabras, textStartX, doc.y, options)
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
  doc.fontSize(9)
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
        total,
        formasDePago,
        facturables,
      } = facturaPDFData

      drawTitle(doc)
      drawContactInfo(doc)
      drawInvoiceInfo(doc, facturaPDFData, cliente)

      drawFacturablesDetails(doc, facturables)
      drawTotalPalabras(doc, "SON: " + valorPalabras(total))
      drawTotalValues(doc, facturaPDFData)
      drawPaymentMethodFooter(doc, formasDePago)
    }

    return writeFunc
  },
}
