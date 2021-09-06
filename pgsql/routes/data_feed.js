const DataFeedController = require('../controllers/DataFeedController');
const Joi = require('joi');

const handleError = function(request, h, err) {
  throw err;
};

const routes = [
  // Data Feed base routes
  {
    method: 'POST',
    path: '/datafeed/add',
    handler: DataFeedController.addData,
    options: {
      auth: false,
      description: 'Add new data.',
      tags: ['api', 'datafeed'],
      validate: {
        failAction: handleError,
        payload: Joi.allow(''),
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
  // Infra routes
  {
    method: 'GET',
    path: '/datafeed/list/infra/alldata',
    handler: DataFeedController.getAllInfraData,
    options: {
      auth: false,
      description: 'Get all Infra data (demo only, should not be used in live data set)',
      tags: ['api', 'infra'],
    },
  },
  {
    method: 'GET',
    path: '/datafeed/list/infra/node/{name}',
    handler: DataFeedController.getInfraNode,
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
    path: '/datafeed/list/infra/nodes',
    handler: DataFeedController.getInfraNodeList,
    options: {
      auth: false,
      description: 'Get listing of all Infra nodes.',
      tags: ['api', 'infra'],
    },
  },
  {
    method: 'POST',
    path: '/datafeed/list/infra/nodes',
    handler: DataFeedController.getInfraNodeListDetails,
    options: {
      auth: false,
      description: 'Get all Infra data for a list of nodes by name',
      tags: ['api', 'infra'],
      validate: {
        payload: Joi.object({
          node_list: Joi.array().items(Joi.string().min(1).required()),
        }),
      },
    },
  },
  {
    method: 'POST',
    path: '/datafeed/search/infra/attributes',
    handler: () => { return 'Not yet implemented.'; },
    options: {
      auth: false,
      description: 'Search Infra attribute data',
      tags: ['api', 'datafeed'],
      validate: {
        payload: Joi.object(),
      },
    },
  },
  // Compliance routes
  {
    method: 'GET',
    path: '/datafeed/list/compliance/alldata',
    handler: DataFeedController.getAllComplianceData,
    options: {
      auth: false,
      description: 'Get all Compliance data (demo only, should not be used in live data set)',
      tags: ['api', 'compliance'],
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
    path: '/datafeed/list/compliance/nodes',
    handler: DataFeedController.getComplianceNodeList,
    options: {
      auth: false,
      description: 'Get listing of all Compliance nodes.',
      tags: ['api', 'compliance'],
    },
  },
  {
    method: 'POST',
    path: '/datafeed/detail/compliance/nodes',
    handler: DataFeedController.getComplianceDetailsByNodeList,
    options: {
      auth: false,
      description: 'Get detailed Compliance data for a list of nodes by name',
      tags: ['api', 'compliance'],
      validate: {
        payload: Joi.object({
          node_list: Joi.array().items(Joi.string().min(1).required()),
        }),
      },
    },
  },
  {
    method: 'GET',
    path: '/datafeed/detail/compliance/node/{name}',
    handler: DataFeedController.getComplianceDetailsByNode,
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
];

module.exports = routes;
