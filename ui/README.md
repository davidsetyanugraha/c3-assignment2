# UI for Cluster and Cloud Computing, Assignment 2

This UI will be based **heavily** on [OpenLayers](https://openlayers.org). From the [repository](https://github.com/openlayers/openlayers):

> OpenLayers is a high-performance, feature-packed library for creating interactive maps on the web. It can display map tiles, vector data and markers loaded from any source on any web page. OpenLayers has been developed to further the use of geographic information of all kinds. It is completely free, Open Source JavaScript, released under the BSD 2-Clause License.

## Why not [Mapbox](https://www.mapbox.com/).

Because it has less versatility when adding another layer on top of existing map. For example, if we want to add another layer, we need to use its Studio to create the layer before consuming it later. This isn't feasible with our target because the area coordinates will be generated rather dynamically from the combination of AURIN and our semantic analysis result.

## How OpenLayers will help solve our problem

Take this example: [GeoJSON](https://openlayers.org/en/latest/examples/geojson.html). If we want to add a triangle in a certain area, we can just do:

```Javascript
// Define the style for type "Polygon".
'Polygon': new Style({
  stroke: new Stroke({
    color: 'blue',
    lineDash: [4],
    width: 3
  }),
  fill: new Fill({
    color: 'rgba(0, 0, 255, 0.1)'
  })
})

// Draw a Feature of type "Polygon" on the map.
{
  'type': 'Feature',
  'geometry': {
    'type': 'Polygon',
    'coordinates': [[[-5e6, -1e6], [-4e6, 1e6], [-3e6, -1e6]]]
  }
}
```

The `e` in Javascript means multiplying with an exponent base 10. So, `-5e6` equals to `-5000000`. From above example, a triangle will be made between these 3 points:

```Javascript
// This is the bottom-left point.
Point 1: { x: -5000000, y: -1000000 }
// This is the single top point.
Point 2: { x: -4000000, y: 1000000 }
// This is the bottom-right point.
Point 2: { x: -3000000, y: -1000000 }
```

With the same fashion, we can do so make a polygon to a certain area. We just need to give a set of polygon that defines that region. Then, we can just put a set of random colors to color those regions later. We're all good, hopefully.

## Demo

TBD

## What's Used in UI

1. [Create React App](https://github.com/facebook/create-react-app): A tool used to build ReactJS app, without all the hassles configuring build tools, proxy, etc.
2. [ReactJS](https://github.com/facebook/react): A UI library published by Facebook. It is really easy to compose components and combine this with other libraries.
3. [OpenLayers](https://openlayers.org).
4. [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket): if we want to show something like, "Live Classification" and show it immediately on the UI, this can be really helpful. Easy to implement on server-side as well.

## Running

### Prerequisites

1. [Node.js®](https://nodejs.org/en/) LTS version. Create React App is running on top of a Node server for the development, because it's triggering Live Reload on file changes -- and we can set up the proxy as well, which can't be done without a server.
2. [Yarn](https://yarnpkg.com/en/) for package management.

### Getting started

1. In this folder, `yarn` in your CLI.
2. `yarn start` to start the development server.
3. `yarn build` to build everything into an optimized bundle of static page.
