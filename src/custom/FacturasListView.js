import React from 'react'
import MaterialTable from '../lib/MaterialTable'
import { getFacturaURL, findVentas } from '../api'

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
    const { fecha, codigo } = this.state.rows[index]
    window.open(getFacturaURL(codigo, fecha))

  }

  requestData = (input) => {
    findVentas(input)
      .then((resp) => {
        const ventas = resp.body
        this.setState({rows: ventas})
      }, (err) => {
        if (err.status === 404) {
          this.setState({rows: []})
        } else
          console.error('findVentas error: ' + JSON.stringify(err))})
  }

  componentDidMount() {
    this.requestData('')
  }

  render () {
    const rows = this.state.rows
    return (
      <MaterialTable columns={columns} keys={keys} rows={rows}
        searchHint={searchHint} onOpenItem={this.openFacturaInNewTab} onDeleteItem={() => {}}
        enableCheckbox={false} onQueryChanged={this.requestData}/>
    )
  }

}
