import React, { useRef, useEffect, useState, Fragment } from 'react';

import generateMap from '../../components/Map';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  container: {
    padding: theme.spacing.unit * 2,
    borderRadius: 10,
    background: 'white'
  }
});

function App({ classes }) {
  const target = useRef(null);
  const container = useRef(null);
  const overlay = useRef(null);
  const map = useRef(null);

  const [, setState] = useState(0);
  const [content, setContent] = useState(undefined);

  useEffect(function() {
    // Force update.
    setState(1);

    async function getMap() {
      const newMap = await generateMap(
        target,
        container,
        setContent,
        map.current,
        overlay
      );

      map.current = newMap;
    }

    getMap();

    return () => {
      overlay.current.setElement(undefined);
      overlay.current = null;
      container.current = null;
      map.current.setTarget(null);
      map.current = null;
    };
  }, []);

  function onClose(e) {
    e.preventDefault();
    if (overlay.current) {
      overlay.current.setPosition(undefined);
      setContent(undefined);
    }
  }

  return (
    <Fragment>
      {/* <div
        ref={container}
        className={classes.container}
        style={{
          display: content === undefined ? 'none' : 'block'
        }}
      >
        <button
          ref={node => {
            if (node) {
              if (node.onclick === null) {
                node.onclick = onClose;
              }
            }
          }}
        >
          x
        </button>
        {content}
      </div> */}
      <div ref={target} className="map" id="map" />
    </Fragment>
  );
}

export default withStyles(styles)(App);
