import React from 'react';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';

import Clear from 'material-ui/svg-icons/content/clear';
import Payment from 'material-ui/svg-icons/action/payment';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import Warning from 'material-ui/svg-icons/alert/warning';
import Error from 'material-ui/svg-icons/alert/error';
import { yellow700, red700, green700 } from 'material-ui/styles/colors';

import * as Actions from './Actions.js';

import { FormasDePago } from 'facturacion_common/src/Models.js';
import Money from 'facturacion_common/src/Money.js';
import IconBox from '../lib/IconBox.js';

const formasDePago = Object.keys(FormasDePago).map(key => ({
  text: FormasDePago[key],
  value: key
}));

const black54p = '#757575';

const newUniqueIdGenerator = () => {
  let i = 0;
  return () => i++;
};

const iconStyle = {
  display: 'inline-block'
};
const noPaddingStyle = { padding: '0px' };

const getNewId = newUniqueIdGenerator();

const renderRow = props => ({ formaPagoText, valorText }, i) => {
  const { submitAction } = props;
  const onValorChange = event => {
    submitAction({
      type: Actions.updateValor,
      valorText: event.target.value,
      index: i
    });
  };

  const onFormaPagoTextChanged = (newText, array) => {
    const selectedItem = array.find(({ text }) => newText === text);

    const formaPagoText = selectedItem ? selectedItem.text : newText;
    const formaPago = selectedItem ? selectedItem.value : undefined;

    submitAction({
      type: Actions.updateFormaPago,
      formaPagoText,
      formaPago,
      index: i
    });
  };

  const onDelete = () => {
    submitAction({
      type: Actions.removerPago,
      index: i
    });
  };

  const deleteColumn = (
    <TableRowColumn>
      <IconButton style={iconStyle} onTouchTap={onDelete}>
        <Clear color={black54p} />
      </IconButton>
    </TableRowColumn>
  );

  return (
    <TableRow key={i} displayBorder={false}>
      <TableRowColumn width={260} style={noPaddingStyle}>
        <AutoComplete
          hintText="Forma de pago"
          dataSource={formasDePago}
          openOnFocus={true}
          filter={AutoComplete.caseInsensitiveFilter}
          onUpdateInput={onFormaPagoTextChanged}
          searchText={formaPagoText}
          style={{ width: '250px' }}
          textFieldStyle={{ width: '250px' }}
        />
      </TableRowColumn>
      <TableRowColumn width={60} style={noPaddingStyle}>
        <TextField
          style={{ width: '50px' }}
          hintText={'$'}
          value={valorText}
          name={'valor'}
          inputStyle={{ textAlign: 'right', fontSize: '13px' }}
          onChange={onValorChange}
        />
      </TableRowColumn>
      {i > 1 ? deleteColumn : <TableRowColumn style={{ width: '48px' }} />}
    </TableRow>
  );
};

const AgregarPagoButton = props => {
  const { submitAction } = props;

  const onClick = () => {
    submitAction({
      type: Actions.agregarPago,
      key: getNewId()
    });
  };

  return (
    <FlatButton
      label="Agregar Pago"
      labelPosition="before"
      primary={true}
      onClick={onClick}
      icon={<Payment />}
    />
  );
};

const warningMessage = text => (
  <span style={{ paddingLeft: '24px' }}>
    <IconBox color={yellow700} icon={Warning} />
    {text}
  </span>
);

const errorMessage = text => (
  <span style={{ paddingLeft: '24px' }}>
    <IconBox color={red700} icon={Error} />
    {text}
  </span>
);

const okMessage = text => (
  <span style={{ paddingLeft: '24px' }}>
    <IconBox color={green700} icon={CheckCircle} />
    {text}
  </span>
);

const footerMsg = ({ pagos, total }) => {
  if (pagos.length === 0)
    return warningMessage('Por favor agrega almenos un pago.');

  const totalPagado = pagos.reduce((res, item) => {
    if (!item.valor) return res;
    return res + item.valor;
  }, 0);

  const totalPagadoStr = Money.print(totalPagado);
  const totalStr = Money.print(total);

  if (totalStr === totalPagadoStr)
    return okMessage(`Pagado $${totalPagadoStr}/${totalStr}.`);

  return warningMessage(
    `Pagado $${totalPagadoStr}/${totalStr}. Por favor completa el saldo.`
  );
};

const Footer = props => {
  const { errorMsg, pagos, total } = props;
  if (errorMsg) return errorMessage(errorMsg);
  return footerMsg({ pagos, total });
};

const PagosForm = props => {
  const { pagos, submitAction } = props;
  return (
    <div>
      <AgregarPagoButton submitAction={submitAction} />

      <Table height={'200px'} style={{ width: '380px' }} selectable={false}>
        <TableBody displayRowCheckbox={false}>
          {pagos.map(renderRow(props))}
        </TableBody>
      </Table>
      <Footer {...props} />
    </div>
  );
};

export default PagosForm;
