const express = require('express');
const router = express.Router();
const dataFeedController = require('../controllers/data_feed');
// Retrieve all users
router.get('/get', dataFeedController.findAll);
// Create a new user
router.post('/add', dataFeedController.create);
// Retrieve a single user with id
router.get('/:id', dataFeedController.findOne);
// Update a user with id
router.put('/:id', dataFeedController.update);
// Delete a user with id
router.delete('/:id', dataFeedController.delete);
module.exports = router;
