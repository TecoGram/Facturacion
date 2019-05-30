import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { insertarMedico } from 'facturacion_common/src/api';
import { validarMedico } from 'facturacion_common/src/Validacion';

import NuevoMedicoForm from './NuevoMedicoForm';
import ServerErrorText from '../lib/formTable/ServerErrorText';

import { NUEVO_MEDICO_DIALOG_CLOSED } from '../DialogTypes';

export default class NuevoMedicoDialog extends React.Component {
  state = {
    inputs: {},
    errors: {},
    serverError: null
  };

  cancelarDialog = () => {
    this.setState({ inputs: {}, errors: {}, serverError: null });
    this.props.cambiarDialog(NUEVO_MEDICO_DIALOG_CLOSED);
  };

  updateData = (fieldName, newValue) => {
    const newData = { ...this.state.inputs };
    newData[fieldName] = newValue;
    const newErrors = { ...this.state.errors };
    newErrors[fieldName] = null;
    this.setState({ inputs: newData, errors: newErrors });
  };

  renderServerError = errText => {
    if (errText) return <ServerErrorText>{errText}</ServerErrorText>;
    else return <div />;
  };

  guardarMedico = (inputs, cerrarDialog) => {
    const { nombre, direccion, email, comision, telefono1, telefono2 } = inputs;

    insertarMedico(
      nombre,
      direccion,
      email,
      comision,
      telefono1,
      telefono2
    ).then(
      () => {
        this.setState({ inputs: {}, errors: {}, serverError: null });
        cerrarDialog(
          `Nuevo medico guardado: ${nombre}`,
          NUEVO_MEDICO_DIALOG_CLOSED
        );
      },
      err => {
        this.setState({
          serverError: 'Error al almacenar datos: ' + err.response.text
        });
      }
    );
  };

  validarDatos = () => {
    const { errors, inputs } = validarMedico(this.state.inputs);
    if (errors) {
      this.setState({ errors: errors });
    } else {
      this.setState({ errors: {} });
      this.guardarMedico(inputs, this.props.cerrarDialogConMsg);
    }
  };

  render() {
    const { open } = this.props;

    const actions = [
      <FlatButton
        label="Cancelar"
        secondary={true}
        onTouchTap={this.cancelarDialog}
      />,
      <FlatButton
        label="Guardar"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.validarDatos}
      />
    ];

    return (
      <Dialog
        title={'Nuevo Medico'}
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={this.handleClose}
      >
        <NuevoMedicoForm
          inputs={this.state.inputs}
          errors={this.state.errors}
          updateData={this.updateData}
        />
        {this.renderServerError(this.state.serverError)}
      </Dialog>
    );
  }
}
