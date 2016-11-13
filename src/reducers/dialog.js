import { CAMBIAR_DIALOG_ACTION } from '../ActionTypes'
function dialog (state = [], action) {

  switch(action.type) {
    case CAMBIAR_DIALOG_ACTION:
      return action.value
    default: {
      return state
    }
  }
}

export default dialog
