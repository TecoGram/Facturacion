import React from 'react';

import ActionStore from 'material-ui/svg-icons/action/store';
import Info from 'material-ui/svg-icons/action/info';
import Person from 'material-ui/svg-icons/social/person';
import Phone from 'material-ui/svg-icons/communication/phone';
import Email from 'material-ui/svg-icons/communication/email';

import IconTextFieldRow from '../../lib/formTable/IconTextFieldRow'

export default class NuevoClienteForm extends React.Component {

  render() {
    const {
      data,
      updateData,
    } = this.props

    const rucInput = {
      hintText: "RUC",
      icon: Info,
      value: data.ruc || '',
      onChange: (event) => {updateData('ruc', event.target.value)},
    }

    const telf1Input = {
      hintText: "Teléfono 1",
      icon: Phone,
      value: data.telefono1 || '',
      onChange: (event) => {updateData('telefono1', event.target.value)},
    }

    const clienteInput = {
      hintText: "Cliente",
      icon: Person,
      value: data.cliente || '',
      onChange: (event) => {updateData('cliente', event.target.value)},
    }

    const telf2Input = {
      hintText: "Teléfono 2",
      icon: Phone,
      value: data.telefono2 || '',
      onChange: (event) => {updateData('telefono2', event.target.value)},
    }

    const direccionInput = {
      hintText: "Dirección",
      icon: ActionStore,
      value: data.direccion || '',
      onChange: (event) => {updateData('direccion', event.target.value)},
    }

    const emailInput = {
      hintText: "E-mail",
      icon: Email,
      value: data.email || '',
      onChange: (event) => {updateData('email', event.target.value)},
    }

    return (
      <table>
        <tbody>
          <IconTextFieldRow
            leftInput={rucInput}
            rightInput={telf1Input} />
          <IconTextFieldRow
            leftInput={clienteInput}
            rightInput={telf2Input} />
          <IconTextFieldRow
            leftInput={direccionInput}
            rightInput={emailInput} />
        </tbody>
      </table>
    )
  }
}
