import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow,
  TableRowColumn} from 'material-ui/Table';
import PaperContainer from './PaperContainer'
import IconTextFieldRow from './formTable/IconTextFieldRow'
import IconButton from 'material-ui/IconButton';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Clear from 'material-ui/svg-icons/content/clear';
import Search from 'material-ui/svg-icons/action/search';

const black54p = '#757575'

const ButtonsColumn = (index, onEditItem, onDeleteItem) => {
  const iconStyle = {
    display: 'inline-block',
  }

  let editCol = null
  let deleteCol = null
  if (onDeleteItem) {
    deleteCol =
      <IconButton style={iconStyle} onTouchTap={() => onDeleteItem(index)}>
        <Clear color={black54p}/>
      </IconButton>
  }
  if (onEditItem) {
    editCol =
      <IconButton style={iconStyle} onTouchTap={() => onEditItem(index)}>
        <ModeEdit color={black54p}/>
      </IconButton>
  }

  let buttons = null
  if (editCol || deleteCol) {
    buttons =
      <TableRowColumn>
        <div>
          {editCol}
          {deleteCol}
        </div>
      </TableRowColumn>
  }

  return buttons
}

class SearchBox extends React.Component {

  static propTypes = {
    hint: React.PropTypes.string.isRequired,
    onQueryChanged: React.PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props)
    this.state = {
      queryText: '',
    }
  }

  newQuery = (e) => {
    const newValue = e.target.value
    this.setState({queryText: newValue})
    this.props.onQueryChanged(newValue)
  }

  render () {
    const input = {
      icon: Search,
      hintText: this.props.hint,
      onChange: this.newQuery,
      value: this.state.queryText,
    }

    const tableStyle = {
      width: 'auto',
      marginLeft: 'auto',
      marginRight: '0px',
    }

    return (
      <table style={tableStyle}>
        <tbody >
          <IconTextFieldRow leftInput={input} inverted={true}/>
        </tbody>
      </table>
    )
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
* onEditItem y onDeleteItem son callbacks opcionales. Si se pasa onEditItem,
* se agrega una columna a la tabla para editar la fila. Si se pasa onDeleteItem,
* se agrega una columna a la tabla para eliminar la fila. Ambos tienen la forma
* (item) => { } donde item es la fila con la cual se origino el click.
*
* Esto usa el componente Table de material-ui, el cual no recicla views, por lo
* tanto hay que tener cuidado con no renderizar muchas filas
*/
export default class MaterialTable extends React.Component {

  static propTypes = {
    columns: React.PropTypes.array.isRequired,
    rows: React.PropTypes.array.isRequired,
    keys: React.PropTypes.array.isRequired,
    searchHint: React.PropTypes.string.isRequired,
    onQueryChanged: React.PropTypes.func.isRequired,
    onEditItem: React.PropTypes.func,
    onDeleteItem: React.PropTypes.func,
    enableCheckbox: React.PropTypes.bool,
  }

  render() {
    const {
      enableCheckbox,
      keys,
      onEditItem,
      onDeleteItem,
      onQueryChanged,
      rows,
      searchHint,
    } = this.props

    let columns = this.props.columns
    if (onEditItem || onDeleteItem) {
      columns = [...columns, '']
    }

    return (
      <div style={{height:'100%', overflow:'auto'}} >
        <PaperContainer padding={'15px'}>
          <SearchBox hint={searchHint} onQueryChanged={onQueryChanged} />
          <Table selectable={enableCheckbox}>
             <TableHeader displaySelectAll={enableCheckbox}
               adjustForCheckbox={enableCheckbox}>
               <TableRow>
                 { columns.map((colName, i) => {
                   return <TableHeaderColumn key={i}>{colName}</TableHeaderColumn>
                 })}
              </TableRow>
             </TableHeader>
             <TableBody displayRowCheckbox={enableCheckbox}>
              {
                rows.map((item, i) => {
                  const row = rows[i]
                  return (
                  <TableRow key={i}>
                    { keys.map((propName, j) => {
                      return <TableRowColumn key={j}>{row[propName]}</TableRowColumn>
                    })}
                    { ButtonsColumn(i, onEditItem, onDeleteItem) }
                  </TableRow>
                )
                })
              }
              </TableBody>
          </Table>
        </PaperContainer>
      </div>
    )
  }
}
