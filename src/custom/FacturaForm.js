import React, {Component} from 'react';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';

import AddShoppingCart from 'material-ui/svg-icons/action/add-shopping-cart';
import Info from 'material-ui/svg-icons/action/info';
import Loyalty from 'material-ui/svg-icons/action/loyalty';
import Payment from 'material-ui/svg-icons/action/payment';
import Person from 'material-ui/svg-icons/social/person';
import Receipt from 'material-ui/svg-icons/action/receipt';
import Today from 'material-ui/svg-icons/action/today';

import ClienteAutoComplete from './AutoComplete/ClienteAutoComplete'
import ProductoAutoComplete from './AutoComplete/ProductoAutoComplete'
import SelectedClienteChip from './SelectedClienteChip'
import IconBox from '../lib/IconBox'

const autoCompleteWidth = '425px'
const txtMargin = '42px'

export default class FacturaForm extends Component {

  renderClienteInput = (props) => {
    const {
      cliente,
      onNewCliente,
    } = props

    if (cliente)
      return (
        <SelectedClienteChip text={cliente.nombre}
        onRequestDelete={() => {onNewCliente(null)}} />
      )
    else
      return (
          <ClienteAutoComplete width={autoCompleteWidth}
          onNewItemSelected={onNewCliente}/>
      )
  }

  render() {
    return (
      <div>
        <br />
        <div style={{display: 'block', marginBottom: '8px'}}>
          <IconBox icon={Person}/>
          { this.renderClienteInput(this.props) }
          <IconBox icon={AddShoppingCart}/>
          <ProductoAutoComplete width={autoCompleteWidth}
            onNewItemSelected={this.props.onNewProduct}/>
        </div>

        <IconBox icon={Receipt}/>
        <TextField
          hintText="Código"
          style={{width: '140px', marginRight: txtMargin}} />

        <IconBox icon={Today}/>
        <DatePicker
          hintText="Fecha" style={{display: 'inline-block'}}
          textFieldStyle={{width:'140px', marginRight: txtMargin}} />

        <IconBox icon={Loyalty}/>
        <TextField
          hintText="Desc. %"
          style={{width:'80px', marginRight: txtMargin}} />

        <IconBox icon={Payment}/>
        <TextField
          hintText="Forma de pago"
          style={{width:'140px', marginRight: txtMargin}} />

        <IconBox icon={Info}/>
        <TextField
          hintText="Autorización"
          style={{width:'144px'}} />
      </div>
    );
  }
}

FacturaForm.propTypes = {
  icon: React.PropTypes.element,
}
