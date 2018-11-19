import React from 'react';
import ReactDOM from 'react-dom';
import App from './client/app';
import './client/styles/styles.scss';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import yellow from '@material-ui/core/colors/yellow';

const theme = createMuiTheme({
  typography: {
		useNextVariants: true,
	},
	palette: {
		primary: blue,
		secondary: {
			main: '#ffd54f',
		}
	},
});

ReactDOM.render(<MuiThemeProvider theme={theme}> <App /></MuiThemeProvider>, document.getElementById('index'));