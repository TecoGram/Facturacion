import ClienteForm from './NuevoCliente/ClienteForm';
import { NEW_FACTURA_PAGE } from '../src/PageTypes.js';

const store = {
  dialog: {
    Content: ClienteForm,
    title: 'Nuevo Cliente',
    editar: null,
    open: false
  },
  snackbar: null,
  page: {
    type: NEW_FACTURA_PAGE,
    props: {}
  }
};

export default store;
