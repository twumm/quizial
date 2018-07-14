const Question = require('../models/question');
const User = require('../models/user');
const Answer = require('../models/answer');
const async = require('async');
const {containsObject} = require('../custom-functions/custom')

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
    questions_count: callback => {
      Question.count()
        .exec({}, callback)
    },
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
      console.log(results.questions_count)
      return res.render('quiz_result', {user: req.user})
    }
    else if (containsObject(results.question._id, results.user.questionsAttempted))
    {
      console.log(`In attempted questions: Question id: ${results.question._id}`)
      console.log(`In if: Is question already answered: ${containsObject(results.question._id, results.user.questionsCorrect)}`)
      console.log(`In if: Is question already attempted: ${containsObject(results.question._id, results.user.questionsAttempted)}`)
      // res.render('quiz_result', {user: req.user, error: 'No more questions!'})
      res.redirect('back')
    }
    else if (containsObject(results.question._id, results.user.questionsCorrect))
    {
      console.log(`In questions correct: Question id: ${results.question._id}`)
      console.log(`In if: Is question already answered: ${containsObject(results.question._id, results.user.questionsCorrect)}`)
      console.log(`In if: Is question already attempted: ${containsObject(results.question._id, results.user.questionsAttempted)}`)
      res.redirect('back')
    }
    else {
      // console.log(`Questions answered correctly by user: ${results.user.questionsCorrect}`)
      // console.log(`Question id we are currently at: ${typeof(results.user.questionsCorrect[0])}`)
      // console.log(`Question id we are currently at is: ${results.user.questionsCorrect[0]}`)
      // console.log(`Question id we are currently at: ${typeof(results.question._id)}`)
      // console.log(`Question id we are currently at(last): ${results.question._id}`)
      // console.log(`Is question already in questions answered correctly? ${results.user.questionsCorrect.some(results.question._id)}`)
      // containsObject(results.question._id, results.user.questionsAttempted)
      console.log(`In else: Question id: ${results.question._id}`)
      console.log(`In else: Is question already answered: ${containsObject(results.question._id, results.user.questionsCorrect)}`)
      console.log(`In else: Is question already attempted: ${containsObject(results.question._id, results.user.questionsAttempted)}`)
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
}
