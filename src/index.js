import React from 'react';
import ReactDOM from 'react-dom';
import App from './client/app';
import './client/styles/styles.scss';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
  typography: {
		useNextVariants: true,
	},
	palette: {
		primary: blue,
	},
});

ReactDOM.render(<MuiThemeProvider theme={theme}> <App /></MuiThemeProvider>, document.getElementById('index'));