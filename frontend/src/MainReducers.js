import * as Actions from './MainActions.js';
import ClienteForm from './NuevoCliente/ClienteForm.js';
import ProductoForm from './NuevoProducto/ProductoForm.js';
import MedicoForm from './NuevoMedico/MedicoForm.js';
import PagosForm from './Pagos/PagosForm.js';

export const getDefaultState = () => ({
  dialog: {
    Content: ClienteForm,
    title: 'Nuevo Cliente',
    editar: null,
    open: false
  },
  drawerOpen: false,
  snackbar: {}
});

const mostrarInputDialog = ({ Content, editar, ...extras }) => state => {
  switch (Content) {
    case ClienteForm:
      return {
        ...state,
        dialog: {
          Content,
          editar,
          open: true,
          title: editar ? 'Editar Cliente' : 'Nuevo Cliente'
        }
      };
    case ProductoForm:
      return {
        ...state,
        dialog: {
          Content,
          editar,
          open: true,
          title: editar ? 'Editar Producto' : 'Nuevo Producto'
        }
      };
    case MedicoForm:
      return {
        ...state,
        dialog: {
          Content,
          open: true,
          title: 'Nuevo Médico'
        }
      };
    case PagosForm:
      return {
        ...state,
        dialog: {
          ...extras,
          Content,
          open: true,
          title: 'Editar Pagos'
        }
      };

    default:
      return state;
  }
};

const cerrarInputDialog = ({ message }) => state => {
  const dialog = { ...state.dialog, open: false };
  const snackbar = { message };
  return { ...state, dialog, snackbar };
};

const toggleDrawerMenu = ({ drawerOpen }) => state => {
  return { ...state, drawerOpen };
};

const mostrarSnackbar = ({ message, link }) => state => {
  return { ...state, snackbar: { message, link } };
};

const cerrarSnackbar = ({ message }) => state => {
  return { ...state, snackbar: {} };
};

export const createReducer = action => {
  const { type, ...params } = action;
  switch (type) {
    case Actions.getDefaultState: {
      return getDefaultState;
    }

    case Actions.mostrarInputDialog: {
      return mostrarInputDialog(params);
    }

    case Actions.cerrarInputDialog: {
      return cerrarInputDialog(params);
    }

    case Actions.toggleDrawerMenu: {
      return toggleDrawerMenu(params);
    }

    case Actions.mostrarSnackbar: {
      return mostrarSnackbar(params);
    }

    case Actions.cerrarSnackbar: {
      return cerrarSnackbar(params);
    }

    default: {
      return x => x;
    }
  }
};
