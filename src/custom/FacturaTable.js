import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import TextField from 'material-ui/TextField'

const renderTableHeader = () => {
  return (
    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
      <TableRow>
        <TableHeaderColumn width={40} style={{padding: '0px'}}>#</TableHeaderColumn>
        <TableHeaderColumn width={80} style={{padding: '0px'}}>Reg. San.</TableHeaderColumn>
        <TableHeaderColumn width={150} style={{padding: '0px'}}>Nombre</TableHeaderColumn>
        <TableHeaderColumn width={60} style={{padding: '0px'}}>Lote</TableHeaderColumn>
        <TableHeaderColumn width={40} style={{padding: '0px'}}>Cant.</TableHeaderColumn>
        <TableHeaderColumn width={60} style={{padding: '0px'}}>Fecha Exp.</TableHeaderColumn>
        <TableHeaderColumn width={60} style={{padding: '0px'}}>Precio</TableHeaderColumn>
        <TableHeaderColumn width={40} style={{padding: '0px'}}>Importe</TableHeaderColumn>
      </TableRow>
    </TableHeader>
  )
}

export default class FacturaTable extends React.Component {

  renderRow = (product, i) => {
    return (
    <TableRow key={i}>
      <TableRowColumn width={40} style={{padding: '0px'}}>{i}</TableRowColumn>
      <TableRowColumn width={80} style={{padding: '0px'}}>{product.regSan}</TableRowColumn>
      <TableRowColumn width={150} style={{padding: '0px'}}>{product.name}</TableRowColumn>
      <TableRowColumn width={60} style={{padding: '0px'}}>{product.lote}</TableRowColumn>
      <TableRowColumn width={40} style={{padding: '0px'}}>
        <TextField name='countText' style={{width: '28px'}} defaultValue={1}/>
      </TableRowColumn>
      <TableRowColumn width={60} style={{padding: '0px'}}>{product.expDate}</TableRowColumn>
      <TableRowColumn width={60} style={{padding: '0px'}}>
        <TextField name='countText' style={{width: '50px'}} defaultValue={product.price}/>
      </TableRowColumn>
      <TableRowColumn width={40} style={{padding: '0px'}}>${product.price * product.count}</TableRowColumn>
    </TableRow>
  )
  }

  render() {
    return (
    <Table selectable={false}>
      { renderTableHeader() }
      <TableBody displayRowCheckbox={false}>
        { this.props.items.map(this.renderRow) }
      </TableBody>
    </Table>
    );
  }
}
