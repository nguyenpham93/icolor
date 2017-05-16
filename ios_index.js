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

const collection = require ('./models/collection');
const account = require ('./models/register');
const user = require('./models/users');
const likedislike = require('./models/like_dislike');


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
require('./passport/passport-local/passport_local')(passport);

//------------Set up router --------------------
app.get ('/all', (req, res) => {
        let user_id = 0;
        if(req.session.user.id) {
            user_id = req.session.user.id;
        }
        collection.getAllCollection (user_id)
        .then (result => {
            res.json({data: result})
        });
    });


    app.get ('/detailios/:id', (req, res) => {
        let user_id = 0;
        if(req.session.user.id) {
            user_id = req.session.user.id;
        }
        let id = req.params.id;
        collection.getCollection (id, user_id)
        .then ( (data) => {
            res.json({data: data})
        });
    });

    app.get('/relatedios', (req, res) => {
        let id = req.query.id;
        let id_parent = req.query.idparent;
        let hex = "#" + id;
        let arr = [];
        collection.getColorRelated ( hex, id_parent )
        .then ( data => {
            res.json ({data: data});
        });
    });

  app.listen(3001, () => {
    console.log("Express running at port 3001");
  });