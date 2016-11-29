import React from 'react';

import RaisedButton from 'material-ui/RaisedButton'
import { calcularValores } from './FacturacionUtils'

const ivaLabel = `IVA 14%: $`

export default class FacturaResults extends React.Component {


  render() {
    const {
      productos,
      descuento,
      onGuardarClick,
      guardarButtonDisabled,
    } = this.props

    const {
      subtotal,
      rebaja,
      valorIVA,
      total,
    } = calcularValores(productos, descuento)

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
            <tr>
              <td><strong>{ivaLabel}</strong></td>
              <td>{Number(valorIVA).toFixed(2)}</td>
            </tr>
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
          <RaisedButton label="Generar Factura" primary={true}
            onTouchTap={ onGuardarClick } disabled={guardarButtonDisabled}/>
        </div>
      </div>
    )
  }
}
