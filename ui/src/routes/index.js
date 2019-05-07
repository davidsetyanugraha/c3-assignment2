import React from 'react';
import { Switch, Route } from 'react-router';

import { withStyles } from '@material-ui/core/styles';
import Map from '../views/Map';

const styles = theme => ({
  content: {
    marginLeft: theme.custom.sidebarWidth
  }
});

function Routes(props) {
  return (
    <div className={props.classes.content}>
      <Switch>
        <Route path="/" exact component={Map} />
      </Switch>
    </div>
  );
}

export default withStyles(styles)(Routes);
