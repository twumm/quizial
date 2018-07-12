const express = require('express');
const router = express.Router();
const quiz_controller = require('../controllers/quizController');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// GET request to display quiz home.
router.get('/', quiz_controller.quiz_home_get);

// GET request to display quiz.
router.get('/quiz', quiz_controller.quiz_display_get);

// POST request to handle quiz response.
router.post('/quiz', quiz_controller.quiz_response_post);

module.exports = router;
