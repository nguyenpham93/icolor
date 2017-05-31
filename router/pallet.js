const collection = require('../models/collection');
const account = require('../models/register');
const auth = require('../passport/auth');
const user = require('../models/users');
const likedislike = require('../models/like_dislike');
const moment = require("moment");
const Promise = require("bluebird");
const bcrypt = require('bcrypt-nodejs');
const shortid = require("shortid");
const async = require("async");

const NodeCache = require("node-cache");
const myCache = new NodeCache({stdTTL: 43200, checkperiod: 600});

//Check hex code
function isHexaColor(sNum) {
    return (typeof sNum === "string") && sNum.length === 6
        && !isNaN(parseInt(sNum, 16));
}

function merge(item, cb){
    collection.addCollection(item)
    .then (data => {
        cb(null,data);
    },
    error => {
        console.log(error);
        cb (null, error);
    });
}

module.exports = function (app, passport) {
    app.get('/addnewpallet', (req, res) => {
        let user_id = req.session.user.id || "null";

        if ( user_id === 'null') {
            res.redirect('/');
        } else {
            collection.getIdNameCollection ()
            .then (result => {
                res.render ('addnewpallet', {
                    data: {
                        dt: result,
                        islogin : req.session.login,
                        users : req.session.user.email || ''
                    },
                    vue: {
                        head: {
                            title: 'Add new pallet',
                            meta: [
                                    { script: '/public/js/select2.min.js' },
                                    { style: '/public/css/select2.min.css',type: 'text/css',rel: 'stylesheet' }
                                ]
                        },
                        components: ['myheader']
                    }
                });
            });

        }
    });

    app.post('/addnewpallet', (req, res) => {

        let user_id = req.session.user.id || 'null';
        let name = req.body['name'];
        let description = req.body['description'];
        let color1 = req.body['color1'];
        let color2 = req.body['color2'];
        let color3 = req.body['color3'];
        let color4 = req.body['color4'];
        let color5 = req.body['color5'];

        let error = '';

        if(name.trim().length < 1){
            error += '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Name required <br>';
        }
        if(!isHexaColor(color1)){
            error += '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Color 1 invalid <br>';
        }
        if(!isHexaColor(color2)){
            error += '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Color 2 invalid <br>';
        }
        if(!isHexaColor(color3)){
            error += '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Color 3 invalid <br>';
        }
        if(!isHexaColor(color4)){
            error += '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Color 4 invalid <br>';
        }
        if(!isHexaColor(color5)){
            error += '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Color 5 invalid <br>';
        }



        if(error.length > 0){
            res.json({
                errMsg: error,
                islogin : req.session.login,
                users : req.session.user.email || ''
            })
        }else{
            let id = shortid.generate();
            let color = [{
                id: id,
                name: name,
                color1: '#' + color1,
                color2: '#' + color2,
                color3: '#' + color3,
                color4: '#' + color4,
                color5: '#' + color5,
                date: moment().format("DD-MM-YYYY HH:mm:ss"),
                description: description,
                id_user: user_id,
                like: 0,
                dislike:0,
                share: 0
            }];
            let islogin = req.session.login;
            let users = req.session.user.email || '';

            myCache.del( "homenull");
            myCache.del( "home" + user_id);
            myCache.del( "dataSortByLikenull");
            myCache.del( "dataSortByLike" + user_id);

            async.mapSeries (color, merge, (err, rs) => {
                res.json({
                    errMsg: rs[0],
                    islogin : islogin,
                    users : users
                })
            });
        }
    });

    app.post('/delete-pallet', (req, res) => {
        let user_id = req.session.user.id || 'null';
        let pallet_id = req.body['pallet_id'];
        let id_user = req.body['user_id'];
        if(user_id === id_user){

            let q = req.body['page'];
            let n = 1;
            let pgfrom = 0;
            if (q != undefined && q > 0) {
                pgfrom = (pgfrom + q - 1) * n;
            } else {
                q = 1;
            }

            collection.deleteCollection({id: pallet_id})
                .then(data => {

                    collection.searchPaginationCollectionByIdUser(user_id, pgfrom, n)
                        .then(data1 => {
                            
                            myCache.del( "homenull");
                            myCache.del( "home" + user_id);
                            myCache.del( "dataSortByLikenull");
                            myCache.del( "dataSortByLike" + user_id);

                            res.json({
                                    dt: data1,
                                    islogin: req.session.login,
                                    users: req.session.user.email || ''
                                })
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        }else{
            res.json({
                errMsg: 'Fail',
                islogin : req.session.login,
                users : req.session.user.email || ''
            })
        }
    });

    app.post('/clonepallet', (req, res) => {
        let user_id = req.session.user.id || 'null';
        let idPallet = req.body['idPallet'];

            collection.getCollection(idPallet, user_id)
                .then(data => {
                    res.json({
                            pallet: data,
                            islogin: req.session.login,
                            users: req.session.user.email || '',
                            msgClone: 'Clone Successful'
                        })
                })
                .catch(err => {
                    res.json({
                            islogin: req.session.login,
                            users: req.session.user.email || '',
                            msgClone: 'Clone Fail'
                        })
                });
    });

};
