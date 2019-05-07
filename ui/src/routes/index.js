import React from 'react';
import { Switch, Route } from 'react-router';

import { withStyles } from '@material-ui/core/styles';
import MapView from '../views/Map';
import Chart from '../views/Chart';

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
        <Route path="/" exact component={MapView} />
      </Switch>
    </div>
  );
}

export default withStyles(styles)(Routes);
