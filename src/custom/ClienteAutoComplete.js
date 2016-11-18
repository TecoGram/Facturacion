import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';

import { findClientes } from '../api.js'
const autoCompleteWidth = '425px'

const dataSourceConfig = {
  text: 'nombre',
  value: 'ruc',
};

export default class ClienteAutoComplete extends React.Component {

  constructor(props, context) {
    super(props);
    this.state = {
      suggestions: [],
    };
  }

  reqFindClientes = (input) => {
    if(input.length === 0)
      this.setState({ suggestions: [] })
    else
      findClientes(input)
      .then(
        (resp) => { this.setState({ suggestions: resp.body }) },
        (err) => { this.setState({ suggestions: [] }) }
      )
  }

  render() {
    return (
      <AutoComplete
        hintText="Cliente"
        style={{width: autoCompleteWidth, marginRight: '36px'}}
        textFieldStyle={{width: autoCompleteWidth}}
        filter={AutoComplete.noFilter}
        openOnFocus={false}
        dataSourceConfig={dataSourceConfig}
        dataSource={this.state.suggestions}
        onUpdateInput={(searchText) => this.reqFindClientes(searchText) }
      />
    )
  }
}
