import React from 'react';

import { findClientes } from '../api.js'
import AutoCompleteComponent from '../lib/AutoCompleteComponent'

const dataSourceConfig = {
  text: 'nombre',
  value: 'ruc',
};

export default class ClienteAutoComplete extends React.Component {

  render() {
    return (
      <AutoCompleteComponent
        hintText="Cliente"
        style={{ marginRight: '36px'}}
        openOnFocus={false}
        dataSourceConfig={dataSourceConfig}
        newDataPromise={findClientes}
        onNewItemSelected={this.props.onNewItemSelected}
        width={this.props.width}
      />
    )
  }
}
