const Os = require('os');

var healthStatusObject = {
  status: 'OK',
  server: Os.hostname(),
};

// non-api route entries
const defaultroutes = [
  // Base route to validate server is up
  {
    method: 'GET',
    path: '/',
    handler: () => {
      return 'Server Is Online.';
    },
    options: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/health',
    handler: () => {
      return healthStatusObject;
    },
    options: {
      description: 'Health Check Page',
      tags: ['api', 'health'],
      auth: 'simple',
    },
  },
];

// Export the routes back to the app
const data_feed = require('./data_feed');

module.exports = [].concat(
  defaultroutes,
  data_feed,
);
