var config = require('./config/config');
var mongoose = require('mongoose');
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");
});

var express = require("express");
var app = express();
var passport = require('passport');
var path = require("path");

var morgan =        require('morgan');
var cookieParser =  require('cookie-parser');
var bodyParser =    require("body-parser");
var session =       require('express-session');
var LocalStrategy = require('passport-local').Strategy;

app.use(morgan('dev'));
app.use(cookieParser());
//will let take data fom the post
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// passport config
var User = require('./app/models/user');
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//app.use(express.static(path.resolve(__dirname, 'app')));
app.use(express.static(path.resolve(__dirname)));

var user    = require('./app/routes/userRouter');
var topic   = require('./app/routes/topicRouter');

// All router should have prefixed /api
app.use('/', user);
app.use('/api', topic);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});



//starting server
app.listen(443, process.env.IP || "0.0.0.0");
console.log("Magic happens at "+process.env.PORT);
