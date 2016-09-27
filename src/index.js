import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CustomStyle from './CustomStyle'
import MainNavigationView from './components/MainNavigationView'
import FacturarView from './components/FacturarView'
import ProductosView from './components/ProductosView'

import 'fixed-data-table/dist/fixed-data-table.css'

injectTapEventPlugin();

ReactDOM.render(
  <MuiThemeProvider muiTheme={CustomStyle.muiTheme}>
    <MainNavigationView leftChild={<FacturarView />} rightChild={<ProductosView />}
      title={"TecoGram S.A."} leftTabName={"Facturación"} rightTabName={"Inventario"}/>
  </MuiThemeProvider>,
  document.getElementById('root')
);
