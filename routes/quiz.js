const express = require('express')
const quizController = require('../controllers/quizController')

const router = express.Router()

// GET request to display quiz home.
router.get('/', quizController.quiz_home_get)

// Reset user variables and start quiz if user is logged in.
router.get('/quiz-start', quizController.quiz_start_get)

// GET request to display quiz home.
router.get('/quiz', quizController.quiz_display_get)

// GET request to display quizzes
// router.get('/quiz', quizController.quiz_display_get);

// POST request to handle quiz response.
router.post('/quiz', quizController.quiz_response_post)

module.exports = router
