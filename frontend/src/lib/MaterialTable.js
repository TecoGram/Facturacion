import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import PaperContainer from './PaperContainer';
import IconTextFieldRow from './formTable/IconTextFieldRow';
import IconButton from 'material-ui/IconButton';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Clear from 'material-ui/svg-icons/content/clear';
import Search from 'material-ui/svg-icons/action/search';
import OpenInNew from 'material-ui/svg-icons/action/open-in-new';

const black54p = '#757575';

const ButtonsColumn = props => {
  const { item, index, onEditItem, onDeleteItem, onOpenItem } = props;
  const isMutableItem = props.isMutableItem || (() => true);
  const iconStyle = {
    display: 'inline-block'
  };

  let editCol = null;
  let deleteCol = null;
  let openCol = null;
  if (onDeleteItem && isMutableItem(item)) {
    deleteCol = (
      <IconButton style={iconStyle} onTouchTap={() => onDeleteItem(index)}>
        <Clear color={black54p} />
      </IconButton>
    );
  }
  if (onEditItem && isMutableItem(item)) {
    editCol = (
      <IconButton style={iconStyle} onTouchTap={() => onEditItem(index)}>
        <ModeEdit color={black54p} />
      </IconButton>
    );
  }
  if (onOpenItem) {
    openCol = (
      <IconButton style={iconStyle} onTouchTap={() => onOpenItem(index)}>
        <OpenInNew color={black54p} />
      </IconButton>
    );
  }

  let buttons = null;
  if (editCol || deleteCol || openCol) {
    buttons = (
      <TableRowColumn>
        <div>
          {openCol}
          {editCol}
          {deleteCol}
        </div>
      </TableRowColumn>
    );
  }

  return buttons;
};

class SearchBox extends React.Component {
  static propTypes = {
    hint: React.PropTypes.string.isRequired,
    onQueryChanged: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      queryText: ''
    };
  }

  newQuery = e => {
    const newValue = e.target.value;
    this.setState({ queryText: newValue });
    this.props.onQueryChanged(newValue);
  };

  render() {
    const input = {
      icon: Search,
      hintText: this.props.hint,
      onChange: this.newQuery,
      value: this.state.queryText
    };

    const tableStyle = {
      width: 'auto',
      marginLeft: 'auto',
      marginRight: '0px'
    };

    return (
      <table style={tableStyle}>
        <tbody>
          <IconTextFieldRow leftInput={input} inverted={true} />
        </tbody>
      </table>
    );
  }
}

/**
 * Renderiza una tabla dentro de un Paper. En la esquina superior dereche se coloca
 * un TextField para hacer busquedas que filtren el contenido de la tabla.
 *
 * Es necesario pasar 3 arrays: rows, columns y keys. rows son las filas de la tabla,
 * tienen que ser objetos. columns tiene las etiquetas de cada columna y keys tiene
 * el nombre del atributo con la data de la columna.
 *
 * Con el prop searchHint se pone el 'hint' para filtrar el contenido de la tabla.
 *
 * El prop onQueryChanged es un callback a ejecutar cada vez que el usario escribe
 * en el textField para filtrar datos, es una funcion tipo (query) => { }, donde
 * query es el texto ingresado.
 *
 * onEditItem, onDeleteItem y onOpenItem son callbacks opcionales.
 * Si se pasa onEditItem, se agrega una columna a la tabla para editar la fila.
 * Si se pasa onDeleteItem, se agrega una columna a la tabla para eliminar la fila.
 * Si se pasa onOpenItem, se agrega una columna a la tabla para ver detalle de la fila.
 * Todos tienen la forma (item) => { } donde item es el indice de la fila con la
 * cual se origino el click.
 *
 * Esto usa el componente Table de material-ui, el cual no recicla views, por lo
 * tanto hay que tener cuidado con no renderizar muchas filas
 */

const _columnTypes = {
  string: 0,
  numeric: 1
};

export default class MaterialTable extends React.Component {
  static ColumnTypes = Object.freeze(_columnTypes);

  static propTypes = {
    columns: React.PropTypes.array.isRequired,
    rows: React.PropTypes.array.isRequired,
    keys: React.PropTypes.array.isRequired,
    columnTypes: React.PropTypes.array,
    searchHint: React.PropTypes.string.isRequired,
    onQueryChanged: React.PropTypes.func.isRequired,
    height: React.PropTypes.string,
    onEditItem: React.PropTypes.func,
    onDeleteItem: React.PropTypes.func,
    onOpenItem: React.PropTypes.func,
    isMutableItem: React.PropTypes.func,
    enableCheckbox: React.PropTypes.bool
  };

  renderTableRows = () => {
    const {
      keys,
      rows,
      columnTypes,
      onDeleteItem,
      onEditItem,
      onOpenItem,
      isMutableItem
    } = this.props;

    return rows.map((item, i) => {
      const row = rows[i];
      return (
        <TableRow key={i}>
          {keys.map((propName, j) => {
            let dataToDisplay = row[propName];
            let columnStyle;
            if (
              columnTypes &&
              columnTypes[j] === MaterialTable.ColumnTypes.numeric
            ) {
              dataToDisplay = Number(row[propName]).toFixed(2);
              columnStyle = { textAlign: 'right' };
            }
            return (
              <TableRowColumn style={columnStyle} key={j}>
                {dataToDisplay}
              </TableRowColumn>
            );
          })}
          {ButtonsColumn({
            index: i,
            item,
            isMutableItem,
            onEditItem,
            onDeleteItem,
            onOpenItem
          })}
        </TableRow>
      );
    });
  };

  render() {
    const {
      enableCheckbox,
      height,
      onDeleteItem,
      onEditItem,
      onQueryChanged,
      searchHint
    } = this.props;

    let columns = this.props.columns;
    if (onEditItem || onDeleteItem) {
      columns = [...columns, ''];
    }

    return (
      <div style={{ height: '100%', overflow: 'auto' }}>
        <PaperContainer padding={'15px'}>
          <SearchBox hint={searchHint} onQueryChanged={onQueryChanged} />
          <Table selectable={enableCheckbox} height={height}>
            <TableHeader
              displaySelectAll={enableCheckbox}
              adjustForCheckbox={enableCheckbox}
            >
              <TableRow>
                {columns.map((colName, i) => {
                  return (
                    <TableHeaderColumn key={i}>{colName}</TableHeaderColumn>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={enableCheckbox}>
              {this.renderTableRows()}
            </TableBody>
          </Table>
        </PaperContainer>
      </div>
    );
  }
}
