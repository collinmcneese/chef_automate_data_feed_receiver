// /* eslint-disable max-len */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const feedSchema = new Schema({}, {strict: false}); // Allow for dynamic fields
const Feed = mongoose.model('Feed', feedSchema);
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const express = require('express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Data Feed Receiver API',
      version: '0.0.1',
      description:
        'Simple CRUD API to receive Chef Infra Client node and Chef Automate Data Feed information.',
      license: {
        name: 'Apache-2.0',
        url: 'https://spdx.org/licenses/Apache-2.0.html',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    paths: {
      '/datafeed/get': {
        get: {
          tags: ['Data Feed'],
          responses: {
            200: {},
          },
        },
      },
      '/datafeed/add': {
        post: {
          tags: ['Data Feed'],
          requestBody: {
            content: {
              'application/json': {},
            },
          },
          responses: {
            200: {},
          },
        },
      },
    },
  },
  apis: ['index.js'],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

mongoose
  .connect('mongodb://localhost:27017/datafeed', { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    const app = express();
    app.use(express.json({limit: '50mb'}));
    app.use(express.urlencoded({limit: '50mb', extended: true}));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

    app.post('/datafeed/add', async(req, res) => {
      req.body;
      console.log(req.body);
      const post = new Feed(req.body);
      // TODO: Transform the keys with dots rather than turning off checkKeys
      await post.save({checkKeys: false});
      res.send('ok\n');
    });

    app.get('/datafeed/get', async(req, res) => {
      Feed.find({}).then(function(feed) {
        res.send(feed);
      });
    });

    var server = app.listen(3000, function() {
      var host = server.address().address;
      var port = server.address().port;
      console.log('Example app listening at http://%s:%s', host, port);
    });
  });
