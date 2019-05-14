// Title: The Seven Deadly Sins in Social Media Case Study in Victoria Cities
// Team Name: Team 14
// Team Members:
//   Dading Zainal Gusti (1001261)
//   David Setyanugraha (867585)
//   Ghawady Ehmaid (983899)
//   Indah Permatasari (929578)
//   Try Ajitiono (990633)

import React, { useRef, useEffect, useState, Fragment } from 'react';

import generateMap from './Map';
import {
  withStyles,
  Grid,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@material-ui/core';
import createVectorLayer from './vectorLayer';

const styles = theme => ({
  root: {
    position: 'relative'
  },
  container: {
    position: 'absolute',
    marginTop: 64,
    border: '1px solid black',
    minWidth: 250,
    top: 0,
    right: 0,
    zIndex: 1000,
    padding: theme.spacing.unit * 2,
    borderRadius: 10,
    background: 'white'
  },
  overlayLine: {
    margin: 0
  },
  radios: {
    display: 'flex',
    flexDirection: 'row'
  }
});

function App({ classes }) {
  const target = useRef(null);
  const map = useRef(null);

  const [, setState] = useState(0);
  const [content, setContent] = useState(undefined);
  const [chosenMap, setChosenMap] = useState('sins');

  useEffect(
    function() {
      // Force update.
      setState(1);

      async function getMap() {
        const vectorLayer = await createVectorLayer(chosenMap === 'sins');
        const newMap = await generateMap(target, setContent, map.current, [
          vectorLayer
        ]);

        map.current = newMap;
      }

      if (map.current !== null) {
        const currentLayers = map.current.getLayers().array_;

        map.current.getLayers().array_ = currentLayers.slice(0, 1);
      }

      getMap();

      return () => {};
    },
    [chosenMap]
  );

  function onChangeRadio(e) {
    setChosenMap(e.target.value);
  }

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <FormLabel component="legend">Map type</FormLabel>
          <RadioGroup
            aria-label="Choose map type"
            name="mapType"
            className={classes.radios}
            value={chosenMap}
            onChange={onChangeRadio}
          >
            <FormControlLabel
              value="sins"
              control={<Radio color="primary" />}
              label="Sins"
              labelPlacement="start"
            />
            <FormControlLabel
              value="unliveable"
              control={<Radio color="primary" />}
              label="Unliveable"
              labelPlacement="start"
            />
          </RadioGroup>
        </Grid>
      </Grid>
      {content !== undefined && (
        <div
          className={classes.container}
          style={{
            display: content === undefined ? 'none' : 'block'
          }}
        >
          {Array.isArray(content)
            ? content.map((line, idx) => <Fragment key={idx}>{line}</Fragment>)
            : content}
        </div>
      )}
      <div ref={target} className="map" id="map" />
    </div>
  );
}

export default withStyles(styles)(App);
