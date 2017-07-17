import React from 'react';

const errorStyle = {
  position: 'relative',
  bottom: '2px',
  top: '6px',
  fontSize: '12px',
  lineHeight: '12px',
  color: '#f44336',
};
export default class ServerErrorText extends React.Component {
  render() {
    return (
      <div style={errorStyle}>
        {this.props.children}
      </div>
    );
  }
}
