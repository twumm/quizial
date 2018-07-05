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

// GET request to change User password.
// router.get('/user/changepassword', user_controller.user_changepassword_get)

// POST request to change User password.
router.post('/user/changepassword', user_controller.user_changepassword_post)

//GET request for forgot password.
router.get('/user/forgot-password', user_controller.user_forgotpassword_get);

//POST request for forgot password.
router.post('/user/forgot-password', user_controller.user_forgotpassword_post);

// GET request to reset password.
router.get('/user/reset/:reset_token', user_controller.user_reset_get);

// POST request to reset password.
router.post('/user/reset/:reset_token', user_controller.user_reset_post);

// GET request log user out.
router.get('/user/logout', user_controller.user_logout_get);

// GET request for user profile.
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
