const { CAMBIAR_DIALOG_ACTION, CERRAR_DIALOG_CON_MSG_ACTION } = require('../ActionTypes')

function dialog (state = {}, action) {
  switch(action.type) {
    case CAMBIAR_DIALOG_ACTION:
    case CERRAR_DIALOG_CON_MSG_ACTION:
      return {
        value: action.value || state.value,
        editar: action.editar || state.editar,
        open: action.open,
      }
    default: {
      return state
    }
  }
}

module.exports = dialog
