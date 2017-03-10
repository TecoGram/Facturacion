import React, {Component} from 'react';

import PaperContainer from '../../lib/PaperContainer'
import FacturaForm from './FacturaForm'
import FacturaTable from './FacturaTable'
import FacturaResults from './FacturaResults'
import { getFacturaURL, verVenta } from '../../api'
import {
  agregarProductoComoFacturable,
  editarFacturaExistente,
  getDefaultState,
  modificarValorEnFacturaData,
  modificarValorEnFacturable,
  puedeGuardarFactura,
  prepararFacturaParaGuardar,
  removeFacturableAt,
} from './EditorState'

export default class FacturaEditorView extends Component {

  constructor(props) {
    super(props)
    this.state = getDefaultState()
  }

  onFacturaDataChanged = (key, newValue) => {
    const modificacion = modificarValorEnFacturaData(key, newValue)
    if (modificacion != null) this.setState(modificacion)
  }

  onFacturableChanged = (index, key, newValue) => {
    const modificacion = modificarValorEnFacturable(index, key, newValue)
    if (modificacion != null) this.setState(modificacion)
  }

  onFacturableDeleted = (index) => {
    this.setState(removeFacturableAt(index))
  }

  onNewCliente = (newCliente) => {
    this.setState({ cliente: newCliente })
    if (newCliente)
      this.onFacturaDataChanged('descuento', '' + newCliente.descDefault)
  }

  onNewMedico = (newMedico) => {
    this.setState({ medico: newMedico })
  }

  onNewProductFromKeyboard = (newProduct) => {
    this.setState(agregarProductoComoFacturable(newProduct))
  }

  resetearEditorYMostrarResultado = (ventaGuardada, msg) => {
    this.setState(getDefaultState())
    const pdfLink = getFacturaURL(ventaGuardada.codigo, ventaGuardada.empresa)
    window.open(pdfLink)
    this.props.abrirLinkConSnackbar(msg, pdfLink)
  }

  guardarFacturaAsync = (guardarPromise, ventaAGuardar, guardadoExitoMsg) => {
    guardarPromise.then(() => {
      this.resetearEditorYMostrarResultado(ventaAGuardar, guardadoExitoMsg)
    })
    .catch((err) => {
      console.error("error ", err.status, err.response.text)
    })
  }

  onGenerarFacturaClick = () => {
    const empresa = this.props.empresa
    const editar = this.props.ventaKey
    const {
      errors,
      msg,
      prom,
      ventaRow } = prepararFacturaParaGuardar(this.state, editar, empresa)

    if (errors)
      this.setState({ errors: errors })
    else
      this.guardarFacturaAsync(prom, ventaRow, msg)
  }

  componentDidMount() {
    const facturaAEditar = this.props.ventaKey
    if (facturaAEditar)
      verVenta(facturaAEditar.codigo, facturaAEditar.empresa)
        .then((resp) => {
          this.setState(editarFacturaExistente(resp))
        })
  }

  render() {
    const {
      cliente,
      errors,
      facturables,
      facturaData,
      medico,
    } = this.state

    const {
      isExamen,
      ventaKey,
    } = this.props

    const descuento = facturaData.get('descuento')

    return (
      <div style={{height:'100%', overflow:'auto'}} >
      <PaperContainer >
        <div style={{marginTop: '24px', marginLeft: '36px', marginRight: '36px'}}>
          <FacturaForm data={facturaData.toJS()}
            errors={errors}
            cliente={cliente}
            medico={medico}
            onDataChanged={this.onFacturaDataChanged}
            ventaKey={ventaKey}
            onNewMedico={this.onNewMedico}
            onNewCliente={this.onNewCliente}
            onNewProduct={this.onNewProductFromKeyboard}
            isExamen={isExamen} />
          <FacturaTable
            items={facturables}
            onFacturableChanged={this.onFacturableChanged}
            onFacturableDeleted={this.onFacturableDeleted}
            isExamen={isExamen} />
          <FacturaResults
            facturables={facturables}
            descuento={Number(descuento)}
            onGuardarClick={this.onGenerarFacturaClick}
            nuevo={!ventaKey}
            guardarButtonDisabled={!puedeGuardarFactura(this.state)}
            isExamen={isExamen} />
        </div>
      </PaperContainer>
      </div>
    );
  }

}

FacturaEditorView.propTypes = {
  abrirLinkConSnackbar: React.PropTypes.func.isRequired,
  isExamen: React.PropTypes.bool,
  ventaKey: React.PropTypes.shape({
    codigo: React.PropTypes.string.isRequired,
    empresa: React.PropTypes.string.isRequired,
  }),
}

FacturaEditorView.defaultProps = {
  isExamen: false,
}
