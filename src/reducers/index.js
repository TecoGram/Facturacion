import { combineReducers } from 'redux';

import dialog from './dialog'
import factura from './factura'
import snackbar from './snackbar'
import productos from './productos'

const rootReducer = combineReducers({dialog, factura, snackbar, productos});

export default rootReducer;
