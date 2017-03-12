import React from 'react';
import TextField from 'material-ui/TextField';
import IconBox from '../IconBox'

const secondColStyle = { paddingLeft: '30px' }
const secondInvColStyle = { paddingRight: '15px' }

const inputShape = React.PropTypes.shape({
  hintText: React.PropTypes.string,
  errorText: React.PropTypes.string,
  value: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  icon: React.PropTypes.func.isRequired,
})

const EmptyRow = (props) => {
  return <tr><td><div style={{height: props.height}} /></td></tr>

}
const IconColumn = (props) => {
  return <td style={props.style}><IconBox icon={props.input.icon}/></td>
}

const TextColumn = (props) => {
  const input = props.input
  return (
    <td style={props.style}>
      <TextField hintText={input.hintText} onChange={input.onChange}
        errorText={input.errorText} value={input.value}/>
    </td>
  )
}

/**
* Componente para mostrar un TextField con un icono a su izquierda o derecha.
* La manera mas sencilla de alinear el icono con el TextField es una tabla, por
* lo tanto este componente renderiza un tr. El padre de este componente debe
* de ser un tableBody.
*
* Se pueden mostrar uno o dos TextFields con iconos organizados horizontalmente.
* Para esto estan los props leftInput y rightInput. ambos props son un objeto
* con los siguientes atributos:
* - hintText: texto 'hint' a mostrar cuando el TextField esta vacio
* - errorText: texto de error a mostrar debajo del TextField
* - value: string a mostrar como contenido del TextField
* - onChange: callback a ejecutar cuando cambia el texto del TextField. esta
* funcion deberia de terminar cambiando el prop 'value'
* Si se pasan ambos props leftInput y rightInput se renderizan dos textFields,
* de lo contrario uno, o ninguno si no se pasa nungun prop.
*
* El prop empty permite crear una fila vacia.
* Por defecto se pinta el icono a la izquierda del TextField. se puede invertir
* esto seteando el prop 'inverted' como true.
*/
export default class IconTextFieldRow extends React.Component {
  static propTypes = {
    empty: React.PropTypes.bool,
    inverted: React.PropTypes.bool,
    leftInput: inputShape,
    rightInput: inputShape,
  }

  getFirstIconColumn = (leftInput) => {
    return leftInput && <IconColumn input={leftInput}/>
  }

  getFirstTextColumn = (leftInput, inverted) => {
    return leftInput &&
      <TextColumn
        style={inverted ? secondInvColStyle : undefined}
        input={leftInput} />
  }

  getSecondIconColumn = (rightInput, inverted) => {
    return rightInput &&
      <IconColumn
        style={inverted ? undefined : secondColStyle}
        input={rightInput} />

  }

  getSecondTextColumn = (rightInput) => {
    return rightInput && <TextColumn input={rightInput} />
  }

  render() {
    const {
      empty,
      inverted,
      leftInput,
      rightInput,
    } = this.props

    if (empty)
      return <EmptyRow height={30} />
    if (inverted)
      return (
        <tr>
          { this.getFirstTextColumn(leftInput, inverted) }
          { this.getFirstIconColumn(leftInput) }
          { this.getSecondTextColumn(rightInput) }
          { this.getSecondIconColumn(rightInput, inverted) }
        </tr>
      )
    else
      return (
        <tr>
          { this.getFirstIconColumn(leftInput) }
          { this.getFirstTextColumn(leftInput, inverted) }
          { this.getSecondIconColumn(rightInput, inverted) }
          { this.getSecondTextColumn(rightInput) }
        </tr>
      )
  }
}
