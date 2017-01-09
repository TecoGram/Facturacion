import React, {Component} from 'react';
import TextField from 'material-ui/TextField';

import AddShoppingCart from 'material-ui/svg-icons/action/add-shopping-cart';
import Info from 'material-ui/svg-icons/action/info';
import Loyalty from 'material-ui/svg-icons/action/loyalty';
import Payment from 'material-ui/svg-icons/action/payment';
import Person from 'material-ui/svg-icons/social/person';
import Receipt from 'material-ui/svg-icons/action/receipt';
import Today from 'material-ui/svg-icons/action/today';
import LocalHospital from 'material-ui/svg-icons/maps/local-hospital';
import AirlineSeatReclineNormal from 'material-ui/svg-icons/notification/airline-seat-recline-normal';

import ClienteAutoComplete from '../AutoComplete/ClienteAutoComplete'
import ProductoAutoComplete from '../AutoComplete/ProductoAutoComplete'
import MedicoAutoComplete from '../AutoComplete/MedicoAutoComplete'
import CloseableColorChip from '../../lib/CloseableColorChip'
import FormattedDatePicker from '../../lib/FormattedDatePicker';
import IconBox from '../../lib/IconBox'

const autoCompleteWidth = '425px'
const txtMargin = '35px'
const codigoTextStyle = {width: '142px', verticalAlign: 'top', marginRight: txtMargin}

const fechaStyle={display: 'inline-block'}
const fechaTextStyle = {width:'139px', marginRight: txtMargin}

const CodigoText = (props) => {
  const {
    ventaKey,
    data,
    errors,
    onDataChanged,
  } = props

  const myProps = {
    hintText: 'Código',
    style: codigoTextStyle,
  }

  if (ventaKey) {
    myProps.disabled = true
    myProps.value = ventaKey.codigo
  } else {
    myProps.value = data.codigo
    myProps.errorText = errors.codigo
    myProps.onChange = (event) => onDataChanged('codigo', event.target.value)
  }

  return <TextField {...myProps} />
}


const FechaText = (props) => {
  const {
    ventaKey,
    data,
    errors,
    onDataChanged,
  } = props

  const myProps = {
    hintText: 'Fecha',
    style: fechaStyle,
    textFieldStyle: fechaTextStyle,
  }

  if (ventaKey) {
    myProps.disabled = true
    myProps.value = ventaKey.fecha
  } else {
    myProps.value = data.fecha
    myProps.errorText = errors.fecha
    myProps.onChange = (n, date) => onDataChanged('fecha', date)
  }

  return <FormattedDatePicker {...myProps} />
}

const ClienteInput = (props) => {
  const {
    cliente,
    errors,
    onNewCliente,
    width,
  } = props

  if (cliente)
    return (
      <CloseableColorChip text={cliente.nombre} width={width} icon={Person}
        onRequestDelete={() => {onNewCliente(null)}} />
    )
  else
    return (
      <ClienteAutoComplete width={width}
        errorText={errors.get('cliente')} onNewItemSelected={onNewCliente}/>
    )
}

const MedicoInput = (props) => {
  const {
    medico,
    errors,
    onNewMedico,
    width,
  } = props

  if (medico)
    return (
      <CloseableColorChip text={medico.nombre} width={width} icon={LocalHospital}
        onRequestDelete={() => {onNewMedico(null)}} />
    )
  else
    return (
      <MedicoAutoComplete width={width}
        errorText={errors.get('medico')} onNewItemSelected={onNewMedico}/>
    )
}

const ClienteDataRow = (props) => {
  let width = autoCompleteWidth

  return (
    <div style={{display: 'block'}}>
      <IconBox icon={Person}/>
      <ClienteInput cliente={props.cliente} errors={props.errors}
      onNewCliente={props.onNewCliente} width={width} />
      <IconBox icon={AddShoppingCart}/>
      <ProductoAutoComplete width={width}
        onNewItemSelected={props.onNewProduct}/>
    </div>
  )

}

const PacienteDataRow = (props) => {
  let width = autoCompleteWidth

  return (
    <div style={{display: 'block'}}>
      <IconBox icon={LocalHospital} />
      <MedicoInput medico={props.medico} errors={props.errors}
        onNewMedico={props.onNewMedico} width={width} />
      <IconBox icon={AirlineSeatReclineNormal} />
      <TextField hintText='Paciente' style={{width: width}} />
    </div>
  )
}

export default class FacturaForm extends Component {

  render() {
    const {
      data,
      errors,
      onDataChanged,
      isExamen,
    } = this.props

    let formHeight = '130px'
    let pacienteRow = null

    if (isExamen) { //renderizar cosas especificas para examenes
      formHeight = '170px'
      pacienteRow = <PacienteDataRow {...this.props} />
    }

    return (
      <div style={{height: formHeight}}>
        <br />
        <ClienteDataRow {...this.props} />
        { pacienteRow }
        <table>
          <tbody>
            <tr>
              <td>
                <IconBox icon={Receipt}/>
              </td>
              <td>
                <CodigoText {...this.props} />
              </td>

              <td>
                <IconBox icon={Today}/>
              </td>
              <td>
                <FechaText {...this.props} />
              </td>

              <td>
                <IconBox icon={Loyalty}/>
              </td>
              <td>
                <TextField
                  hintText="Desc." value={data.descuento}
                  errorText={errors.descuento}
                  onChange={(event) => onDataChanged('descuento', event.target.value)}
                  style={{width:'40px'}} inputStyle={{textAlign:'right'}} />
                <span style={{marginRight: txtMargin}}>%</span>
              </td>

              <td>
                <IconBox icon={Payment}/>
              </td>
              <td>
                <TextField
                  hintText="Forma de pago" value={data.formaPago}
                  errorText={errors.formaPago}
                  onChange={(event) => onDataChanged('formaPago', event.target.value)}
                  style={{width:'152px', marginRight: txtMargin}} />
              </td>

              <td>
                <IconBox icon={Info}/>
              </td>
              <td>
                <TextField
                  hintText="Autorización" value={data.autorizacion}
                  errorText={errors.autorizacion}
                  onChange={(event) => onDataChanged('autorizacion', event.target.value)}
                  style={{ verticalAlign: 'top', width:'156px'}} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

FacturaForm.propTypes = {
  data: React.PropTypes.object.isRequired,
  errors: React.PropTypes.object.isRequired,
  onDataChanged: React.PropTypes.func.isRequired,
  isExamen: React.PropTypes.bool,
}

FacturaForm.defaultProps = {
  isExamen: false,
}
