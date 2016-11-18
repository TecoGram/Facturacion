import React, {Component} from 'react';

import PaperContainer from '../lib/PaperContainer'
import FacturaForm from './FacturaForm'
import FacturaTable from './FacturaTable'
import FacturaResults from './FacturaResults'


const mockItems = [
  {
    name: 'Acido Urico 20x12 ml 240 det. TECO',
    regSan: 'AD-0493-11-03',
    lote: 'EDR356',
    count: 100,
    price: 120.00,
    expDate: '06/10/2017',
  },
  {
    name: 'Acido Urico 20x12 ml 240 det. TECO',
    regSan: 'AD-0493-11-03',
    lote: 'EDR356',
    count: 100,
    price: 120.00,
    expDate: '06/10/2017',
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

    }
  }

  onNewCliente = (newCliente) => {
    this.setState({ cliente: newCliente })
  }

  render() {
    const {
      cliente,
    } = this.state

    return (
      <div style={{height:'100%', overflow:'auto'}} >
      <PaperContainer >
        <div style={{marginTop: '24px', marginLeft: '36px', marginRight: '36px'}}>
          <FacturaForm suggestions={["hello", "bye"]} cliente={cliente}
            onNewCliente={this.onNewCliente}/>
          <FacturaTable items={mockItems}/>
          <FacturaResults />
        </div>
      </PaperContainer>
      </div>
    );
  }

}
