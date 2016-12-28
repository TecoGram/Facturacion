import React, { Component } from 'react';
import MainNavigationView from '../lib/MainNavigationView'
import FacturarView from './FacturarView'

class App extends Component {
  render() {
    return (
        <MainNavigationView selectedPage={<FacturarView />} title={"TecoGram S.A."}/>
      );
  }
}

export default App;
