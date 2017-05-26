const moment = require("moment");
const bcrypt = require('bcrypt-nodejs');
const elas = require ('../../elastic/index');
const config = require('../config/config.js');
const shortid = require('shortid');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function (passport){
    passport.use('google', new GoogleStrategy({
        clientID        : config.googleAuth.clientID,
        clientSecret    : config.googleAuth.clientSecret,
        callbackURL     : config.googleAuth.callbackURL
    },
    
    // google will send back the tokens and profile
    function (access_token, refresh_token, profile, done) {
        // asynchronous
        process.nextTick (function() {
        
        // find the user in the database based on their facebook id
        elas.search ( 'icolor', 'users', profile.emails[0].value)
        .then (user => {
            user = user[0];    
            if (user) {
                if ( user['google_id'] && user['google_id'] === profile.id ) {
                    return done (null, user); // user found, return that user
                } else {
                    user['google_id'] = profile.id;
                    user['google_access_token'] = access_token;
                    return done (null, user); 
                }
            } else {    
                bcrypt.hash ( config.googleAuth.secretPassword, null, null, function(err, hash) {
                    // if there is no user found with that google id, create them
                    let newUser = {};
                    // set all of the google information in our user model
                    newUser['id'] = shortid.generate();
                    newUser['email'] = profile.emails[0].value; // google can return multiple emails so we'll take the first
                    newUser['password'] = hash;
                    newUser['google_id']    = profile.id; // set the users google id                 
                    newUser['google_access_token'] = access_token; // we will save the token that google provides to the user                    
                    newUser['facebook_id']  = '';
                    newUser['facebook_id_access_token'] = '';
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
            return done(err);
        });
        });
    }));
};