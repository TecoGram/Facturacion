import React, {Component} from 'react';

import PaperContainer from '../lib/PaperContainer'
import FacturaForm from './FacturaForm'
import FacturaTable from './FacturaTable'
import FacturaResults from './FacturaResults'


const mockItems = [
  {
    nombre: 'Acido Urico 20x12 ml 240 det. TECO',
    codigo: 'AD-0493-11-03',
    lote: 'EDR356',
    count: 1,
    precioVenta: 20.00,
    fechaExp: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  },
]

export default class FacturarView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      cliente: null,
      codigo: '',
      fecha: '',
      descuento: '',
      autorizacion: '',
      formaPago: '',
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
    const newProductList = [...this.state.productos, newProduct]
    this.setState({ productos: newProductList})
  }

  render() {
    const {
      cliente,
      productos,
    } = this.state

    return (
      <div style={{height:'100%', overflow:'auto'}} >
      <PaperContainer >
        <div style={{marginTop: '24px', marginLeft: '36px', marginRight: '36px'}}>
          <FacturaForm suggestions={["hello", "bye"]} cliente={cliente}
            onNewCliente={this.onNewCliente} onNewProduct={this.onNewProductFromKeyboard}/>
          <FacturaTable items={productos}/>
          <FacturaResults />
        </div>
      </PaperContainer>
      </div>
    );
  }

}
