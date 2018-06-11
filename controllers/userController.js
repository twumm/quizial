const User = require('../models/user');
const Question = require('../models/question');

const { body, validationResult } = require('express-validator/check/');
const sanitizeBody = require('express-validator/filter');


// Display User signup form on GET.
exports.user_signup_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED: User signup get');
}

// Handle User signup on POST.
exports.user_signup_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED: User signup post');
}

// Display User create form on GET.
exports.user_signin_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED: User signin get');
}

// Handle User create on POST.
exports.user_signin_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED: User signin post');
}

// Display User update form on GET.
exports.user_update_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED: User update get');
}

// Handle User update on POST.
exports.user_update_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED: User update post')
}

// Display User delete on GET.
exports.user_delete_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED: User delete get');
}

// Handle User delete on POST.
exports.user_delete_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED: User delete post');
}