import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import NuevoClienteForm from './NuevoClienteForm'
import { validarCliente } from '../../Validacion'
import { insertarCliente } from '../../api'
import ServerErrorText from '../../lib/formTable/ServerErrorText'

export default class NuevoClienteDialog extends React.Component {

  state = {
    inputs: {},
    errors: {},
    serverError: null,
  }

  handleClose = () => {
    //console.log("close")
  };

  updateData = (fieldName, newValue) => {
    const newData = { ...this.state.inputs }
    newData[fieldName] = newValue
    const newErrors = { ...this.state.errors }
    newErrors[fieldName] = null
    this.setState({inputs: newData, errors: newErrors})
  }

  renderServerError = (errText) => {
    if (errText)
      return (
        <ServerErrorText>{errText}</ServerErrorText>
      )
    else return <div />
  }

  guardarCliente = (inputs, cerrarDialog) => {
    const {
      ruc, nombre, direccion, email, telefono1, telefono2,
    } = inputs

    insertarCliente(ruc, nombre, direccion, email, telefono1, telefono2)
    .then((resp) => {
      this.setState({inputs: {}, errors: {}, serverError: null})
      cerrarDialog(`Nuevo cliente guardado: ${nombre}`)
    }, (err) => {
      this.setState({ serverError: 'Error al almacenar datos: ' + err.response.text })
    })
  }

  render() {
    const {
      tipoDialog,
      cambiarDialog,
      cerrarDialogConMsg,
    } = this.props

    const actions = [
      <FlatButton
        label="Cancelar"
        secondary={true}
        onTouchTap={(event) => {
          this.setState({inputs: {}, errors: {}, serverError: null})
          cambiarDialog(null)
        }
      }
      />,
      <FlatButton
        label="Guardar"
        primary={true}
        keyboardFocused={true}
        onTouchTap={(event) => {
          const userInputs = this.state.inputs
          const { errors, inputs } = validarCliente(userInputs)
          if(errors) {
            this.setState({errors: errors})
          } else {
            this.setState({errors: {}})
            this.guardarCliente(inputs, cerrarDialogConMsg)
          }
        }
      }
      />,
    ]

    return (
      <Dialog
        title={'Nuevo Cliente'}
        actions={actions}
        modal={false}
        open={Boolean(tipoDialog)}
        onRequestClose={this.handleClose} >
        <NuevoClienteForm inputs={this.state.inputs} errors={this.state.errors}
        updateData={this.updateData}/>
        { this.renderServerError(this.state.serverError) }
      </Dialog>
    )
  }
}
