import React from 'react';

import Chip from 'material-ui/Chip';

import { primaryColor } from '../CustomStyle'

const chipStyle = {
  fontSize: '16px',
  width: '425px',
  height: '48px',
  marginRight: '36px',
  display: 'inline-block',
  lineHeight: '24px',
}

export default class SelectedClienteChip extends React.Component {

  render() {
    const {
      text,
      onRequestDelete,
    } = this.props

    return (
      <div style={chipStyle}>
        <Chip
          backgroundColor={primaryColor}
          labelStyle={{color: 'white'}}
          onRequestDelete={onRequestDelete} >
          { text }
        </Chip>
      </div>
    )
  }
}
