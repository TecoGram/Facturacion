import {
  CLEAR_FACTURA_EDITOR_OK,
  CERRAR_DIALOG_CON_MSG_ACTION,
  ABRIR_LINK_CON_SNACKBAR,
  MOSTRAR_ERROR_CON_SNACKBAR
} from '../ActionTypes';

function message(state = {}, action) {
  const { type, message } = action;
  switch (type) {
    case MOSTRAR_ERROR_CON_SNACKBAR:
      return { message, duration: action.duration };
    case CERRAR_DIALOG_CON_MSG_ACTION:
      return message ? { message } : null;
    case ABRIR_LINK_CON_SNACKBAR:
      return { message, link: action.link };
    case CLEAR_FACTURA_EDITOR_OK:
      return { message, link: action.link };
    default: {
      return null;
    }
  }
}

export default message;
