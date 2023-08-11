var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//importing the mongoose packages
var configs = require('./configs/global');
var mongoose = require('mongoose');
var hbs = require('hbs');
var passport = require('passport');
var session = require('express-session')
var github = require('passport-github2').Strategy;
//user model importation
var User = require('./models/user')
var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var playerRouter = require('./routes/players');
var teamRouter = require('./routes/teams');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//configuring session
app.use(session({
  secret: 'assignmentFinal',
  resave: false,
  saveUninitialized: false
}));
//Initializing
app.use(passport.initialize());
app.use(passport.session());
//Implementing strategy
passport.use(User.createStrategy());
passport.use(new github({
  
  clientID: configs.github.clientId,
  clientSecret: configs.github.clientSecret,
  callbackURL: configs.github.callbackUrl
},
async (accessToken, refreshToken, profile, done) => {
  const user = await User.findOne({ oauthId: profile.id });
  if (user) {
    return done(null, user);
  }
  else {
    const newUser = new User({
      username: profile.username,
      oauthId: profile.id,
      oauthProvider: "GitHub",
      created: Date.now()
    });
    const savedUser = await newUser.save();
    return done(null, savedUser);
  }
}
))
//serialize and deserialization
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//local strategy





app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/players',playerRouter);
app.use('/teams', teamRouter)

//conneting to the database
mongoose.connect(configs.db, {useNewUrlParser: true, useUnifiedTopology: true})
.then((message) => {
  console.log('Connection Registered')
})
.catch((error) => {
  console.log(`Connection Lost, Try Again ${error}`);
})

//this code has been taken from lesson 6 of the js class
// hbs.registerHelper('createOption', (currentValue, selectedValue) => {
//   var selectedProperty = '';
//   if (currentValue == selectedValue) {
//     selectedProperty = 'selected';
//   }
//   return new hbs.SafeString('<option '+ selectedProperty +'>' + currentValue + '</option>');
// });

hbs.registerHelper('createOption', (currentValue, selectedValue) => {
  var selectedProperty = '';
  if (currentValue == selectedValue) {
    selectedProperty = 'selected';
  }
  return new hbs.SafeString('<option value="' + currentValue + '" ' + selectedProperty + '>' + currentValue + '</option>');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
