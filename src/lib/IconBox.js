import React, {Component} from 'react';
import {grey700} from 'material-ui/styles/colors';

export default class IconBox extends Component {
  render() {
    const iconStyle = {
      height: '32px',
      width: '32px',
      position:'absolute',
      top: '50%',
      bottom: '50%',
      transform: 'translate(-50%, -50%)',
    }

    const iconObject = new this.props.icon({color: grey700, style: iconStyle})

    const containerStyle = {
      display: 'inline',
      height: '48px',
      width: '48px',
      position: 'relative',
      marginRight: '24px',
    }

    return (
        <div style={containerStyle}>
          {iconObject.render()}
        </div>
      )
  }
}
