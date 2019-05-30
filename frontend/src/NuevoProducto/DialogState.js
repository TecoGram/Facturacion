import { validarProducto } from 'facturacion_common/src/Validacion.js';

export default class DialogState {
  constructor(props, setStateFunc) {
    this.setState = setStateFunc;
    this.props = props;

    this.validarDatos = this.validarDatos.bind(this);
    this.getDefaultState = this.getDefaultState.bind(this);
    this.cerrarDialogConExito = this.cerrarDialogConExito.bind(this);
    this.mostrarErrorDeServidor = this.mostrarErrorDeServidor.bind(this);
    this.updateData = this.updateData.bind(this);
    this.cancelarDialog = this.cancelarDialog.bind(this);
    this.getMensajeExito = this.getMensajeExito.bind(this);
    this.revisarDataParaEditar = this.revisarDataParaEditar.bind(this);
  }
  getDefaultState() {
    return {
      inputs: { pagaIva: true },
      errors: {},
      serverError: null
    };
  }

  cancelarDialog() {
    this.setState(this.getDefaultState());
    this.props.cancelarDialog();
  }

  validarDatos(inputs) {
    const { errors, inputs: _inputs } = validarProducto(inputs);
    if (errors) {
      this.setState({ errors: errors });
      return null;
    } else {
      this.setState({ errors: {} });
      return _inputs;
    }
  }

  getMensajeExito(nombre) {
    if (this.props.editar) return `Producto actualizado: ${nombre}`;
    return `Nuevo producto guardado: ${nombre}`;
  }

  cerrarDialogConExito(nombre) {
    const msg = this.getMensajeExito(nombre);
    this.setState(this.getDefaultState());
    this.props.cerrarDialogConMsg(msg);
  }

  mostrarErrorDeServidor(respError) {
    this.setState({
      serverError: 'Error al almacenar datos: ' + respError.response.text
    });
  }

  updateData(fieldName, newValue, state) {
    const newData = Object.assign({}, state.inputs);
    newData[fieldName] = newValue;
    const newErrors = Object.assign({}, state.errors);
    newErrors[fieldName] = null;
    this.setState({ inputs: newData, errors: newErrors });
  }

  revisarDataParaEditar() {
    const editarData = this.props.editar;
    if (editarData) {
      const editarInputs = Object.assign({}, editarData);
      editarInputs.precioDist = '' + editarData.precioDist;
      editarInputs.precioVenta = '' + editarData.precioVenta;
      editarInputs.pagaIva = editarData.pagaIva === 0 ? false : true;
      this.setState({ inputs: editarInputs });
    }
  }
}
