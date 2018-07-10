const Question = require('../models/question');
const User = require('../models/user');
const Answer = require('../models/answer');
const async = require('async');

// Display quiz home on GET.
exports.quiz_home_get = function(req, res, next) {
  res.render('quiz_start', {user: req.user});
}

// Display quiz on GET.
exports.quiz_display_get = function(req, res, next) {
  // res.send('NOT IMPLEMENTED: Quiz display get');
  // Query for questions in the db.

  /*TODO - add questions attempted var(num) to track number of questions
  answered in a session. If number is equal to the quizzes a user is 
  required to take, redirect to results page and reset questions attempted.*/

  async.parallel({
    question: callback => {
      Question.count()
        .exec((err, count) => {
          if (err) {return next(err)}
          let randomQuestionNum = Math.floor(Math.random() * count)
          
          Question.findOne().skip(randomQuestionNum)
            .populate('answer')
            // .limit(1)
            .exec(callback);
            // .then(questions => res.render('quiz_display', {title: 'Quiz here', questions: questions, user: req.user}))
            // .catch(err => res.join(err));
        })
    },
    user: callback => {
      User.findOne({username: req.user.username})
        .exec(callback);
    }
  }, (err, results) => {
    // console.log(results);
    if (err) { return next(err);}
    if (!results.user.questionsAttempted.includes(results.question._id)) {
      res.render('quiz_display', { quiz: results.question, user: req.user})
    }
  })

  /*Question.find()
    .populate('answer')
    .exec()
    .then(questions => res.render('quiz_display', {title: 'Quiz here', questions: questions, user: req.user}))
    .catch(err => res.join(err));*/
}

exports.quiz_response_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED: Quiz display post');
}
