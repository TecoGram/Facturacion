import { createStore } from 'redux';

import rootReducer from './reducers/index';
import ajustes from './Ajustes.js';
import defaultState from './DefaultStore';

const store = createStore(rootReducer, { ...defaultState, ajustes });

export default store;
