const elas = require('../elastic/index');
const async = require("async");
const convert = require("color-convert");
const core = require("./core");
const Promise = require("bluebird");
const quickSort = require('./quicksort');

class User {
    constructor(){}

    getAuthor (item, cb) {
        elas.search ("icolor", "users", item['id_user'])
        .then ( (data) => {
            item['author'] = data[0]['email'];
            // item['author_email'] = data[0]['email'];
            cb (null, item);
        }, 
        error => {
            cb (null, item);
        });
    }
}

module.exports = new User();