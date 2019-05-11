import React from 'react';

import { fromLonLat } from 'ol/proj.js';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer } from 'ol/layer';
import Select from 'ol/interaction/Select.js';
import { pointerMove } from 'ol/events/condition.js';
import { OSM } from 'ol/source';

import titleCase from 'title-case';

const victoriaBoundingBox = [
  [140.96190162, -39.19848673],
  [150.03328204, -33.98079743]
];

const zoom = 7;
const victoriaMedian = fromLonLat(
  [
    (victoriaBoundingBox[0][0] + victoriaBoundingBox[1][0]) / 2,
    (victoriaBoundingBox[0][1] + victoriaBoundingBox[1][1]) / 2
  ],
  'EPSG:3857'
);
const sins = ['sloth', 'greed', 'gluttony', 'wrath', 'lust', 'envy', 'pride'];

export default async function generateMap(
  target,
  setContent,
  oldMap,
  otherLayers = []
) {
  let map;

  if (!oldMap) {
    const layers = [
      new TileLayer({
        source: new OSM()
      })
    ].concat(otherLayers);

    map = new Map({
      layers,
      target: target.current,
      view: new View({
        center: victoriaMedian,
        zoom
      })
    });
  }

  if (typeof setContent !== 'undefined') {
    map.on('pointermove', function(evt) {
      const [feature] = evt.target.getFeaturesAtPixel(evt.pixel) || [];

      if (feature) {
        const { freqTotal, lga_name } = feature.values_;

        if (freqTotal !== undefined) {
          setContent(
            [
              <h4 style={{ marginTop: 0 }}>
                {titleCase(lga_name)} ({feature.values_.freqTotal} sins)
              </h4>
            ].concat(
              feature.values_.sins.map((sinValue, index) => (
                <span>
                  <b>{sins[index]}</b>: {sinValue}
                </span>
              ))
            )
          );
        } else {
          setContent(undefined);
        }
      }
    });
  }

  const select = new Select({
    condition: pointerMove
  });

  // For selection.
  // https://openlayers.org/en/latest/examples/vector-tile-selection.html.
  map.addInteraction(select);

  return map;
}
