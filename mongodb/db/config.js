// module.exports = {
//     url: 'mongodb://localhost:27017/node-express-api'
// }

/* eslint-disable max-len */
// Load Dependencies
const assert = require('assert');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment settings using dotenv
assert('./.env', '.env File is required at the root directory, see ".env.example"');
dotenv.config('../.env');
const {
  DB_URL,
  DB_INIT,
} = process.env;

// Validate config options are present from .env
assert(DB_URL, 'DB_PATH configuration is required.');

// Load DB Configuration
// SQLite config
const db = mongoose.connect(DB_URL, { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
  console.log('Successfully connected to the database');
}).catch(err => {
  console.log('Could not connect to the database.', err);
  process.exit();
});

// Load DB Models from files
const DataFeedModel = require('../models/data_feed');

// Build Model Objects from model files
const data_feed = DataFeedModel(db, mongoose);


// Export the models so that they may be consumed by controller
module.exports = [
  data_feed,
];

// // Create/Update DB layout from models
// if (DB_INIT === 'force') {
//   // With Force: true set this will be destructive and remove all existing data.  USE CAUTION
//   db.sync({
//     force: true,
//   });
// }
// if (DB_INIT === 'true') {
//   // DB Sync (without destruction)
//   db.sync();
// }

// Start the DB
// db
//   .connect()
//   // eslint-disable-next-line no-unused-vars
//   .then(function() {
//     console.log('Database connection is established to: ' + DB_PATH);
//   }, function(err) {
//     console.log('Unable to connect to the database:' + DB_PATH, err);
//   });
module.exports = db;
