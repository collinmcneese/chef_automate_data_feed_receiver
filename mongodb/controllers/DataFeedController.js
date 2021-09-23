const Feed = require('../models/data_feed');
const ndjson = require('ndjson');
const ndjsonParse = require('ndjson-parse');

exports.findAll = async(req, res) => {
  Feed.find()
    .then(users => {
      res.send(users);
    }).catch(err => {
      res.status(500).send({
        message: err.message || 'Something went wrong while getting list of users.',
      });
    });
};

exports.create = async(req, res) => {
  if (!req.body) {
    console.log('No Body Sent');
    console.log(req);
    return res.status(400).send({
      message: 'Please fill all required field',
    });
  }

  //   async () => {
  var feed = {};
  if (req.body.attributes) {
    console.log('Chef Infra report sent');
    console.log(Object.keys(req.body));
    feed = new Feed({
      attributes_normal: req.body.attributes.normal,
      attributes_default: req.body.attributes.default,
      // attributes_automatic: req.body.attributes.automatic,
      client_run: req.body.client_run,
      name: req.body.attributes.automatic.name,
      platform: req.body.attributes.automatic.platform,
      report: req.payload.client_run,
    });
  } else if (req.body.report) {
    console.log('Compliance Only Report Sent');
    console.log(Object.keys(req.body));
    feed = new Feed({
      // data: req.body
      node: req.body.node,
      report: req.payload.client_run,
    });
  } else {
    console.log('No Infra Report or Compliance Scan');
    // feed = new Feed(ndjson.parse(req.body));
    feed = new Feed(req.body);
    console.log(ndjsonParse(req.body));
    // console.log(ndjson.parse(req));
    // console.log(ndjsonParse(req.body));
    // ndjson.parse(req.body)
    //   .on('data', function(data) {
    //     console.log(data);
    //   });
    // var body_array = ndjsonParse(req.body);
    // console.log(body_array[0]);
  }

  await feed.save()
    .then(data => {
      res.send(data);
    }).catch(err => {
      res.status(500).send({
        message: err.message || 'Something went wrong while creating new user.',
      });
    });
};


// exports.findOne = (req, res) => {
//   User.findById(req.params.id)
//     .then(user => {
//       if (!user) {
//         return res.status(404).send({
//           message: 'User not found with id ' + req.params.id,
//         });
//       }
//       res.send(user);
//     }).catch(err => {
//       if (err.kind === 'ObjectId') {
//         return res.status(404).send({
//           message: 'User not found with id ' + req.params.id,
//         });
//       }
//       return res.status(500).send({
//         message: 'Error getting user with id ' + req.params.id,
//       });
//     });
// };

// exports.update = (req, res) => {
//   // Validate Request
//   if (!req.body) {
//     return res.status(400).send({
//       message: 'Please fill all required field',
//     });
//   }
//   // Find user and update it with the request body
//   User.findByIdAndUpdate(req.params.id, {
//     first_name: req.body.first_name,
//     last_name: req.body.last_name,
//     email: req.body.last_name,
//     phone: req.body.last_name,
//   }, {
//     new: true,
//   })
//     .then(user => {
//       if (!user) {
//         return res.status(404).send({
//           message: 'user not found with id ' + req.params.id,
//         });
//       }
//       res.send(user);
//     }).catch(err => {
//       if (err.kind === 'ObjectId') {
//         return res.status(404).send({
//           message: 'user not found with id ' + req.params.id,
//         });
//       }
//       return res.status(500).send({
//         message: 'Error updating user with id ' + req.params.id,
//       });
//     });
// };

// exports.delete = (req, res) => {
//   User.findByIdAndRemove(req.params.id)
//     .then(user => {
//       if (!user) {
//         return res.status(404).send({
//           message: 'user not found with id ' + req.params.id,
//         });
//       }
//       res.send({
//         message: 'user deleted successfully!',
//       });
//     }).catch(err => {
//       if (err.kind === 'ObjectId' || err.name === 'NotFound') {
//         return res.status(404).send({
//           message: 'user not found with id ' + req.params.id,
//         });
//       }
//       return res.status(500).send({
//         message: 'Could not delete user with id ' + req.params.id,
//       });
//     });
// };
