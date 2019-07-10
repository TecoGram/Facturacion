import Money from 'facturacion_common/src/Money.js';

export default class ListState {
  constructor(props, setStateFunc) {
    this.setState = setStateFunc;
    this.props = props;

    this.colocarProductosDelResponse = this.colocarProductosDelResponse.bind(
      this
    );
    this.colocarListaVacia = this.colocarListaVacia.bind(this);
    this.removerProductoDeLaLista = this.removerProductoDeLaLista.bind(this);
    this.mostrarError = this.mostrarError.bind(this);
  }

  colocarProductosDelResponse(resp) {
    this.setState(() => {
      return {
        rows: resp.body.map(p => ({
          ...p,
          precioVentaText: Money.print(p.precioVenta)
        }))
      };
    });
  }

  colocarListaVacia() {
    this.setState(() => {
      return { rows: [] };
    });
  }

  removerProductoDeLaLista(rowid) {
    this.setState(prevState => {
      return { rows: prevState.rows.filter(item => item.rowid !== rowid) };
    });
  }

  mostrarError(respError) {
    this.props.mostrarErrorConSnackbar(respError.response.text);
  }
}
