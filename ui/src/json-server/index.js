const http = require('http');
const json = require('../../../geojson-files/LGA_GeoData.json');
const statResult = require('../../../analysis/output/stat_area.json');
const favoriteResult = require('../../../analysis/output/agg_favorite_cat.json');

const port = 3001;

http
  .createServer((req, res) => {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
      'Access-Control-Max-Age': 2592000 // 30 days
      /** add other headers as per requirement */
    };

    if (req.method === 'OPTIONS') {
      res.writeHead(204, headers);
      res.end();
      return;
    }

    if (['GET', 'POST'].indexOf(req.method) > -1) {
      res.writeHead(200, headers);

      if (req.url === '/') {
        res.end(JSON.stringify(json));
      } else if (req.url === '/agg-fav') {
        res.end(JSON.stringify(favoriteResult));
      } else {
        res.end(JSON.stringify(statResult));
      }

      return;
    }

    res.writeHead(405, headers);
    res.end(`${req.method} is not allowed for the request.`);
  })
  .listen(port);
