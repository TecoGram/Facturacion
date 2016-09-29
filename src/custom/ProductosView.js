import React, {Component} from 'react';

import CRUDTable from '../lib/CRUDTable'


const list = [
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  { id: 43234, nombre: 'Acido Urico 20x12 ml 240 det. TECO', reg: 'AD-0493-11-03', cant: 0, precioFab: 20.00, precio: 39.95 },
  // And so on...
];

const columnData = [
  { key: 'reg', name: 'Reg. Sanitario', width: 200 },
  { key: 'nombre', name: 'Nombre', width: 300, flexGrow: 1 },
  { key: 'cant', name: 'Cantidad', width: 90 },
  { key: 'precioFab', name: 'Precio Fabrica', width: 120 },
  { key: 'precio', name: 'Precio', width: 80 },
];

function getProductId(product){
  return product.id
}

/**
* This component draws a Table efficiently using all the space available. It expects
the parent to have all the height available, so that the table fits the size of
the window. If this condition is not met, the table may not render at all.
*/
export default class ProductosView extends Component {

  state = {
    data : [],
  };

  componentWillMount() {
    this.setState({data: list})
  }

  render() {
    const data = this.state.data
    return <CRUDTable data={data} columnData={columnData} />
  }
}
