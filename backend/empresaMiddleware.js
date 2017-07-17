const fs = require('fs');
const path = require('path');
const defaultStore = require('../src/DefaultStore.js');

const indexFilePath = path.join(__dirname, '../build/index.html');

const crearStoreConNombreEmpresa = empresa => {
  const store = Object.assign({}, defaultStore);
  store.ajustes.empresa = empresa;
  return store;
};

const colocarStoreEnHtml = (html, store) => {
  const storePlaceholder = 'void 0';
  return html.replace(storePlaceholder, JSON.stringify(store));
};

const sendBuildNotReadyError = res => {
  res.status(500).send('React App no inicializada. Ejecutaste npm run build?');
};

const enviarHtmlConStore = (res, store) => {
  fs.readFile(indexFilePath, 'utf8', (err, data) => {
    if (err) sendBuildNotReadyError(res);
    else {
      const htmlDinamico = colocarStoreEnHtml(data, store);
      res.send(htmlDinamico);
    }
  });
};

const serveTecogram = (req, res) => {
  const store = crearStoreConNombreEmpresa('TecoGram S.A.');
  enviarHtmlConStore(res, store);
};

const serveBiocled = (req, res) => {
  const store = crearStoreConNombreEmpresa('Biocled');
  enviarHtmlConStore(res, store);
};

module.exports = {
  serveTecogram,
  serveBiocled,
};
