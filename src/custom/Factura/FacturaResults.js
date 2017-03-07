import React from 'react';

import RaisedButton from 'material-ui/RaisedButton'
import { calcularValoresFacturablesImm } from './Math'

const ivaLabel = `IVA 14%: $`
const nuevoLabel = 'Generar Factura'
const editarLabel = 'Guardar Cambios'

export default class FacturaResults extends React.Component {

  render() {
    const {
      isExamen,
      facturables,
      descuento,
      onGuardarClick,
      guardarButtonDisabled,
      nuevo,
    } = this.props

    const {
      subtotal,
      rebaja,
      valorIVA,
      total,
    } = calcularValoresFacturablesImm(facturables, descuento)

    const label = nuevo ? nuevoLabel : editarLabel

    const ivaRow = isExamen ? null :
      <tr>
        <td><strong>{ivaLabel}</strong></td>
        <td>{Number(valorIVA).toFixed(2)}</td>
      </tr>


    return (
      <div style={{width: '100%', textAlign: 'right'}}>
        <br />
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
        <div style={{ textAlign: 'center' }}>
          <RaisedButton label={label} primary={true}
            onTouchTap={ onGuardarClick } disabled={guardarButtonDisabled}/>
        </div>
      </div>
    )
  }
}

FacturaResults.propTypes = {
  isExamen: React.PropTypes.bool,
  facturables: React.PropTypes.object.isRequired, //Immutable.js list
  descuento: React.PropTypes.number.isRequired,
  onGuardarClick: React.PropTypes.func,
  nuevo: React.PropTypes.bool.isRequired,
}

FacturaResults.defaultProps = {
  isExamen: false,
}
