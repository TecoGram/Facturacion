import React from 'react';

import { findProductos } from '../api.js';
import AutoCompleteComponent from '../lib/AutoCompleteComponent';

const dataSourceConfig = {
  text: 'nombre',
  value: 'nombre',
};

export default class ProductoAutoComplete extends React.Component {
  render() {
    return (
      <AutoCompleteComponent
        hintText="Producto"
        dataSourceConfig={dataSourceConfig}
        newDataPromise={findProductos}
        onNewItemSelected={this.props.onNewItemSelected}
        width={this.props.width}
      />
    );
  }
}
