import React from 'react';

import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';

import Money from 'facturacion_common/src/Money.js';

import ServerErrorText from '../lib/formTable/ServerErrorText';

const ivaLabel = porcentajeIVA => `IVA ${porcentajeIVA}%: $`;
const nuevoLabel = 'Generar Factura';
const editarLabel = 'Guardar Cambios';
const errorMsgStyle = {
  fontSize: '14px',
  textAlign: 'left'
};

const ResultsTable = props => {
  const { isExamen, porcentajeIVA } = props;
  const subtotal = Money.print(props.subtotal);
  const rebaja = Money.print(props.rebaja);
  const impuestos = Money.print(props.impuestos);
  const total = Money.print(props.total);

  const ivaRow = isExamen ? null : (
    <tr>
      <td>
        <strong>{ivaLabel(porcentajeIVA)}</strong>
      </td>
      <td>{impuestos}</td>
    </tr>
  );
  return (
    <div style={{ float: 'right' }}>
      <table
        style={{ width: 'auto', display: 'inline-table', textAlign: 'right' }}
      >
        <tbody>
          <tr>
            <td>
              <strong>Subtotal: $</strong>
            </td>
            <td style={{ paddingLeft: '20px' }}>{subtotal}</td>
          </tr>
          {ivaRow}
          <tr>
            <td>
              <strong>Descuento: $</strong>
            </td>
            <td>{rebaja}</td>
          </tr>
          <tr>
            <td>
              <strong>Total: $</strong>
            </td>
            <td>{total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const FacturaDetalladaCheckbox = props => {
  const { detallado, isExamen, onFacturaDataChanged } = props;

  if (isExamen) return null;
  return (
    <Checkbox
      label={'Mostrar Información detallada en cada producto'}
      style={{ textAlign: 'left' }}
      checked={detallado}
      onCheck={(event, isChecked) => {
        onFacturaDataChanged('detallado', isChecked);
      }}
    />
  );
};

const GuardarFacturaButton = props => {
  const { nuevo, guardarButtonDisabled, onGuardarClick, subtotal } = props;
  const label = nuevo ? nuevoLabel : editarLabel;
  return (
    <div style={{ textAlign: 'center' }}>
      <RaisedButton
        label={label}
        primary={true}
        onTouchTap={() => onGuardarClick(subtotal)}
        disabled={guardarButtonDisabled}
      />
    </div>
  );
};

export default class FacturaResults extends React.Component {
  render() {
    return (
      <div style={{ width: '100%', paddingTop: '6px' }}>
        <ServerErrorText style={errorMsgStyle}>
          {this.props.errorUnidades}
        </ServerErrorText>
        <ResultsTable {...this.props} />
        <FacturaDetalladaCheckbox {...this.props} />
        <br />
        <GuardarFacturaButton {...this.props} />
      </div>
    );
  }
}

FacturaResults.propTypes = {
  errorUnidades: React.PropTypes.string,
  isExamen: React.PropTypes.bool,
  detallado: React.PropTypes.bool.isRequired,
  rebaja: React.PropTypes.number.isRequired,
  subtotal: React.PropTypes.number.isRequired,
  impuestos: React.PropTypes.number,
  total: React.PropTypes.number.isRequired,
  onGuardarClick: React.PropTypes.func,
  onFacturaDataChanged: React.PropTypes.func.isRequired,
  nuevo: React.PropTypes.bool.isRequired,
  porcentajeIVA: React.PropTypes.number
};

FacturaResults.defaultProps = {
  isExamen: false
};
