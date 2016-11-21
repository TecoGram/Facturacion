import React from 'react';

import AutoComplete from 'material-ui/AutoComplete'

export default class AutoCompleteComponent extends React.Component {

  static propTypes = {
    dataSourceConfig: React.PropTypes.object.isRequired,
    hintText: React.PropTypes.string.isRequired,
    onNewItemSelected: React.PropTypes.func,
    newDataPromise: React.PropTypes.func.isRequired,
    style: React.PropTypes.object,
    width: React.PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      suggestions: [],
    }
  }

  reqNewData = (input) => {
    const newDataPromise = this.props.newDataPromise
    if(input.length === 0)
      this.setState({ suggestions: [] })
    else
      newDataPromise(input)
      .then(
        (resp) => { this.setState({ suggestions: resp.body }) },
        (err) => { this.setState({ suggestions: [] }) }
      )
  }

  onNewItemSelected = (selectedValue, index) => {
    const onNewItemSelected = this.props.onNewItemSelected
    if(!onNewItemSelected)
      return;

    const items = this.state.suggestions
    const totalSuggestions = items.length
    if(index >= 0 && index < totalSuggestions)
      onNewItemSelected(items[index])
    else if (index === -1 && totalSuggestions > 0)
      onNewItemSelected(items[0])
  }

  render() {
    const {
      dataSourceConfig,
      hintText,
      width,
    } = this.props

    const style = this.props.style || {}
    style.width = width

    return (
      <AutoComplete
        hintText={hintText}
        style={style}
        textFieldStyle={{width: width}}
        filter={AutoComplete.noFilter}
        openOnFocus={false}
        dataSourceConfig={dataSourceConfig}
        dataSource={this.state.suggestions}
        onUpdateInput={(searchText) => this.reqNewData(searchText) }
        onNewRequest={ this.onNewItemSelected }
      />
    )
  }
}
