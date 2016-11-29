import React, {Component} from 'react';

import validator from 'validator'
import Immutable from 'immutable'
import PaperContainer from '../lib/PaperContainer'
import FacturaForm from './FacturaForm'
import FacturaTable from './FacturaTable'
import FacturaResults from './FacturaResults'
import { /*crearUnidadesRow,*/ crearVentaRow } from './FacturacionUtils'
import { validarVentaRow } from '../Validacion'

const mockItems = Immutable.List.of(Immutable.Map({
  nombre: 'Acido Urico 20x12 ml 240 det. TECO',
  codigo: 'AD-0493-11-03',
  lote: 'EDR356',
  count: 1,
  precioVenta: 20.00,
  fechaExp: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
}))

export default class FacturarView extends Component {

  constructor(props) {
    super(props)
    this.state = this.getDefaultState()
  }

  getDefaultState = () => {
    return {
      cliente: null,
      errors: Immutable.Map(),
      facturaData: Immutable.Map({
        codigo: '',
        fecha: new Date(),
        descuento: '',
        autorizacion: '',
        formaPago: '',
      }),
      productos: mockItems,
    }

  }

  onNewCliente = (newCliente) => {
    this.setState({ cliente: newCliente })
  }

  onNewProductFromKeyboard = (newProduct) => {
    newProduct.lote = ''
    newProduct.count = 1
    //fecha de expiracion: dentro de un año
    newProduct.fechaExp = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    const immutableProduct = Immutable.Map(newProduct)
    this.setState({ productos: this.state.productos.push(immutableProduct) })
  }

  newProductValueIsAppropiate(key, newValue) {
    switch(key) {
      case 'count':
        return validator.isNumeric(newValue, {min: 0}) || newValue.length === 0
      case 'precioVenta':
        return validator.isFloat(newValue, {min: 0}) || newValue.length === 0
      default:
        return true
    }

  }

  newValueIsAppropiate(key, newValue) {
    switch(key) {
      case 'codigo':
        return validator.isNumeric(newValue)
      case 'precioVenta':
        return validator.isFloat(newValue, {min: 0}) || newValue.length === 0
      case 'fechaExp':
        return true
      default:
        return true
    }

  }

  onFacturaDataChanged = (key, newValue) => {
    console.log('update ', key, newValue)
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

  onGenerarFacturaClick = () => {

    const {
      cliente,
      facturaData,
      productos,
    } = this.state

    const ventaRow = crearVentaRow(cliente, facturaData, productos)
    console.log('venta ' + JSON.stringify(ventaRow))
    const {
      errors,
      inputs,
    } = validarVentaRow(ventaRow)
    console.log('errors ' + JSON.stringify(errors))
    console.log('inputs ' + JSON.stringify(inputs))
    if(errors)
      this.setState({errors: errors})
    else
      this.setState(this.getDefaultState())
  }

  guardarFacturaDisabled = () => {
    if(!this.state.cliente)
      return true

    if(this.state.productos.isEmpty())
      return true

    return false
  }

  render() {
    const {
      cliente,
      errors,
      facturaData,
      productos,
    } = this.state

    const descuento = facturaData.get('descuento')

    return (
      <div style={{height:'100%', overflow:'auto'}} >
      <PaperContainer >
        <div style={{marginTop: '24px', marginLeft: '36px', marginRight: '36px'}}>
          <FacturaForm data={facturaData} errors={errors} cliente={cliente}
            onDataChanged={this.onFacturaDataChanged}
            onNewCliente={this.onNewCliente} onNewProduct={this.onNewProductFromKeyboard}/>
          <FacturaTable items={productos} onProductChanged={this.onProductChanged}/>
          <FacturaResults productos={productos} descuento={descuento}
            onGuardarClick={this.onGenerarFacturaClick}
            guardarButtonDisabled={this.guardarFacturaDisabled()}/>
        </div>
      </PaperContainer>
      </div>
    );
  }

}
