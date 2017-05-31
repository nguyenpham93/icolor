const express = require ('express');
const expressVue = require ('express-vue');
const app = express();
const bodyParser = require ("body-parser");
const path = require ('path');
const async = require ('async');
const elas = require ("../elastic/index");
const passport = require('passport');
const auth = require ('../passport/auth');
const session = require('express-session');
const NodeCache = require( "node-cache" );

//const myCache = new NodeCache( { stdTTL: 0, checkperiod: 600 } );

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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

app.set ('views', path.join (__dirname, '/../views'));
app.set ('vue', {
	componentsDir: path.join (__dirname, '../views', 'components'),
	defaultLayout : 'layout'
});

app.use (bodyParser.urlencoded ({
	extended: true
}));

app.use (bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
app.use(auth.checkAuthentication);

//------------Set up Passport--------------------
require('../passport/passport')(passport);

//------------Set up Passport-local strategy--------------------
require('../passport/passport-local/passport_local')(passport);

//------------Set up Facebook OAuth 2.0 with Passport--------------------
require('../passport/facebook/passport_facebook')(passport);

//------------Set up Google OAuth 2.0 with Passport--------------------
require('../passport/google/passport_google')(passport);

//------------Set up router --------------------
require('../router/router')(app, passport);

app.listen(3000, () => {
    console.log("Express running at port 3000");
});