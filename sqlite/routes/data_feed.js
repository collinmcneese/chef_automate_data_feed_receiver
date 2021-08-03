const DataFeedController = require('../controllers/DataFeedController');
const Joi = require('joi');

const routes = [
  {
    method: 'GET',
    path: '/datafeed/list/infra/all',
    handler: DataFeedController.getAllInfraData,
    options: {
      auth: false,
      description: 'Get all data',
      tags: ['api', 'datafeed'],
    },
  },
  {
    method: 'GET',
    path: '/datafeed/list/compliance/all',
    handler: DataFeedController.getAllComplianceData,
    options: {
      auth: false,
      description: 'Get all data',
      tags: ['api', 'datafeed'],
    },
  },
  {
    method: 'GET',
    path: '/datafeed/list/nodes',
    handler: DataFeedController.getNodes,
    options: {
      auth: false,
      description: 'Get node data for all nodes.',
      tags: ['api', 'datafeed'],
    },
  },
  {
    method: 'GET',
    path: '/datafeed/list/node/{name}',
    handler: DataFeedController.getNode,
    options: {
      auth: false,
      description: 'Get all data for a node by name',
      tags: ['api', 'datafeed'],
    },
  },
  {
    method: 'GET',
    path: '/datafeed/list/keys/nodes/{name}',
    handler: DataFeedController.getObjectKeys,
    options: {
      auth: false,
      description: 'Get object keys based on a provided Node name.',
      tags: ['api', 'datafeed'],
      validate: {
        params: Joi.object({
          name: Joi.string().min(1).required(),
        }),
      },
    },
  },
  {
    method: 'GET',
    path: '/datafeed/list/nodes/platform/{platform}',
    handler: DataFeedController.getNodesByPlatform,
    options: {
      auth: false,
      description: 'Get nodes by platform',
      tags: ['api', 'datafeed'],
      validate: {
        params: Joi.object({
          platform: Joi.string().min(1).required(),
        }),
      },
    },
  },
  {
    method: 'POST',
    path: '/datafeed/search/attributes',
    handler: DataFeedController.searchAttributes,
    options: {
      auth: false,
      description: 'Search attributes for filter string',
      tags: ['api', 'datafeed'],
      validate: {
        payload: Joi.object({
          filter: Joi.string(),
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
      description: 'Add new data.',
      tags: ['api', 'datafeed'],
      validate: {
        payload: Joi.object(),
      },
    },
  },
  {
    method: 'DELETE',
    path: '/datafeed/purge',
    handler: DataFeedController.delNodeData,
    options: {
      auth: false,
      description: 'Delete all node data',
      tags: ['api', 'datafeed'],
    },
  },
];

module.exports = routes;
