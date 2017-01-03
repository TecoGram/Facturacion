import { CAMBIAR_PAGE_ACTION } from '../ActionTypes'
function page (state = '', action) {

  switch(action.type) {
    case CAMBIAR_PAGE_ACTION:
      return action.value
    default: {
      return state
    }
  }
}

export default page
