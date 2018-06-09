const express = require('express');
const router = express.Router();
const question_controller = require('../controllers/questionController');

/// QUESTION ROUTES ///

// GET request to create a Question.
router.get('/question/create', question_controller.question_create_get);

// POST request to create a Question.
router.post('/question/create', question_controller.question_create_post);

// GET request to update a Question.
router.get('/question/:id/update', question_controller.question_update_get);

// POST request to update a Question.
router.post('/question/:id/update', question_controller.question_update_post);

// GET request to delete a Question.
router.get('/question/:id/delete', question_controller.question_delete_get);

// POST request to update a Question.
router.post('/question/:id/delete', question_controller.question_delete_post);

module.exports = router;