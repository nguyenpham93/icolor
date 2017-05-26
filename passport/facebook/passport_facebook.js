const moment = require("moment");
const bcrypt = require('bcrypt-nodejs');
const elas = require ('../../elastic/index');
const config = require('../config/config.js');
const shortid = require('shortid');
const FacebookStrategy  = require('passport-facebook').Strategy;

module.exports = function (passport){
    passport.use('facebook', new FacebookStrategy({
        clientID        : config.facebookAuth.clientID,
        clientSecret    : config.facebookAuth.clientSecret,
        callbackURL     : config.facebookAuth.callbackURL,
        profileFields: ['id', 'emails', 'name']
    },
    
    // facebook will send back the tokens and profile
    function (access_token, refresh_token, profile, done) {
        // asynchronous
        process.nextTick (function() {
        
        // find the user in the database based on their facebook id
        elas.search ( 'icolor', 'users', profile.emails[0].value)
        .then (user => {
            user = user[0];    
            if (user) {
                if ( user['facebook_id'] && user['facebook_id'] === profile.id ) {
                    return done (null, user); // user found, return that user
                } else {
                    user['facebook_id'] = profile.id;
                    user['facebook_access_token'] = access_token;
                    elas.insertDocument ("icolor", "users", user)
                    .then ((data) => {
                        return done (null, user); 
                    });
                }
            } else {    
                bcrypt.hash ( config.facebookAuth.secretPassword, null, null, function(err, hash) {
                    // if there is no user found with that facebook id, create them
                    let newUser = {};
                    // set all of the facebook information in our user model
                    newUser['id'] = shortid.generate();
                    newUser['email'] = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    newUser['password'] = hash;
                    newUser['facebook_id']    = profile.id; // set the users facebook id                 
                    newUser['facebook_access_token'] = access_token; // we will save the token that facebook provides to the user                    
                    newUser['google_id']  = '';
                    newUser['google_access_token'] = '';
                    newUser['date'] = moment().format("DD-MM-YYYY HH:mm:ss");
                    elas.insertDocument ("icolor", "users", newUser)
                    .then ((data) => {
                        return done(null, newUser);
                    });
                });
            } 
        },
        error => {
            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            return done(error);
        });
        });
    }));
};