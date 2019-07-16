import React, { Component } from 'react';

import PaperContainer from '../lib/PaperContainer';
import FacturaForm from './FacturaForm';
import FacturaTable from './FacturaTable';
import FacturaResults from './FacturaResults';
import ComprobanteDialog from './ComprobanteDialog';
import { getFacturaURL } from 'facturacion_common/src/api';
import * as Actions from './EditorActions.js';
import { createReducer, getDefaultState } from './EditorReducers.js';
import { updateState } from '../Arch.js';
import { calcularValoresFacturables } from 'facturacion_common/src/Math.js';

export default class FacturaEditorView extends Component {
  constructor(props) {
    super(props);
    this.createReducer = createReducer;
    this.state = getDefaultState();
  }

  onFacturaInputChanged = (key, value) => {
    updateState(this, { type: Actions.updateFacturaInput, key, value });
  };

  onFacturableChanged = (index, key, value) => {
    updateState(this, { type: Actions.updateUnidadInput, index, key, value });
  };

  onFacturableDeleted = index => {
    updateState(this, { type: Actions.removeUnidad, index });
  };

  onNewCliente = clienteRow => {
    updateState(this, { type: Actions.setCliente, clienteRow });
  };

  onNewMedico = medicoRow => {
    updateState(this, { type: Actions.setMedico, medicoRow });
  };

  onNewProductFromKeyboard = productoRow => {
    updateState(this, { type: Actions.agregarProducto, productoRow });
  };

  getInsertOkMsg = editar =>
    editar
      ? 'La factura se editó exitosamente'
      : 'La factura se guardó exitosamente';

  onGenerarFacturaClick = () => {
    const { empresa, iva } = this.props.ajustes;
    const { isExamen, ventaKey } = this.props;
    const editar = !!ventaKey;

    const config = { empresa, iva, isExamen, editar };
    const callback = ({ success, ...extras }) => {
      if (!success) {
        this.props.mostrarErrorConSnackbar(extras.msg);
        return;
      }

      const pdfLink = getFacturaURL(extras.rowid);
      window.open(pdfLink);
      const msg = this.getInsertOkMsg(editar);
      this.props.abrirLinkConSnackbar(msg, pdfLink);
    };

    updateState(this, {
      type: Actions.guardarFactura,
      config,
      callback
    });
  };

  componentDidMount() {
    const { ventaKey, isExamen } = this.props;
    updateState(this, {
      type: Actions.getFacturaExistente,
      ventaKey,
      isExamen
    });
  }

  updatePagos = pagos =>
    updateState(this, {
      type: Actions.updatePagos,
      pagos
    });

  abrirPagosForUpdate = total => {
    if (total === 0)
      this.props.mostrarErrorConSnackbar('No hay nada que pagar.');
    else {
      const originalPagos =
        this.state.pagos.length < 2
          ? [...this.state.pagos, { formaPagoText: '', valorText: '' }]
          : this.state.pagos;
      this.props.abrirPagos({
        total,
        originalPagos,
        onSaveData: this.updatePagos
      });
    }
  };

  resetearConMsg = msg => {
    updateState(this, { type: Actions.getDefaultState });
    Promise.resolve().then(() => this.props.mostrarErrorConSnackbar(msg));
  };

  editarFactura = ventaId => {
    const { ventaKey, isExamen } = this.props;
    if (ventaId === ventaKey)
      updateState(this, { type: Actions.cerrarComprobanteDialog });

    const editarFn = isExamen
      ? this.props.editarFacturaExamen
      : this.props.editarFactura;
    editarFn(ventaId);
  };

  render() {
    const {
      clienteRow,
      errors,
      unidades,
      inputs,
      medicoRow,
      pagos,
      guardando
    } = this.state;

    const { isExamen, ventaKey, ajustes } = this.props;

    // se permite usar string vacio como 0 asi que
    // hay que sanitizar
    const descuento = inputs.descuento === '' ? 0 : inputs.descuento;
    const flete = inputs.flete === '' ? 0 : inputs.flete;

    const errorUnidades = errors && errors.unidades;
    const detallado = inputs.detallado;
    const iva = isExamen ? 0 : ajustes.iva;
    const { subtotal, rebaja, impuestos, total } = calcularValoresFacturables({
      unidades,
      descuento,
      iva,
      flete
    });

    return (
      <div style={{ height: '100%', overflow: 'auto' }}>
        <PaperContainer>
          <div
            style={{
              marginTop: '24px',
              marginLeft: '36px',
              marginRight: '36px'
            }}
          >
            <FacturaForm
              data={inputs}
              errors={errors}
              cliente={clienteRow}
              medico={medicoRow}
              pagos={pagos}
              updatePagos={this.updatePagos}
              onDataChanged={this.onFacturaInputChanged}
              ventaKey={ventaKey}
              onNewMedico={this.onNewMedico}
              onNewCliente={this.onNewCliente}
              onNewProduct={this.onNewProductFromKeyboard}
              abrirPagosForUpdate={() => this.abrirPagosForUpdate(total)}
              isExamen={isExamen}
            />
            <FacturaTable
              items={unidades}
              onFacturableChanged={this.onFacturableChanged}
              onFacturableDeleted={this.onFacturableDeleted}
              isExamen={isExamen}
            />
            <FacturaResults
              errorUnidades={errorUnidades}
              subtotal={subtotal}
              rebaja={rebaja}
              impuestos={impuestos}
              total={total}
              porcentajeIVA={iva}
              contable={inputs.contable}
              contableDisabled={!ajustes.main || inputs.contableDisabled}
              guardando={guardando}
              detallado={detallado}
              onGuardarClick={this.onGenerarFacturaClick}
              onFacturaDataChanged={this.onFacturaInputChanged}
              nuevo={!ventaKey}
              guardarButtonDisabled={false}
              isExamen={isExamen}
            />
            <ComprobanteDialog
              ventaId={this.state.emitiendo ? this.state.emitiendo.ventaId : 0}
              editarFactura={this.editarFactura}
              cerrarConMsg={this.resetearConMsg}
            />
          </div>
        </PaperContainer>
      </div>
    );
  }
}

FacturaEditorView.propTypes = {
  abrirPagos: React.PropTypes.func.isRequired,
  abrirLinkConSnackbar: React.PropTypes.func.isRequired,
  mostrarErrorConSnackbar: React.PropTypes.func.isRequired,
  editarFactura: React.PropTypes.func.isRequired,
  editarFacturaExamen: React.PropTypes.func.isRequired,
  isExamen: React.PropTypes.bool,
  ventaKey: React.PropTypes.number
};

FacturaEditorView.defaultProps = {
  isExamen: false
};
