import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import { toReadableDate } from 'facturacion_common/src/DateParser';

const FormattedDatePicker = props => {
  const actualProps = { ...props, formatDate: toReadableDate };
  return <DatePicker {...actualProps} />;
};

export default FormattedDatePicker;
