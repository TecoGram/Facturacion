let InitialStore

if(window.__PRELOADED_STATE__){
  InitialStore = window.__PRELOADED_STATE__
}else
  InitialStore = require('./DefaultStore.js')

export default InitialStore;
