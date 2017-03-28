
class ListState {
  constructor (props, setStateFunc) {
    this.setState = setStateFunc
    this.props = props

    this.colocarClientesDelResponse = this.colocarClientesDelResponse.bind(this);
    this.colocarListaVacia = this.colocarListaVacia.bind(this);
    this.removerClienteDeLaLista = this.removerClienteDeLaLista.bind(this);
    this.mostrarError = this.mostrarError.bind(this);
  }

  colocarClientesDelResponse (resp) {
    this.setState(() => {
      return { rows: resp.body }
    })
  }

  colocarListaVacia () {
    this.setState(() => {
      return { rows: [] }
    })
  }

  removerClienteDeLaLista (ruc) {
    this.setState((prevState) => {
      return { rows: prevState.rows.filter((item) => item.ruc !== ruc) }
    })
  }

  mostrarError (respError) {
    this.props.mostrarErrorConSnackbar(respError.response.text)
  }
}

module.exports = ListState
