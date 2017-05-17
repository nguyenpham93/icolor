const moment = require("moment");
const shortid = require("shortid");
const bcrypt = require('bcrypt-nodejs');
const elas = require ('../elastic/index');


class Register {
    constructor(){};

    register( email, password) {
    return new Promise((resolve, reject) => {
        this.isEmailExist(email)
            .then(status => {
                // Email available
                if (!status) {
                    bcrypt.hash(password, null, null, function(err, hash) {
                        let user = {
                            id: shortid.generate(),
                            email: email,
                            password: hash,
                            date: moment().format("DD-MM-YYYY HH:mm:ss")
                        }
                        elas.insertDocument('icolor', 'users', user)
                        .then(data => {
                            resolve(true);
                        });
                    });
                } else {
                    resolve(false);
                }
            });
    });
}

    isEmailExist ( email ) {
        return new Promise ( (resolve, reject) => {
            elas.search ( 'icolor', 'users', email)
            .then ( data => {
                if ( data.length ) {
                    resolve (true);
                } else {
                    resolve (false);
                }
            });
        });
    }
};

module.exports = new Register ();