import React from 'react';

import { findMedicos } from '../api.js';
import AutoCompleteComponent from '../lib/AutoCompleteComponent';

const dataSourceConfig = {
  text: 'nombre',
  value: 'nombre',
};

export default class MedicoAutoComplete extends React.Component {
  static propTypes = {
    width: React.PropTypes.string.isRequired,
    onNewItemSelected: React.PropTypes.func.isRequired,
  };

  render() {
    return (
      <AutoCompleteComponent
        hintText="Medico"
        style={{ marginRight: '36px' }}
        openOnFocus={false}
        dataSourceConfig={dataSourceConfig}
        newDataPromise={findMedicos}
        onNewItemSelected={this.props.onNewItemSelected}
        width={this.props.width}
      />
    );
  }
}
