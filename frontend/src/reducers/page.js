import {
  NEW_FACTURA_PAGE,
  EDITAR_FACTURA_PAGE,
  NEW_FACTURA_EXAMEN_PAGE
} from '../PageTypes';
import { CLEAR_FACTURA_EDITOR_OK, CAMBIAR_PAGE_ACTION } from '../ActionTypes';

function page(state = {}, action) {
  switch (action.type) {
    case CAMBIAR_PAGE_ACTION:
      return {
        type: action.value,
        props: action.props
      };
    case CLEAR_FACTURA_EDITOR_OK:
      return {
        type:
          state.type === NEW_FACTURA_PAGE || state.type === EDITAR_FACTURA_PAGE
            ? NEW_FACTURA_PAGE
            : NEW_FACTURA_EXAMEN_PAGE,
        props: {}
      };
    default: {
      return state;
    }
  }
}

export default page;
