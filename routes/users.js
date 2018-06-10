const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');


// GET request to create a User.
router.get('/user/create', user_controller.user_create_get);

// POST request to create a User.
router.post('/user/create', user_controller.user_create_post);

// GET request to update a User.
router.get('/user/:id/update', user_controller.user_update_get);

// POST request to update a User.
router.post('/user/:id/update', user_controller.user_update_post);

// GET request to delete a User.
router.get('/user/:id/delete', user_controller.user_delete_get);

// POST request to delete a User.
router.post('/user/:id/delete', user_controller.user_delete_post);

module.exports = router;