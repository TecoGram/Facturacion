import React from 'react';

import ActionStore from 'material-ui/svg-icons/action/store';
import Email from 'material-ui/svg-icons/communication/email';
import Info from 'material-ui/svg-icons/action/info';
import Loyalty from 'material-ui/svg-icons/action/loyalty';
import Person from 'material-ui/svg-icons/social/person';
import Phone from 'material-ui/svg-icons/communication/phone';

import IconTextFieldRow from '../lib/formTable/IconTextFieldRow';
import { TiposID } from 'facturacion_common/src/Models.js';

const tiposIDSource = Object.keys(TiposID).map(key => ({
  text: TiposID[key],
  value: key
}));

export default class NuevoClienteForm extends React.Component {
  render() {
    const { editar, errors, inputs, updateData } = this.props;

    const tipoInput = {
      hintText: 'Tipo de identificación',
      icon: Info,
      value: inputs.tipoText || '',
      errorText: errors.tipo,
      dataSource: tiposIDSource,
      disabled: editar,
      onChange: newText => {
        updateData('tipo', newText);
      }
    };

    const idInput = {
      hintText: '#ID',
      icon: Info,
      value: inputs.id || '',
      errorText: errors.id,
      disabled: editar,
      onChange: event => {
        updateData('id', event.target.value);
      }
    };

    const telf1Input = {
      hintText: 'Teléfono 1',
      icon: Phone,
      value: inputs.telefono1 || '',
      errorText: errors.telefono1,
      onChange: event => {
        updateData('telefono1', event.target.value);
      }
    };

    const clienteInput = {
      hintText: 'Cliente',
      icon: Person,
      value: inputs.nombre || '',
      errorText: errors.nombre,
      onChange: event => {
        updateData('nombre', event.target.value);
      }
    };

    const telf2Input = {
      hintText: 'Teléfono 2',
      icon: Phone,
      value: inputs.telefono2 || '',
      errorText: errors.telefono2,
      onChange: event => {
        updateData('telefono2', event.target.value);
      }
    };

    const direccionInput = {
      hintText: 'Dirección',
      icon: ActionStore,
      value: inputs.direccion || '',
      errorText: errors.direccion,
      onChange: event => {
        updateData('direccion', event.target.value);
      }
    };

    const emailInput = {
      hintText: 'E-mail',
      icon: Email,
      value: inputs.email || '',
      errorText: errors.email,
      onChange: event => {
        updateData('email', event.target.value);
      }
    };

    const descDefaultInput = {
      hintText: 'Descuento recomendado (%)',
      icon: Loyalty,
      value: inputs.descDefault || '',
      errorText: errors.descDefault,
      onChange: event => {
        updateData('descDefault', event.target.value);
      }
    };

    return (
      <table>
        <tbody>
          <IconTextFieldRow leftInput={tipoInput} rightInput={idInput} />
          <IconTextFieldRow leftInput={clienteInput} rightInput={emailInput} />
          <IconTextFieldRow leftInput={telf1Input} rightInput={telf2Input} />
          <IconTextFieldRow
            leftInput={direccionInput}
            rightInput={descDefaultInput}
          />
          {/* An additional empty row prevents jittering in the dialog */}
          <IconTextFieldRow empty={true} />
        </tbody>
      </table>
    );
  }
}

NuevoClienteForm.propTypes = {
  editar: React.PropTypes.bool.isRequired,
  errors: React.PropTypes.object.isRequired,
  inputs: React.PropTypes.object.isRequired,
  updateData: React.PropTypes.func.isRequired
};
