import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class MainDialog extends React.Component {
  cerrar = msg => Promise.resolve().then(() => this.props.cerrarDialog(msg));

  onCancelarClicked = () => {
    this.childElement.onCancelarClicked(this.cerrar);
  };

  onGuardarClicked = () => {
    this.childElement.onGuardarClicked(this.cerrar);
  };

  setContentRef = element => {
    this.childElement = element;
  };

  render() {
    const { open, title, Content, cerrarDialog, ...childProps } = this.props;

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
        title={title}
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={this.onCancelarClicked}
      >
        <Content
          ref={this.setContentRef}
          key={Content.editable && childProps.editar}
          {...childProps}
        />
      </Dialog>
    );
  }
}

MainDialog.propTypes = {
  open: React.PropTypes.bool.isRequired,
  cerrarDialog: React.PropTypes.func.isRequired
};
