const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');


// GET request to signup a User.
router.get('/user/signup', user_controller.user_signup_get);

// POST request to signup a User.
router.post('/user/signup', user_controller.user_signup_post);

// GET request to signin a User.
router.get('/user/signin', user_controller.user_signin_get);

// POST request to signin a User.
router.post('/user/signin', user_controller.user_signin_post);

// GET request for one user.
router.get('/user/:username', user_controller.user_profile);

// GET request to update a User.
router.get('/user/:id/update', user_controller.user_update_get);

// POST request to update a User.
router.post('/user/:id/update', user_controller.user_update_post);

// GET request to delete a User.
router.get('/user/:id/delete', user_controller.user_delete_get);

// POST request to delete a User.
router.post('/user/:id/delete', user_controller.user_delete_post);

module.exports = router;