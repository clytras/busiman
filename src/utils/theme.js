import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';


let _theme;

export function theme({ force = false } = {}) {
  if(force || !_theme) {
    _theme = createMuiTheme({
      palette: {
        primary: {
          // light: '#fff',
          main: blue[700],
          // dark: '#000'
        },
        secondary: {
          main: pink[500],
        },
      }
   });
  }
  return _theme;
}

export function Themed({ children }) {
  return (
    <MuiThemeProvider theme={theme()}>
      {children}
    </MuiThemeProvider>
  );
}
