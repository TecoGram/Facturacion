import React, {Component} from 'react';

import validator from 'validator'
import Immutable from 'immutable'
import PaperContainer from '../lib/PaperContainer'
import FacturaForm from './FacturaForm'
import FacturaTable from './FacturaTable'
import FacturaResults from './FacturaResults'
import { /*crearUnidadesRow,*/ crearVentaRow } from './FacturacionUtils'
import { validarVentaRow } from '../Validacion'
import { insertarVenta } from '../api'

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
      productos: Immutable.List(),
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
      insertarVenta(ventaRow)
      .then((resp) => this.setState(this.getDefaultState()),
        (err) => console.log(err))
    }
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
          <FacturaForm data={facturaData.toJS()} errors={errors} cliente={cliente}
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
