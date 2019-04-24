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

const zoom = 5;
const australiaMedian = fromLonLat([133.7751, -25.2744], 'EPSG:3857');

async function getVectorLayer() {
  const response = await fetch('http://localhost:3001');
  const territory = await response.json();

  // var styles = {
  //   Polygon: new Style({
  //     stroke: new Stroke({
  //       color: 'blue',
  //       lineDash: [4],
  //       width: 3
  //     }),
  //     fill: new Fill({
  //       color: 'rgba(0, 0, 255, 1)'
  //     })
  //   })
  // };

  const territoryStyles = territory.features.map(() => {
    return new Style({
      stroke: new Stroke({
        color: 'blue',
        lineDash: [4],
        width: 3
      }),
      fill: new Fill({
        color: `rgba(${Math.random() * 255}, ${Math.random() *
          255}, ${Math.random() * 255}, 1)`
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
      center: australiaMedian,
      zoom
    })
  });

  // Create the graticule component
  var graticule = new Graticule({
    // the style to use for the lines, optional.
    strokeStyle: new Stroke({
      color: 'rgba(255,120,0,0.9)',
      width: 2,
      lineDash: [0.5, 4]
    }),
    showLabels: true
  });

  graticule.setMap(map);

  return map;
}
