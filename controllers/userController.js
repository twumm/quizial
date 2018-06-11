const User = require('../models/user');
const Question = require('../models/question');

const { body, validationResult } = require('express-validator/check/');
const { sanitizeBody } = require('express-validator/filter');


// Display User signup form on GET.
exports.user_signup_get = function(req, res, next) {
  res.render('user_form', { title: 'Welcome! Enter details to continue' });
  // res.send('NOT IMPLEMENTED: User signup get');
}

// Handle User signup on POST.
exports.user_signup_post = [
  // Validate input fields.
  body('email', 'Email required.').isLength({ min: 1 }).trim().isEmail(),
  body('username', 'Username required.').isLength({ min: 1 }).trim(),
  body('password', 'Password required.').isLength({ min: 1 }),

  //  Sanitize values with wildcat.
  sanitizeBody('*'),

  // Process request.
  (req, res, next) => {
    // Save errors from validation, if any.
    const errors = validationResult(req);

    // Create a user variable to store user input from fields.
    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });
    console.log(user);

    if (!errors.isEmpty()) {
      // There are errors in the sign up form data.
      res.render('user_form', { title: 'POST - Welcome! Enter details to continue', signupTitle: 'Error in sign up. Please try again', user: user, errors: errors });
    } else {
      // No errors so create user in db.
      user.save(function(err) {
        if (err) { return next(err); }
        // Successful so redirect to user profile.
        // req.session.userId = user._id;
        res.redirect(user.url);
        console.log('got to the user save function')
      });
    }
  }
];

// function(req, res, next) {
//   res.send('NOT IMPLEMENTED: User signup post');
// }

// Display User create form on GET.
exports.user_signin_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED: User signin get');
}

// Handle User create on POST.
exports.user_signin_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED: User signin post');
}

// Display User detail form on GET.
exports.user_detail = function(req, res, next) {
  res.send('NOT IMPLEMENTED: User detail get ' + req.params.username);
}

// Display User update form on GET.
exports.user_update_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED: User update get');
}

// Handle User update on POST.
exports.user_update_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED: User update post')
}

// Display User delete on GET.
exports.user_delete_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED: User delete get');
}

// Handle User delete on POST.
exports.user_delete_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED: User delete post');
}