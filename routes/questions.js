const express = require('express')
const questionController = require('../controllers/questionController')
const { requiresLogin } = require('../middleware/custom')

const router = express.Router()

// / QUESTION ROUTES ///

// GET request to create a Question.
router.get('/question/create', requiresLogin, questionController.question_create_get)

// POST request to create a Question.
router.post('/question/create', requiresLogin, questionController.question_create_post)

// GET request to update a Question.
router.get('/question/:id/update', requiresLogin, questionController.question_update_get)

// POST request to update a Question.
router.post('/question/:id/update', requiresLogin, questionController.question_update_post)

// GET request to delete a Question.
router.get('/question/:id/delete', requiresLogin, questionController.question_delete_get)

// POST request to update a Question.
router.post('/question/:id/delete', requiresLogin, questionController.question_delete_post)

module.exports = router
