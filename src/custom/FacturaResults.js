import React from 'react';

import RaisedButton from 'material-ui/RaisedButton'

const iva = 0.14
const ivaLabel = `IVA 14%: $`

export default class FacturaResults extends React.Component {

  calcularSubtotal = (productos) => {
    let subtotal = 0
    const len = productos.size
    for (let i = 0; i < len; i++) {
      const product = productos.get(i)
      subtotal += product.get('precioVenta') * product.get('count')
    }
    return subtotal
  }

  calcularRebaja = (subtotal, descuento) => {
    if(!descuento || descuento.length === 0)
      descuento = 0
    return subtotal * descuento / 100
  }

  calcularIVA = (subtotal) => {
    return subtotal * iva
  }

  render() {
    const {
      productos,
      descuento,
      onGuardarClick,
    } = this.props

    const subtotal = this.calcularSubtotal(productos)
    const rebaja = this.calcularRebaja(subtotal, descuento)
    const valorIVA = this.calcularIVA(subtotal)
    const total = subtotal - rebaja + valorIVA

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
        onTouchTap={ onGuardarClick } />
      </div>
      </div>
    )
  }
}
