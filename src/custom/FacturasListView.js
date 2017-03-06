import React from 'react'
import MaterialTable from '../lib/MaterialTable'
import { getFacturaURL, findVentas, deleteVenta } from '../api'
import { crearListaFacturasParaTabla } from '../../backend/responseFormatter.js'

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
    const { codigo, empresa } = this.state.rows[index]
    window.open(getFacturaURL(codigo, empresa))

  }

  openEditorPage = (index) => {
    const { codigo, empresa } = this.state.rows[index]
    this.props.editarFactura(codigo, empresa)
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
    findVentas(input)
      .then((resp) => {
        const ventas = crearListaFacturasParaTabla(resp.body)
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
