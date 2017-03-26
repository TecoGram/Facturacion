import React from 'react'
import MaterialTable from '../lib/MaterialTable'
import { findProductos } from '../api'

const columns = ['Reg. Sanitario', 'Nombre', 'Precio Dist.', 'Precio Venta']
const keys = ['codigo', 'nombre', 'precioDist', 'precioVenta']
const searchHint = 'Buscar productos...'

export default class FacturasListView extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      rows: [],
    }
  }

  requestData = (input) => {
    findProductos(input)
      .then((resp) => {
        const listaProductos = resp.body
        this.setState({rows: listaProductos})
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
        onQueryChanged={this.requestData}/>
    )
  }

}
