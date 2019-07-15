import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

import AddShoppingCart from 'material-ui/svg-icons/action/add-shopping-cart';
import Payment from 'material-ui/svg-icons/action/payment';
import Info from 'material-ui/svg-icons/action/info';
import Loyalty from 'material-ui/svg-icons/action/loyalty';
import Person from 'material-ui/svg-icons/social/person';
import Today from 'material-ui/svg-icons/action/today';
import LocalHospital from 'material-ui/svg-icons/maps/local-hospital';
import LocalShipping from 'material-ui/svg-icons/maps/local-shipping';
import AirlineSeatReclineNormal from 'material-ui/svg-icons/notification/airline-seat-recline-normal';

import ClienteAutoComplete from '../AutoComplete/ClienteAutoComplete';
import ProductoAutoComplete from '../AutoComplete/ProductoAutoComplete';
import MedicoAutoComplete from '../AutoComplete/MedicoAutoComplete';
import CloseableColorChip from '../lib/CloseableColorChip';
import IconBox from '../lib/IconBox';
import { DateTimePicker, CurrentTime } from './TimeInputs';
import { SinglePaymentInput, PaymentsInput } from './PaymentInputs';

const autoCompleteWidth = '425px';
const txtMargin = '28px';

const ClienteInput = props => {
  const { cliente, errors, onNewCliente, width } = props;

  if (cliente)
    return (
      <CloseableColorChip
        text={cliente.nombre}
        width={width}
        icon={Person}
        onRequestDelete={() => onNewCliente(null)}
      />
    );
  else
    return (
      <ClienteAutoComplete
        width={width}
        errorText={errors.cliente}
        onNewItemSelected={onNewCliente}
      />
    );
};

const MedicoInput = props => {
  const { medico, errors, onNewMedico, width } = props;

  if (medico)
    return (
      <CloseableColorChip
        text={medico.nombre}
        width={width}
        icon={LocalHospital}
        onRequestDelete={() => onNewMedico(null)}
      />
    );
  else
    return (
      <MedicoAutoComplete
        width={width}
        errorText={errors.medico}
        onNewItemSelected={onNewMedico}
      />
    );
};

const ClienteDataRow = props => {
  let width = autoCompleteWidth;
  const onNewCliente = cliente => {
    // delay para evitar warnings de no-op setState
    Promise.resolve().then(() => props.onNewCliente(cliente));
  };

  return (
    <div style={{ display: 'block' }}>
      <IconBox icon={Person} />
      <ClienteInput
        cliente={props.cliente}
        errors={props.errors}
        onNewCliente={onNewCliente}
        width={width}
      />
      <IconBox icon={AddShoppingCart} />
      <ProductoAutoComplete
        isExamen={props.isExamen}
        width={width}
        onNewItemSelected={props.onNewProduct}
      />
    </div>
  );
};

const PacienteDataRow = props => {
  let width = autoCompleteWidth;
  const { onNewMedico, onDataChanged, data, medico } = props;

  const { paciente } = data;

  return (
    <div style={{ display: 'block' }}>
      <IconBox icon={LocalHospital} />
      <MedicoInput
        medico={medico}
        errors={props.errors}
        onNewMedico={onNewMedico}
        width={width}
      />
      <IconBox icon={AirlineSeatReclineNormal} />
      <TextField
        hintText="Paciente"
        style={{ width: width }}
        value={paciente}
        onChange={event => onDataChanged('paciente', event.target.value)}
      />
    </div>
  );
};

const PagosInput = props => {
  const { pagos, empresa, updatePagos, abrirPagosForUpdate } = props;

  const isMultiplePayments = pagos.length > 1;
  if (isMultiplePayments) {
    return (
      <PaymentsInput
        empresa={empresa}
        pagos={pagos}
        abrirPagosForUpdate={abrirPagosForUpdate}
        onDelete={() => updatePagos([{ formaPagoText: '', valorText: '' }])}
      />
    );
  }

  const [pagoUnico] = pagos;
  const onChange = (formaPagoText, formaPago) =>
    updatePagos([{ formaPagoText, formaPago }]);
  return (
    <SinglePaymentInput
      onChange={onChange}
      onAddPaymentsClick={abrirPagosForUpdate}
      value={pagoUnico.formaPagoText}
    />
  );
};

const DateTimeInput = props => {
  const { fecha } = props.data;

  if (fecha === 'now')
    return (
      <CurrentTime onClick={() => props.onDataChanged('fecha', new Date())} />
    );

  const onDateChange = (e, date) => {
    const copiedDate = new Date(date.getTime());
    copiedDate.setHours(
      fecha.getHours(),
      fecha.getMinutes(),
      fecha.getSeconds()
    );
    props.onDataChanged('fecha', copiedDate);
  };

  const onTimeChange = (e, date) => {
    props.onDataChanged('fecha', date);
  };

  const onDeleteClick = () => {
    props.onDataChanged('fecha', 'now');
  };

  return (
    <DateTimePicker
      onDateChange={onDateChange}
      onTimeChange={onTimeChange}
      onDeleteClick={onDeleteClick}
      value={fecha}
    />
  );
};

export default class FacturaForm extends Component {
  render() {
    const {
      abrirPagosForUpdate,
      updatePagos,
      pagos,
      data,
      errors,
      onDataChanged,
      isExamen
    } = this.props;

    const formHeight = isExamen ? '170px' : '130px';
    const pacienteRow = isExamen ? <PacienteDataRow {...this.props} /> : null;

    return (
      <div style={{ height: formHeight }}>
        <br />
        <ClienteDataRow {...this.props} />
        {pacienteRow}
        <table>
          <tbody>
            <tr>
              <td>
                <IconBox icon={Today} />
              </td>
              <td>
                <DateTimeInput {...this.props} />
              </td>

              <td>
                <IconBox icon={LocalShipping} />
              </td>
              <td>
                <TextField
                  hintText="Flete"
                  value={data.fleteText}
                  errorText={errors.flete}
                  onChange={event => onDataChanged('flete', event.target.value)}
                  style={{ width: '80px', marginRight: txtMargin }}
                  inputStyle={{ textAlign: 'right' }}
                />
              </td>

              <td>
                <IconBox icon={Loyalty} />
              </td>
              <td>
                <TextField
                  hintText="Desc."
                  value={data.descuento}
                  errorText={errors.descuento}
                  onChange={event =>
                    onDataChanged('descuento', event.target.value)
                  }
                  style={{ width: '35px' }}
                  inputStyle={{ textAlign: 'right' }}
                />
                <span style={{ marginRight: txtMargin, paddingLeft: '9px' }}>
                  %
                </span>
              </td>

              <td>
                <IconBox icon={Info} />
              </td>
              <td>
                <TextField
                  hintText="Autorización"
                  value={data.autorizacion}
                  errorText={errors.autorizacion}
                  onChange={event =>
                    onDataChanged('autorizacion', event.target.value)
                  }
                  style={{
                    verticalAlign: 'top',
                    width: '140px',
                    marginRight: txtMargin
                  }}
                />
              </td>

              <td>
                <IconBox icon={Payment} />
              </td>
              <td>
                <PagosInput
                  pagos={pagos}
                  abrirPagosForUpdate={abrirPagosForUpdate}
                  updatePagos={updatePagos}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

FacturaForm.propTypes = {
  data: React.PropTypes.object.isRequired,
  errors: React.PropTypes.object.isRequired,
  onDataChanged: React.PropTypes.func.isRequired,
  abrirPagosForUpdate: React.PropTypes.func.isRequired,
  isExamen: React.PropTypes.bool
};

FacturaForm.defaultProps = {
  isExamen: false
};
