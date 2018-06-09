const Question = require('../models/question');
const User = require('../models/user');
const Answer = require('../models/answer');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


// Display Question create form on GET.
exports.question_create_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED: Question create get');
}

// Handle Question create on POST.
exports.question_create_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED: Question create post');
}

// Display Question update form on GET.
exports.question_update_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED: Question update get');
}

// Handle Question update on POST.
exports.question_update_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED: Question update post')
}

// Display Question delete on GET.
exports.question_delete_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED: Question delete get');
}

// Handle Question delete on POST.
exports.question_delete_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED: Question delete post');
}