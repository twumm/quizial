const Question = require('../models/question');
const User = require('../models/user');
const Answer = require('../models/answer');
const async = require('async');

// Display quiz home on GET.
exports.quiz_home_get = function(req, res, next) {
  User.findById(req.user)
    .exec((err, user) => {
      // Reset questions attempted count, score and question attempted array
      // each time user starts the quiz.
      user.questionsAttemptedCount = 0
      user.questionsAttempted = []
      user.score = 0
      user.save()
      res.render('quiz_start', {user: req.user});
    })
  
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
    if (!results.user.questionsAttempted.includes(results.question._id) &&
        !results.user.questionsCorrect.includes(results.question._id)) {
      res.render('quiz_display', { quiz: results.question, user: req.user})
    }
    else {
      res.render(('quiz_result', {user: req.user, error: 'No more questions!'}))
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
        // Add question attempted to user's table.
        results.user.questionsAttempted.push(results.question._id)
        // Track number of questions user has attempted.
        results.user.questionsAttemptedCount++
        // Add user who attempted the question to the question's table.
        results.question.usersAttempted.push(results.user._id)
        // Increment number of wrong attempts on a question.
        results.question.wrongCount++
        // Save the user and question.
        results.user.save()
        results.question.save()
        res.redirect('back')
      }
      else if (results.question.answer.answerCorrect === userAnswer) {
        // Add question answered correctly to user's table to prevent repetition.
        results.user.questionsCorrect.push(results.question._id)
        // Track number of questions user has attempted.
        results.user.questionsAttemptedCount++
        // Increment user's temporary score.
        results.user.score++
        // User answered correctly so add to all time score.
        results.user.allTimeScore++
        // Add users who answered correctly to the question's table.
        results.question.usersCorrect.push(results.user._id)
        // Add user who attempted the question to the question's table.
        results.question.usersAttempted.push(results.user._id)
        // Increment number of correct attempts on a question.
        results.question.correctCount++
        // Save the user and question.
        results.user.save()
        results.question.save()
        res.redirect('back')
      }
  })
  // console.log(req.body.possibleAnswer)
  // console.log(req.body.questionID)
  // res.redirect('back')
}
