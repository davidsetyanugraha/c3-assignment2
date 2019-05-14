// Title: The Seven Deadly Sins in Social Media Case Study in Victoria Cities
// Team Name: Team 14
// Team Members:
//   Dading Zainal Gusti (1001261)
//   David Setyanugraha (867585)
//   Ghawady Ehmaid (983899)
//   Indah Permatasari (929578)
//   Try Ajitiono (990633)

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

const sinNames = [
  'sloth',
  'greed',
  'gluttony',
  'wrath',
  'lust',
  'envy',
  'pride'
];
const aurinNames = [
  'sedentary',
  'gambling loss',
  'overweight',
  'offence',
  'sexual offence',
  'homelessness',
  'income'
];

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
  } else {
    map = oldMap;

    otherLayers.forEach(layer => map.addLayer(layer));
  }

  if (typeof setContent !== 'undefined') {
    map.on('pointermove', function(evt) {
      const [feature] = evt.target.getFeaturesAtPixel(evt.pixel) || [];

      if (feature) {
        const {
          freqTotal,
          lga_name,
          sins,
          aurin,
          unliveable
        } = feature.values_;

        if (freqTotal !== undefined) {
          setContent(
            [
              <h4 style={{ marginTop: 0, textAlign: 'center' }}>
                {titleCase(lga_name)} ({freqTotal} sins) - Unliveable:{' '}
                {unliveable.toFixed(2)}
              </h4>
            ].concat(
              <table>
                <thead>
                  <tr>
                    <th />
                    <th># Tweets</th>
                    <th>AURIN Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {sins.map((sinValue, index) => (
                    <tr key={index}>
                      <td>
                        <b>{titleCase(sinNames[index])}</b> (
                        {titleCase(aurinNames[index])})
                      </td>
                      <td>{sinValue}</td>
                      <td>{aurin[index]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
