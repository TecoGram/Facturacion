import React, { Component, PropTypes } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  withRouter
} from 'react-router-dom';

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

import * as CustomStyle from './CustomStyle';
import MainDialog from './MainDialog';
import ClienteForm from './NuevoCliente/ClienteForm.js';
import ProductoForm from './NuevoProducto/ProductoForm.js';
import MedicoForm from './NuevoMedico/MedicoForm.js';
import FacturasListView from './FacturasList/FacturasListView';
import ClientesListView from './ClientesList/ClientesListView';
import ProductosListView from './ProductosList/ProductosListView';
import FacturaEditorView from './Factura/FacturaEditorView';
import appSettings from './Ajustes';
import * as Actions from './MainActions.js';
import { createReducer, getDefaultState } from './MainReducers.js';
import { updateState } from './Arch.js';
const toolbarTextColor = '#FFFFFF';
const toolbarTitleStyle = {
  color: toolbarTextColor,
  fontFamily: 'Roboto'
};

const redirectEmpresa = redirigirAMain => {
  if (redirigirAMain) window.location = '/app?empresa=0';
  else window.location = '/app?empresa=1';
};

const MainDrawer = withRouter(props => {
  const redirectAndClose = path => {
    props.handleChange(false);
    // change location after drawer closes
    setTimeout(() => props.history.push(path), 300);
  };

  return (
    <Drawer
      docked={false}
      width={200}
      open={props.open}
      onRequestChange={props.handleChange}
    >
      <MenuItem
        onTouchTap={() => redirectAndClose('/factura/edit/new')}
        leftIcon={<Add />}
      >
        Factura
      </MenuItem>
      <MenuItem
        onTouchTap={() => redirectAndClose('/factura_examen/edit/new')}
        leftIcon={<Add />}
      >
        Factura Examen
      </MenuItem>
      <Divider />
      <MenuItem
        onTouchTap={() => redirectAndClose('/clientes')}
        leftIcon={<ViewList />}
      >
        Clientes
      </MenuItem>
      <MenuItem
        onTouchTap={() => redirectAndClose('/productos')}
        leftIcon={<ViewList />}
      >
        Productos
      </MenuItem>
      <MenuItem
        onTouchTap={() => redirectAndClose('/facturas')}
        leftIcon={<ViewList />}
      >
        Facturas
      </MenuItem>
      <Divider />
      {appSettings.empresas.map((empresaName, index) => {
        return (
          <MenuItem
            key={index}
            onTouchTap={() => redirectEmpresa(index === 0)}
            leftIcon={<ExitToApp />}
          >
            {empresaName}
          </MenuItem>
        );
      })}
    </Drawer>
  );
});

MainDrawer.propTypes = {
  handleChange: React.PropTypes.func.isRequired
};

class MainSnackbar extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.message !== this.props.message;
  }

  render() {
    const { message, link, cerrarSnackbar } = this.props;

    const action = link && (
      <a rel={'noopener'} target={'_blank'} href={link}>
        ABRIR
      </a>
    );

    return (
      <Snackbar
        open={!!message}
        message={message || ''}
        action={action}
        autoHideDuration={12000}
        onRequestClose={cerrarSnackbar}
      />
    );
  }
}

MainSnackbar.propTypes = {
  message: React.PropTypes.string,
  link: React.PropTypes.string,
  cerrarSnackbar: React.PropTypes.func.isRequired
};

class MainToolbar extends Component {
  getIconStyles = context => {
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
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  };

  render() {
    const { iconButtonStyle, iconButtonIconStyle } = this.getIconStyles(
      this.context
    );

    const { mostrarNuevoItemDialog, title, onMenuButtonClicked } = this.props;

    const appBar = this.context.muiTheme.appBar;

    return (
      <Toolbar style={{ backgroundColor: appBar.color }}>
        <ToolbarGroup>
          <IconButton
            style={iconButtonStyle}
            iconStyle={iconButtonIconStyle}
            onTouchTap={onMenuButtonClicked}
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
              onTouchTap={() => mostrarNuevoItemDialog(ProductoForm)}
            />
            <MenuItem
              primaryText="Nuevo Cliente"
              onTouchTap={() => mostrarNuevoItemDialog(ClienteForm)}
            />
            <MenuItem
              primaryText="Nuevo Medico"
              onTouchTap={() => mostrarNuevoItemDialog(MedicoForm)}
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
            {appSettings.empresas.map((empresaName, index) => {
              return (
                <MenuItem
                  key={index}
                  primaryText={empresaName}
                  onTouchTap={() => redirectEmpresa(index === 0)}
                />
              );
            })}
          </IconMenu>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

MainToolbar.propTypes = {
  title: React.PropTypes.string.isRequired,
  mostrarNuevoItemDialog: React.PropTypes.func.isRequired,
  onMenuButtonClicked: React.PropTypes.func.isRequired
};
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
  constructor(props) {
    super(props);
    this.createReducer = createReducer;
    this.state = getDefaultState();
  }

  toggleDrawerMenu = drawerOpen => {
    updateState(this, { type: Actions.toggleDrawerMenu, drawerOpen });
  };

  mostrarNuevoItemDialog = Content => {
    updateState(this, { type: Actions.mostrarInputDialog, Content });
  };

  cerrarInputDialog = message => {
    updateState(this, { type: Actions.cerrarInputDialog, message });
  };

  abrirPagos = params => {
    updateState(this, { type: Actions.mostrarInputDialog, ...params });
  };

  mostrarSnackbar = (message, link) => {
    updateState(this, { type: Actions.mostrarSnackbar, message, link });
  };

  cerrarSnackbar = () => {
    updateState(this, { type: Actions.cerrarSnackbar });
  };

  editarCliente = editar => {
    updateState(this, {
      type: Actions.mostrarInputDialog,
      Content: ClienteForm,
      editar
    });
  };

  editarProducto = editar => {
    updateState(this, {
      type: Actions.mostrarInputDialog,
      Content: ProductoForm,
      editar
    });
  };

  redirectToNewFactura = () => <Redirect to={'/factura/edit/new'} />;

  clientesList = routeProps => {
    return (
      <ClientesListView
        editarCliente={this.editarCliente}
        mostrarErrorConSnackbar={this.mostrarSnackbar}
      />
    );
  };

  productosList = routeProps => {
    return (
      <ProductosListView
        editarProducto={this.editarProducto}
        mostrarErrorConSnackbar={this.mostrarSnackbar}
      />
    );
  };

  facturasList = routeProps => {
    const redirect = path => routeProps.history.push(path);
    const editarFactura = id => redirect('/factura/edit/' + id);
    const editarFacturaExamen = id => redirect('/factura_examen/edit/' + id);
    return (
      <FacturasListView
        editarFacturaExamen={editarFacturaExamen}
        editarFactura={editarFactura}
      />
    );
  };

  facturaEditor = routeProps => {
    const { match, history } = routeProps;
    const { id } = match.params;
    const isExamen = match.path.startsWith('/factura_examen/edit');

    const redirect = path => history.push(path);
    const editarFactura = id => redirect('/factura/edit/' + id);
    const editarFacturaExamen = id => redirect('/factura_examen/edit/' + id);

    const clearFacturaEditorOk = (message, link) => {
      this.mostrarSnackbar(message, link);
      if (isExamen) redirect('/factura_examen/edit/new');
      else redirect('/factura/edit/new');
    };

    return (
      <FacturaEditorView
        clearFacturaEditorOk={clearFacturaEditorOk}
        editarFactura={editarFactura}
        editarFacturaExamen={editarFacturaExamen}
        abrirPagos={this.abrirPagos}
        mostrarErrorConSnackbar={this.mostrarSnackbar}
        isExamen={isExamen}
        ventaId={id}
        key={FacturaEditorView.createKey(isExamen, id)}
      />
    );
  };

  render() {
    const muiTheme = CustomStyle.getEmpresaTheme(appSettings.main);
    const { drawerOpen, dialog, snackbar } = this.state;

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={{ backgroundColor: '#ededed', height: 'inherit' }}>
          <MainToolbar
            mostrarNuevoItemDialog={this.mostrarNuevoItemDialog}
            title={appSettings.empresa}
            onMenuButtonClicked={() => this.toggleDrawerMenu(true)}
          />
          <Router basename="/app">
            <div>
              <Switch>
                <Route
                  path="/factura_examen/edit/:id"
                  component={this.facturaEditor}
                />
                <Route
                  path="/factura/edit/:id"
                  component={this.facturaEditor}
                />
                <Route path="/productos" exact component={this.productosList} />
                <Route path="/clientes" exact component={this.clientesList} />
                <Route path="/facturas" exact component={this.facturasList} />

                <Route component={this.redirectToNewFactura} />
              </Switch>
              <MainDrawer
                open={drawerOpen}
                handleChange={this.toggleDrawerMenu}
              />
            </div>
          </Router>
          <MainDialog {...dialog} cerrarDialog={this.cerrarInputDialog} />
          <MainSnackbar {...snackbar} cerrarSnackbar={this.cerrarSnackbar} />
        </div>
      </MuiThemeProvider>
    );
  }
}
