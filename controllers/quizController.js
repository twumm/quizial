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
