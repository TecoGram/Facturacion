const fs = require('fs');
const path = require('path');

const indexFilePath = path.join(__dirname, '../../frontend/build/index.html');
const { empresas } = require('../../system.config.js');
const { tarifaIVA, empresaName: empresaConDatil } = require('./DatilClient');

const crearAjustes = empresa => ({
  iva: tarifaIVA,
  empresa,
  main: empresaConDatil === empresa,
  empresas
});

const colocarAjustesEnHtml = (html, store) => {
  const storePlaceholder = 'void 0';
  return html.replace(storePlaceholder, JSON.stringify(store));
};

const sendBuildNotReadyError = res => {
  res.status(500).send('React App no inicializada. Ejecutaste npm run build?');
};

const enviarHtmlConAjustes = (res, store) => {
  fs.readFile(indexFilePath, 'utf8', (err, data) => {
    if (err) sendBuildNotReadyError(res);
    else {
      const htmlDinamico = colocarAjustesEnHtml(data, store);
      res.send(htmlDinamico);
    }
  });
};

const serveApp = (req, res) => {
  const empresaIndex = req.query.empresa || 0;
  const empresaName = empresas[empresaIndex];
  if (!empresaName) {
    res.status(404).send('Empresa no encontrada');
    return;
  }

  const ajustes = crearAjustes(empresaName);
  enviarHtmlConAjustes(res, ajustes);
};

module.exports = {
  serveApp
};
