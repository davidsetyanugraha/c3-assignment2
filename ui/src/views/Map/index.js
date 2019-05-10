import React, { useRef, useEffect, useState, Fragment } from 'react';

import generateMap from '../../components/Map';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1000,
    padding: theme.spacing.unit * 2,
    borderRadius: 10,
    background: 'white'
  }
});

function App({ classes }) {
  const target = useRef(null);
  const map = useRef(null);

  const [, setState] = useState(0);
  const [content, setContent] = useState(undefined);

  useEffect(function() {
    // Force update.
    setState(1);

    async function getMap() {
      const x = await fetch(
        '/nectar/dashboard_source1/_design/summary/_view/sins_per_area?group=true'
      );
      const json = await x.json();

      console.log(json);

      const newMap = await generateMap(target, setContent, map.current);

      map.current = newMap;
    }

    getMap();

    return () => {};
  }, []);

  return (
    <Fragment>
      {content !== undefined && (
        <div
          className={classes.container}
          style={{
            display: content === undefined ? 'none' : 'block'
          }}
        >
          {content}
        </div>
      )}
      <div ref={target} className="map" id="map" />
    </Fragment>
  );
}

export default withStyles(styles)(App);
