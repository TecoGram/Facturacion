import { createStore } from 'redux';

import rootReducer from './reducers/index';
import initialStore from './InitialStore'

const store = createStore(rootReducer, initialStore);

export default store;
