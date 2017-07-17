import { CAMBIAR_PAGE_ACTION } from '../ActionTypes';
function page(state = {}, action) {
  switch (action.type) {
    case CAMBIAR_PAGE_ACTION:
      return {
        type: action.value,
        props: action.props,
      };
    default: {
      return state;
    }
  }
}

export default page;
