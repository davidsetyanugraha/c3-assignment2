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
