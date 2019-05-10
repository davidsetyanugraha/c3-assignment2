import React, { useRef, useEffect, useState, Fragment } from 'react';
import Feature from 'ol/Feature';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Fill, Stroke, Style, Icon, Circle as CircleStyle } from 'ol/style';
import Point from 'ol/geom/Point.js';
import LineString from 'ol/geom/LineString.js';

import generateMap from '../../components/Map';
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

  // var locations = [
  //   [140.44241609, -36.84913974],
  //   ...Array.from(new Array(1000), (_, idx) => [
  //     140.44241609 + idx / 200,
  //     -36.84913974
  //   ]),
  //   [145.44241609, -36.84913974]
  // ];

  // var route = new LineString(locations).transform('EPSG:4326', 'EPSG:3857');

  // var routeCoords = route.getCoordinates();
  // var routeLength = routeCoords.length;

  // var routeFeature = new Feature({
  //   type: 'route',
  //   geometry: route
  // });
  // var geoMarker = new Feature({
  //   type: 'geoMarker',
  //   geometry: new Point(routeCoords[0])
  // });
  // var startMarker = new Feature({
  //   type: 'icon',
  //   geometry: new Point(routeCoords[0])
  // });
  // var endMarker = new Feature({
  //   type: 'icon',
  //   geometry: new Point(routeCoords[routeLength - 1])
  // });

  var styles = {
    route: new Style({
      stroke: new Stroke({
        width: 2,
        color: [237, 212, 0, 0.8]
      })
    })
    // icon: new Style({
    //   image: new Icon({
    //     anchor: [0.5, 1],
    //     src: 'https://openlayers.org/en/v3.20.1/examples/data/icon.png'
    //   })
    // }),
    // geoMarker: new Style({
    //   image: new CircleStyle({
    //     radius: 7,
    //     fill: new Fill({ color: 'black' }),
    //     stroke: new Stroke({
    //       color: 'white',
    //       width: 2
    //     })
    //   })
    // })
  };

  useEffect(function() {
    // Force update.
    setState(1);

    // var vectorLayer2 = new VectorLayer({
    //   source: new VectorSource({
    //     features: [routeFeature, geoMarker, startMarker, endMarker]
    //   }),
    //   style: function(feature) {
    //     // hide geoMarker if animation is active
    //     if (animating && feature.get('type') === 'geoMarker') {
    //       return null;
    //     }
    //     return styles[feature.get('type')];
    //   }
    // });

    async function getMap() {
      const x = await fetch('/nectar/coordinates/_all_docs?include_docs=True');
      const json = await x.json();

      var locations = [];

      json.rows.map(({ doc }) => {
        const { startlon, startlat, endlon, endlat } = doc;
        console.log(startlat);
        locations.push([startlon, startlat]);
        locations.push([endlon, endlat]);
      });

      var route = new LineString(locations).transform('EPSG:4326', 'EPSG:3857');

      var routeCoords = route.getCoordinates();
      // var routeLength = routeCoords.length;
      console.log(routeCoords);
      var routeFeature = new Feature({
        type: 'route',
        geometry: route
      });

      var vectorLayer2 = new VectorLayer({
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

      const newMap = await generateMap(target, undefined, map.current, [
        vectorLayer2
      ]);

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

  // function onClick() {
  //   // if (moving) {
  //   //   setMoving(true);
  //   // } else {
  //   //   setMoving(false);
  //   // }
  //   startAnimation();
  // }

  // var animating = false;
  // var speed = 10,
  //   now;

  // var moveFeature = function(event) {
  //   var vectorContext = event.vectorContext;
  //   var frameState = event.frameState;

  //   if (animating) {
  //     var elapsedTime = frameState.time - now;
  //     // here the trick to increase speed is to jump some indexes
  //     // on lineString coordinates
  //     var index = Math.round((speed * elapsedTime) / 1000);

  //     if (index >= routeLength) {
  //       stopAnimation(true);
  //       return;
  //     }

  //     var currentPoint = new Point(routeCoords[index]);
  //     var feature = new Feature(currentPoint);
  //     vectorContext.drawFeature(feature, styles.geoMarker);
  //   }
  //   // tell OpenLayers to continue the postcompose animation
  //   map.current.render();
  // };

  // function startAnimation() {
  //   if (animating) {
  //     stopAnimation(false);
  //   } else {
  //     animating = true;
  //     now = new Date().getTime();
  //     speed = 10;
  //     // hide geoMarker
  //     geoMarker.setStyle(null);
  //     map.current.on('postcompose', moveFeature);
  //     map.current.render();
  //   }
  // }

  /**
   * @param {boolean} ended end of animation.
   */
  // function stopAnimation(ended) {
  //   animating = false;

  //   // if animation cancelled set the marker at the beginning
  //   var coord = ended ? routeCoords[routeLength - 1] : routeCoords[0];
  //   /** @type {module:ol/geom/Point~Point} */ geoMarker
  //     .getGeometry()
  //     .setCoordinates(coord);
  //   //remove listener
  //   map.current.un('postcompose', moveFeature);
  // }

  return (
    <Fragment>
      <div ref={target} className="map" id="map" />
      {/* <button onClick={onClick}>start movement</button> */}
    </Fragment>
  );
}

export default withStyles(styles)(Movement);
