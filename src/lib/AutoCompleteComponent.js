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
      text: '',
    }
  }

  reqNewData = (input) => {

    const newDataPromise = this.props.newDataPromise
    if(input.length === 0)
      this.setState({ text: input, suggestions: [] })
    else {
      this.setState({ text: input })
      newDataPromise(input)
      .then(
        (resp) => { this.setState({ suggestions: resp.body }) },
        (err) => { this.setState({ suggestions: [] }) }
      )
    }
  }

  clearAutoComplete = () => {
    this.setState({ text: '', suggestions: []})
  }

  onNewItemSelected = (selectedValue, index) => {
    const onNewItemSelected = this.props.onNewItemSelected
    if(!onNewItemSelected)
      return;

    const items = this.state.suggestions
    const totalSuggestions = items.length
    if(index >= 0 && index < totalSuggestions) {
      this.clearAutoComplete()
      onNewItemSelected(items[index])
    } else if (index === -1 && totalSuggestions > 0) {
      this.clearAutoComplete()
      onNewItemSelected(items[0])
    }
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
        searchText={this.state.text}
        onUpdateInput={(searchText) => this.reqNewData(searchText) }
        onNewRequest={ this.onNewItemSelected }
      />
    )
  }
}
