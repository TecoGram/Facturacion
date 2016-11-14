import { CAMBIAR_DIALOG_ACTION, CERRAR_DIALOG_CON_MSG_ACTION } from '../ActionTypes'
function dialog (state = [], action) {

  switch(action.type) {
    case CAMBIAR_DIALOG_ACTION:
      return action.value
    case CERRAR_DIALOG_CON_MSG_ACTION:
      return null
    default: {
      return state
    }
  }
}

export default dialog
