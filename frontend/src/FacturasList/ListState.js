import {
  toReadableDateTime,
  parseDBDate
} from 'facturacion_common/src/DateParser.js';
import Money from 'facturacion_common/src/Money.js';
import { calcularTotalVentaRow } from 'facturacion_common/src/Math.js';
export default class ListState {
  constructor(props, setStateFunc) {
    this.setState = setStateFunc;
    this.props = props;

    this.colocarVentas = this.colocarVentas.bind(this);
    this.deleteVenta = this.deleteVenta.bind(this);
    this.openEditorPage = this.openEditorPage.bind(this);
  }

  colocarVentas(listaVentas) {
    const rows = listaVentas.map(venta => {
      const { fecha, id } = venta;
      const fechaText = toReadableDateTime(parseDBDate(fecha));
      const total = Money.print(calcularTotalVentaRow(venta));
      const comprobanteID = id || 'N/A';
      return {
        ...venta,
        fechaText,
        comprobanteID,
        total
      };
    });

    this.setState(() => {
      return { rows };
    });
  }

  deleteVenta(rowid) {
    this.setState(prevState => {
      return {
        rows: prevState.rows.filter(item => item.rowid !== rowid)
      };
    });
  }

  openEditorPage(rowid, tipo) {
    if (tipo === 0) this.props.editarFactura(rowid);
    else this.props.editarFacturaExamen(rowid);
  }
}
