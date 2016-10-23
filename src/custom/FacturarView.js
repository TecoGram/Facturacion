import React, {Component} from 'react';

import PaperContainer from '../lib/PaperContainer'
import FacturaForm from './FacturaForm'
import FacturaTable from './FacturaTable'


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

  render() {
    return (
      <PaperContainer >
        <div style={{marginTop: '24px', marginLeft: '36px', marginRight: '36px'}}>
          <FacturaForm suggestions={["hello", "bye"]} />
          <FacturaTable items={mockItems}/>
        </div>
      </PaperContainer>
    );
  }

}
