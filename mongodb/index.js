const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const dbConfig = require('./db/config');
const mongoose = require('mongoose');

// app.use(bodyParser({limit: '50mb'}));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse requests of content-type - application/json
app.use(express.json({
  limit: '50mb',
  type: ['application/json', 'application/ndjson'],
  strict: false,
}));
// app.use(express.raw({
//   limit: '50mb',
//   type: '*/*',
//   inflate: true,
// }));

mongoose.Promise = global.Promise;

// define a root/default route
app.get('/', (req, res) => {
  res.json({message: 'Hello World'});
});

// Require Users routes
// const routes = require('./routes/data_feed')
// app.use('/datafeed', routes)
const dataFeedController = require('./controllers/DataFeedController');
app.get('/datafeed', dataFeedController.findAll);
app.post('/datafeed/add', dataFeedController.create);


// listen for requests
app.listen(port, () => {
  console.log(`Node server is listening on port ${port}`);
});
