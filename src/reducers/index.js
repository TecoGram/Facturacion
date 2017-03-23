import { combineReducers } from 'redux';

import dialog from './dialog'
import ajustes from './ajustes'
import page from './page'
import snackbar from './snackbar'

const rootReducer = combineReducers({dialog, ajustes, page, snackbar});

export default rootReducer;
