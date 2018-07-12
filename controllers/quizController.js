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
            .exec(callback);
        })
    },
    user: callback => {
      User.findById(req.user)
        .exec(callback);
    }
  }, (err, results) => {
    if (err) { return next(err);}
    if (results.user.questionsAttemptedCount == 5) {
      return res.render('quiz_result', {user: req.user})
    }
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

// Handle quiz response/display on POST.
exports.quiz_response_post = function(req, res, next) {
  // Save the answer selected by the user.
  let userAnswer = req.body.possibleAnswer;

  // Query for user and question attempted.
  async.parallel({
    user: callback => {
      User.findById(req.user)
      .exec(callback)
    },
    question: callback => {
      Question.findById(req.body.questionID)
      .populate('answer')
      .exec(callback)
    }
  }, (err, results) => {
      if (err) { return next(err); }
      if (results.question.answer.answerCorrect !== userAnswer) {
        results.user.questionsAttempted.push(results.question._id)
        results.user.questionsAttemptedCount++
        results.question.wrongCount++
        /*results.user.save(
          {$push: {questionsAttempted: results.question._id}},
          {$inc: {questionsAttemptedCount: 1}})*/
        results.user.save()
        results.question.save()
        res.redirect('back')
      }
      else if (results.question.answer.answerCorrect === userAnswer) {
        results.user.questionsCorrect.push(results.question._id)
        results.question.usersCorrect.push(results.user._id)
        results.user.questionsAttemptedCount++
        results.question.correctCount++
        results.user.save()
        results.question.save()
        res.redirect('back')
      }
  })
  // console.log(req.body.possibleAnswer)
  // console.log(req.body.questionID)
  // res.redirect('back')
}
