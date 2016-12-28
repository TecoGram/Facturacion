import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {blue500, blue100, blue700, blue800} from 'material-ui/styles/colors';


const myTheme = getMuiTheme({
  appBar: {
    textColor: '#FFFFFF',
  },
  palette: {
    primary1Color: blue500,
  },
});

module.exports = {
  muiTheme: myTheme,
  primaryColor: blue500,
  primaryColor100: blue100,
  primaryColor700: blue700,
  primaryColor800: blue800,
}
