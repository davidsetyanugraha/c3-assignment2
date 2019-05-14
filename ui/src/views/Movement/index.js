// Title: The Seven Deadly Sins in Social Media Case Study in Victoria Cities
// Team Name: Team 14
// Team Members:
//   Dading Zainal Gusti (1001261)
//   David Setyanugraha (867585)
//   Ghawady Ehmaid (983899)
//   Indah Permatasari (929578)
//   Try Ajitiono (990633)

import React, { useRef, useEffect, useState, Fragment } from 'react';
import Feature from 'ol/Feature';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Stroke, Style } from 'ol/style';
import LineString from 'ol/geom/LineString.js';

import generateMap from './Map';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  container: {
    padding: theme.spacing.unit * 2,
    borderRadius: 10,
    background: 'white'
  }
});

function Movement({ classes }) {
  const target = useRef(null);
  const container = useRef(null);
  const overlay = useRef(null);
  const map = useRef(null);

  const [, setState] = useState(0);

  var styles = {
    route: new Style({
      stroke: new Stroke({
        width: 2,
        color: [237, 212, 0, 0.8]
      })
    })
  };

  useEffect(function() {
    // Force update.
    setState(1);

    async function getMap() {
      const x = await fetch(
        '/nectar/dashboard_source1/_design/summary/_view/coor_to_coor?group=true'
      );
      const json = await x.json();

      const layers = [];

      json.rows.forEach(({ key }) => {
        const locations = [];
        const [startlon, startlat, endlon, endlat] = key;

        locations.push([startlon, startlat]);
        locations.push([endlon, endlat]);

        const route = new LineString(locations).transform(
          'EPSG:4326',
          'EPSG:3857'
        );

        const routeFeature = new Feature({
          type: 'route',
          geometry: route
        });

        const vectorLayer2 = new VectorLayer({
          source: new VectorSource({
            features: [routeFeature]
          }),
          style: function(feature) {
            // hide geoMarker if animation is active
            // if (animating && feature.get('type') === 'geoMarker') {
            //   return null;
            // }
            return styles[feature.get('type')];
          }
        });

        layers.push(vectorLayer2);
      });

      const newMap = await generateMap(target, undefined, map.current, layers);

      map.current = newMap;
    }

    getMap();

    return () => {
      target.current = null;
      overlay.current = null;
      container.current = null;
      map.current = null;
    };
  }, []);

  return (
    <Fragment>
      <div ref={target} className="map" id="map" />
      {/* <button onClick={onClick}>start movement</button> */}
    </Fragment>
  );
}

export default withStyles(styles)(Movement);
