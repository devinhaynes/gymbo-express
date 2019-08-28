
//Requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const pug = require('pug');
const path = require('path');
const validator = require('express-validator');
const config = require('./config/database');
const passport = require('passport');
const User = require('./models/user');

// Constants
const PORT = 3000;
const HOST = 'localhost';
const app = express();

//MongoDB
mongoose.connect(config.database, config.options);

//Middleware for parsing JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));
//Allows pug templates to get session variables
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
//Validator
app.use(validator({
  errorFormatter: (param, msg, value) => {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));
//Flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
})
//Set template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Passport config
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

//For static files i.e style.css
app.use(express.static(path.join(__dirname, 'static')));

let route = require('./routes/router');
app.use('/', route);

app.listen(PORT, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
