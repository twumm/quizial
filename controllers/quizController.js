const _ = require('underscore')
const async = require('async')

const Question = require('../models/question')
const User = require('../models/user')
const Answer = require('../models/answer')
const { containsObject } = require('../custom-functions/custom')


// Display quiz home on GET.
exports.quiz_home_get = (req, res) => {
  res.render('quiz_home', { user: req.user })
}
/**
 * TODO
 * Clicking on start quiz that not reset questions answered variable.
 * How to resolve this?
 * Maybe switch buttons to reset or start quiz based on questionsAttemptedCount
 */

exports.quiz_start_get = (req, res, next) => {
  if (!req.user) {
    req.flash('info', 'Please sign in to play')
    res.redirect('back')
  } else {
    User.findById(req.user)
      .exec((err, user) => {
      // Reset questions attempted count, score and question attempted array
      // each time user starts the quiz.
        if (err) { return next(err) }

        user.questionsAttemptedCount = 0
        user.questionsAttempted = []
        user.lastScore = user.score
        user.score = 0
        user.save()
        res.redirect('/quiz')
        // next()
      })
  }
}

// Display quiz on GET.
exports.quiz_display_get = (req, res, next) => {
  // res.send('NOT IMPLEMENTED: Quiz display get');
  // Query for questions in the db.

  /* TODO - add questions attempted var(num) to track number of questions
  answered in a session. If number is equal to the quizzes a user is
  required to take, redirect to results page and reset questions attempted. */

  async.parallel({
    questions_count: (callback) => {
      Question.count()
        .exec({}, callback)
    },
    question: (callback) => {
      Question.count()
        .exec((err, count) => {
          if (err) { return next(err) }
          const randomQuestionNum = Math.floor(Math.random() * count)

          Question.findOne().skip(randomQuestionNum)
            .populate('answer')
            .exec(callback)
        })
    },
    user: (callback) => {
      User.findById(req.user)
        .exec(callback)
    },
  }, (err, results) => {
    if (err) { return next(err) }
    // If the user has attempted maximum questions, display results.
    if (results.user.questionsAttemptedCount === 5) {
      res.render('quiz_result', { user: req.user })
    }
    // If the current question has already been attempted, do not display.
    // Redirect to show different question.
    else if (containsObject(results.question._id, results.user.questionsAttempted)
            || containsObject(results.question._id, results.user.questionsPosted)) {
      res.redirect('back')
    }
    // If the question exists in the questions user has answered correct, and
    // the user has answered all questions in the db, inform user quiz is empty.
    else if (containsObject(results.question._id, results.user.questionsCorrect)
            && _.size(results.user.questionsCorrect) == results.questions_count) {
      req.flash('info', 'Woohoo! You have answered all questions. Reset to start over again')
      res.render('quiz_result', { user: req.user, quiz_completed: true })
    }
    // If quiz has already been answered correctly, display new question.
    else if (containsObject(results.question._id, results.user.questionsCorrect)) {
      res.render('quiz_display', { quiz: results.question, user: req.user })
    }
    // Display quiz if the question has not been answered or attempted.
    else {
      res.render('quiz_display', { quiz: results.question, user: req.user })
    }
  })

  /* Question.find()
    .populate('answer')
    .exec()
    .then(questions => res.render('quiz_display', {title: 'Quiz here', questions: questions, user: req.user}))
    .catch(err => res.join(err)); */
}

// Handle quiz response/display on POST.
exports.quiz_response_post = (req, res, next) => {
  // Save the answer selected by the user.
  const userAnswer = req.body.possibleAnswer

  // Query for user and question attempted.
  async.parallel({
    user: (callback) => {
      User.findById(req.user)
        .exec(callback)
    },
    question: (callback) => {
      Question.findById(req.body.questionID)
        .populate('answer')
        .exec(callback)
    },
  }, (err, results) => {
    if (err) { return next(err) }
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
    } else if (results.question.answer.answerCorrect === userAnswer) {
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
