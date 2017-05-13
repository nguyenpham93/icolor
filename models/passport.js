const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const elas = require ('../elastic/index');

module.exports = function (passport){
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser ( function ( id, done ) {
        elas.search ( 'icolor', 'users', id)
        .then ( user => {
            user = user[0];
            done (null, user);
        },
        error => {
            console.log (error);
        });
    });

    passport.use ( new LocalStrategy ({
        usernameField: 'email',
        passwordField: 'password',
    },
        function ( email, password, done ) {
            elas.search ( 'passport', 'users', email)
            .then ( user => {
                user = user[0];
                bcrypt.compare ( password, user['password'], function (err, res) {
                    if (err) { return done (err); }
                    if (!result) {
                        return done ( null, false, { message : 'Incorrect Email or Password' });
                    } 
                    return done ( null, user );
                });
            },
            error => {
                return done (error);
            });
        }
    ))

};