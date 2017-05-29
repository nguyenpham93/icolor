const collection = require('../models/collection');
const account = require('../models/register');
const auth = require('../passport/auth');
const user = require('../models/users');
const likedislike = require('../models/like_dislike');
const moment = require("moment");
const Promise = require("bluebird");

const convert = require("color-convert");
const core = require("../models/core");
const NodeCache = require( "node-cache" );

const myCache = new NodeCache( { stdTTL: 43200, checkperiod: 600 } );

module.exports = function (app, passport) {

    require('./users')(app, passport);

    require('./pallet')(app, passport);

    // TEST
    app.get('/calculate', (req, res) => {
        let hex2 = "#FFFFFF";
        let arr = [];
        console.time('testspeed');
        collection.getAllColor()
            .then(data => {
                data.forEach((color2) => {
                    let temp1 = {};
                    let lab1 = convert.hex.lab(hex2);
                    let lab2 = convert.hex.lab(color2['id']);
                    let distance = core.DeltaECIE(lab1, lab2);

                    // color related if score between two colors less than 50
                    if (distance < 50) {
                        color2.score = distance;
                        arr.push(color2);
                    }
                });
                console.log(arr);
                console.timeEnd('testspeed');
            });
    });

    app.get('/', (req, res) => {
        let user_id = req.session.user.id;
        let q = req.body['page'];
        let n = 20;
        let pgfrom = 0;
        if (q != undefined && q > 0) {
            pgfrom = (pgfrom + q - 1) * n;
        } else {
            q = 1;
        }

        myCache.get("home", function (err, value) {
            if (!err) {
                if (value == undefined) {
                    collection.getAllCollection(user_id)
                    .then(result => {

                        let countAll = result.length;
                        p = Math.ceil(countAll / n, 0);
                        let items = result.slice(pgfrom, pgfrom + n);

                        let obj = {
                            dt: items,
                            islogin: req.session.login,
                            users: req.session.user.email || '',
                            allpage: p,
                            page: q,
                        };

                        myCache.set("home", obj, function (err, success) {
                            if (!err && success) {
                                console.log(success);
                            }
                        });
                        res.render('index', {
                            data: obj,
                            vue: {
                                head: {
                                    title: 'Color Pro',
                                    meta: [
                                        // { script: '/public/js/home/script.js' },
                                        {style: '/public/css/home/style.css', type: 'text/css', rel: 'stylesheet'}
                                    ],
                                },
                                components: ['myheader', 'pallet']
                            }
                        });
                    });
                } else {
                    res.render('index', {
                            data: value,
                            vue: {
                                head: {
                                    title: 'Color Pro',
                                    meta: [
                                        // { script: '/public/js/home/script.js' },
                                        {style: '/public/css/home/style.css', type: 'text/css', rel: 'stylesheet'}
                                    ],
                                },
                                components: ['myheader', 'pallet']
                            }
                        });
                }
            }
        });



    });

    app.post('/search/:q/:term', (req, res) => {
        let q = req.params['q'];
        let term = req.params['term'];
        let user_id = 0;
        //console.log(req.body)

        let selected = req.body['selected'];
        let page = req.body['page'];

        if (req.session.user.id) {
            user_id = req.session.user.id;
        }

        let n = 20;
        let pgfrom = (page - 1) * n;

        if (q === 'all') {
            // let getAll = Promise.coroutine(function* () {
            //     let resultA = yield collection.getPaginationCollection (pgfrom, n, selected, user_id);
            //     let resultB = yield collection.getAllCollection (user_id);
            //     return [resultA, resultB];
            // });

            collection.getAllCollection(user_id)
                .then(data => {
                    let countAll = data.length;
                    p = Math.ceil(countAll / n, 0);
                    let items = data.slice(pgfrom, pgfrom + n);
                    res.json({
                        dt: items,
                        islogin: req.session.login,
                        users: req.session.user.email || '',
                        allpage: p,
                        page: page,
                    });
                });
        } else {
            // Search by HEX
            if (q === 'hex') {

                let nearColor = [];
                term = '#' + term;

                collection.searchCollectionByHex(term, user_id, selected)
                    .then(data => {

                        let countAll = data.length;
                        p = Math.ceil(countAll / n, 0);
                        let items = data.slice(pgfrom, pgfrom + n);

                        res.json({
                            dt: items,
                            islogin: req.session.login,
                            users: req.session.user.email || '',
                            allpage: p,
                            page: page,
                        });

                    });
            } else {
                // SEARCH BY TERM
                collection.searchCollection(term, user_id, selected)
                    .then(data => {
                        let countAll = data.length;
                        p = Math.ceil(countAll / n, 0);
                        let items = data.slice(pgfrom, pgfrom + n);
                        res.json({
                            dt: items,
                            islogin: req.session.login,
                            users: req.session.user.email || '',
                            allpage: p,
                            page: page,
                        });
                    });
            }
        }
    });

    app.get('/relate', (req, res) => {
        let id = req.query.id;
        let id_parent = req.query.idparent;
        let hex = "#" + id;
        let arr = [];
        collection.getColorRelated(hex, id_parent)
            .then(data => {
                data.forEach((i) => {
                    i.date = i.date.split(" ")[0];
                })
                res.json({
                    dt: data,
                    islogin: req.session.login,
                    users: req.session.user.email || ''
                });
            });
    });

    app.get('/detail/:id', (req, res) => {
        let id = req.params.id;
        let user_id = 0;
        if (req.session.user.id) {
            user_id = req.session.user.id;
        }
        collection.getCollectionById(id, user_id)
            .then((data) => {
                data[0].date = data[0].date.split(" ")[0];
                res.render('detail', {
                    data: {collection: data[0], islogin: req.session.login, users: req.session.user.email || ''},
                    vue: {
                        head: {
                            title: data['name'],
                            meta: [
                                // { script: '/public/js/detail/script.js' },
                                {style: '/public/css/detail/style.css', type: 'text/css', rel: 'stylesheet'}
                            ]
                        },
                        components: ['myheader', 'footerdetail', 'related', 'palletrelated']
                    }
                });
            });
    });

    app.post('/likedislike', (req, res) => {
        if (req.session.user.id) {
            let status = req.body['action'];
            let user_id = req.session.user.id;
            let collection_id = req.body['collection_id'];
            likedislike.clickLikeDislike(collection_id, user_id, status)
                .then(data => {
                        collection.getCollection(data, user_id)
                            .then((data1) => {
                                res.json(data1[0])
                            });
                    },
                    failed => {
                        res.json({error: 'Failed'});
                    });
        } else {
            //console.log('Unauthorized');
            res.json({error: 'You must login to like or dislike'});
        }
    });

    app.post('/register', (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        let status = {};
        account.register(email, password)
            .then(succeed => {
                if (succeed) {
                    status = true;
                } else {
                    status = false;
                }
                res.json({status: status, islogin: req.session.login, users: req.session.user.email || ''});
            });
    });


    app.get('/logout', (req, res) => {
        let session = req.session;
        session.login = false;
        session.user = {};
        session.destroy(function (err) {
            res.json({islogin: false, users: ''});
        });
    });

    app.get("/logined", (req, res) => {
        let data = {};
        if (req.session.login) {
            data = {'islogin': true, 'users': req.session.user.email || ''};
        } else {
            data = {'islogin': false};
        }
        res.json(data);
    });

    //------------Passport-Local Strategy--------------------
    app.post("/login", passport.authenticate('local', {successRedirect: '/logined', failureRedirect: '/logined'}));

    //------------Facebook OAuth 2.0 with Passport--------------------
    app.get('/login/facebook',
        passport.authenticate('facebook', {scope: ['email']}
        ));

    // handle the callback after facebook has authenticated the user
    app.get('/login/facebook/callback', passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/'
        })
    );

    //------------Google OAuth 2.0 with Passport--------------------
    app.get('/login/google',
        passport.authenticate('google', {scope: ['email', 'profile']}
        ));

    // handle the callback after facebook has authenticated the user
    app.get('/login/google/callback', passport.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/'
        })
    );

    app.get('/test', (req, res) => {
        res.json({errMsg: 'ok WEB'});
    })

}
