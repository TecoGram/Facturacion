import React, { Component, PropTypes } from 'react';

import Add from 'material-ui/svg-icons/content/add';
import ExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import ViewList from 'material-ui/svg-icons/action/view-list';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';

import { bindActionCreators } from 'redux';
import { connect, Provider } from 'react-redux';

import {
  CLIENTE_DIALOG,
  PRODUCTO_DIALOG,
  MEDICO_DIALOG,
  PAGOS_DIALOG
} from './DialogTypes';
import {
  NEW_FACTURA_PAGE,
  EDITAR_FACTURA_PAGE,
  NEW_FACTURA_EXAMEN_PAGE,
  EDITAR_FACTURA_EXAMEN_PAGE,
  FACTURA_LIST_PAGE,
  CLIENTE_LIST_PAGE,
  PRODUCTO_LIST_PAGE
} from './PageTypes';

import ActionCreators from './ActionCreators';
import * as CustomStyle from './CustomStyle';
import {
  NuevaFacturaPage,
  EditarFacturaPage,
  NuevaFacturaExamenPage,
  EditarFacturaExamenPage
} from './Factura/Variantes';
import NuevoClienteDialog from './NuevoCliente/NuevoClienteDialog';
import NuevoProductoDialog from './NuevoProducto/NuevoProductoDialog';
import NuevoMedicoDialog from './NuevoMedico/NuevoMedicoDialog';
import PagosDialog from './Pagos/PagosDialog.js';
import FacturasListView from './FacturasList/FacturasListView';
import ClientesListView from './ClientesList/ClientesListView';
import ProductosListView from './ProductosList/ProductosListView';
import store from './Store';
import appSettings from './Ajustes';

const toolbarTextColor = '#FFFFFF';
const toolbarTitleStyle = {
  color: toolbarTextColor,
  fontFamily: 'Roboto'
};

function mapStateToProps(state) {
  return {
    dialog: state.dialog,
    ajustes: state.ajustes,
    snackbar: state.snackbar,
    page: state.page
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

const redirectEmpresa = redirigirATeco => {
  if (redirigirATeco) window.location = '/teco';
  else window.location = '/biocled';
};

const MainDrawer = props => {
  const cp = page => {
    props.onPageSelected(page);
  };

  return (
    <Drawer
      docked={false}
      width={200}
      open={props.open}
      onRequestChange={props.handleChange}
    >
      <MenuItem onTouchTap={() => cp(NEW_FACTURA_PAGE)} leftIcon={<Add />}>
        Factura
      </MenuItem>
      <MenuItem
        onTouchTap={() => cp(NEW_FACTURA_EXAMEN_PAGE)}
        leftIcon={<Add />}
      >
        Factura Examen
      </MenuItem>
      <Divider />
      <MenuItem
        onTouchTap={() => cp(CLIENTE_LIST_PAGE)}
        leftIcon={<ViewList />}
      >
        Clientes
      </MenuItem>
      <MenuItem
        onTouchTap={() => cp(FACTURA_LIST_PAGE)}
        leftIcon={<ViewList />}
      >
        Facturas
      </MenuItem>
      <MenuItem
        onTouchTap={() => cp(PRODUCTO_LIST_PAGE)}
        leftIcon={<ViewList />}
      >
        Productos
      </MenuItem>
      <Divider />
      <MenuItem
        onTouchTap={() => redirectEmpresa(true)}
        leftIcon={<ExitToApp />}
      >
        TecoGram S.A.
      </MenuItem>
      <MenuItem
        onTouchTap={() => redirectEmpresa(false)}
        leftIcon={<ExitToApp />}
      >
        Biocled
      </MenuItem>
    </Drawer>
  );
};

class MainSnackbar extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.data !== nextProps.data) return true;
    return false;
  }

  getDataFromProps = props => {
    const data = props.data;
    let action, message, open, onActionTouchTap, duration;
    if (data) {
      open = true;
      message = data.message;
      if (data.link) {
        action = 'ABRIR';
        onActionTouchTap = () => window.open(data.link);
      }
      if (data.duration) duration = data.duration;
    } else {
      open = false;
      message = '';
    }

    return { action, message, open, onActionTouchTap, duration };
  };

  render() {
    const {
      action,
      message,
      open,
      duration,
      onActionTouchTap
    } = this.getDataFromProps(this.props);

    return (
      <Snackbar
        open={open}
        message={message}
        action={action}
        onActionTouchTap={onActionTouchTap}
        autoHideDuration={duration || 12000}
      />
    );
  }
}

class MainToolbar extends Component {
  getIconStyles(props, context) {
    const {
      appBar,
      toolbar,
      button: { iconButtonSize }
    } = context.muiTheme;

    const flatButtonSize = 36;

    const styles = {
      iconButtonStyle: {
        marginTop: (toolbar.height - iconButtonSize) / 2,
        marginRight: 8,
        marginLeft: -16
      },
      iconButtonIconStyle: {
        fill: appBar.textColor,
        color: appBar.textColor
      },
      flatButton: {
        color: appBar.textColor,
        marginTop: (iconButtonSize - flatButtonSize) / 2 + 1
      }
    };

    return styles;
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  };

  render() {
    const { iconButtonStyle, iconButtonIconStyle } = this.getIconStyles(
      this.props,
      this.context
    );

    const { mostrarDialog, title, onLeftButtonClicked } = this.props;

    const appBar = this.context.muiTheme.appBar;

    return (
      <Toolbar style={{ backgroundColor: appBar.color }}>
        <ToolbarGroup>
          <IconButton
            style={iconButtonStyle}
            iconStyle={iconButtonIconStyle}
            onTouchTap={onLeftButtonClicked}
          >
            <NavigationMenu />
          </IconButton>
          <ToolbarTitle text={title} style={toolbarTitleStyle} />
        </ToolbarGroup>

        <ToolbarGroup>
          <IconMenu
            iconButtonElement={
              <IconButton
                touch={true}
                style={iconButtonStyle}
                iconStyle={iconButtonIconStyle}
              >
                <Add />
              </IconButton>
            }
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem
              primaryText="Nuevo Producto"
              onTouchTap={() => mostrarDialog(PRODUCTO_DIALOG)}
            />
            <MenuItem
              primaryText="Nuevo Cliente"
              onTouchTap={() => mostrarDialog(CLIENTE_DIALOG)}
            />
            <MenuItem
              primaryText="Nuevo Medico"
              onTouchTap={() => mostrarDialog(MEDICO_DIALOG)}
            />
          </IconMenu>
          <IconMenu
            iconButtonElement={
              <IconButton
                touch={true}
                style={iconButtonStyle}
                iconStyle={iconButtonIconStyle}
              >
                <ExitToApp />
              </IconButton>
            }
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem
              primaryText="TecoGram S.A."
              onTouchTap={() => {
                redirectEmpresa(true);
              }}
            />
            <MenuItem
              primaryText="Biocled"
              onTouchTap={() => {
                redirectEmpresa(false);
              }}
            />
          </IconMenu>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

class MainDialog extends Component {
  render() {
    const {
      dialogState,
      mostrarDialog,
      cancelarDialog,
      cerrarDialogConMsg
    } = this.props;

    const dialogProps = {
      ...dialogState.dialogParams,
      cancelarDialog,
      mostrarDialog,
      cerrarDialogConMsg
    };
    switch (dialogState.value) {
      case CLIENTE_DIALOG:
        return <NuevoClienteDialog {...dialogProps} />;
      case MEDICO_DIALOG:
        return <NuevoMedicoDialog {...dialogProps} />;
      case PRODUCTO_DIALOG:
        return <NuevoProductoDialog {...dialogProps} />;
      case PAGOS_DIALOG:
        return <PagosDialog {...dialogProps} />;
      default:
        throw Error('Unknown dialog: ' + dialogState.value);
    }
  }
}

const SelectedPage = props => {
  const {
    abrirLinkConSnackbar,
    mostrarErrorConSnackbar,
    ajustes,
    page,
    editarCliente,
    editarProducto,
    editarFactura,
    editarFacturaExamen,
    abrirPagos
  } = props;

  const commonProps = {
    ajustes
  };

  const pageProps = { ...commonProps, ...page.props };

  const facturaEditorProps = {
    abrirLinkConSnackbar,
    mostrarErrorConSnackbar,
    abrirPagos,
    ...pageProps
  };

  switch (page.type) {
    case NEW_FACTURA_PAGE:
      return <NuevaFacturaPage {...facturaEditorProps} />;
    case EDITAR_FACTURA_PAGE:
      return <EditarFacturaPage {...facturaEditorProps} />;
    case NEW_FACTURA_EXAMEN_PAGE:
      return <NuevaFacturaExamenPage {...facturaEditorProps} />;
    case EDITAR_FACTURA_EXAMEN_PAGE:
      return <EditarFacturaExamenPage {...facturaEditorProps} />;
    case FACTURA_LIST_PAGE:
      return (
        <FacturasListView
          editarFactura={editarFactura}
          editarFacturaExamen={editarFacturaExamen}
          {...pageProps}
        />
      );
    case CLIENTE_LIST_PAGE:
      return (
        <ClientesListView
          mostrarErrorConSnackbar={mostrarErrorConSnackbar}
          editarCliente={editarCliente}
          {...pageProps}
        />
      );
    case PRODUCTO_LIST_PAGE:
      return (
        <ProductosListView
          mostrarErrorConSnackbar={mostrarErrorConSnackbar}
          editarProducto={editarProducto}
          {...pageProps}
        />
      );
    default:
      return null;
  }
};

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false
    };
  }

  handleDrawerChange = value => {
    this.setState({
      drawerOpen: value
    });
  };

  onPageSelected = newPage => {
    this.setState({
      drawerOpen: false
    });
    this.props.cambiarPagina(newPage, {});
  };

  render() {
    const {
      abrirLinkConSnackbar,
      mostrarErrorConSnackbar,
      editarCliente,
      editarProducto,
      editarFactura,
      editarFacturaExamen,
      cancelarDialog,
      mostrarDialog,
      cerrarDialogConMsg,
      dialog,
      ajustes,
      snackbar,
      page
    } = this.props;
    const abrirPagos = extras => mostrarDialog(PAGOS_DIALOG, extras);

    return (
      <div style={{ backgroundColor: '#ededed', height: 'inherit' }}>
        <MainToolbar
          mostrarDialog={mostrarDialog}
          title={ajustes.empresa}
          onLeftButtonClicked={() => this.handleDrawerChange(true)}
        />
        <SelectedPage
          ajustes={ajustes}
          page={page}
          editarCliente={editarCliente}
          editarProducto={editarProducto}
          editarFactura={editarFactura}
          editarFacturaExamen={editarFacturaExamen}
          abrirLinkConSnackbar={abrirLinkConSnackbar}
          mostrarErrorConSnackbar={mostrarErrorConSnackbar}
          abrirPagos={abrirPagos}
        />
        <MainDrawer
          open={this.state.drawerOpen}
          handleChange={this.handleDrawerChange}
          onPageSelected={this.onPageSelected}
        />
        <MainDialog
          dialogState={dialog}
          cancelarDialog={cancelarDialog}
          mostrarDialog={mostrarDialog}
          cerrarDialogConMsg={cerrarDialogConMsg}
        />
        <MainSnackbar data={snackbar} />
      </div>
    );
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
    const MainComponent = connect(
      mapStateToProps,
      mapDispatchToProps
    )(Main);
    const muiTheme = CustomStyle.getEmpresaTheme(appSettings.empresa);
    return (
      <Provider store={store}>
        <MuiThemeProvider muiTheme={muiTheme}>
          <MainComponent />
        </MuiThemeProvider>
      </Provider>
    );
  }
}
