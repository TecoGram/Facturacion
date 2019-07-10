import React from 'react';
import {
  getFacturaURL,
  findAllVentas,
  deleteVenta
} from 'facturacion_common/src/api';

import MaterialTable from '../lib/MaterialTable';
import ListState from './ListState';

const ColumnTypes = MaterialTable.ColumnTypes;
const columns = ['Comprobante ID', 'Empresa', 'Fecha', 'Cliente', 'Total'];
const keys = ['comprobanteID', 'empresa', 'fechaText', 'nombre', 'total'];
const columnTypes = [
  ColumnTypes.string,
  ColumnTypes.string,
  ColumnTypes.string,
  ColumnTypes.string,
  ColumnTypes.numeric
];
const searchHint = 'Buscar facturas...';

export default class FacturasListView extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = new ListState(props, args => this.setState(args));
    this.state = {
      rows: []
    };
  }

  componentWillReceiveProps = nextProps => {
    this.stateManager.props = nextProps;
  };

  openFacturaInNewTab = index => {
    const { rowid } = this.state.rows[index];
    const facturaURL = getFacturaURL(rowid);
    window.open(facturaURL);
  };

  openEditorPage = index => {
    const { rowid, tipo } = this.state.rows[index];
    this.stateManager.openEditorPage(rowid, tipo);
  };

  deleteRow = index => {
    const { rowid } = this.state.rows[index];
    deleteVenta(rowid).then(() => {
      this.stateManager.deleteVenta(rowid);
    });
  };

  requestData = input => {
    const { ajustes } = this.props;
    findAllVentas(ajustes.empresa, input).then(
      resp => {
        const listaVentas = resp.body;
        this.stateManager.colocarVentas(listaVentas);
      },
      err => {
        if (err.status === 404) {
          this.stateManager.colocarVentas([]);
        }
      }
    );
  };

  componentDidMount() {
    this.requestData('');
  }

  render() {
    const rows = this.state.rows;
    return (
      <MaterialTable
        columns={columns}
        columnTypes={columnTypes}
        enableCheckbox={false}
        keys={keys}
        rows={rows}
        searchHint={searchHint}
        onDeleteItem={this.deleteRow}
        onEditItem={this.openEditorPage}
        onOpenItem={this.openFacturaInNewTab}
        isMutableItem={item => !item.id}
        height={'450px'}
        onQueryChanged={this.requestData}
      />
    );
  }
}

FacturasListView.propTypes = {
  ajustes: React.PropTypes.object.isRequired,
  editarFactura: React.PropTypes.func.isRequired,
  editarFacturaExamen: React.PropTypes.func.isRequired
};
