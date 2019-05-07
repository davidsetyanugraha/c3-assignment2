import React from 'react';

import { MuiThemeProvider } from '@material-ui/core';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Sidebar from './components/Sidebar';
import Routes from './routes';
import theme from './theme';

const history = createBrowserHistory();

function ThemeProvider() {
  return (
    <MuiThemeProvider theme={theme}>
      <Sidebar />
      <Router history={history}>
        <Routes />
      </Router>
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
