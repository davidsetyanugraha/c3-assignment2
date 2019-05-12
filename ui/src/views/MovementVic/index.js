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

function MovementVic({ classes }) {
  const target = useRef(null);
  const map = useRef(null);

  const [selectedRanges, setSelectedRanges] = useState(undefined);
  const [ranges, setRanges] = useState({});

  var styles = {
    route: new Style({
      stroke: new Stroke({
        width: 2,
        color: [237, 212, 0, 0.8]
      })
    })
  };

  useEffect(
    function() {
      async function getMap() {
        const x = await fetch(
          '/nectar/dashboard_source1/_design/summary/_view/coor_to_coor_vic_time?group=true'
        );
        let json = await x.json();

        // imit for now.
        // json.rows = json.rows.slice(0, 2500);

        const ranges = {};
        const initialSelected = selectedRanges || [];

        json.rows.forEach(({ key }) => {
          const locations = [];
          const [time, startlon, startlat, endlon, endlat] = key;

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

          if (ranges[time] === undefined) {
            ranges[time] = [];
          }

          ranges[time].push(vectorLayer2);

          if (selectedRanges === undefined) {
            initialSelected.push(time);
          }
        });

        if (selectedRanges !== undefined) {
          const layers = Object.keys(ranges).reduce((sum, curKey) => {
            if (!initialSelected.includes(curKey)) {
              return sum;
            }

            return sum.concat(ranges[curKey]);
          }, []);

          if (map.current !== null) {
            const currentLayers = map.current.getLayers().array_;

            map.current.getLayers().array_ = currentLayers.slice(0, 1);
          }

          map.current = await generateMap(
            target,
            undefined,
            map.current,
            layers
          );
        } else {
          setRanges(ranges);
          setSelectedRanges(initialSelected);
        }
      }

      getMap();
    },
    [selectedRanges]
  );

  const opts = Object.keys(ranges);

  function onChangeSelect(e) {
    const options = e.target.options;
    const value = [];

    for (let i = 0, l = opts.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }

    setSelectedRanges(value);
  }

  return (
    <Fragment>
      <select multiple value={selectedRanges} onChange={onChangeSelect}>
        {opts.map(opt => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
      <div ref={target} className="map" id="map" />
      {/* <button onClick={onClick}>start movement</button> */}
    </Fragment>
  );
}

export default withStyles(styles)(MovementVic);
