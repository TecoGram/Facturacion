import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import NuevoClienteForm from '../custom/formTable/NuevoClienteForm'

export default class FormDialog extends React.Component {

  state = {
    data: [],
  }

  handleClose = () => {
    //console.log("close")
  };

  updateData = (fieldName, newValue) => {
    const newData = { ...this.state.data }
    newData[fieldName] = newValue
    this.setState({data: newData})
  }

  render() {

    const {
      tipoDialog,
      cambiarDialog,

    } = this.props

    const actions = [
      <FlatButton
        label="Cancelar"
        secondary={true}
        onTouchTap={(event) => cambiarDialog(null)}
      />,
      <FlatButton
        label="Guardar"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ]

    return (
      <Dialog
        title="Nuevo Cliente"
        actions={actions}
        modal={false}
        open={Boolean(tipoDialog)}
        onRequestClose={this.handleClose} >
        <NuevoClienteForm data={this.state.data} updateData={this.updateData}/>
      </Dialog>
    )
  }
}
