import {
  toReadableDateTime,
  parseDBDate
} from 'facturacion_common/src/DateParser.js';
import Money from 'facturacion_common/src/Money.js';
import leftPad from 'left-pad';
import { calcularTotalVentaRow } from 'facturacion_common/src/Math.js';

const getComprobanteFromVenta = venta => {
  if (!venta.secuencial) return '-';

  if (!venta.id) return 'Pendiente';

  return leftPad(venta.secuencial, 9, 0);
};

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
      const { fecha } = venta;
      const fechaText = toReadableDateTime(parseDBDate(fecha));
      const total = Money.print(calcularTotalVentaRow(venta));
      const comprobante = getComprobanteFromVenta(venta);
      return {
        ...venta,
        fechaText,
        comprobante,
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
