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
    const mergedStyle = { ...errorStyle, ...this.props.style };
    return (
      <div style={mergedStyle}>
        {this.props.children}
      </div>
    );
  }
}
