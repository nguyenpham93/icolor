const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const elas = require ('../../elastic/index');

module.exports = function (passport){

    passport.use ( new LocalStrategy ({
        usernameField: 'email',
        passwordField: 'password',
    },
        function ( email, password, done ) {
            elas.search ( 'icolor', 'users', email)
            .then ( user => {
                user = user[0];
                if ( !user ) {
                    return done ( null, false, { message : 'Email not correct' });
                } else {
                    bcrypt.compare (password, user['password'], ( err, result ) => {
                        if (err) { return done (err); }
                        if (!result) {
                            return done ( null, false, { message : 'Incorrect Email or Password' });
                        } 
                        return done ( null, user );
                    });
                }
            },
            error => {
                return done (error);
            });
        }
    ))

};