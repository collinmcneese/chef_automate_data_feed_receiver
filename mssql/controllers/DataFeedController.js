const boom = require('@hapi/boom');
const db = require('../db/sequelize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const data_feed_infra = db.models.df_infra_data_feed;
const data_feed_compliance = db.models.df_compliance_data_feed;

function ndjsonParse(jsonString) {
  const type = typeof jsonString;
  if (type === 'string') {
    const jsonRows = jsonString.split(/\n|\n\r/).filter(Boolean);
    return jsonRows.map(jsonStringRow => JSON.parse(jsonStringRow));
  }
};

function countInArray(array, value) {
  return array.reduce((n, x) => n + (x === value), 0);
}
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
function controlStatus(control_data) {
  if (control_data.includes('"status":"failed"')) {
    return 'failed';
  } else if (control_data.includes('"status":"passed"')) {
    return 'passed';
  } else if (control_data.includes('"status":"skipped"')) {
    return 'skipped';
  } else {
    return null;
  }
};

async function addData(data) {
  try {
    if (data.attributes) {
      console.log('Chef Infra report sent');
      delete (data.attributes.automatic['json?']);
      var rPlatform = data.attributes.automatic.platform;
      var node_name = data.client_run.node_name;
      var attributes_automatic = {};
      var reply = await data_feed_infra.findOrCreate({
        where: {
          node_id: data.attributes.node_id,
        },
        defaults: {
          attributes_normal: JSON.stringify(data.attributes.normal),
          attributes_default: JSON.stringify(data.attributes.default),
          attributes_automatic: JSON.stringify(attributes_automatic),
          client_run: JSON.stringify(data.client_run),
          name: node_name,
          platform: rPlatform,
        },
      });
      // If record was already present (false), run update action
      if (reply[1] === false) {
        await data_feed_infra.update({
          attributes_normal: JSON.stringify(data.attributes.normal),
          attributes_default: JSON.stringify(data.attributes.default),
          attributes_automatic: JSON.stringify(attributes_automatic),
          client_run: JSON.stringify(data.client_run),
          name: node_name,
          platform: rPlatform,
        },
        {
          where: {
            node_id: data.attributes.node_id,
          },
        });
      };
    };
    if (data.report) {
      console.log('Chef InSpec Compliance report sent');
      for (var profile of data.report.profiles) {
        var rPlatform_name = data.report.platform.name;
        var rNode_name = data.report.node_name;
        var rProfile_name = profile.name;
        var rProfile_name_full = profile.full;
        var rProfile_controls = profile.controls || [];
        var rProfile_status = profile.status;
        // Delete the control code and desc blocks from the object
        for (var control of rProfile_controls) {
          delete control.code;
          delete control.desc;
          var rControl_status_json = JSON.stringify(control.results);
          var rControl_status = controlStatus(rControl_status_json);
          var reply_compliance = await data_feed_compliance.findOrCreate({
            where: {
              node_id: data.report.node_id,
              profile_name: profile.name,
              control_name: control.id,
            },
            defaults: {
              name: rNode_name,
              platform: rPlatform_name,
              profile_name: rProfile_name,
              profile_full: rProfile_name_full,
              profile_status: rProfile_status,
              control_name: control.id,
              control_title: control.title,
              control_status: rControl_status,
              control_results: JSON.stringify(control.results),
              control_waived: control.waived_str,
            },
          });
          // If record was already present (false), run update action
          if (reply_compliance[1] === false) {
            await data_feed_compliance.update({
              profile_full: rProfile_name_full,
              profile_status: rProfile_status,
              control_name: control.id,
              control_title: control.title,
              control_status: rControl_status,
              control_results: JSON.stringify(control.results),
              control_waived: control.waived_str,
              platform: rPlatform_name,
            },
            {
              where: {
                node_id: data.report.node_id,
                profile_name: profile.name,
                control_name: control.id,
              },
            });
          };
        }
      }
    };
  } catch (err) {
    return err;
  }
  return 'success';
}

exports.getAllInfraData = async() => {
  try {
    var reply = await data_feed_infra.findAll({});
    return reply;
  } catch (err) {
    console.log(err);
    throw boom.boomify(err);
  }
};

exports.getInfraNodeRun = async(req) => {
  try {
    var reply = await data_feed_infra.findAll({
      where: {
        name: req.params.name,
      },
    });
    return reply;
  } catch (err) {
    console.log(err);
    throw boom.boomify(err);
  }
};

exports.getInfraNode = async(req) => {
  try {
    var reply = await data_feed_infra.findAll({
      where: {
        name: req.params.name,
      },
    });
    return reply;
  } catch (err) {
    console.log(err);
    throw boom.boomify(err);
  }
};

exports.getInfraNodeList = async() => {
  try {
    var node_list_raw = await data_feed_infra.findAll({
      attributes: [
        'name',
      ],
      raw: true,
    });
    var node_list = [];
    for (var n of node_list_raw) {
      node_list.push(n.name);
    }
    node_list = node_list.filter(function(item, pos) {
      return node_list.indexOf(item) === pos;
    });
    return node_list.sort();
  } catch (err) {
    console.log(err);
    throw boom.boomify(err);
  }
};

exports.getInfraNodeListDetails = async(req) => {
  try {
    var reply = await data_feed_infra.findAll({
      where: {
        name: {
          [Op.in]: req.payload.node_list,
        },
      },
      attributes: [
        'node_id',
        'client_run',
        'platform',
        'name',
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

exports.getAllComplianceData = async() => {
  try {
    var reply = await data_feed_compliance.findAll({});
    return reply;
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
        'profile_full',
      ],
      raw: true,
    });
    var reply = {};
    var profile_list = [];
    for (var profile of profile_list_raw) {
      profile_list.push(profile.profile_name);
    }
    for (var p of profile_list.filter(onlyUnique)) {
      reply[p] = countInArray(profile_list, p);
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
        name: req.params.name,
      },
      group: [
        'node_id',
        'platform',
        'name',
        'profile_name',
        'profile_full',
        'profile_status',
      ],
      attributes: [
        'node_id',
        'platform',
        'name',
        'profile_name',
        'profile_full',
        'profile_status',
      ],
    });
    return reply;
  } catch (err) {
    console.log(err);
    throw boom.boomify(err);
  }
};

exports.getComplianceNodeList = async(req) => {
  try {
    var node_list_raw = await data_feed_compliance.findAll({
      attributes: [
        'name',
      ],
      raw: true,
    });
    var node_list = [];
    for (var n of node_list_raw) {
      node_list.push(n.name);
    }
    node_list = node_list.filter(function(item, pos) {
      return node_list.indexOf(item) === pos;
    });
    return node_list.sort();
  } catch (err) {
    console.log(err);
    throw boom.boomify(err);
  }
};

exports.getComplianceDetailsByNode = async(req) => {
  try {
    var reply = await data_feed_compliance.findAll({
      where: {
        name: req.params.name,
      },
      attributes: [
        'node_id',
        'platform',
        'name',
        'profile_name',
        'profile_full',
        'profile_status',
        'control_name',
        'control_title',
        'control_waived',
        'control_results',
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

exports.getComplianceDetailsByNodeList = async(req) => {
  try {
    var reply = await data_feed_compliance.findAll({
      where: {
        name: {
          [Op.in]: req.payload.node_list,
        },
      },
      attributes: [
        'node_id',
        'platform',
        'name',
        'profile_name',
        'profile_full',
        'profile_status',
        'control_name',
        'control_title',
        'control_waived',
        'control_results',
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

// Data Feed Base Functions
exports.addData = async(req) => {
  const stream = await req.payload;
  const chunks = [];
  for await (let chunk of stream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  const str = buffer.toString('utf-8');
  for (var row of ndjsonParse(str)) {
    await addData(row);
  }
  return 'success';
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
