import React from 'react';

import { updateState } from '../Arch.js';
import PagosFormView from './PagosFormView';
import { createReducer, getDefaultState } from './Reducers.js';
import * as Actions from './Actions.js';
import ServerErrorText from '../lib/formTable/ServerErrorText';

export default class PagosForm extends React.Component {
  constructor(props) {
    super(props);
    this.createReducer = createReducer;
    this.state = getDefaultState();
  }

  onGuardarClicked = callback => {
    updateState(this, {
      type: Actions.guardarPagos,
      onSaveData: this.props.onSaveData,
      cancelarDialog: callback
    });
  };

  onCancelarClicked = callback => {
    updateState(this, { type: Actions.getDefaultState });
    callback();
  };

  renderServerError = errText => {
    if (errText) return <ServerErrorText>{errText}</ServerErrorText>;
    else return <div />;
  };

  render() {
    const { originalPagos, total } = this.props;
    const { pagos, modificado, errorMsg } = this.state;

    return (
      <div>
        <PagosFormView
          total={total}
          errorMsg={errorMsg}
          pagos={modificado ? pagos : originalPagos}
          submitAction={action =>
            updateState(this, { originalPagos, ...action })
          }
        />
        {this.renderServerError(this.state.serverError)}
      </div>
    );
  }
}

PagosForm.propTypes = {
  total: React.PropTypes.number,
  originalPagos: React.PropTypes.array,
  onSaveData: React.PropTypes.func
};
