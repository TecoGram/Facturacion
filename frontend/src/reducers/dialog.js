const {
  CAMBIAR_DIALOG_ACTION,
  CERRAR_DIALOG_CON_MSG_ACTION
} = require('../ActionTypes');

function dialog(state = {}, action) {
  switch (action.type) {
    case CAMBIAR_DIALOG_ACTION:
      return {
        value: action.value || state.value,
        dialogParams: action.dialogParams
      };
    case CERRAR_DIALOG_CON_MSG_ACTION:
      return {
        value: action.value || state.value,
        dialogParams: {
          editar: null,
          open: false
        }
      };
    default: {
      return state;
    }
  }
}

module.exports = dialog;
