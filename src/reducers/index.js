import { combineReducers } from 'redux';

import dialog from './dialog'
import factura from './factura'
import productos from './productos'

const rootReducer = combineReducers({dialog, factura, productos});

export default rootReducer;
