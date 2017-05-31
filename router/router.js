const collection = require('../models/collection');
const account = require('../models/register');
const auth = require('../passport/auth');
const user = require('../models/users');
const likedislike = require('../models/like_dislike');
const moment = require("moment");
const Promise = require("bluebird");

const convert = require("color-convert");
const core = require("../models/core");
const NodeCache = require("node-cache");

const myCache = new NodeCache({stdTTL: 43200, checkperiod: 600});

module.exports = function (app, passport) {

    require('./users')(app, passport);

    require('./pallet')(app, passport);

    app.get('/', (req, res) => {

        let user_id = req.session.user.id || 'null';
        let q = req.body['page'];
        let n = 20;
        let pgfrom = 0;
        if (q != undefined && q > 0) {
            pgfrom = (pgfrom + q - 1) * n;
        } else {
            q = 1;
        }

        myCache.get("home" + user_id, function (err, value) {
            if (!err) {
                if (value == undefined) {
                    collection.getAllCollection(user_id)
                        .then(result => {

                            let countAll = result.length;
                            p = Math.ceil(countAll / n, 0);
                            let items = result.slice(pgfrom, pgfrom + n);

                            myCache.set("home" + user_id, result, function (err, success) {
                                if (!err && success) {
                                    console.log(success);
                                }
                            });

                            res.render('index', {
                                data: {
                                    dt: items,
                                    islogin: req.session.login,
                                    users: req.session.user.email || '',
                                    allpage: p,
                                    page: q,
                                },
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
                    let countAll = value.length;
                    p = Math.ceil(countAll / n, 0);
                    let items = value.slice(pgfrom, pgfrom + n);
                    res.render('index', {
                        data: {
                            dt: items,
                            islogin: req.session.login,
                            users: req.session.user.email || '',
                            allpage: p,
                            page: q,
                        },
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
        let user_id = req.session.user.id || 'null';
        let selected = req.body['selected'];
        let page = req.body['page'];

        let n = 20;
        let pgfrom = (page - 1) * n;

        if (q === 'all') {

            if ( selected == 'latest' ) {

                myCache.get( "home" + user_id, function( err, value ){
                    if( !err ){
                        if(value == undefined){
                            
                            collection.getAllCollectionBylike (user_id, selected)
                            .then ( data => {

                                myCache.set ( "home" + user_id, data, function( err, success ){
                                    if( !err && success ){
                                        console.log( success );
                                    }
                                });

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
                            
                            let countAll = value.length;
                            p = Math.ceil(countAll / n, 0);
                            let items = value.slice(pgfrom, pgfrom + n);

                            res.json({
                                dt: items,
                                islogin: req.session.login,
                                users: req.session.user.email || '',
                                allpage: p,
                                page: page,
                            });

                        }
                    }
                });

            } else {

                myCache.get( "dataSortByLike" + user_id, function( err, value ){
                    if( !err ){
                        if (value == undefined){

                            collection.getAllCollectionBylike (user_id, selected)
                            .then ( data => {

                                myCache.set ( "dataSortByLike" + user_id, data, function( err, success ){
                                    if( !err && success ){
                                        console.log( success );
                                    }
                                });

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
                            
                            let countAll = value.length;
                            p = Math.ceil(countAll / n, 0);
                            let items = value.slice(pgfrom, pgfrom + n);

                            res.json({
                                dt: items,
                                islogin: req.session.login,
                                users: req.session.user.email || '',
                                allpage: p,
                                page: page,
                            });
                            
                        }
                    }
                });

            }
  
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
        let user_id = user_id = req.session.user.id || 'null';

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
            let user_id = req.session.user.id || 'null';
            let collection_id = req.body['collection_id'];
            likedislike.clickLikeDislike(collection_id, user_id, status)
                .then(data => {
                        collection.getCollection(data, user_id)
                            .then((data1) => {

                                myCache.del( "homenull");
                                myCache.del( "home" + user_id);
                                myCache.del( "dataSortByLikenull");
                                myCache.del( "dataSortByLike" + user_id);

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
        let email    = req.body.email;
        let password = req.body.password;
        let status   = {};
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
        let session   = req.session;
        let user_id = req.session.user.id || 'null';

        myCache.del( "homenull");
        myCache.del( "home" + user_id);
        myCache.del( "dataSortByLikenull");
        myCache.del( "dataSortByLike" + user_id);

        session.login = false;
        session.user  = {};
        session.destroy(function (err) {
            res.json({islogin: false, users: ''});
        });
    });


    app.get("/logined", (req, res) => {
        let data = {};
        let user_id = req.session.user.id || 'null';

        if (req.session.login) {

        myCache.del( "homenull");
        myCache.del( "home" + user_id);
        myCache.del( "dataSortByLikenull");
        myCache.del( "dataSortByLike" + user_id);

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


