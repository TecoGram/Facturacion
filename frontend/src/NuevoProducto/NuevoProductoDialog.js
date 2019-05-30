import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { insertarProducto, updateProducto } from 'facturacion_common/src/api';

import NuevoProductoForm from './NuevoProductoForm';
import DialogState from './DialogState';
import ServerErrorText from '../lib/formTable/ServerErrorText';

export default class NuevoProductoDialog extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = new DialogState(props, args => this.setState(args));
    this.state = this.stateManager.getDefaultState();
  }

  cancelarDialog = () => {
    this.stateManager.cancelarDialog();
  };

  updateData = (fieldName, newValue) => {
    this.stateManager.updateData(fieldName, newValue, this.state);
  };

  renderServerError = errText => {
    if (errText) return <ServerErrorText>{errText}</ServerErrorText>;
    else return <div />;
  };

  guardarProducto = inputs => {
    const {
      rowid,
      codigo,
      nombre,
      marca,
      precioDist,
      precioVenta,
      pagaIva
    } = inputs;

    const { cerrarDialogConExito, mostrarErrorDeServidor } = this.stateManager;

    const guardarAction = this.props.editar
      ? updateProducto(
          rowid,
          codigo,
          nombre,
          marca,
          precioDist,
          precioVenta,
          pagaIva
        )
      : insertarProducto(
          codigo,
          nombre,
          marca,
          precioDist,
          precioVenta,
          pagaIva
        );
    const handleSuccess = () => cerrarDialogConExito(inputs.nombre);

    guardarAction.then(handleSuccess, mostrarErrorDeServidor);
  };

  validarDatos = () => {
    const rawInputs = this.state.inputs;
    const inputs = this.stateManager.validarDatos(rawInputs);
    if (inputs) {
      inputs.rowid = rawInputs.rowid;
      this.guardarProducto(inputs);
    }
  };

  componentDidMount() {
    this.stateManager.revisarDataParaEditar();
  }

  componentWillReceiveProps = nextProps => {
    this.stateManager.props = nextProps;
    this.stateManager.revisarDataParaEditar();
  };

  render() {
    const { open, editar } = this.props;

    const actions = [
      <FlatButton
        label="Cancelar"
        secondary={true}
        onTouchTap={this.cancelarDialog}
      />,
      <FlatButton
        label="Guardar"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.validarDatos}
      />
    ];

    return (
      <Dialog
        title={'Nuevo Producto'}
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={this.handleClose}
      >
        <NuevoProductoForm
          inputs={this.state.inputs}
          errors={this.state.errors}
          updateData={this.updateData}
          editar={Boolean(editar)}
        />
        {this.renderServerError(this.state.serverError)}
      </Dialog>
    );
  }
}

NuevoProductoDialog.propTypes = {
  editar: React.PropTypes.object,
  open: React.PropTypes.bool.isRequired,
  cancelarDialog: React.PropTypes.func.isRequired,
  cerrarDialogConMsg: React.PropTypes.func.isRequired
};
