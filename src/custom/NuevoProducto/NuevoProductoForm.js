import React from 'react';

import Info from 'material-ui/svg-icons/action/info';
import BusinessCenter from 'material-ui/svg-icons/places/business-center';
import AttachMoney from 'material-ui/svg-icons/editor/attach-money';

import IconTextFieldRow from '../../lib/formTable/IconTextFieldRow'

export default class NuevoProductoForm extends React.Component {

  render() {
    const {
      errors,
      inputs,
      updateData,
    } = this.props

    const codigoInput = {
      hintText: "Registro Sanitario",
      icon: Info,
      value: inputs.codigo || '',
      errorText: errors.codigo,
      onChange: (event) => {updateData('codigo', event.target.value)},
    }

    const nombreInput = {
      hintText: "Nombre",
      icon: BusinessCenter,
      value: inputs.nombre || '',
      errorText: errors.nombre,
      onChange: (event) => {updateData('nombre', event.target.value)},
    }

    const precioFabInput = {
      hintText: "Precio Distribuidora",
      icon: AttachMoney,
      value: inputs.precioFab || '',
      errorText: errors.precioFab,
      onChange: (event) => {updateData('precioFab', event.target.value)},
    }

    const precioVentaInput = {
      hintText: "Precio Venta",
      icon: AttachMoney,
      value: inputs.precioVenta || '',
      errorText: errors.precioVenta,
      onChange: (event) => {updateData('precioVenta', event.target.value)},
    }

    return (
      <table>
        <tbody>
          <IconTextFieldRow
            leftInput={codigoInput}
            rightInput={nombreInput} />
          <IconTextFieldRow
            leftInput={precioFabInput}
            rightInput={precioVentaInput} />
        </tbody>
      </table>
    )
  }
}
