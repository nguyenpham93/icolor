const express = require ('express');
const expressVue = require ('express-vue');
const app = express();
const bodyParser = require ("body-parser");
const path = require ('path');
const async = require ('async');
const elas = require ("./elastic/index");
// const jwt = require('jsonwebtoken');
const passport = require('passport');
const auth = require ('./passport/auth');
// const passportJWT = require("passport-jwt");

const session = require('express-session');
app.use(session({
  cookie: { maxAge: (3600 * 1000) },
  unser : 'destroy',
  secret: 'JackCodeHammer', 
  resave: false, 
  saveUninitialized: true, 
  cookie: {secure: false}
}))

app.use ('/public', express.static ('public'))

app.engine ('vue', expressVue);

app.set ('view engine', 'vue');

app.set ('views', path.join (__dirname, '/views'));

app.set ('vue', {
	componentsDir: path.join (__dirname, 'views', 'components'),
	defaultLayout : 'layout'
});

app.use (bodyParser.urlencoded ({
	extended: true
}));

app.use (bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
app.use(auth.checkAuthentication);

//------------Set up passport --------------------
require('./passport/passport_local')(passport);

//------------Set up router --------------------
require('./router/router')(app, passport);

  app.listen(3000, () => {
    console.log("Express running at port 3000");
  });