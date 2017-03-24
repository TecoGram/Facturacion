import React from 'react';

import Checkbox from 'material-ui/Checkbox'
import RaisedButton from 'material-ui/RaisedButton'

const ivaLabel = (porcentajeIVA) => `IVA ${porcentajeIVA}%: $`
const nuevoLabel = 'Generar Factura'
const editarLabel = 'Guardar Cambios'

const ResultsTable = (props) => {
  const {
    isExamen,
    subtotal,
    rebaja,
    impuestos,
    total,
    porcentajeIVA,
  } = props

  const ivaRow = isExamen ? null :
    <tr>
      <td><strong>{ivaLabel(porcentajeIVA)}</strong></td>
      <td>{Number(impuestos).toFixed(2)}</td>
    </tr>
  return (
    <div>
      <table style={{ width: 'auto', display: 'inline-table', textAlign: 'right'}}>
        <tbody>
          <tr>
            <td><strong>Subtotal: $</strong></td>
            <td style={{paddingLeft:'20px'}}>{Number(subtotal).toFixed(2)}</td>
          </tr>
          { ivaRow }
          <tr>
            <td><strong>Descuento: $</strong></td>
            <td>{Number(rebaja).toFixed(2)}</td>
          </tr>
          <tr>
            <td><strong>Total: $</strong></td>
            <td>{Number(total).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const FacturaDetalladaCheckbox = (props) => {
  const {
    detallado,
    isExamen,
    onFacturaDataChanged,
  } = props

  if (isExamen) return null
  return (
    <Checkbox
      label={"Mostrar Información detallada en cada producto"}
      style={{ textAlign: 'left' }}
      checked={detallado}
      onCheck={(event, isChecked) => { onFacturaDataChanged('detallado', isChecked)}} />
  )
}

const GuardarFacturaButton = (props) => {
  const {
    nuevo,
    guardarButtonDisabled,
    onGuardarClick,
  } = props
  const label = nuevo ? nuevoLabel : editarLabel
  return (
    <div style={{ textAlign: 'center' }}>
      <RaisedButton label={label} primary={true}
        onTouchTap={ onGuardarClick } disabled={guardarButtonDisabled}/>
    </div>
  )
}
export default class FacturaResults extends React.Component {

  render() {
    return (
      <div style={{width: '100%', paddingTop: '6px', textAlign: 'right'}}>
        <ResultsTable {...this.props} />
        <FacturaDetalladaCheckbox {...this.props} />
        <br />
        <GuardarFacturaButton {...this.props} />
      </div>
    )
  }
}

FacturaResults.propTypes = {
  isExamen: React.PropTypes.bool,
  detallado: React.PropTypes.bool.isRequired,
  rebaja: React.PropTypes.number.isRequired,
  subtotal: React.PropTypes.number.isRequired,
  impuestos: React.PropTypes.number,
  total: React.PropTypes.number.isRequired,
  onGuardarClick: React.PropTypes.func,
  onFacturaDataChanged: React.PropTypes.func.isRequired,
  nuevo: React.PropTypes.bool.isRequired,
  porcentajeIVA: React.PropTypes.number,
}

FacturaResults.defaultProps = {
  isExamen: false,
}
