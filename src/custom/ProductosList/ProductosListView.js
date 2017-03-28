import React from 'react'
import MaterialTable from '../../lib/MaterialTable'
import { findProductos, deleteProducto } from '../../api'

import ListState from './ListState'

const columns = ['Reg. Sanitario', 'Marca', 'Nombre', 'Precio Venta']
const keys = ['codigo', 'marca', 'nombre', 'precioVenta']
const searchHint = 'Buscar productos...'

export default class ProductosListView extends React.Component {

  constructor(props) {
    super(props)
    this.stateManager = new ListState(props, (args) => this.setState(args))
    this.state = {
      rows: [],
    }
  }

  requestData = (input) => {
    const {
      colocarListaVacia,
      colocarProductosDelResponse,
    } = this.stateManager
    findProductos(input, 50)
      .then(colocarProductosDelResponse, colocarListaVacia)
  }

  deleteRow = (index) => {
    const { rowid } = this.state.rows[index]
    const {
      removerProductoDeLaLista,
      mostrarError,
    } = this.stateManager

    const handleSuccess = () => removerProductoDeLaLista(rowid)
    deleteProducto(rowid)
      .then(handleSuccess, mostrarError)
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
        height={'450px'}
        onQueryChanged={this.requestData}
        onDeleteItem={this.deleteRow} />
    )
  }

}

ProductosListView.propTypes = {
  mostrarErrorConSnackbar: React.PropTypes.func.isRequired,
}
