const Question = require('../models/question');
const User = require('../models/user');
const Answer = require('../models/answer');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const async = require('async');


// Display Question create form on GET.
exports.question_create_get = function(req, res, next) {
  res.render('question_form', { title: 'Create a question' });
  // res.send('NOT IMPLEMENTED: Question create get');
}

// Handle Question create on POST.
exports.question_create_post = [
  // Validate input fields.
  body('question', 'Question must not be empty').isLength({ min: 1 }).trim(),
  body('correctOption', 'Correct answer must not be empty').isLength({ min: 1 }).trim(),
  body('wrongOptionOne', 'Wrong answer must not be empty').isLength({ min: 1 }).trim(),
  body('wrongOptionTwo', 'Wrong answer must not be empty').isLength({ min: 1 }).trim(),
  body('wrongOptionThree', 'Wrong answer must not be empty').isLength({ min: 1 }).trim(),

  // Sanitize values using wildcard.
  sanitizeBody('*'),

  // Process request.
  (req, res, next) => {
    // Store errors from validation, if any.
    const errors = validationResult(req);

    // Create answer variable for correct answer.
    const answer = new Answer({
      answerCorrect: req.body.correctOption,
      answerOption: [req.body.correctOption, req.body.wrongOptionOne,
        req.body.wrongOptionTwo, req.body.wrongOptionThree
      ]
    });

    // Create question variable to contain question from the form.
    const question = new Question({
      question: req.body.question,
      answer: answer._id
    });

    // If there are errors, render form with values.
    if (!errors.isEmpty()) {
      res.render('question_form', { title: 'Please check for errors', question: question, answers: answer, errors: errors });
    } else {
      async.series({
        save_question: function(callback) {
          question.save(callback);
        },
        save_answer: function(callback) {
          answer.save(callback);
        }
      }, function(err, callback) {
        if (err) { return next(err); }
        return res.redirect('/');
      })
    }
  }
]

/*function(req, res, next) {
  res.send('NOT IMPLEMENTED: Question create post');
}*/

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
