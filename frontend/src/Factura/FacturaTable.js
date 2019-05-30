import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';
import Math from 'facturacion_common/src/Math.js';

const black54p = '#757575';
const noPaddingStyle = { padding: '0px' };

const RenderTableHeader = props => {
  let regSanCol = (
    <TableHeaderColumn width={80} style={noPaddingStyle}>
      Reg. Santario
    </TableHeaderColumn>
  );
  let loteCol = (
    <TableHeaderColumn width={60} style={noPaddingStyle}>
      Lote
    </TableHeaderColumn>
  );
  let fechaExpCol = (
    <TableHeaderColumn width={70} style={noPaddingStyle}>
      Fecha Exp.
    </TableHeaderColumn>
  );

  if (props.isExamen) {
    //ocultar columnas que no se usan en examenes
    regSanCol = null;
    loteCol = null;
    fechaExpCol = null;
  }

  return (
    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
      <TableRow>
        <TableHeaderColumn width={40} style={noPaddingStyle}>
          #
        </TableHeaderColumn>
        {regSanCol}
        <TableHeaderColumn width={170} style={noPaddingStyle}>
          Nombre
        </TableHeaderColumn>
        {loteCol}
        <TableHeaderColumn width={40} style={noPaddingStyle}>
          Cant.
        </TableHeaderColumn>
        {fechaExpCol}
        <TableHeaderColumn width={60} style={noPaddingStyle}>
          Precio
        </TableHeaderColumn>
        <TableHeaderColumn width={50} style={noPaddingStyle}>
          Importe
        </TableHeaderColumn>
        <TableHeaderColumn width={30} style={noPaddingStyle} />
      </TableRow>
    </TableHeader>
  );
};

export default class FacturaTable extends React.Component {
  renderRow = (facturable, i) => {
    const { isExamen, onFacturableChanged, onFacturableDeleted } = this.props;

    let regSanCol = (
      <TableRowColumn width={80} style={noPaddingStyle}>
        {facturable.codigo}
      </TableRowColumn>
    );
    let loteCol = (
      <TableRowColumn width={60} style={noPaddingStyle}>
        <TextField
          value={facturable.lote}
          style={{ width: '50px' }}
          name={'lote'}
          inputStyle={{ textAlign: 'right', fontSize: '13px' }}
          onChange={event => {
            onFacturableChanged(i, 'lote', event.target.value);
          }}
        />
      </TableRowColumn>
    );
    let fechaExpCol = (
      <TableRowColumn width={70} style={noPaddingStyle}>
        <TextField
          value={facturable.fechaExp}
          hintText={'expiración'}
          style={{ width: '70px', fontSize: '13px' }}
          onChange={(event, date) => {
            onFacturableChanged(i, 'fechaExp', date);
          }}
        />
      </TableRowColumn>
    );

    if (isExamen) {
      //ocultar columnas que no se usan en examenes
      regSanCol = null;
      loteCol = null;
      fechaExpCol = null;
    }

    return (
      <TableRow key={i}>
        <TableRowColumn width={40} style={noPaddingStyle}>
          {i + 1}
        </TableRowColumn>

        {regSanCol}

        <TableRowColumn width={170} style={noPaddingStyle}>
          {facturable.nombre}
        </TableRowColumn>

        {loteCol}

        <TableRowColumn width={40} style={noPaddingStyle}>
          <TextField
            style={{ width: '28px' }}
            value={facturable.count}
            name={'count'}
            inputStyle={{ textAlign: 'right', fontSize: '13px' }}
            onChange={event => {
              onFacturableChanged(i, 'count', event.target.value);
            }}
          />
        </TableRowColumn>

        {fechaExpCol}

        <TableRowColumn width={60} style={noPaddingStyle}>
          ${' '}
          <TextField
            style={{ width: '50px' }}
            name={'precio'}
            value={facturable.precio}
            onChange={event => {
              onFacturableChanged(i, 'precioVenta', event.target.value);
            }}
            inputStyle={{ fontSize: '13px' }}
          />
        </TableRowColumn>

        <TableRowColumn
          width={50}
          style={{ padding: '0px', textOverflow: 'clip' }}
        >
          <span style={{ marginRight: '34px' }}>
            $ {Math.calcularImporteFacturable(facturable)}
          </span>
        </TableRowColumn>

        <TableRowColumn
          width={30}
          style={{ padding: '0px', textAlign: 'right' }}
        >
          <IconButton onTouchTap={() => onFacturableDeleted(i)}>
            <Delete color={black54p} />
          </IconButton>
        </TableRowColumn>
      </TableRow>
    );
  };

  render() {
    return (
      <Table height={'200px'} selectable={false}>
        {RenderTableHeader(this.props)}
        <TableBody displayRowCheckbox={false}>
          {this.props.items.map(this.renderRow)}
        </TableBody>
      </Table>
    );
  }
}

FacturaTable.propTypes = {
  isExamen: React.PropTypes.bool,
  items: React.PropTypes.object.isRequired,
  onFacturableChanged: React.PropTypes.func.isRequired,
  onFacturableDeleted: React.PropTypes.func.isRequired
};

FacturaTable.defaultProps = {
  isExamen: false
};
