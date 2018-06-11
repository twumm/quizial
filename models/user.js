const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  // first_name: { type: String, required: true, max: 60 },
  // last_name: { type: String, required: true, max: 60 },
  username: { type: String, unique: true, required: true, trim: true, max: 40, unique: true },
  email: { type: String, unique: true, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  // passwordConf: { type: String, required: true },
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

// Hash the password before saving to the database.
UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) { return next(err); }
    // No error so hash the password
    user.password = hash;
    next();
  });
});

module.exports = mongoose.model('User', UserSchema);