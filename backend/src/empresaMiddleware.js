const fs = require('fs');
const path = require('path');

const indexFilePath = path.join(__dirname, '../../frontend/build/index.html');

const crearAjustes = empresa => ({ iva: 12, empresa });

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

const serveTecogram = (req, res) => {
  const ajustes = crearAjustes('TecoGram S.A.');
  enviarHtmlConAjustes(res, ajustes);
};

const serveBiocled = (req, res) => {
  const ajustes = crearAjustes('Biocled');
  enviarHtmlConAjustes(res, ajustes);
};

module.exports = {
  serveTecogram,
  serveBiocled
};
