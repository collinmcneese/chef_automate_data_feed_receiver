/* eslint-disable max-len */
// Load Dependencies
const assert = require('assert');
const dotenv = require('dotenv');
const {
  Sequelize,
} = require('sequelize');

// Load environment settings using dotenv
assert('./.env', '.env File is required at the root directory, see ".env.example"');
dotenv.config('../.env');
const {
  DB_PATH,
  DB_INIT,
  DB_HOST,
  DB_USER,
  DB_NAME,
  DB_PASSWORD,
} = process.env;

// Validate config options are present from .env
assert(DB_PATH, 'DB_PATH configuration is required.');

// Load DB Configuration
// Example connection using MSSQL
const db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mssql',
  dialectOptions: {
    authentication: {
      // Uncomment this section to use NTLM authentication rather than SQL authentication.
      // type: 'ntlm',
      // options: {
      //   domain: process.env.DB_DOMAIN,
      //   userName: process.env.DB_USER,
      //   password: process.env.DB_PASSWORD,
      // },
    },
    options: {
      encrypt: true,
      instanceName: process.env.DB_INSTANCE,
      trustedConnection: true,
      validateBulkLoadParameters: true,
    },
  },
  pool: {
    max: 100,
    min: 1,
    acquire: 30000,
    idle: 2000,
  },
  logging: false,
});

// Load DB Models from files
const DataFeedInfraModel = require('../models/infra_data_feed');
const DataFeedComplianceModel = require('../models/compliance_data_feed');

// Build Model Objects from model files
const data_feed_infra = DataFeedInfraModel(db, Sequelize);
const data_feed_compliance = DataFeedComplianceModel(db, Sequelize);


// Export the models so that they may be consumed by controller
module.exports = [
  data_feed_infra,
  data_feed_compliance,
];

// Create/Update DB layout from models
if (DB_INIT === 'force') {
  // With Force: true set this will be destructive and remove all existing data.  USE CAUTION
  db.sync({
    force: true,
  });
}
if (DB_INIT === 'true') {
  // DB Sync (without destruction)
  db.sync();
}

// Start the DB
db
  .authenticate()
  // eslint-disable-next-line no-unused-vars
  .then(function() {
    console.log('Database connection is established to: ' + DB_HOST);
  }, function(err) {
    console.log('Unable to connect to the database:' + DB_HOST, err);
  });
module.exports = db;
