const { CAMBIAR_DIALOG_ACTION, CERRAR_DIALOG_CON_MSG_ACTION } = require('../ActionTypes')

function dialog (state = {}, action) {
  switch(action.type) {
    case CAMBIAR_DIALOG_ACTION:
      return {
        value: action.value || state.value,
        editar: action.open ? action.editar : null,
        open: action.open,
      }
    case CERRAR_DIALOG_CON_MSG_ACTION:
      return {
        value: action.value || state.value,
        editar: null,
        open: action.open,
      }
    default: {
      return state
    }
  }
}

module.exports = dialog
