import React, {Component, PropTypes} from 'react';

import Add from 'material-ui/svg-icons/content/add';
import Drawer from 'material-ui/Drawer';
import {Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';


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


class MainDrawer extends Component {

  onItemClicked = () => {
    this.props.handleChange(false)
  }

  render() {
    return (
      <Drawer
          docked={false}
          width={200}
          open={this.props.open}
          onRequestChange={this.props.handleChange}
        >
          <MenuItem onTouchTap={this.onItemClicked}>Menu Item</MenuItem>
          <MenuItem onTouchTap={this.onItemClicked}>Menu Item 2</MenuItem>
        </Drawer>
    )
  }
}

class MainToolbar extends Component {

  getIconStyles(props, context) {
    const {
      appBar,
      toolbar,
      button: {
        iconButtonSize,
      },
    } = context.muiTheme;
    console.log(toolbar.height)

    const flatButtonSize = 36;

    const styles = {
      iconButtonStyle: {
        marginTop: (toolbar.height - iconButtonSize) / 2,
        marginRight: 8,
        marginLeft: -16,
      },
      iconButtonIconStyle: {
        fill: appBar.textColor,
        color: appBar.textColor,
      },
      flatButton: {
        color: appBar.textColor,
        marginTop: (iconButtonSize - flatButtonSize) / 2 + 1,
      },
    };

    return styles;
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  render() {

    const {
      iconButtonStyle,
      iconButtonIconStyle,
    } = this.getIconStyles(this.props, this.context)

    const {
      cambiarDialog,
      onLeftButtonClicked,
    } = this.props

    return (
      <Toolbar style={{backgroundColor: CustomStyle.muiTheme.palette.primary1Color}}>

        <ToolbarGroup>
          <IconButton style={iconButtonStyle} iconStyle={iconButtonIconStyle}
            onTouchTap={onLeftButtonClicked}>
            <NavigationMenu />
          </IconButton>
          <ToolbarTitle text={this.props.title}
          style={toolbarTitleStyle}/>
        </ToolbarGroup>

        <ToolbarGroup>
          <IconMenu iconButtonElement={
            <IconButton touch={true} style={iconButtonStyle} iconStyle={iconButtonIconStyle}>
              <Add />
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
      drawerOpen: false,
    };
  }

  handleDrawerChange = (value) => {
    this.setState({
      drawerOpen: value,
    });
  };

  render() {
    const {
      cambiarDialog,
      cerrarDialogConMsg,
      dialog,
      message,
      selectedPage,
      title,
    } = this.props

    return (
      <div style={{backgroundColor: '#ededed', height: 'inherit'}}>
        <MainToolbar title={title} cambiarDialog={cambiarDialog}
        onLeftButtonClicked={() => this.handleDrawerChange(true)}/>
        {selectedPage}
        <MainDrawer open={this.state.drawerOpen} handleChange={this.handleDrawerChange} />
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
      selectedPage,
      title,
    } = this.props

    const MainComponent = connect(mapStateToProps, mapDispatchToProps) (Main)

    return (
      <MuiThemeProvider muiTheme={CustomStyle.muiTheme}>
        <Provider store={store} >
          <MainComponent
            title={title} selectedPage={selectedPage} />
        </Provider>
      </MuiThemeProvider>
    );
  }
}
