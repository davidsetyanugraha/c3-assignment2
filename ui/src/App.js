// Title: The Seven Deadly Sins in Social Media Case Study in Victoria Cities
// Team Name: Team 14
// Team Members:
//   Dading Zainal Gusti (1001261)
//   David Setyanugraha (867585)
//   Ghawady Ehmaid (983899)
//   Indah Permatasari (929578)
//   Try Ajitiono (990633)

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
      <Router history={history}>
        <Sidebar />
        <Routes />
      </Router>
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
