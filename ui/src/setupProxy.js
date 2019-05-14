// Title: The Seven Deadly Sins in Social Media Case Study in Victoria Cities
// Team Name: Team 14
// Team Members:
//   Dading Zainal Gusti (1001261)
//   David Setyanugraha (867585)
//   Ghawady Ehmaid (983899)
//   Indah Permatasari (929578)
//   Try Ajitiono (990633)

const proxy = require('http-proxy-middleware');

// create-react-app v2 forces us to make this file
// source: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#configuring-the-proxy-manually
module.exports = function(app) {
  const listEndpoints = {
    '/nectar': {
      // We setup dynamic proxy here so we can edit with environment variables.
      target: 'http://172.26.37.235:5984',
      pathRewrite: {
        '/nectar': ''
      },
      changeOrigin: true
    },
    '/local-server': {
      // We setup dynamic proxy here so we can edit with environment variables.
      target: 'http://localhost:3001',
      pathRewrite: {
        '/local-server': ''
      },
      changeOrigin: true
    }
  };

  Object.keys(listEndpoints).forEach(endpoint => {
    app.use(proxy(endpoint, listEndpoints[endpoint]));
  });
};
