const User = require('../models/user');
const Question = require('../models/question');

const { body, validationResult } = require('express-validator/check/');
const { sanitizeBody } = require('express-validator/filter');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


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

// function(req, res, next) {
//   res.send('NOT IMPLEMENTED: User signup post');
// }

// Display User create form on GET.
exports.user_signin_get = function(req, res, next) {
  if (req.user) {
    res.redirect('/quiz/user/' + req.user.username)
  }
  res.render('user_form', { title: 'Welcome! Enter details to continue', user: req.user });
  // res.send('NOT IMPLEMENTED: User signin get');
}

// Handle User create on POST.
exports.user_signin_post = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err)
    if (!user) {
      return res.redirect('/quiz/user/')
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/quiz/user/' + user.username);
    });
  })(req, res, next);
}

/*exports.user_signin_post = [
  // Validate user input from the form.
  body('userDetail', 'Username or email required').isLength({ min: 1 }).trim(),
  body('password', 'Password required').isLength({ min: 1 }),

  // Sanitize fields using wildcats.
  sanitizeBody('*'),

  // Process request
  (req, res, next) => {
    // Save errors from validation, if any.
    const errors = validationResult(req);

    // Create user object with the data entered.
    const user = new User({
      userDetail: req.body.userDetail,
      password: req.body.password
    });

    // Check if there are errors in the form values.
    if (!errors.isEmpty()) {
      // There are errors so render form with the values.
      res.render('user_form', { title: 'Welcome! Enter details to continued', signinError: 'Error in sign up. Please try again', user: user, errors: errors })
    } else {
    passport.authenticate('local', function(err, user, info) {
      // console.log(local)
      if (err) { return next(err); }
      if (!user) {
        return res.redirect('/quiz/user/signin')
      }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/');
      });
    });
    // User.authenticate(req.body.userDetail, req.body.password, function(error, user) {
    //   console.log(req.body.userDetail, req.body.password);
    //   if (error || !user) {
    //     res.render('user_form', { title: 'Welcome! Enter details to continue', signinError: 'Wrong username, email or password', user: user })
    //   } else {
    //     req.session.userId = user._id;
    //     res.redirect('/quiz/user/' + user.username);
    //   } 
    // });
    // }
  }
];*/

// Handle change USER password on GET.
// exports.user_changepassword_get = function(req, res, next) {
//   res.send('NOT HERE YET');
// }

// Handle change USER password on POST.
exports.user_changepassword_post = [
  // Check if passwords meet minimum requirement
  body('newpassword').isLength({ min: 5 }),
  body('confirmpassword').isLength({ min: 5 }),
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
