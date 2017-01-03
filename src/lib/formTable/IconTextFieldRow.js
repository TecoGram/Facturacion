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
* Por defecto se pinta el icono a la izquierda del TextField. se puede invertir
* esto seteando el prop 'inverted' como true.
*/
export default class IconTextFieldRow extends React.Component {
  static propTypes = {
    leftInput: inputShape,
    rightInput: inputShape,
    inverted: React.PropTypes.bool,
  }
  render() {
    const {
      leftInput,
      rightInput,
      inverted,
    } = this.props

    const firstIconColumn = leftInput &&
      <td><IconBox icon={leftInput.icon}/></td>
    const firstTextColumn = leftInput &&
      <td style={inverted ? secondInvColStyle : undefined}>
        <TextField hintText={leftInput.hintText} onChange={leftInput.onChange}
          errorText={leftInput.errorText} value={leftInput.value}/>
      </td>
    const secondIconColumn = rightInput &&
      <td style={inverted ? undefined : secondColStyle}><IconBox icon={rightInput.icon}/></td>
    const secondTextColumn = rightInput &&
      <td>
        <TextField hintText={rightInput.hintText} onChange={rightInput.onChange}
          errorText={rightInput.errorText} value={rightInput.value}/>
      </td>

    if (inverted)
      return (
        <tr>
          { firstTextColumn }
          { firstIconColumn }
          { secondTextColumn }
          { secondIconColumn }
        </tr>
      )
    else
      return (
        <tr>
          { firstIconColumn }
          { firstTextColumn }
          { secondIconColumn }
          { secondTextColumn }
        </tr>
      )
  }
}
