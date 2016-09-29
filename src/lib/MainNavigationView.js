import React, {Component} from 'react';
import {Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui';
import {Tabs, Tab} from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CustomStyle from '../CustomStyle'
import MyTabTemplate from './tabs/MyTabTemplate'

/**
* This component is meant to be the root container of your app. You should
* render it in a div that is the only child of the body tag. That div should
* have this style: "height: 100%; width: 100%; position: fixed"
* If these conditions are not met, the component may fail to acquire the
* whole space of the window, and consequently, The components inside the tabs
* won't get 100% of the height available. If the component depends on having
* all  height available it won't render properly.
*/
export default class MainNavigationView extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  handleChange = (value) => {
    this.setState({
      value: value,
    });
  };

  render() {
    const toolbarHeight = CustomStyle.muiTheme.toolbar.height
    return (
        <MuiThemeProvider muiTheme={CustomStyle.muiTheme}>
          <div style={{height: 'inherit'}}>
            <Toolbar style={{backgroundColor: CustomStyle.muiTheme.palette.primary1Color}}>
              <ToolbarGroup>
                <ToolbarTitle text={this.props.title}
                style={{color: "#FFFFFF", fontFamily: 'Roboto'}}/>
              </ToolbarGroup>
            </Toolbar>
            <Tabs style={{height: `calc(100% - ${toolbarHeight}px)`}}
            value={this.state.value} onChange={this.handleChange}
            tabTemplate={MyTabTemplate} contentContainerStyle={{height: `inherit`}}>
              <Tab label={this.props.leftTabName} value={0} >
                {this.props.leftChild}
              </Tab>
              <Tab label={this.props.rightTabName} value={1} >
                {this.props.rightChild}
              </Tab>
            </Tabs>
          </div>
        </MuiThemeProvider>
        );
  }
}
