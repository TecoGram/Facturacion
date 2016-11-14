import { combineReducers } from 'redux';

import dialog from './dialog'
import factura from './factura'
import message from './message'
import productos from './productos'

const rootReducer = combineReducers({dialog, factura, message, productos});

export default rootReducer;
