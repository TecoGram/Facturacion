import { createStore } from 'redux';

import rootReducer from './reducers/index';

let defaultState

if(window.__PRELOADED_STATE__){
  defaultState = window.__PRELOADED_STATE__
}else
  defaultState = require('./DefaultStore.js')

const store = createStore(rootReducer, defaultState);

export default store;
