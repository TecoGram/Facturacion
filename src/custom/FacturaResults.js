import React from 'react';

export default class FacturaResults extends React.Component {

  render() {
    return (
      <div >
        <br />
        <table style={{float: 'right', textAlign: 'right'}}>
          <tr><td><strong>Subtotal:</strong></td><td style={{paddingLeft:'20px'}}>$100</td></tr>
          <tr><td><strong>IVA 14%:</strong></td><td>$14</td></tr>
          <tr><td><strong>Descuento:</strong></td><td>$0</td></tr>
          <tr><td><strong>Total:</strong></td><td>$114</td></tr>
        </table>
      </div>
    )
  }
}
