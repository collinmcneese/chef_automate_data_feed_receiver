const boom = require('@hapi/boom');
const db = require('../db/sequelize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const data_feed_infra = db.models.df_data_feed_infra;
const data_feed_compliance = db.models.df_data_feed_compliance;

exports.getAllInfraData = async() => {
  try {
    var reply = await data_feed_infra.findAll({});
    // var response = [];
    // for (var object of reply) {
    //   var objectClientRun = strip_json_string(object.client_run);
    //   var objectAttributes = JSON.parse(strip_json_string(object.attributes));
    //   var respObject = {
    //     node_id: reply.node_id,
    //     client_run: JSON.parse(objectClientRun),
    //     normal_attributes: objectAttributes.normal,
    //     default_attributes: objectAttributes.default,
    //     automatic_attributes: objectAttributes.automatic,
    //     created: object.createdAt,
    //     updated: object.updatedAt,
    //   };
    //   response.push(respObject);
    // };
    return reply;
  } catch (err) {
    console.log(err);
    throw boom.boomify(err);
  }
};

exports.getAllComplianceData = async() => {
  try {
    var reply = await data_feed_compliance.findAll({});
    return reply;
  } catch (err) {
    console.log(err);
    throw boom.boomify(err);
  }
};

exports.getNodeRun = async(req) => {
  try {
    var rName = req.params.name;
    var reply = await data_feed_infra.findAll({
      where: {
        name: req.params.name.toLowerCase(),
      },
    });
    return reply;
  } catch (err) {
    console.log(err);
    throw boom.boomify(err);
  }
};

exports.getNode = async(req) => {
  try {
    var reply = await data_feed_infra.findAll({
      where: {
        name: req.params.name.toLowerCase(),
      },
    });
    return reply;
  } catch (err) {
    console.log(err);
    throw boom.boomify(err);
  }
};

exports.getNodes = async() => {
  try {
    var reply = await data_feed_infra.findAll({
      attributes: [
        'node_id',
        // 'client_run',
        'platform',
        'name',
        'createdAt',
        'updatedAt',
      ],
    });
    // console.log(Object.keys(reply[0].dataValues))
    return reply;
  } catch (err) {
    console.log(err);
    throw boom.boomify(err);
  }
};

exports.getObjectKeys = async(req) => {
  try {
    var rName = req.params.name;
    var reply = await data_feed_infra.findOne({
      where: {
        name: {
          [Op.like]: rName,
        },
      },
    });
    console.log(Object.keys(reply.dataValues));
    return Object.keys(reply.dataValues);
  } catch (err) {
    console.log(err);
    throw boom.boomify(err);
  }
};

exports.getNodesByPlatform = async(req) => {
  try {
    var reply = await data_feed_infra.findAll({
      attributes: [
        'node_id',
        'name',
        'platform',
        ['createdAt', 'created'],
        ['updatedAt', 'updated'],
      ],
      where: {
        platform: {
          [Op.like]: req.params.platform,
        },
      },
      raw: true,
    });
    return reply;
  } catch (err) {
    console.log(err);
    throw boom.boomify(err);
  }
};

// Search attributes for a key or a key/value pair
exports.searchAttributes = async(req) => {
  try {
    var rFilter = req.payload.filter;
    // Find a key only and return all the values
    var search = await data_feed_infra.findAll({
      attributes: [
        'node_id',
        'name',
        'platform',
        ['createdAt', 'created'],
        ['updatedAt', 'updated'],
      ],
      where: {
        [Op.or]: [
          {attributes_automatic: {[Op.like]: rFilter}},
          {attributes_normal: {[Op.like]: rFilter}},
          {attributes_default: {[Op.like]: rFilter}},
        ],
      },
      raw: true,
    });
    // search.forEach(data => {
    //   console.log(Object.keys(data))
    //   console.log(Object.keys(data.attributes_normal))
    //   // console.log(data)
    // });
    return search;
  } catch (err) {
    console.log(err);
    throw boom.boomify(err);
  }
};

exports.addData = async(req) => {
  try {
    if (req.payload.attributes) {
      delete (req.payload.attributes.automatic['json?']);
      console.log(req.payload);
      var rPlatform = req.payload.attributes.automatic.platform;
      var node_name = req.payload.client_run.node_name;
      var attributes_automatic = {};
      var reply = await data_feed_infra.findOrCreate({
        where: {
          node_id: req.payload.attributes.node_id,
        },
        defaults: {
          attributes_normal: JSON.stringify(req.payload.attributes.normal),
          attributes_default: JSON.stringify(req.payload.attributes.default),
          attributes_automatic: JSON.stringify(attributes_automatic),
          client_run: JSON.stringify(req.payload.client_run),
          name: node_name,
          platform: rPlatform,
        },
      });
      // If record was already present (false), run update action
      if (reply[1] === false) {
        await data_feed_infra.update({
          attributes_normal: JSON.stringify(req.payload.attributes.normal),
          attributes_default: JSON.stringify(req.payload.attributes.default),
          attributes_automatic: JSON.stringify(attributes_automatic),
          client_run: JSON.stringify(req.payload.client_run),
          name: node_name,
          platform: rPlatform,
        },
        {
          where: {
            node_id: req.payload.attributes.node_id,
          },
        });
      }
    } else if (req.payload.report) {
      console.log('Compliance-only report sent');
      console.log(req.payload);
    } else {
      console.log('No report or attributes in payload were found');
      console.log(req.payload);
    };
    return 'success';
  } catch (err) {
    console.log(err);
    throw boom.boomify(err);
  }
};

exports.delNodeData = async() => {
  try {
    var purge = await data_feed_infra.destroy({
      truncate: true,
    });
    return purge;
  } catch (err) {
    console.log(err);
    throw boom.boomify(err);
  }
};
