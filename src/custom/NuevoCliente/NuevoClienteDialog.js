import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import NuevoClienteForm from './NuevoClienteForm'
import DialogState from './DialogState'
import { insertarCliente, updateCliente } from '../../api'
import ServerErrorText from '../../lib/formTable/ServerErrorText'

export default class NuevoClienteDialog extends React.Component {

  constructor(props) {
    super(props)
    this.stateManager = new DialogState(props, (args) => this.setState(args))
    this.state = {
      inputs: {},
      errors: {},
      serverError: null,
    }
  }

  cancelarDialog = () => {
    this.stateManager.cancelarDialog()
  };

  updateData = (fieldName, newValue) => {
    this.stateManager.updateData(fieldName, newValue, this.state)
  }

  renderServerError = (errText) => {
    if (errText)
      return (
        <ServerErrorText>{errText}</ServerErrorText>
      )
    else return <div />
  }

  guardarCliente = (inputs) => {
    const {
      ruc, nombre, direccion, email, telefono1, telefono2, descDefault,
    } = inputs

    const {
      cerrarDialogConExito,
      mostrarErrorDeServidor,
    } = this.stateManager

    const guardarAction = this.props.editar ? updateCliente: insertarCliente
    const handleSuccess = () => cerrarDialogConExito(inputs.nombre)

    guardarAction(ruc, nombre, direccion, email, telefono1, telefono2, descDefault)
      .then(handleSuccess, mostrarErrorDeServidor)
  }

  validarDatos = () => {
    const rawInputs = this.state.inputs
    const inputs = this.stateManager.validarDatos(rawInputs)
    if(inputs) {
      this.guardarCliente(inputs, this.props.cerrarDialogConMsg)
    }
  }

  componentDidMount() {
    this.stateManager.revisarDataParaEditar()
  }

  componentWillReceiveProps = (nextProps) => {
    this.stateManager.props = nextProps
    this.stateManager.revisarDataParaEditar()
  }

  render() {
    const {
      open,
      editar,
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
        title={'Nuevo Cliente'}
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={this.handleClose} >
        <NuevoClienteForm inputs={this.state.inputs} errors={this.state.errors}
          updateData={this.updateData} editar={Boolean(editar)}/>
        { this.renderServerError(this.state.serverError) }
      </Dialog>
    )
  }
}

NuevoClienteDialog.propTypes = {
  editar: React.PropTypes.object,
  open: React.PropTypes.bool.isRequired,
  cancelarDialog: React.PropTypes.func.isRequired,
  cerrarDialogConMsg: React.PropTypes.func.isRequired,
}
