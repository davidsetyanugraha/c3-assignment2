// Title: The Seven Deadly Sins in Social Media Case Study in Victoria Cities
// Team Name: Team 14
// Team Members:
//   Dading Zainal Gusti (1001261)
//   David Setyanugraha (867585)
//   Ghawady Ehmaid (983899)
//   Indah Permatasari (929578)
//   Try Ajitiono (990633)

import React, { useRef, useEffect, useState } from 'react';
import Feature from 'ol/Feature';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Stroke, Style } from 'ol/style';
import LineString from 'ol/geom/LineString.js';

import generateMap from './Map';
import { withStyles } from '@material-ui/core';
import SearchableSelect from '../../components/SearchableSelect';

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
  const initialized = useRef(false);

  const [selectedRanges, setSelectedRanges] = useState([]);
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
          '/nectar/analysis_extended/_design/summary/_view/coor_to_coor_vic_time?group=true'
        );
        let json = await x.json();

        // imit for now.
        // json.rows = json.rows.slice(0, 2500);

        const ranges = {};
        const initialSelected = [];

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

          if (!initialSelected.includes(time)) {
            initialSelected.push(time);
          }
        });

        setRanges(ranges);
        setSelectedRanges(
          initialSelected.map(opt => ({ label: opt, value: opt }))
        );

        initialized.current = true;
      }

      if (initialized.current === false) {
        getMap();
      } else {
        const layers = Object.keys(ranges).reduce((sum, curKey) => {
          if (
            selectedRanges.find(({ value }) => value === curKey) === undefined
          ) {
            return sum;
          }

          return sum.concat(ranges[curKey]);
        }, []);

        if (map.current !== null) {
          const currentLayers = map.current.getLayers().array_;

          map.current.getLayers().array_ = currentLayers.slice(0, 1);
        }

        map.current = generateMap(target, undefined, map.current, layers);
      }
    },
    [selectedRanges]
  );

  const opts = Object.keys(ranges);

  function onChangeSelect(option) {
    setSelectedRanges(option);
  }

  return (
    <div>
      <SearchableSelect
        multiple
        value={selectedRanges}
        onChange={onChangeSelect}
        options={opts.map(opt => ({ label: opt, value: opt }))}
      />
      <div ref={target} className="map" id="map" />
      {/* <button onClick={onClick}>start movement</button> */}
    </div>
  );
}

export default withStyles(styles)(MovementVic);
