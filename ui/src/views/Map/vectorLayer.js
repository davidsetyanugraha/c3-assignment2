// Title: The Seven Deadly Sins in Social Media Case Study in Victoria Cities
// Team Name: Team 14
// Team Members:
//   Dading Zainal Gusti (1001261)
//   David Setyanugraha (867585)
//   Ghawady Ehmaid (983899)
//   Indah Permatasari (929578)
//   Try Ajitiono (990633)

import { fromLonLat } from 'ol/proj.js';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Fill, Stroke, Style } from 'ol/style';
import Circle from 'ol/geom/Circle.js';

const countTotal = obj => {
  const { value } = obj;
  // There are 2 fields, key and value.
  // "key" consists of [lga_code, region_name].
  // "value" consists of sins, in order of "sloth", "greed", "gluttony", "wrath", "lust", "envy", "pride".
  return value.slice(0, 7).reduce((sum, cur) => sum + cur, 0);
};

export default async function createVectorLayer(countSins = true) {
  const [response, area] = await Promise.all([
    // Area boundary.
    fetch('/LGA_GeoData.json'),
    // Data.
    fetch(
      '/nectar/sins_per_area2/_design/summary/_view/sins_per_area?group=True'
    )
  ]);
  const territory = await response.json();
  const { rows } = await area.json();
  let max = -999999;

  rows.forEach(result => {
    let total;

    if (countSins) {
      total = countTotal(result);
    } else {
      // unliveable_score is index 14.
      total = result.value[14];
    }

    if (total > max) {
      max = total;
    }
  });

  let normalizedMax = max;

  if (countSins) {
    normalizedMax = Math.pow(normalizedMax, 0.2);
  } else {
    normalizedMax = Math.pow(normalizedMax, 0.8);
  }

  var styleFunction = function(feature) {
    const row = rows.find(({ key }) => key[0] === feature.values_.lga_code);
    let val = 0;

    if (row !== undefined) {
      if (countSins) {
        val = Math.pow(countTotal(row), 0.2);
      } else {
        // unliveable_score is index 14.
        val = row.value[14];
      }
    }

    const red = (val / normalizedMax) * 255;
    const green = 255 - red;
    let colored = false;
    let color;

    if (red > 0) {
      colored = true;

      color = `rgba(${red}, ${green}, 0, 0.9)`;
    } else {
      color = `rgba(255, 255, 255, 0)`;
    }

    return new Style({
      stroke: colored
        ? new Stroke({
            color: 'white',
            lineDash: [3],
            width: 3
          })
        : undefined,
      fill: new Fill({
        color
      })
    });
  };

  var geojsonObject = {
    type: 'FeatureCollection',
    crs: {
      type: 'name',
      properties: {
        name: 'EPSG:3857'
      }
    },
    features: territory.features.map(feature => {
      const { properties, geometry, ...rest } = feature;
      const row = rows.find(({ key }) => key[0] === properties.lga_code);
      let freqTotal;
      let sins;
      let aurin;
      let unliveable;

      if (row !== undefined) {
        freqTotal = countTotal(row);
        sins = row.value.slice(0, 7);
        aurin = row.value.slice(7, 14);
        unliveable = row.value[14];
      }

      return {
        ...rest,
        properties: {
          ...properties,
          freqTotal,
          sins,
          aurin,
          unliveable
        },
        geometry: {
          ...geometry,
          coordinates: geometry.coordinates.map(outer => {
            if (geometry.type === 'Polygon') {
              return outer.map(point => {
                return fromLonLat(point, 'EPSG:3857');
              });
            }

            // MultiPolygon.
            return outer.map(line => {
              return line.map(point => {
                return fromLonLat(point, 'EPSG:3857');
              });
            });
          })
        }
      };
    })
  };

  var vectorSource = new VectorSource({
    features: new GeoJSON().readFeatures(geojsonObject)
  });

  vectorSource.addFeature(new Feature(new Circle([5e6, 7e6], 1e6)));

  var vectorLayer = new VectorLayer({
    source: vectorSource,
    style: styleFunction
  });

  return vectorLayer;
}
