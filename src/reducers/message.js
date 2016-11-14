import { CERRAR_DIALOG_CON_MSG_ACTION } from '../ActionTypes'

function message (state = '', action) {
  switch (action.type) {
    case CERRAR_DIALOG_CON_MSG_ACTION:
      return action.message
    default: {
      return null
    }
  }
}

export default message;
