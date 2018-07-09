const Question = require('../models/question');
const User = require('../models/user');
const Answer = require('../models/answer');

// Display quiz home on GET.
exports.quiz_home_get = function(req, res, next) {
  res.render('quiz_start', {user: req.user});
}

// Display quiz on GET.
exports.quiz_display_get = function(req, res, next) {
  // res.send('NOT IMPLEMENTED: Quiz display get');
  // Query for questions in the db.
  Question.find()
    .populate('answer')
    .exec()
    .then(questions => res.render('quiz_display', {title: 'Quiz here', questions: questions, user: req.user}))
    .catch(err => res.join(err));
}

exports.quiz_display_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED: Quiz display post');
}
