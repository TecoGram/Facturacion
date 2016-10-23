import React, {Component} from 'react';

import PaperContainer from '../lib/PaperContainer'
import FacturaForm from './FacturaForm'


export default class FacturarView extends Component {

  render() {
    return (
      <PaperContainer >
        <div style={{marginTop: '24px', marginLeft: '36px'}}>
          <FacturaForm suggestions={["hello", "bye"]} />
        </div>
      </PaperContainer>
    );
  }

}
