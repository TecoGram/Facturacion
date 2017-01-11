import React from 'react'
import FacturaEditorView from './FacturaEditorView'

export const FacturaExamenEditorView = (props) => {
  return <FacturaEditorView {...props} isExamen={true} />
}

export const NuevaFacturaPage =(props) => {
  return <FacturaEditorView {...props} ventaKey={undefined} isExamen={false} />
}

export const EditarFacturaPage =(props) => {
  return <FacturaEditorView {...props} isExamen={false} />
}

export const NuevaFacturaExamenPage =(props) => {
  return <FacturaEditorView {...props} ventaKey={undefined} isExamen={true} />
}

export const EditarFacturaExamenPage =(props) => {
  return <FacturaEditorView {...props} isExamen={true} />
}

EditarFacturaPage.propTypes = {
  ventaKey: React.PropTypes.object.isRequired,
}

EditarFacturaExamenPage.propTypes = {
  ventaKey: React.PropTypes.object.isRequired,
}
