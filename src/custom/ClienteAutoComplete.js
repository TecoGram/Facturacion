import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';

import { findClientes } from '../api.js'

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

  onNewItemSelected = (selectedValue, index) => {
    const items = this.state.suggestions
    const totalSuggestions = items.length
    if(index >= 0 && index < totalSuggestions)
      this.props.onNewItemSelected(items[index])
    else if (index === -1 && totalSuggestions > 0)
      this.props.onNewItemSelected(items[0])
  }

  render() {
    return (
      <AutoComplete
        hintText="Cliente"
        style={{width: this.props.width, marginRight: '36px'}}
        textFieldStyle={{width: this.props.width}}
        filter={AutoComplete.noFilter}
        openOnFocus={false}
        dataSourceConfig={dataSourceConfig}
        dataSource={this.state.suggestions}
        onUpdateInput={(searchText) => this.reqFindClientes(searchText) }
        onNewRequest={ this.onNewItemSelected }
      />
    )
  }
}
