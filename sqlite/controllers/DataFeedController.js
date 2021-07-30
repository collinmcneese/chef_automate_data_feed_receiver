const boom = require('@hapi/boom');
const db = require('../db/sequelize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const data_feed = db.models.df_data_feed;

exports.getAllData = async() => {
  try {
    var reply = await data_feed.findAll({});
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

exports.getNode = async(req) => {
  try {
    var reply = await data_feed.findAll({
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
    var reply = await data_feed.findAll({
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
    var reply = await data_feed.findOne({
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
    var reply = await data_feed.findAll({
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
    var search = await data_feed.findAll({
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
      var reply = await data_feed.findOrCreate({
        where: {
          node_id: req.payload.attributes.node_id,
        },
        defaults: {
          attributes_normal: JSON.stringify(req.payload.attributes.normal),
          attributes_default: JSON.stringify(req.payload.attributes.default),
          attributes_automatic: JSON.stringify(req.payload.attributes.automatic),
          client_run: JSON.stringify(req.payload.client_run),
          name: req.payload.attributes.automatic.name,
          platform: req.payload.attributes.automatic.platform,
          report: JSON.stringify(req.payload.client_run),
        },
      });
      // If record was already present (false), run update action
      if (reply[1] === false) {
        await data_feed.update({
          attributes_normal: JSON.stringify(req.payload.attributes.normal),
          attributes_default: JSON.stringify(req.payload.attributes.default),
          attributes_automatic: JSON.stringify(req.payload.attributes.automatic),
          client_run: JSON.stringify(req.payload.client_run),
          name: req.payload.attributes.automatic.name,
          platform: req.payload.attributes.automatic.platform,
          report: JSON.stringify(req.payload.client_run),
        },
        {
          where: {
            node_id: req.payload.attributes.node_id,
          },
        });
      }
    } else {
      console.log('No attributes in payload were found');
    };
    return 'success';
  } catch (err) {
    console.log(err);
    throw boom.boomify(err);
  }
};

exports.delNodeData = async() => {
  try {
    var purge = await data_feed.destroy({
      truncate: true,
    });
    return purge;
  } catch (err) {
    console.log(err);
    throw boom.boomify(err);
  }
};
