import React from 'react';

import { findClientes } from 'facturacion_common/src/api.js';
import AutoCompleteComponent from '../lib/AutoCompleteComponent';

const dataSourceConfig = {
  text: 'nombre',
  value: 'id'
};

export default class ClienteAutoComplete extends React.Component {
  render() {
    return (
      <AutoCompleteComponent
        hintText="Cliente"
        style={{ marginRight: '36px' }}
        openOnFocus={false}
        dataSourceConfig={dataSourceConfig}
        newDataPromise={findClientes}
        onNewItemSelected={this.props.onNewItemSelected}
        width={this.props.width}
      />
    );
  }
}
