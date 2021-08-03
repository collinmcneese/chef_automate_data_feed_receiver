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
      tags: ['api', 'infra'],
    },
  },
  {
    method: 'GET',
    path: '/datafeed/list/compliance/all',
    handler: DataFeedController.getAllComplianceData,
    options: {
      auth: false,
      description: 'Get all data',
      tags: ['api', 'compliance'],
    },
  },
  {
    method: 'GET',
    path: '/datafeed/list/nodes',
    handler: DataFeedController.getNodes,
    options: {
      auth: false,
      description: 'Get node data for all nodes.',
      tags: ['api', 'infra'],
    },
  },
  {
    method: 'GET',
    path: '/datafeed/list/node/{name}',
    handler: DataFeedController.getNode,
    options: {
      auth: false,
      description: 'Get all Infra data for a node by name',
      tags: ['api', 'infra'],
      validate: {
        params: Joi.object({
          name: Joi.string().min(1).required(),
        }),
      },
    },
  },
  {
    method: 'GET',
    path: '/datafeed/list/compliance/profiles',
    handler: DataFeedController.getProfileList,
    options: {
      auth: false,
      description: 'Get listing of all profiles within Compliance data',
      tags: ['api', 'compliance'],
    },
  },
  {
    method: 'GET',
    path: '/datafeed/list/compliance/profiles/node/{name}',
    handler: DataFeedController.getProfileListByNode,
    options: {
      auth: false,
      description: 'Get all Compliance data for a node by name',
      tags: ['api', 'compliance'],
      validate: {
        params: Joi.object({
          name: Joi.string().min(1).required(),
        }),
      },
    },
  },
  {
    method: 'GET',
    path: '/datafeed/details/compliance/profiles/node/{name}',
    handler: DataFeedController.getProfileDetailsByNode,
    options: {
      auth: false,
      description: 'Get detailed Compliance data for a node by name, including Control data',
      tags: ['api', 'compliance'],
      validate: {
        params: Joi.object({
          name: Joi.string().min(1).required(),
        }),
      },
    },
  },
  {
    method: 'GET',
    path: '/datafeed/list/keys/nodes/{name}',
    handler: DataFeedController.getObjectKeys,
    options: {
      auth: false,
      description: 'Get object keys based on a provided Node name.',
      tags: ['api', 'infra'],
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
      tags: ['api', 'infra'],
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
