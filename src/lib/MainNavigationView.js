import React, {Component} from 'react';

import Add from 'material-ui/svg-icons/content/add';
import {Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui';
import {Tabs, Tab} from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';

import { bindActionCreators } from 'redux';
import { connect, Provider } from 'react-redux'

import { NUEVO_CLIENTE_DIALOG,
  NUEVO_PRODUCTO_DIALOG,
  NUEVO_CLIENTE_DIALOG_CLOSED,
  NUEVO_PRODUCTO_DIALOG_CLOSED } from '../DialogTypes'

import ActionCreators from '../ActionCreators'
import CustomStyle from '../CustomStyle'
import NuevoClienteDialog from '../custom/nuevoCliente/NuevoClienteDialog'
import NuevoProductoDialog from '../custom/NuevoProducto/NuevoProductoDialog'
import MyTabTemplate from './tabs/MyTabTemplate'
import store from '../Store'

const toolbarTextColor = '#FFFFFF'
const toolbarTitleStyle = {
  color: toolbarTextColor,
  fontFamily: 'Roboto',
}

function mapStateToProps(state) {
  return {
    dialog: state.dialog,
    message: state.message,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

class MainToolbar extends Component {

  render() {
    const {
      cambiarDialog,
    } = this.props

    return (
      <Toolbar style={{backgroundColor: CustomStyle.muiTheme.palette.primary1Color}}>

        <ToolbarGroup>
          <ToolbarTitle text={this.props.title}
          style={toolbarTitleStyle}/>
        </ToolbarGroup>

        <ToolbarGroup>
          <IconMenu iconButtonElement={
            <IconButton touch={true}>
              <Add color={toolbarTextColor}/>
            </IconButton> }
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}>
            <MenuItem primaryText="Nuevo Producto" onTouchTap={(event) =>
              cambiarDialog(NUEVO_PRODUCTO_DIALOG)}/>
            <MenuItem primaryText="Nuevo Cliente" onTouchTap={(event) =>
              cambiarDialog(NUEVO_CLIENTE_DIALOG)}/>
          </IconMenu>
        </ToolbarGroup>

      </Toolbar>
    )
  }
}

class MainDialog extends Component {
  render() {
    const {
      type,
      cambiarDialog,
      cerrarDialogConMsg,
    } = this.props

    if(!type)
      return (
        <div />
      )
    else if (type === NUEVO_CLIENTE_DIALOG || type === NUEVO_CLIENTE_DIALOG_CLOSED)
      return (
        <NuevoClienteDialog open={ type === NUEVO_CLIENTE_DIALOG }
          cambiarDialog={cambiarDialog}
          cerrarDialogConMsg={cerrarDialogConMsg} />
      )
    else if (type === NUEVO_PRODUCTO_DIALOG || type === NUEVO_PRODUCTO_DIALOG_CLOSED)
      return (
        <NuevoProductoDialog open={ type === NUEVO_PRODUCTO_DIALOG }
          cambiarDialog={cambiarDialog}
          cerrarDialogConMsg={cerrarDialogConMsg} />
      )
    else throw Error('Tipo de dialog desconocido')
  }
}

class Main extends Component {

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

    const {
      cambiarDialog,
      cerrarDialogConMsg,
      dialog,
      leftChild,
      leftTabName,
      message,
      rightChild,
      rightTabName,
      title,
    } = this.props

    return (
      <div style={{height: 'inherit'}}>
        <MainToolbar title={title} cambiarDialog={cambiarDialog} />
        <Tabs style={{backgroundColor: '#ededed', height: `calc(100% - ${toolbarHeight}px)`}}
        value={this.state.value} onChange={this.handleChange}
        tabTemplate={MyTabTemplate} contentContainerStyle={{height: `inherit`}}>
          <Tab label={leftTabName} value={0} labelWidth={300}>
            {leftChild}
          </Tab>
          <Tab label={rightTabName} value={1} labelWidth={300}>
            {rightChild}
          </Tab>
        </Tabs>
        <MainDialog type={dialog} cambiarDialog={cambiarDialog}
          cerrarDialogConMsg={cerrarDialogConMsg}/>
        <Snackbar open={Boolean(message)} message={message || ''}
          autoHideDuration={5000}/>
      </div>
    )
  }
}
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

  render() {
    const {
      leftChild,
      leftTabName,
      rightChild,
      rightTabName,
      title,
    } = this.props

    const MainComponent = connect(mapStateToProps, mapDispatchToProps) (Main)

    return (
      <MuiThemeProvider muiTheme={CustomStyle.muiTheme}>
        <Provider store={store} >
          <MainComponent
            title={title} leftTabName={leftTabName} leftChild={leftChild}
            rightChild={rightChild} rightTabName={rightTabName} />
        </Provider>
      </MuiThemeProvider>
    );
  }
}
