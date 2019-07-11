import {
  CAMBIAR_DIALOG_ACTION,
  CERRAR_DIALOG_CON_MSG_ACTION
} from '../ActionTypes';

const dialog = (state = {}, action) => {
  const { type, ...extras } = action;
  switch (type) {
    case CAMBIAR_DIALOG_ACTION:
      return {
        open: true,
        Content: action.Content,
        ...extras
      };
    case CERRAR_DIALOG_CON_MSG_ACTION:
      return {
        ...state,
        open: false,
        editar: null
      };
    default:
      return state;
  }
};

export default dialog;
