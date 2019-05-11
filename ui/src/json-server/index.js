const express = require('express');
const path = require('path');

const json = require('../../../geojson-files/LGA_GeoData.json');
const statResult = require('../../../analysis/output/stat_area.json');
const favoriteResult = require('../../../analysis/output/agg_favorite_cat.json');

const app = express();
const port = 3001;

app.get('/', (req, res) => res.send(json));
app.get('/agg-fav', (req, res) => res.send(favoriteResult));
app.get('/travel-dest', (req, res) =>
  res.sendFile(`${path.join(__dirname)}/travel-dest.html`)
);
app.get('/stat', (req, res) => res.send(statResult));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
