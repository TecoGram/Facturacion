import React from 'react';
import TextField from 'material-ui/TextField';
import IconBox from '../IconBox'

const secondColStyle = { paddingLeft: '30px' }

export default class IconTextFieldRow extends React.Component {
  render() {

    const {
      leftInput,
      rightInput,
    } = this.props

    const firstColumn = leftInput &&
      <td><IconBox icon={leftInput.icon}/></td>
    const secondColumn = leftInput &&
      <td>
        <TextField hintText={leftInput.hintText} onChange={leftInput.onChange}
          errorText={leftInput.errorText} value={leftInput.value}/>
      </td>
    const thirdColumn = rightInput &&
      <td style={secondColStyle}><IconBox icon={rightInput.icon}/></td>
    const fourthColumn = rightInput &&
      <td>
        <TextField hintText={rightInput.hintText} onChange={rightInput.onChange}
          errorText={rightInput.errorText} value={rightInput.value}/>
      </td>

    return (
      <tr>
        { firstColumn }
        { secondColumn }
        { thirdColumn }
        { fourthColumn }
      </tr>
    )
  }
}
