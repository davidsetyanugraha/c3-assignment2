// Title: The Seven Deadly Sins in Social Media Case Study in Victoria Cities
// Team Name: Team 14
// Team Members:
//   Dading Zainal Gusti (1001261)
//   David Setyanugraha (867585)
//   Ghawady Ehmaid (983899)
//   Indah Permatasari (929578)
//   Try Ajitiono (990633)

import { createMuiTheme } from '@material-ui/core';

/**
 * Theme provider. This is used so we can use theme easily across all components.
 */

const baseTheme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});
const customTheme = {
  ...baseTheme,
  custom: {
    sidebarWidth: 240,
    colors: {
      white: '#fff'
    }
  }
};

export default customTheme;
