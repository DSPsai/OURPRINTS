import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import colors from './colors';

let theme = createMuiTheme({
  palette: {
    primary: {
      main: colors[700]
    },
    secondary: {
      main: colors[700]
    },
    background: {
      default: grey[200]
    },

  }
});

theme = responsiveFontSizes(theme);

export default theme;
