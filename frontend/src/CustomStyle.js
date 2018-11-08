import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { blue500, pink300 } from 'material-ui/styles/colors';

export const myTheme = color =>
  getMuiTheme({
    palette: {
      primary1Color: color,
    },
  });

export const getEmpresaTheme = empresa => {
  let color;
  if (empresa === 'TecoGram S.A.') color = blue500;
  else if (empresa === 'Biocled') color = pink300;
  else throw new Error('Empresa desconocida: ' + empresa);
  const theme = myTheme(color);
  return theme;
};
