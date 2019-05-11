import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

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
  }
});

const routes = [
  { to: '/', name: 'Charts' },
  { to: '/map', name: 'Distribution' },
  { to: '/movement', name: 'Movement' },
  { to: '/movement-vic', name: 'Movement (VIC)' },
  { to: '/dashboard', name: 'Dashboard' },
  { to: '/travel-dest.html', name: 'Travels', out: true }
];

function PermanentDrawerLeft(props) {
  const { classes } = props;

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
          {routes.map(({ to, name, out }, index) => {
            return (
              <Link to={to} key={name} target={out ? '_blank' : undefined}>
                <ListItem button>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
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

PermanentDrawerLeft.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PermanentDrawerLeft);
