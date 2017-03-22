import React from 'react';

import Info from 'material-ui/svg-icons/action/info';
import Label from 'material-ui/svg-icons/action/label';
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
      value: inputs.precioDist || '',
      errorText: errors.precioDist,
      onChange: (event) => {updateData('precioDist', event.target.value)},
    }

    const precioVentaInput = {
      hintText: "Precio Venta",
      icon: AttachMoney,
      value: inputs.precioVenta || '',
      errorText: errors.precioVenta,
      onChange: (event) => {updateData('precioVenta', event.target.value)},
    }

    const marcaInput = {
      hintText: "Marca",
      icon: Label,
      value: inputs.marca || '',
      errorText: errors.marca,
      onChange: (event) => {updateData('marca', event.target.value)},
    }

    const pagaIvaInput = {
      hintText: "paga IVA",
      value: inputs.pagaIva,
      onChange: (event, isChecked) => {updateData('pagaIva', isChecked)},
    }

    return (
      <table style={{marginLeft: 10}}>
        <tbody>
          <IconTextFieldRow
            leftInput={nombreInput}
            rightInput={codigoInput} />
          <IconTextFieldRow
            leftInput={precioFabInput}
            rightInput={precioVentaInput} />
          <IconTextFieldRow
            leftInput={marcaInput}
            boolInput={pagaIvaInput} />
        </tbody>
      </table>
    )
  }
}
