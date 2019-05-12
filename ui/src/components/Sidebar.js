import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import MapIcon from '@material-ui/icons/Map';
import PublicIcon from '@material-ui/icons/Public';
import FlightIcon from '@material-ui/icons/Flight';

import { Link } from 'react-router-dom';

const styles = theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    width: `calc(100% - ${theme.custom.sidebarWidth}px)`,
    marginLeft: theme.custom.sidebarWidth
  },
  drawer: {
    width: theme.custom.sidebarWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: theme.custom.sidebarWidth
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3
  },
  link: {
    '&:visited': {
      color: 'black'
    },
    color: 'black',
    textDecoration: 'none'
  },
  listActive: {
    background: '#dadada'
  }
});

const routes = [
  { to: '/', name: 'Dashboard', icon: DashboardIcon },
  { to: '/map', name: 'Sin Distribution', icon: MapIcon },
  { to: '/movement', name: 'Movement', icon: PublicIcon },
  { to: '/movement-vic', name: 'Movement (VIC)', icon: PublicIcon },
  { to: '/travel-dest.html', name: 'Travels', out: true, icon: FlightIcon }
];

function Sidebar(props) {
  const { classes, location } = props;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
        anchor="left"
      >
        <List>
          {routes.map(({ to, name, out, icon: Icon }, index) => {
            return (
              <Link
                to={to}
                key={name}
                target={out ? '_blank' : undefined}
                className={classes.link}
              >
                <ListItem
                  className={location.pathname === to ? classes.listActive : ''}
                  button
                >
                  <Icon />
                  <ListItemText primary={name} />
                </ListItem>
              </Link>
            );
          })}
        </List>
      </Drawer>
    </div>
  );
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default compose(
  withRouter,
  withStyles(styles)
)(Sidebar);
