import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { updateState } from '../Arch.js';
import PagosForm from './PagosForm';
import { createReducer, getDefaultState } from './Reducers.js';
import * as Actions from './Actions.js';
import ServerErrorText from '../lib/formTable/ServerErrorText';

export default class PagosDialog extends React.Component {
  constructor(props) {
    super(props);
    this.createReducer = createReducer;
    this.state = getDefaultState();
  }

  close = saveData => () => {
    const cerrarDialogOnNextTick = () =>
      Promise.resolve().then(() => this.props.cancelarDialog());

    if (!saveData) {
      updateState(this, { type: Actions.getDefaultState });
      cerrarDialogOnNextTick();
      return;
    }

    updateState(this, {
      type: Actions.guardarPagos,
      onSaveData: this.props.onSaveData,
      cancelarDialog: cerrarDialogOnNextTick
    });
  };

  renderServerError = errText => {
    if (errText) return <ServerErrorText>{errText}</ServerErrorText>;
    else return <div />;
  };

  render() {
    const { originalPagos, open, total } = this.props;
    const { pagos, modificado, errorMsg } = this.state;

    const actions = [
      <FlatButton
        label="Cancelar"
        secondary={true}
        onTouchTap={this.close(false)}
      />,
      <FlatButton
        label="Guardar"
        primary={true}
        onTouchTap={this.close(true)}
      />
    ];

    return (
      <Dialog
        title={'Pagos'}
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={this.close(false)}
      >
        <PagosForm
          total={total}
          errorMsg={errorMsg}
          pagos={modificado ? pagos : originalPagos}
          submitAction={action =>
            updateState(this, { originalPagos, ...action })
          }
        />
        {this.renderServerError(this.state.serverError)}
      </Dialog>
    );
  }
}

PagosDialog.propTypes = {
  total: React.PropTypes.number,
  open: React.PropTypes.bool.isRequired,
  onSaveData: React.PropTypes.func,
  cancelarDialog: React.PropTypes.func,
  originalPagos: React.PropTypes.array
};
