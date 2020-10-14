const DataFeedController = require('../controllers/DataFeedController');
const Joi = require('joi');

const routes = [
  {
    method: 'GET',
    path: '/datafeed/list/all',
    handler: DataFeedController.getAllData,
    options: {
      auth: false,
      description: 'Get all data',
      tags: ['api', 'list'],
    },
  },
  {
    method: 'GET',
    path: '/datafeed/list/nodes',
    handler: DataFeedController.getNodes,
    options: {
      auth: false,
      description: 'Get all data',
      tags: ['api', 'list'],
    },
  },
  {
    method: 'GET',
    path: '/datafeed/list/nodes/platform/{platform}',
    handler: DataFeedController.getNodesByPlatform,
    options: {
      auth: false,
      description: 'Get nodes by platform',
      tags: ['api', 'list'],
      validate: {
        params: Joi.object({
          platform: Joi.string().min(1).required(),
        }),
      },
    },
  },
  {
    method: 'POST',
    path: '/datafeed/add',
    handler: DataFeedController.addData,
    options: {
      auth: false,
      description: 'Get all data',
      tags: ['api', 'update'],
    },
  },
];

module.exports = routes;
