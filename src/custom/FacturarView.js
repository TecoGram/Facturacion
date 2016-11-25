import React, {Component} from 'react';

import validator from 'validator'
import Immutable from 'immutable'
import PaperContainer from '../lib/PaperContainer'
import FacturaForm from './FacturaForm'
import FacturaTable from './FacturaTable'
import FacturaResults from './FacturaResults'



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
    this.state = {
      cliente: null,
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
    if(this.newValueIsAppropiate(key, newValue)) {
      this.setState({facturaData: this.state.facturaData.update(key, v => newValue)})
    }
  }

  onProductChanged = (index, key, newValue) => {
    if(this.newValueIsAppropiate(key, newValue)) {
      const productos = this.state.productos
      const updatedProduct = productos.get(index).update(key, v => newValue)
      this.setState({productos: productos.update(index, v => updatedProduct)})
    }
  }

  render() {
    const {
      cliente,
      descuento,
      facturaData,
      productos,
    } = this.state

    return (
      <div style={{height:'100%', overflow:'auto'}} >
      <PaperContainer >
        <div style={{marginTop: '24px', marginLeft: '36px', marginRight: '36px'}}>
          <FacturaForm data={facturaData} cliente={cliente}
            onDataChanged={this.onFacturaDataChanged}
            onNewCliente={this.onNewCliente} onNewProduct={this.onNewProductFromKeyboard}/>
          <FacturaTable items={productos} onProductChanged={this.onProductChanged}/>
          <FacturaResults productos={productos} descuento={descuento}/>
        </div>
      </PaperContainer>
      </div>
    );
  }

}
