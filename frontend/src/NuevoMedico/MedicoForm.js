import React from 'react';

import MedicoFormView from './MedicoFormView';
import ServerErrorText from '../lib/formTable/ServerErrorText';
import * as Actions from './Actions.js';
import { updateState } from '../Arch.js';
import { createReducer, getDefaultState } from './Reducers.js';

export default class MedicoForm extends React.Component {
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

  onCancelarClicked = callback => {
    updateState(this, { type: Actions.cerrar, callback });
  };
  onGuardarClicked = callback => {
    updateState(this, { type: Actions.guardar, callback });
  };

  componentDidMount() {
    const { editar } = this.props;
    if (editar) updateState(this, { type: Actions.editar, cliente: editar });
  }

  render() {
    return (
      <div>
        <MedicoFormView
          inputs={this.state.inputs}
          errors={this.state.errors}
          updateData={this.updateInput}
          editar={!!this.props.editar}
        />
        {this.renderServerError(this.state.serverError)}
      </div>
    );
  }
}
