const { NEW_FACTURA_PAGE } = require('../src/PageTypes.js')
const { CLIENTE_DIALOG } = require('../src/DialogTypes.js')

module.exports = {
  dialog : {
    value: CLIENTE_DIALOG,
    editar: null,
    open: false,
  },
  ajustes: {
    empresa: "TecoGram S.A.",
    iva: 12,
  },
  snackbar: null,
  page: {
    type: NEW_FACTURA_PAGE,
    props: {},
  },
}
