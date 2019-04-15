const {
  calcularValoresItem,
  calcularValoresTotales
} = require('../../frontend/src/Factura/Math.js');
const CODIGO_IVA = 2;

const crearCodigoPorcentajeIva = porcentajeIVA => {
  if (porcentajeIVA === 0) return 0;
  if (porcentajeIVA === 12) return 2;
  if (porcentajeIVA === 14) return 3;

  throw new Error('Porcentaje de IVA no soportado: ' + porcentajeIVA);
};

const crearComprador = clienteRow => {
  if (!clienteRow.email)
    throw new Error(
      'No se encontró correo electronico para: ' + clienteRow.nombre
    );
  return {
    email: clienteRow.email,
    identificacion: clienteRow.ruc,
    tipo_identificacion: clienteRow.tipo,
    razon_social: clienteRow.nombre,
    direccion: clienteRow.direccion,
    telefono: clienteRow.telefono1
  };
};

const crearItem = ({ porcentajeIVA, descuento }) => unidad => {
  const { impuestos, importe, rebaja } = calcularValoresItem({
    ...unidad,
    porcentajeIVA,
    descuento
  });
  return {
    cantidad: unidad.count,
    precio_unitario: unidad.precioVenta,
    descripcion: unidad.nombre,
    precio_total_sin_impuestos: importe,
    impuestos: [
      {
        base_imponible: importe,
        valor: impuestos,
        tarifa: porcentajeIVA,
        codigo: CODIGO_IVA,
        codigo_porcentaje: crearCodigoPorcentajeIva(porcentajeIVA)
      }
    ],
    descuento: rebaja
  };
};

const crearComprobante = args => {
  const { ventaRow, clienteRow, comprobanteRow, unidades, emisor } = args;
  const { total, impuestos } = calcularValoresTotales(
    ventaRow.subtotal,
    ventaRow.flete,
    ventaRow.iva,
    ventaRow.descuento
  );

  return {
    ambiente: 1,
    tipo_emision: 1,
    secuencial: comprobanteRow.rowid,
    fecha_emision: ventaRow.fecha.toString(),
    emisor,
    moneda: 'USD',
    totales: {
      total_sin_impuestos: ventaRow.subtotal,
      impuestos: [
        {
          base_imponible: 0.0,
          valor: 0.0,
          codigo: CODIGO_IVA,
          codigo_porcentaje: crearCodigoPorcentajeIva(0)
        },
        {
          base_imponible: ventaRow.subtotal,
          valor: impuestos,
          codigo: CODIGO_IVA,
          codigo_porcentaje: crearCodigoPorcentajeIva(ventaRow.iva)
        }
      ],
      importe_total: total,
      propina: 0,
      descuento: ventaRow.descuento
    },
    comprador: crearComprador(clienteRow),
    items: unidades.map(crearItem(ventaRow)),
    pagos: {
      medio: ventaRow.formaPago,
      fecha: ventaRow.fecha.toString(),
      total
    }
  };
};

module.exports = {
  crearComprobante
};
