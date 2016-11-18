import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import NuevoProductoForm from './NuevoProductoForm'
import { validarProducto } from '../../Validacion'
import { insertarProducto } from '../../api'
import ServerErrorText from '../../lib/formTable/ServerErrorText'

import { NUEVO_PRODUCTO_DIALOG_CLOSED } from '../../DialogTypes'

export default class NuevoProductoDialog extends React.Component {

  state = {
    inputs: {},
    errors: {},
    serverError: null,
  }

  cancelarDialog = () => {
    this.setState({inputs: {}, errors: {}, serverError: null})
    this.props.cambiarDialog(NUEVO_PRODUCTO_DIALOG_CLOSED)
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

  guardarProducto = (inputs, cerrarDialog) => {
    const {
      codigo, nombre, precioFab, precioVenta,
    } = inputs

    insertarProducto(codigo, nombre, precioFab, precioVenta)
    .then((resp) => {
      this.setState({inputs: {}, errors: {}, serverError: null})
      cerrarDialog(`Nuevo producto guardado: ${nombre}`, NUEVO_PRODUCTO_DIALOG_CLOSED)
    }, (err) => {
      this.setState({ serverError: 'Error al almacenar datos: ' + err.response.text })
    })
  }


  validarDatos = (userInputs) => {
    const { errors, inputs } = validarProducto(this.state.inputs)
    if(errors) {
      this.setState({errors: errors})
    } else {
      this.setState({errors: {}})
      this.guardarProducto(inputs, this.props.cerrarDialogConMsg)
    }
  }

  render() {
    const {
      open,
    } = this.props

    const actions = [
      <FlatButton
        label="Cancelar"
        secondary={true}
        onTouchTap={ this.cancelarDialog }
      />,
      <FlatButton
        label="Guardar"
        primary={true}
        keyboardFocused={true}
        onTouchTap={ this.validarDatos }
      />,
    ]

    return (
      <Dialog
        title={'Nuevo Producto'}
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={this.handleClose} >
        <NuevoProductoForm inputs={this.state.inputs} errors={this.state.errors}
        updateData={this.updateData}/>
        { this.renderServerError(this.state.serverError) }
      </Dialog>
    )
  }
}
