import React from 'react';

import ClienteFormView from './ClienteFormView';
import { updateState } from '../Arch.js';
import * as Actions from './Actions.js';
import { createReducer, getDefaultState } from './Reducers.js';
import ServerErrorText from '../lib/formTable/ServerErrorText';

export default class ClienteForm extends React.Component {
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
        <ClienteFormView
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

ClienteForm.editable = true;

ClienteForm.propTypes = {
  editar: React.PropTypes.object
};
