import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import NuevoClienteForm from './NuevoClienteForm';
import { updateState } from '../Arch.js';
import * as Actions from './Actions.js';
import { createReducer, getDefaultState } from './Reducers.js';
import ServerErrorText from '../lib/formTable/ServerErrorText';

export default class NuevoClienteDialog extends React.Component {
  constructor(props) {
    super(props);
    this.createReducer = createReducer;
    this.state = getDefaultState();
  }

  updateInput = (key, value) => {
    updateState(this, { type: Actions.updateInput, key, value });
  };

  renderServerError = errText => {
    if (errText) return <ServerErrorText>{errText}</ServerErrorText>;
    else return <div />;
  };

  cerrar = () => Promise.resolve().then(() => this.props.cancelarDialog());

  onCancelarClicked = () => {
    updateState(this, { type: Actions.cerrar, callback: this.cerrar });
  };
  onGuardarClicked = () => {
    updateState(this, { type: Actions.guardar, callback: this.cerrar });
  };

  render() {
    const { open } = this.props;

    const actions = [
      <FlatButton
        label="Cancelar"
        secondary={true}
        onTouchTap={this.onCancelarClicked}
      />,
      <FlatButton
        label="Guardar"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.onGuardarClicked}
      />
    ];

    return (
      <Dialog
        title={'Nuevo Cliente'}
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={this.onCancelarClicked}
      >
        <NuevoClienteForm
          inputs={this.state.inputs}
          errors={this.state.errors}
          updateData={this.updateInput}
          editar={Boolean(this.props.cliente)}
        />
        {this.renderServerError(this.state.serverError)}
      </Dialog>
    );
  }
}

NuevoClienteDialog.propTypes = {
  editar: React.PropTypes.object,
  open: React.PropTypes.bool.isRequired,
  cancelarDialog: React.PropTypes.func.isRequired,
  cerrarDialogConMsg: React.PropTypes.func.isRequired
};
