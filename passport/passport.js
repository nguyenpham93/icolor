const elas = require ('../elastic/index');
const NodeCache = require("node-cache");

const myCache = new NodeCache({stdTTL: 43200, checkperiod: 600});
module.exports = function (passport){

    passport.serializeUser ( function (user, done) {
        done (null, user.id);
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

};