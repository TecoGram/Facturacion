import React from 'react'
import MaterialTable from '../../lib/MaterialTable'
import {
  getFacturaURLByType,
  findAllVentas, deleteVenta } from '../../api'

import ListState from './ListState'

const columns = ['Código', 'Empresa', 'Fecha', 'Cliente', 'Total']
const keys = ['codigo', 'empresa', 'fecha', 'nombre', 'total']
const searchHint = 'Buscar facturas...'

export default class FacturasListView extends React.Component {

  constructor(props) {
    super(props)
    this.stateManager = new ListState(props, (args) => this.setState(args))
    this.state = {
      rows: [],
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.stateManager.props = nextProps
  }

  openFacturaInNewTab = (index) => {
    const { codigo, empresa, tipo } = this.state.rows[index]
    const facturaURL = getFacturaURLByType(codigo, empresa, tipo)
    window.open(facturaURL)
  }

  openEditorPage = (index) => {
    const { codigo, empresa, tipo } = this.state.rows[index]
    this.stateManager.openEditorPage(codigo, empresa, tipo)
  }

  deleteRow = (index) => {
    const { codigo, empresa } = this.state.rows[index]
    deleteVenta(codigo, empresa)
      .then(() => { this.stateManager.deleteVenta(codigo, empresa) })
  }

  requestData = (input) => {
    findAllVentas(input)
      .then((resp) => {
        const listaVentas = resp.body
        this.stateManager.colocarVentas(listaVentas)
      }, (err) => {
        if (err.status === 404) {
          this.stateManager.colocarVentas([])
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
