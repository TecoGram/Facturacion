import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import API from 'facturacion_common/src/api.js';

import ServerErrorText from '../lib/formTable/ServerErrorText';

export default class ComprobanteDialog extends Component {
  state = {
    type: 'idle'
  };

  emitirComprobante = ventaId => {
    if (this.state.type === 'loading') return;

    this.setState({ type: 'loading' });
    API.emitirComprobante(ventaId)
      .then(() => {
        this.setState(
          {
            type: 'idle'
          },
          this.props.cerrarConMsg('Comprobante emitido exitosamente')
        );
      })
      .catch(err => {
        const { response } = err;
        if (!response)
          return this.setState({
            type: 'error',
            message:
              'Error al generar comprobante, por favor vuelve a intentar más tarde.'
          });

        const message =
          response.status === 520 ? response.body.datilMsg : response.text;
        this.setState({ type: 'error', message });
      });
  };

  statefulContent = () => {
    const { type, message } = this.state;
    switch (type) {
      case 'error':
        return <ServerErrorText>{message}</ServerErrorText>;
      case 'loading':
        return (
          <div style={{ textAlign: 'center' }}>
            <CircularProgress style={{ margin: '0 auto' }} />;
          </div>
        );
      default:
        return null;
    }
  };

  render() {
    const { editarFactura, ventaId } = this.props;

    const actions = [
      <FlatButton
        label="Editar Factura"
        primary={true}
        onClick={() => editarFactura(ventaId)}
      />,
      <RaisedButton
        label="Emitir Comprobante"
        primary={true}
        onClick={() => this.emitirComprobante(ventaId)}
      />
    ];

    return (
      <Dialog
        title={'Comprobante Listo'}
        open={!!ventaId}
        actions={actions}
        modal={true}
      >
        <p>
          Antes de emitir el comprobante electrónico por favor revisa&nbsp;
          <a
            rel={'noopener'}
            target={'_blank'}
            href={API.getFacturaURL(ventaId)}
          >
            la factura generada
          </a>
          . Una vez emitido el comprobante, ya no se pueden editar los datos de
          esta factura.
        </p>
        {this.statefulContent()}
      </Dialog>
    );
  }
}

ComprobanteDialog.propTypes = {
  editarFactura: React.PropTypes.func.isRequired,
  cerrarConMsg: React.PropTypes.func.isRequired,
  ventaId: React.PropTypes.number
};
