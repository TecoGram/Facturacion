import { CERRAR_DIALOG_CON_MSG_ACTION, ABRIR_LINK_CON_SNACKBAR } from '../ActionTypes'

function message (state = {}, action) {
  switch (action.type) {
    case CERRAR_DIALOG_CON_MSG_ACTION:
      return { message: action.message }
    case ABRIR_LINK_CON_SNACKBAR:
      return { message: action.message, link: action.link }
    default: {
      return null
    }
  }
}

export default message;
