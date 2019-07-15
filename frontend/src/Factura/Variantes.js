import React from 'react';
import FacturaEditorView from './FacturaEditorView';

export const NuevaFacturaPage = props => {
  return (
    <FacturaEditorView
      {...props}
      key={0}
      ventaKey={undefined}
      isExamen={false}
    />
  );
};

export const EditarFacturaPage = props => {
  return <FacturaEditorView {...props} key={props.ventaKey} isExamen={false} />;
};

export const NuevaFacturaExamenPage = props => {
  return (
    <FacturaEditorView
      {...props}
      key={0}
      ventaKey={undefined}
      isExamen={true}
    />
  );
};

export const EditarFacturaExamenPage = props => {
  return <FacturaEditorView {...props} key={props.ventaKey} isExamen={true} />;
};

EditarFacturaPage.propTypes = {
  ventaKey: React.PropTypes.number.isRequired
};

EditarFacturaExamenPage.propTypes = {
  ventaKey: React.PropTypes.number.isRequired
};
