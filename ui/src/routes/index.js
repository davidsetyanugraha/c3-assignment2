// Title: The Seven Deadly Sins in Social Media Case Study in Victoria Cities
// Team Name: Team 14
// Team Members:
//   Dading Zainal Gusti (1001261)
//   David Setyanugraha (867585)
//   Ghawady Ehmaid (983899)
//   Indah Permatasari (929578)
//   Try Ajitiono (990633)

import React from 'react';
import { Switch, Route } from 'react-router';

import { withStyles } from '@material-ui/core/styles';
import MapView from '../views/Map';
import Movement from '../views/Movement';
import MovementVic from '../views/MovementVic';
import Dashboard from '../views/Dashboard';
import Links from '../views/Links';

const styles = theme => ({
  content: {
    marginLeft: theme.custom.sidebarWidth,
    padding: theme.spacing.unit * 2
  }
});

function Routes(props) {
  return (
    <div className={props.classes.content}>
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/map" component={MapView} />
        <Route path="/movement" component={Movement} />
        <Route path="/movement-vic" component={MovementVic} />
        <Route path="/links" component={Links} />
      </Switch>
    </div>
  );
}

export default withStyles(styles)(Routes);
