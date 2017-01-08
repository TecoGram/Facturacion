import React from 'react'
import MaterialTable from '../lib/MaterialTable'
import { getFacturaURL, findVentas, deleteVenta } from '../api'

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
    const { codigo, fecha } = this.state.rows[index]
    window.open(getFacturaURL(codigo, fecha))

  }

  openEditorPage = (index) => {
    const { codigo, fecha } = this.state.rows[index]
    this.props.editarFactura(codigo, fecha)
  }

  deleteRow = (index) => {
    const { codigo, fecha } = this.state.rows[index]
    deleteVenta(codigo, fecha)
    .then(() => {
      if (this.state.rows.length === 1)
        this.setState({rows: this.state.rows.filter((item, i) => i !== index)})
    })
  }

  requestData = (input) => {
    findVentas(input)
      .then((resp) => {
        const ventas = resp.body
        this.setState({rows: ventas})
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
      <MaterialTable columns={columns} keys={keys} rows={rows}
        searchHint={searchHint} onOpenItem={this.openFacturaInNewTab} onEditItem={this.openEditorPage}
        onDeleteItem={this.deleteRow} enableCheckbox={false} onQueryChanged={this.requestData}/>
    )
  }

}
