import { combineReducers } from 'redux';

import dialog from './dialog'
import empresa from './empresa'
import page from './page'
import snackbar from './snackbar'

const rootReducer = combineReducers({dialog, empresa, page, snackbar});

export default rootReducer;
