import React from 'react'
import MaterialTable from '../lib/MaterialTable'
import { getFacturaURL, getFacturaExamenURL, findAllVentas, deleteVenta } from '../api'

const columns = ['Código', 'Fecha', 'RUC', 'Cliente', 'Total']
const keys = ['codigo', 'fecha', 'ruc', 'nombre', 'total']
const searchHint = 'Buscar facturas...'

export default class FacturasListView extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      rows: [],
    }
  }

  openFacturaInNewTab = (index) => {
    const { codigo, empresa, tipo } = this.state.rows[index]
    const facturaURL = tipo === 0 ? getFacturaURL(codigo, empresa)
                                 : getFacturaExamenURL(codigo, empresa)
    window.open(facturaURL)

  }

  openEditorPage = (index) => {
    const { codigo, empresa, tipo } = this.state.rows[index]
    if (tipo === 0)
      this.props.editarFactura(codigo, empresa)
    else
      this.props.editarFacturaExamen(codigo, empresa)
  }

  deleteRow = (index) => {
    const { codigo, empresa } = this.state.rows[index]
    deleteVenta(codigo, empresa)
    .then(() => {
      if (this.state.rows.length === 1)
        this.setState({rows: this.state.rows.filter((item, i) => i !== index)})
    })
  }

  requestData = (input) => {
    findAllVentas(input)
      .then((resp) => {
        this.setState({rows: resp.body})
      }, (err) => {
        if (err.status === 404) {
          this.setState({rows: []})
        }
      })
  }

  componentDidMount() {
    this.requestData('')
  }

  render () {
    const rows = this.state.rows
    return (
      <MaterialTable
        columns={columns}
        enableCheckbox={false}
        keys={keys}
        rows={rows}
        searchHint={searchHint}
        onDeleteItem={this.deleteRow}
        onEditItem={this.openEditorPage}
        onOpenItem={this.openFacturaInNewTab}
        onQueryChanged={this.requestData}/>
    )
  }

}

FacturasListView.propTypes = {
  editarFactura: React.PropTypes.func.isRequired,
  editarFacturaExamen: React.PropTypes.func.isRequired,
}
