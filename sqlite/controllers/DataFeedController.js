const boom = require('@hapi/boom');
const db = require('../db/sequelize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const data_feed_infra = db.models.df_infra_data_feed;
const data_feed_compliance = db.models.df_compliance_data_feed;

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
    // var rName = req.params.name;
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

exports.getProfileList = async(req) => {
  try {
    var profile_list_raw = await data_feed_compliance.findAll({
      attributes: [
        'profile_name',
      ],
      raw: true,
    });
    var reply = {};
    var profile_list = [];
    for (var profile of profile_list_raw) {
      profile_list.push(profile.profile_name);
    }
    console.log(profile_list);
    function countInArray(array, value) {
      return array.reduce((n, x) => n + (x === value), 0);
    }
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    for (var profile of profile_list.filter(onlyUnique)) {
      reply[profile] = countInArray(profile_list, profile);
    }
    return reply;
  } catch (err) {
    console.log(err);
    throw boom.boomify(err);
  }
};

exports.getProfileListByNode = async(req) => {
  try {
    var reply = await data_feed_compliance.findAll({
      where: {
        name: req.params.name.toLowerCase(),
      },
      attributes: [
        'node_id',
        'platform',
        'name',
        'profile_name',
        'profile_full',
        'profile_status',
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

exports.getProfileDetailsByNode = async(req) => {
  try {
    var reply = await data_feed_compliance.findAll({
      where: {
        name: req.params.name.toLowerCase(),
      },
      attributes: [
        'node_id',
        'platform',
        'name',
        'profile_name',
        'profile_full',
        'profile_status',
        'profile_controls',
        'createdAt',
        'updatedAt',
      ],
    });
    return reply;
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
      // console.log(req.payload.report.profiles);
      for (var profile of req.payload.report.profiles) {
        var rPlatform_name = req.payload.report.platform.name;
        var rNode_name = req.payload.report.node_name.toLowerCase();
        var rProfile_name = profile.name;
        var rProfile_name_full = profile.full;
        var rProfile_controls = profile.controls || [];
        var rProfile_status = profile.status;
        var reply = await data_feed_compliance.findOrCreate({
          where: {
            node_id: req.payload.report.node_id,
            profile_name: profile.name,
          },
          defaults: {
            name: rNode_name,
            platform: rPlatform_name,
            profile_name: rProfile_name,
            profile_full: rProfile_name_full,
            profile_status: rProfile_status,
            profile_controls: JSON.stringify(rProfile_controls),
          },
        });
        // If record was already present (false), run update action
        if (reply[1] === false) {
          await data_feed_compliance.update({
            profile_full: rProfile_name_full,
            profile_status: rProfile_status,
            profile_controls: JSON.stringify(rProfile_controls),
            platform: rPlatform_name,
          },
          {
            where: {
              node_id: req.payload.report.node_id,
              profile_name: profile.name,
            },
          });
        }
      }
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
    var purge_result = [];
    var infra = await data_feed_infra.destroy({
      truncate: true,
    });
    purge_result.push(infra);
    var compliance = await data_feed_compliance.destroy({
      truncate: true,
    });
    purge_result.push(compliance);
    return purge_result;
  } catch (err) {
    console.log(err);
    throw boom.boomify(err);
  }
};
