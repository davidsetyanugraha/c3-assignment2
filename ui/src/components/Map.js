import { fromLonLat } from 'ol/proj.js';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import Circle from 'ol/geom/Circle';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Graticule from 'ol/Graticule.js';

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

async function getVectorLayer() {
  const [response, area] = await Promise.all([
    fetch('http://localhost:3001'),
    fetch('http://localhost:3001/stat')
  ]);
  const territory = await response.json();
  const results = await area.json();

  let max = -999999;

  Object.values(results).forEach(result => {
    if (result.freq_gluttony > max) {
      max = result.freq_gluttony;
    }
  });

  const territoryStyles = territory.features.map(feature => {
    const val = results[feature.properties.lga_pid].freq_gluttony;
    let colored = false;
    let color;

    if (val > 0) {
      const minVal = 128;
      const red = (val / minVal) * minVal + minVal;
      colored = true;

      color = `rgba(${red}, 0, 0, 0.5)`;
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
  });

  var styleFunction = function(feature) {
    // console.log(feature);
    return territoryStyles[feature.ol_uid / 2 - 1];
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
      // console.log(feature);
      const type = feature.geometry.type;

      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: feature.geometry.coordinates.map(outer => {
            if (type === 'Polygon') {
              return outer.map(point => {
                // console.log(fromLonLat(point, 'EPSG:3857'));
                return fromLonLat(point, 'EPSG:3857');
              });
            }

            return outer.map(line => {
              return line.map(point => {
                // console.log(fromLonLat(point, 'EPSG:3857'));
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

export default async function generateMap(target) {
  const vectorLayer = await getVectorLayer();
  const map = new Map({
    layers: [
      new TileLayer({
        source: new OSM()
      }),
      vectorLayer
    ],
    target: target.current,
    view: new View({
      center: victoriaMedian,
      zoom
    })
  });

  // Create the graticule component
  var graticule = new Graticule({
    // the style to use for the lines, optional.
    // strokeStyle: new Stroke({
    //   color: 'rgba(255,120,0,0.9)',
    //   width: 2,
    //   lineDash: [0.5, 4]
    // }),
    showLabels: true
  });

  graticule.setMap(map);

  return map;
}
