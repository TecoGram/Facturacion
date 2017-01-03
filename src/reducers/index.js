import { combineReducers } from 'redux';

import dialog from './dialog'
import page from './page'
import snackbar from './snackbar'

const rootReducer = combineReducers({dialog, page, snackbar});

export default rootReducer;
