const PDFDocument = require('pdfkit');
const fs = require('fs');

class PDFWriter {
  constructor(filepath, writeFunc) {
    this.filepath = filepath;
    this.writeFunc = writeFunc;
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 10,
        left: 10,
        bottom: 10,
        right: 10,
      },
    });
    this.doc = doc;
  }

  then(res, rej) {
    const { filepath, doc } = this;
    this.writeFunc(doc);
    return new Promise(function(resolve, reject) {
      const stream = fs.createWriteStream(filepath);
      doc.on('error', reject);
      doc.on('end', resolve);
      doc.pipe(stream);
      doc.end();
    }).then(res, rej);
  }
}

module.exports = PDFWriter;
