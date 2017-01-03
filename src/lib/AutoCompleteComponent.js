import React from 'react';

import AutoComplete from 'material-ui/AutoComplete'

/**
* Componente para AutoComplete. Cada vez que el usario escribe en el TextField,
* se hace un query al servidor para tratar de completar lo que ingreso el usuario
*
* El metod asincrono para hacer el query tiene que ser provisto con el prop
* 'newDataPromise'. Este prop tiene que ser una funcion que devuelva un promise
* que en el then pase un arreglo con las sugenrencias. Las sugenrencias son objetos,
* pero solo un atributo es usado para pintar el string mostrado al usuario. Para
* determinar ese atributo se usa el prop 'dataSourceConfig' que es el que usa
* material-ui en su componente AutoComplete.
*
* Los resultados de la consulta y el texto de la consulta son parte del estado
* de este componente. Cuando el usuario selecciona una sugerenncia
* 'onNewItemSelected' es ejecutado. Este prop tambien se ejecuta cuuando el usuario
* presiona Enter sin seleccionar nada, se asume que el primer elemento de la lista
* de sugenrencias es el escogido.
* onNewItemSelected tiene la forma (item) => {}. Se pasa como argumento el objeto
* completo que devolvio el servidor como sugerencia.
*/
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
