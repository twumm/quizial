const express = require('express');
const app = express();
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const nodemailer = require('nodemailer');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');

// Set up mongoose connection.
const mongoose = require('mongoose');
const mongoDB = 'mongodb://127.0.0.1:27017/quizial';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

// Use sessions for tracking logins
app.use(session({
  secret: 'quizial',
  resave: true,
  saveUninitialized: false,
  // cookie: {
  //     maxAge: 600000
  // },
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// Add Passport middleware.
app.use(passport.initialize());
app.use(passport.session());

// const index = require('./routes/index');
const users = require('./routes/users');
const quiz = require('./routes/quiz');
const questions = require('./routes/questions');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', quiz);
// app.use('/users', users);
app.use('/quiz', quiz, questions, users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;