import React, {Component} from 'react';

import validator from 'validator'
import Immutable from 'immutable'
import PaperContainer from '../../lib/PaperContainer'
import FacturaForm from './FacturaForm'
import FacturaTable from './FacturaTable'
import FacturaResults from './FacturaResults'
import { crearVentaRow,
         facturableAUnidad, productoAFacturable } from './Models.js'
import { validarVentaRow } from '../../Validacion'
import { insertarVenta, updateVenta, getFacturaURL, verVenta } from '../../api'
import DateParser from '../../DateParser'

export default class FacturaEditorView extends Component {

  constructor(props) {
    super(props)
    this.state = this.getDefaultState()
  }

  getDefaultState = () => {
    return {
      cliente: null,
      medico: null,
      errors: Immutable.Map(),
      facturaData: Immutable.Map({
        codigo: '',
        fecha: new Date(),
        descuento: '',
        autorizacion: '',
        formaPago: '',
      }),
      facturables: Immutable.List(),
    }

  }

  onNewCliente = (newCliente) => {
    this.setState({ cliente: newCliente })
  }

  onNewMedico = (newMedico) => {
    this.setState({ medico: newMedico })
  }

  onNewProductFromKeyboard = (newProduct) => {
    this.setState((prevState) => {
      const facturable = Immutable.Map(productoAFacturable(newProduct))
      return { facturables: prevState.facturables.push(facturable) }
    })
  }

  newValueIsAppropiate(key, newValue) {
    switch(key) {
      case 'count':
        return validator.isInt(newValue,{min: 0}) || newValue.length === 0
      case 'precioVenta':
        return validator.isFloat(newValue, {min: 0}) || newValue.length === 0
      default:
        return true
    }
  }

  onFacturaDataChanged = (key, newValue) => {
    if(key === 'descuento' && newValue.length > 0 &&
      !validator.isInt(newValue, {min: 0, max: 100}))
      return;
    this.setState({facturaData: this.state.facturaData.set(key, newValue)})
  }

  onProductChanged = (index, key, newValue) => {
    if(this.newValueIsAppropiate(key, newValue)) {
      const facturables = this.state.facturables
      const updatedFacturables = facturables.update(index,
        (facturable) => facturable.set(key, newValue))
      this.setState({facturables: updatedFacturables})
    }
  }

  onProductDeleted = (index) => {
    this.setState({facturables: this.state.facturables.remove(index)})
  }

  onGenerarFacturaClick = () => {

    const {
      cliente,
      facturables,
      facturaData,
    } = this.state

    const empresa = this.props.empresa
    const unidades = facturables.map((facturableImm) => {
      return facturableAUnidad(facturableImm.toJS())
    })
    const ventaRow = crearVentaRow(cliente, facturaData, facturables, unidades, empresa)
    const { errors } = validarVentaRow(ventaRow)

    if(errors)
      this.setState({errors: errors})
    else {
      let msg, prom
      if (this.props.ventaKey) {
        prom = updateVenta(ventaRow)
        msg = 'La factura se editó exitosamente.'
      } else {
        prom = insertarVenta(ventaRow)
        msg = 'La factura se generó exitosamente.'
      }
      prom.then(() => {
        this.setState(this.getDefaultState())
        const pdfLink = getFacturaURL(ventaRow.codigo, ventaRow.fecha)
        window.open(pdfLink)
        this.props.abrirLinkConSnackbar(msg, pdfLink)
      })
      .catch((err) => {
        console.error(err)
      })
    }
  }

  guardarFacturaDisabled = () => {
    if(!this.state.cliente)
      return true

    if(this.state.facturables.isEmpty())
      return true

    return false
  }

  componentDidMount() {
    const v = this.props.ventaKey
    if (v)
      verVenta(v.codigo, v.empresa)
        .then((respStr) => {
          const resp = DateParser.verVenta(respStr.body)
          this.setState({
            cliente: resp.cliente,
            facturaData: Immutable.fromJS(resp.facturaData),
            facturables: Immutable.fromJS(resp.facturables),
          })
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
          <FacturaForm data={facturaData.toJS()} errors={errors} cliente={cliente}
            medico={medico} onDataChanged={this.onFacturaDataChanged} ventaKey={ventaKey}
            onNewMedico={this.onNewMedico} onNewCliente={this.onNewCliente}
            onNewProduct={this.onNewProductFromKeyboard} isExamen={isExamen} />
          <FacturaTable items={facturables} onProductChanged={this.onProductChanged}
            onProductDeleted={this.onProductDeleted} isExamen={isExamen} />
          <FacturaResults facturables={facturables} descuento={Number(descuento)}
            onGuardarClick={this.onGenerarFacturaClick} nuevo={!ventaKey}
            guardarButtonDisabled={this.guardarFacturaDisabled()} isExamen={isExamen} />
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
