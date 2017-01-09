import React, {Component} from 'react';

import validator from 'validator'
import Immutable from 'immutable'
import PaperContainer from '../../lib/PaperContainer'
import FacturaForm from './FacturaForm'
import FacturaTable from './FacturaTable'
import FacturaResults from './FacturaResults'
import { crearVentaRow, productoAUnidad } from './FacturacionUtils'
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
      productos: Immutable.List(),
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
      const unidad = Immutable.Map(productoAUnidad(newProduct))
      return { productos: prevState.productos.push(unidad) }
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
    this.setState({facturaData: this.state.facturaData.update(key, v => newValue)})
  }

  onProductChanged = (index, key, newValue) => {
    if(this.newValueIsAppropiate(key, newValue)) {
      const productos = this.state.productos
      const updatedProduct = productos.get(index).update(key, v => newValue)
      this.setState({productos: productos.update(index, v => updatedProduct)})
    }
  }

  onProductDeleted = (index) => {
    this.setState({productos: this.state.productos.remove(index)})
  }

  onGenerarFacturaClick = () => {

    const {
      cliente,
      facturaData,
      productos,
    } = this.state

    const ventaRow = crearVentaRow(cliente, facturaData, productos)
    const {
      errors,
    } = validarVentaRow(ventaRow)
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
      prom.then((resp) => {
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

    if(this.state.productos.isEmpty())
      return true

    return false
  }

  componentDidMount() {
    const v = this.props.ventaKey
    if (v)
      verVenta(v.codigo, v.fechaString)
        .then((respStr) => {
          const resp = DateParser.verVenta(respStr.body)
          this.setState({
            cliente: resp.cliente,
            facturaData: Immutable.fromJS(resp.facturaData),
            productos: Immutable.fromJS(resp.productos),
          })
        })
  }

  render() {
    const {
      cliente,
      medico,
      errors,
      facturaData,
      productos,
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
          <FacturaTable items={productos} onProductChanged={this.onProductChanged}
            onProductDeleted={this.onProductDeleted} isExamen={isExamen} />
          <FacturaResults productos={productos} descuento={Number(descuento)}
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
    fecha: React.PropTypes.object.isRequired,
    fechaString: React.PropTypes.string.isRequired,
  }),
}

FacturaEditorView.defaultProps = {
  isExamen: false,
}
