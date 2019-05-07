import React from 'react';
import { Switch, Route } from 'react-router';

import { withStyles } from '@material-ui/core/styles';
import Chart from '../views/Chart';
import MapView from '../views/Map';
import Movement from '../views/Movement';

const styles = theme => ({
  content: {
    marginLeft: theme.custom.sidebarWidth
  }
});

function Routes(props) {
  return (
    <div className={props.classes.content}>
      <Switch>
        <Route path="/" exact component={Chart} />
        <Route path="/map" component={MapView} />
        <Route path="/movement" component={Movement} />
      </Switch>
    </div>
  );
}

export default withStyles(styles)(Routes);
