const DialogState = require('./DialogState.js');

let state;
let stateManager;
const setStateFunc = arg => {
  state = Object.assign(state, arg);
};

const llenarStateConDatosCorrectos = () => {
  state.inputs = {
    ruc: '0937816882001',
    nombre: 'Dr. Julio Mendoza',
    direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
    correo: 'julio_mendoza@yahoo.com.ec',
    telefono1: '2645422',
    telefono2: '2876357',
    descDefault: '0',
  };
};

describe('Cliente Dialog State', () => {
  beforeEach(() => {
    state = {
      inputs: {},
      errors: {},
      serverError: null,
    };
  });

  describe('validarDatos', () => {
    it('retorna null si no logra validar el cliente', () => {
      stateManager = new DialogState({}, setStateFunc);
      const result = stateManager.validarDatos(state.inputs);
      expect(result).toBe(null);
    });

    it('retorna el objeto inputs si logra validar el cliente', () => {
      stateManager = new DialogState({}, setStateFunc);
      llenarStateConDatosCorrectos();
      const result = stateManager.validarDatos(state.inputs);
      expect(result).toBeTruthy();
    });
  });

  describe('cerrarDialogConExito', () => {
    it('cierra el dialog usando el dispatch cerrarDialogConMsg', () => {
      let msg;
      const cerrarDialogConMsg = function(message) {
        msg = message;
      };
      stateManager = new DialogState({ cerrarDialogConMsg }, setStateFunc);
      llenarStateConDatosCorrectos();
      stateManager.cerrarDialogConExito('test');
      expect(msg.endsWith('test')).toBe(true);
    });
  });

  describe('mostrarErrorDeServidor', () => {
    it('parsea el error de la respuesta y lo coloca en el state', () => {
      stateManager = new DialogState({}, setStateFunc);
      const resp = { response: { text: 'Error!' } };
      stateManager.mostrarErrorDeServidor(resp);
      expect(state.serverError.endsWith('Error!')).toBe(true);
    });
  });

  describe('updateData', () => {
    it('coloca propiedades al state y remueve errores', () => {
      stateManager = new DialogState({}, setStateFunc);
      state.errors.nombre = 'incorrecto';
      stateManager.updateData('nombre', 'test', state);
      expect(state.errors.nombre).toBeFalsy();
      expect(state.inputs.nombre).toEqual('test');
    });
  });

  describe('cancelarDialog', () => {
    it('resetea el estado del dialog y llama al dispatch cancelarDialog', () => {
      let called;
      const cancelarDialog = () => {
        called = true;
      };
      stateManager = new DialogState({ cancelarDialog }, setStateFunc);
      stateManager.cancelarDialog();
      expect(called).toBe(true);
      expect(state).toEqual({
        inputs: {},
        errors: {},
        serverError: null,
      });
    });
  });

  describe('getMensajeExito', () => {
    it('obtiene el mensaje de exito a mostrar segun el valor de editar en props', () => {
      stateManager = new DialogState({ editar: {} }, setStateFunc);
      const editarMsg = stateManager.getMensajeExito('test');
      expect(editarMsg).toEqual('Cliente actualizado: test');

      stateManager.props.editar = null;
      const insertarMsg = stateManager.getMensajeExito('test');
      expect(insertarMsg).toEqual('Nuevo cliente guardado: test');
    });
  });

  describe('revisarDataParaEditar', () => {
    it('revisa props y si hay un objeto editar se lo pasa al state', () => {
      const editar = {
        ruc: '0937816882001',
        nombre: 'Dr. Julio Mendoza',
        direccion: 'Avenida Juan Tanca Marengo y Gomez Gould',
        correo: 'julio_mendoza@yahoo.com.ec',
        telefono1: '2645422',
        telefono2: '2876357',
        descDefault: '0',
      };
      stateManager = new DialogState({ editar }, setStateFunc);
      stateManager.revisarDataParaEditar();
      expect(state.inputs).toEqual(editar);
    });
  });
});
