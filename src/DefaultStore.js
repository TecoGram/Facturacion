const { NEW_FACTURA_PAGE } = require('../src/PageTypes.js')

module.exports = {
  dialog : null,
  ajustes: {
    empresa: "TecoGram S.A.",
    iva: 14,
  },
  snackbar: null,
  page: {
    type: NEW_FACTURA_PAGE,
    props: {},
  },
}
