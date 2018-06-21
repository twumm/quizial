const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

const UserSchema = new Schema({
  // first_name: { type: String, required: true, max: 60 },
  // last_name: { type: String, required: true, max: 60 },
  username: { type: String, unique: true, required: true, trim: true, max: 40, unique: true },
  email: { type: String, unique: true, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  // passwordConf: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  questionsPosted: [{ type: Schema.ObjectId, ref: 'Question' }],
  questionsAttempted: [{ type: Schema.ObjectId, ref: 'Question' }],
  questionsCorrect: [{ type: Schema.ObjectId, ref: 'Question' }]
    // birthday: Date,
    // bio: { type: String, max: 2000 },
    // friends: [{ type: Schema.ObjectId, ref: 'User' }],
    // country: { type: String, required: true },
    // dp: { type: String, max: 300 }
});

// Virtual property for user's url.
UserSchema
  .virtual('url')
  .get(function() {
    return '/quiz/user/' + this.username;
  });

// Authenticate user input against the database.
UserSchema.statics.authenticate = function(userInput, password, callback) {
  User.findOne({ $or: [{ username: userInput }, { email: userInput }] })
    .exec(function(err, user) {
      if (err) {
        return callback(err);
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      // Compare the password in the db to the password the user entered.
      bcrypt.compare(password, user.password, function(err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    })
}

// Setup LocalStrategy with passport for username/password authentication.
passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ $or: [{ username: userInput }, { email: userInput }] }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Incorrect username.' });
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  });
}));

// Add serialize and deserialize passport methods to allow user stay logged in.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Hash the password before saving to the database.
UserSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) { return next(); }

  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) { return next(err); }
    // No error so hash the password
    user.password = hash;
    next();
  });
});

// Perform password verification when user attempts sign-in.
UserSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return cb(err); }
    callback(null, isMatch);
  });
};

const User = mongoose.model('User', UserSchema)
module.exports = User;