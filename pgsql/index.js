/* eslint-disable max-len */

// Load Dependencies
const Hapi = require('@hapi/hapi');
const boom = require('@hapi/boom');
const assert = require('assert');
const dotenv = require('dotenv');
// Swagger dependencies
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

// Load environment settings using dotenv
assert('./.env', '.env File is required at the root directory, see ".env.example"');
dotenv.config();
const {
  API_BIND_PORT,
  API_BIND_IP,
  API_EXTERNAL_HOST,
  API_EXTERNAL_PORT,
} = process.env;

// Validate config options are present from .env
assert(API_BIND_PORT, 'API_BIND_PORT configuration is required.');
assert(API_BIND_IP, 'API_BIND_IP configuration is required.');

// Launch HAPI server
(async() => {
  const server = await new Hapi.Server({
    host: API_BIND_IP,
    port: API_BIND_PORT,
    routes: {
      cors: true,
    },
  });
  // Configure HAPI base logging
  server.events.on('log', (event, tags) => {
    if (tags.error) {
      console.log(`Server error: ${event.error ? event.error.message : 'unknown'}`);
    }
  });

  // Stubbing a local user here for local dev purposes.
  const users = {
    df: {
      username: 'df',
      password: 'df',
      name: 'data_feed',
      id: '1',
    },
  };

  const validate = async(request, username, password) => {
    var user = users[username];
    if (!user) {
      return { credentials: null, isValid: false };
    }
    var isValid = true;
    var credentials = { id: user.id, name: user.name };
    return { isValid, credentials };
  };

  await server.register(require('@hapi/basic'));
  server.auth.strategy('simple', 'basic', { validate });

  // Configure Swagger
  const swaggerOptions = {
    info: {
      title: 'DataFeed API',
      // eslint-disable-next-line no-multi-str
      description: 'Swagger Documentation for Data Feed API which \
      consumes and serves data sent from Chef Automate Data Feed \r\n',
      version: Pack.version,
    },
    tags: [
      {
        name: 'infra',
        description: 'Endpoints for interacting with stored Chef Infra data.',
      },
      {
        name: 'compliance',
        description: 'Endpoints for interacting with stored Chef InSpec compliance data.',
      },
      {
        name: 'datafeed',
        description: 'Endpoints for loading data to API.',
      },
    ],
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
    grouping: 'tags',
    sortEndpoints: 'ordered',
    host: API_EXTERNAL_HOST + ':' + API_EXTERNAL_PORT,
    validatorUrl: null,
    schemes: ['http', 'https'],
    consumes: ['application/json', 'application/ndjson', 'application/jsonl', 'application/x-ndjson'],
    produces: ['application/json'],
  };
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  // Process routes
  const routes = require('./routes');
  routes.forEach((route) => {
    server.route(route);
  });

  // Launch Server
  try {
    await server.start();
    console.log('Server running at:', server.info.uri);
    console.log('Check out the API Documentation page:', server.info.uri + '/documentation');
  } catch (err) {
    console.log(err);
    boom.boomify(err);
  }
})();
