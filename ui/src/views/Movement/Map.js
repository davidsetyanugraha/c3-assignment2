import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer } from 'ol/layer';
import Select from 'ol/interaction/Select.js';
import { pointerMove } from 'ol/events/condition.js';
import { OSM } from 'ol/source';

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
        center: [1e6, 0],
        zoom: 2.7
      })
    });
  }

  if (typeof setContent !== 'undefined') {
    map.on('pointermove', function(evt) {
      const [feature] = evt.target.getFeaturesAtPixel(evt.pixel) || [];

      if (feature) {
        const { freq } = feature.values_;

        if (freq > 0) {
          setContent(`Gluttony freq: ${feature.values_.freq}`);
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
