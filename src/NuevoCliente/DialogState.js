const { validarCliente } = require('../Validacion.js');

class DialogState {
  constructor(props, setStateFunc) {
    this.setState = setStateFunc;
    this.props = props;

    this.validarDatos = this.validarDatos.bind(this);
    this.cerrarDialogConExito = this.cerrarDialogConExito.bind(this);
    this.mostrarErrorDeServidor = this.mostrarErrorDeServidor.bind(this);
    this.updateData = this.updateData.bind(this);
    this.cancelarDialog = this.cancelarDialog.bind(this);
    this.getMensajeExito = this.getMensajeExito.bind(this);
    this.revisarDataParaEditar = this.revisarDataParaEditar.bind(this);
  }

  validarDatos(inputs) {
    const { errors, inputs: _inputs } = validarCliente(inputs);
    if (errors) {
      this.setState({ errors: errors });
      return null;
    } else {
      this.setState({ errors: {} });
      return _inputs;
    }
  }

  getMensajeExito(nombre) {
    if (this.props.editar) return `Cliente actualizado: ${nombre}`;
    return `Nuevo cliente guardado: ${nombre}`;
  }

  cerrarDialogConExito(nombre) {
    const msg = this.getMensajeExito(nombre);
    this.setState({ inputs: {}, errors: {}, serverError: null });
    this.props.cerrarDialogConMsg(msg);
  }

  mostrarErrorDeServidor(respError) {
    this.setState({
      serverError: 'Error al almacenar datos: ' + respError.response.text,
    });
  }

  updateData(fieldName, newValue, state) {
    const newData = Object.assign({}, state.inputs);
    newData[fieldName] = newValue;
    const newErrors = Object.assign({}, state.errors);
    newErrors[fieldName] = null;
    this.setState({ inputs: newData, errors: newErrors });
  }

  cancelarDialog() {
    this.setState({ inputs: {}, errors: {}, serverError: null });
    this.props.cancelarDialog();
  }

  revisarDataParaEditar() {
    const editarData = this.props.editar;
    if (editarData) this.setState({ inputs: Object.assign({}, editarData) });
  }
}

module.exports = DialogState;
