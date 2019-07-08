import React, { Component } from 'react';

import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import muiThemeable from 'material-ui/styles/muiThemeable';

import Backspace from 'material-ui/svg-icons/content/backspace';
import LibraryAdd from 'material-ui/svg-icons/av/library-add';

import { FormasDePago } from 'facturacion_common/src/Models.js';

const formasDePago = Object.keys(FormasDePago).map(key => ({
  text: FormasDePago[key],
  value: key
}));

const smallButtonStyle = {
  width: 36,
  height: 36,
  padding: 9,
  verticalAlign: 'middle',
  display: 'inline-block'
};

const smallIconStyle = {
  width: 18,
  height: 18
};

export class SinglePaymentInput extends Component {
  render() {
    const { onChange, onAddPaymentsClick, value } = this.props;

    const onFormaPagoTextChanged = (newText, array) => {
      const selectedItem = array.find(({ text }) => newText === text);

      const formaPagoText = selectedItem ? selectedItem.text : newText;
      const formaPago = selectedItem ? selectedItem.value : undefined;

      onChange(formaPagoText, formaPago);
    };

    return (
      <div style={{ display: 'inline-block' }}>
        <AutoComplete
          hintText="Forma de pago"
          dataSource={formasDePago}
          openOnFocus={true}
          filter={AutoComplete.caseInsensitiveFilter}
          onUpdateInput={onFormaPagoTextChanged}
          searchText={value}
          style={{ width: '180px' }}
          textFieldStyle={{ width: '180px' }}
        />
        <IconButton
          iconStyle={smallIconStyle}
          style={smallButtonStyle}
          onClick={onAddPaymentsClick}
        >
          <LibraryAdd />
        </IconButton>
      </div>
    );
  }
}

const mPaymentsInput = props => {
  const { pagos, muiTheme, abrirPagosForUpdate, onDelete } = props;
  const label = `${pagos.length} formas de pago`;

  return (
    <div style={{ display: 'inline-block' }}>
      <FlatButton
        label={label}
        primary={true}
        onTouchTap={abrirPagosForUpdate}
      />
      <IconButton
        iconStyle={smallIconStyle}
        style={smallButtonStyle}
        onClick={onDelete}
      >
        <Backspace color={muiTheme.palette.primary1Color} />
      </IconButton>
    </div>
  );
};

export const PaymentsInput = muiThemeable()(mPaymentsInput);
