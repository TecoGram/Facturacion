import React from 'react';

import Checkbox from 'material-ui/Checkbox';
import Info from 'material-ui/svg-icons/action/info';
import BusinessCenter from 'material-ui/svg-icons/places/business-center';
import AttachMoney from 'material-ui/svg-icons/editor/attach-money';

import IconTextFieldRow from '../../lib/formTable/IconTextFieldRow'

export default class NuevoProductoForm extends React.Component {

  renderIVACheckbox = (inputs, updateData) => {
    return (
      <Checkbox
        label={"paga IVA"}
        checked={inputs.pagaIva}
        onCheck={(event, isChecked) => { updateData('pagaIva', isChecked)}} />
    )
  }

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
      <div>
        <table style={{marginLeft: 10}}>
          <tbody>
            <IconTextFieldRow
              leftInput={nombreInput}
              rightInput={codigoInput} />
            <IconTextFieldRow
              leftInput={precioFabInput}
              rightInput={precioVentaInput} />
          </tbody>
        </table>
        <br/>
        { this.renderIVACheckbox(inputs, updateData) }
      </div>
    )
  }
}
