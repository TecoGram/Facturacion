import React, { Component } from 'react';
import MainNavigationView from '../lib/MainNavigationView'
import FacturarView from '../lib/FacturarView'
import ProductosView from './ProductosView'

class App extends Component {
  render() {
    return (
        <MainNavigationView leftChild={<FacturarView />} rightChild={<ProductosView />}
          title={"TecoGram S.A."} leftTabName={"Facturación"} rightTabName={"Inventario"}/>
      );
  }
}

export default App;
