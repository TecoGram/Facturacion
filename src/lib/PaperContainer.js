
import React, {Component} from 'react';
import Paper from 'material-ui/Paper';

/**
* This component draws a Table efficiently using all the space available. It expects
the parent to have all the height available, so that the table fits the size of
the window. If this condition is not met, the table may not render at all.
*/
export default class PaperContainer extends Component {

  render() {
    const paperStyle = {
      width : 1010,
      minHeight : 650,
      height: '87%',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '20px',
    }

    const padding = this.props.padding
    if (padding)
      paperStyle.padding = padding
      
    return (
      <Paper style={paperStyle}>
        {this.props.children}
      </Paper>
    );
  }
}
