import React, { useRef, useEffect, useState, Fragment } from 'react';

import generateMap from './Map';
import { withStyles } from '@material-ui/core';
import createVectorLayer from './vectorLayer';

const styles = theme => ({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1000,
    padding: theme.spacing.unit * 2,
    borderRadius: 10,
    background: 'white'
  },
  overlayLine: {
    margin: 0
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
      const vectorLayer = await createVectorLayer();
      const newMap = await generateMap(target, setContent, map.current, [
        vectorLayer
      ]);

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
          {Array.isArray(content)
            ? content.map((line, idx) => (
                <p className={classes.overlayLine} key={idx}>
                  {line}
                </p>
              ))
            : content}
        </div>
      )}
      <div ref={target} className="map" id="map" />
    </Fragment>
  );
}

export default withStyles(styles)(App);
