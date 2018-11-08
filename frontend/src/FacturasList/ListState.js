export default class ListState {
  constructor(props, setStateFunc) {
    this.setState = setStateFunc;
    this.props = props;

    this.colocarVentas = this.colocarVentas.bind(this);
    this.deleteVenta = this.deleteVenta.bind(this);
    this.openEditorPage = this.openEditorPage.bind(this);
  }

  colocarVentas(listaVentas) {
    this.setState(() => {
      return { rows: listaVentas };
    });
  }

  deleteVenta(codigo, empresa) {
    this.setState(prevState => {
      return {
        rows: prevState.rows.filter(
          item => item.empresa !== empresa || item.codigo !== codigo
        ),
      };
    });
  }

  openEditorPage(codigo, empresa, tipo) {
    if (tipo === 0) this.props.editarFactura(codigo, empresa);
    else this.props.editarFacturaExamen(codigo, empresa);
  }
}

