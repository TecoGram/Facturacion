import React, {Component, PropTypes} from 'react';

class MyTabTemplate extends Component {
  static propTypes = {
    children: PropTypes.node,
    selected: PropTypes.bool,
  };

  render() {
    const styles = {
      width: '100%',
      height: '100%',
      position: 'relative',
      textAlign: 'initial',
    };

    if (!this.props.selected) {
      styles.height = 0;
      styles.overflow = 'hidden';
    }

    return (
      <div style={styles}>
        {this.props.children}
      </div>
    );
  }
}

export default MyTabTemplate;
