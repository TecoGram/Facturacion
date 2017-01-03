import React from 'react'
import MaterialTable from '../lib/MaterialTable'
import api from '../api'

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

  requestData = (input) => {
    api.findVentas(input)
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
        searchHint={searchHint} onEditItem={() => {}} onDeleteItem={() => {}}
        enableCheckbox={false} onQueryChanged={this.requestData}/>
    )
  }

}
