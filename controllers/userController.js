const User = require('../models/user');
const Question = require('../models/question');

const { body, validationResult } = require('express-validator/check/');
const { sanitizeBody } = require('express-validator/filter');
const bcrypt = require('bcrypt');
const passport = require('passport');
const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();


// Display User signup form on GET.
exports.user_signup_get = function(req, res, next) {
  res.render('user_form', { title: 'Welcome! Enter details to continue', user: req.user });
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

    if (!errors.isEmpty()) {
      // There are errors in the sign up form data.
      res.redirect('/quiz/user/signin');
    } else {
      // No errors so create user in db.
      user.save(function(err) {
        if (err) { return next(err); }
        // Successful so save login and redirect to user profile.
        req.logIn(user, function(err) {
          res.redirect(user.url);
        });
        // req.session.userId = user._id;
        // res.redirect(user.url);
      });
    }
  }
];

// Display User create form on GET.
exports.user_signin_get = function(req, res, next) {
  if (req.user) {
    res.redirect('/quiz/user/' + req.user.username)
  }
  res.render('user_form', { title: 'Welcome! Enter details to continue', user: req.user });
  // res.send('NOT IMPLEMENTED: User signin get');
}

// Handle User signin on POST.
exports.user_signin_post = [
  // Validate user input from the form.
  body('username', 'Username or email required').isLength({ min: 1 }).trim(),
  body('password', 'Password required').isLength({ min: 1 }),

  // Sanitize fields using wildcats.
  sanitizeBody('*'),

  // Process request.
  (req, res, next) => {
    // Save errors from validation, if any.
    const errors = validationResult(req);

    // Create user object with the data entered.
    const userData = new User({
      username: req.body.username,
      password: req.body.password
    });

    // Check if there are errors in the form values.
    if (!errors.isEmpty()) {
      // There are errors so render form with the values.
      res.render('user_form', { title: 'Welcome! Enter details to continued', signinError: 'Error in sign up. Please try again', user: userData, errors: errors })
    }
    else {
      passport.authenticate('local', function(err, user, info) {
        if (err) return next(err)
        if (!user) {
          return res.redirect('/quiz/user/signin')
        }
        req.logIn(user, function(err) {
          if (err) return next(err);
          return res.redirect('/quiz/user/' + user.username);
        });
      })(req, res, next);
    }
  }
]

// Handle change USER password on GET.
// exports.user_changepassword_get = function(req, res, next) {
//   res.send('NOT HERE YET');
// }

// Handle change USER password on POST.
exports.user_changepassword_post = [
  // Check if passwords meet minimum requirement
  body('password').isLength({ min: 4 }),
  body('confirmpassword').isLength({ min: 4 }),

  // Sanitize fields.
  sanitizeBody('*'),

  // Process request.
  (req, res, next) => {
    // Save errors from validation, if any.
    const errors = validationResult(req);
    // Check if there are errors in the form values.
    
    // Query user from db.
    User.findById(req.user.id)
      .exec(function(err, user) {
        if (err) { return next(err);}
        // There are errors in the field values so render form with the values.
        if (!errors.isEmpty()) {
          req.flash('error', 'Password entered is invalid. Kindly try again.');
          res.redirect(user.url);
        }
        else {
          user.password = req.body.password;
          // Save the user's new password.
          user.save(function(err) {
            if (err) { return next(err); }
            // Successful so save login and redirect to user profile.
            req.logIn(user, function(err) {
              req.flash('success', 'Password successfully changed.');
              res.redirect(user.url);
            });
          });
        }
      })
  }
]

// Display User detail form on GET.
exports.user_profile = function(req, res, next) {
  User.findOne({ username: req.params.username })
    .exec(function(err, user) {
      if (err) { return next(err) }
      res.render('user_profile', { title: 'User detail', user: user, userLoggedIn: req.session.userId });
    })
    // res.send('NOT IMPLEMENTED: User detail get ' + req.params.username);
};

exports.user_forgotpassword_get = function(req, res, next) {
  res.render('user_forgot_password');
}

exports.user_forgotpassword_post = [
  // Validate fields from the form.
  body('email', 'Email required').isEmail().trim(),
  body('emailConfirm', 'Email required').isEmail().trim(),

  // Sanitize fields.
  sanitizeBody('*'),

  // Process request.
  (req, res, next) => {
    // Save errors from validation, if any.
    const errors = validationResult(req);
    // Check if emails entered are the same.
    if (req.body.email !== req.body.emailConfirm) {
      req.flash('error', 'Kindly ensure emails entered are the same.');
      res.redirect('back');
    }
    // If form validation failed, redirect back to form.
    if (!errors.isEmpty()) {
      req.flash('error', 'Please enter valid emails.');
      res.redirect('back');
    }
      // Create token and save to user requesting for password reset.
    async.waterfall([
      function(callback) {
        crypto.randomBytes(20, function(err, buf) {
          let token = buf.toString('hex');
          callback(err, token);
        });
      },
      function(token, callback) {
        User.findOne({email: req.body.email}, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('back');
          }
          // User found so set reset password token and expiry date.
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function(err) {
            callback(err, token, user);
          });
        });
      },
      function(token, user, callback) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: user.email,
          from: 'martint.mensah@gmail.com',
          subject: 'Quizial Password Reset',
          text: `You are receiving this email because you (or someone else) requested for a password reset on Quizial.
          Please click this link to reset your password http://${req.headers.host}/reset/${token}.
          Kindly ignore if you did not request for this password reset.`
        };
        // console.log(msg);
        sgMail.send(msg);
      }
      /*, function(err, callback) {
        if (err) return next(err);
        req.flash('info', `An e-mail has been sent to ${user.email} with further instructions.`);
        res.redirect('/quiz/user/signin');
      }*/
    ], function (err, callback) {
        if (err) return next(err);
        req.flash('error', 'Hmmm something went wrong. Please try again later.');
        res.redirect(`back`);
    });
    // }
  }
]

/*function(req, res, next) {
  req.flash('success', 'Check your email to reset your password.')
  res.render('user_form');
}*/

// Log out the user.
exports.user_logout_get = function(req, res, next) {
  req.logout();
  res.redirect('/');
  /*if (req.session) {
    // Delete the session object
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/quiz/user/signin');
      }
    });
  } else {
    console.log('Logout not working');
  }*/
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
