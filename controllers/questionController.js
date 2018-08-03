const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')
const async = require('async')

const Question = require('../models/question')
const User = require('../models/user')
const Answer = require('../models/answer')


// Display Question create form on GET.
exports.question_create_get = (req, res) => {
  res.render('question_form', { title: 'Create a question', user: req.user })
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
    const errors = validationResult(req)

    // Create answer variable for correct answer.
    const answer = new Answer({
      answerCorrect: req.body.correctOption.toLowerCase(),
      answerOption: [req.body.correctOption.toLowerCase(),
        req.body.wrongOptionOne.toLowerCase(),
        req.body.wrongOptionTwo.toLowerCase(),
        req.body.wrongOptionThree.toLowerCase(),
      ],
    })

    // Create question variable to contain question from the form.
    const question = new Question({
      question: req.body.question.toLowerCase(),
      answer: answer._id,
      submittedBy: req.user ? req.user._id : undefined,
    })

    // Query for user and save the question id to the user table.


    // If there are errors, render form with values.
    if (!errors.isEmpty()) {
      res.render('question_form', {
        title: 'Please check for errors', question, answers: answer, errors,
      })
    } else {
      async.series({
        save_question(callback) {
          question.save(callback)
        },
        save_answer(callback) {
          answer.save(callback)
        },
        save_user_question(callback) {
          User.findById(req.user.id)
            .exec((err, user) => {
              user.questionsPosted.push(question._id)
              user.save(callback)
            })
        },
      }, (err, callback) => {
        if (err) { return next(err) }
        req.flash('success', `Question: '${question.question}' has been successfully added!`)
        return res.redirect('/')
      })
    }
  },
]

/* function(req, res, next) {
  res.send('NOT IMPLEMENTED: Question create post');
} */

// Display Question update form on GET.
exports.question_update_get = (req, res, next) => {
  res.send('NOT IMPLEMENTED: Question update get')
}

// Handle Question update on POST.
exports.question_update_post = (req, res, next) => {
  res.send('NOT IMPLEMENTED: Question update post')
}

// Display Question delete on GET.
exports.question_delete_get = (req, res, next) => {
  res.send('NOT IMPLEMENTED: Question delete get')
}

// Handle Question delete on POST.
exports.question_delete_post = (req, res, next) => {
  res.send('NOT IMPLEMENTED: Question delete post')
}
