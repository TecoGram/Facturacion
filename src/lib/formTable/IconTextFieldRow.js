import React from 'react';
import TextField from 'material-ui/TextField';
import IconBox from '../IconBox'

const secondColStyle = { paddingLeft: '30px' }
const secondInvColStyle = { paddingRight: '15px' }

export default class IconTextFieldRow extends React.Component {
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
