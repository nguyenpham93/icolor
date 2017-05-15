const collection = require ('../models/collection');
const account = require ('../models/register');
const auth = require ( '../passport/auth');
const user = require('../models/users');
const likedislike = require('../models/like_dislike');
const moment = require("moment");

module.exports = function (app, passport) {

    app.get ('/', (req, res) => {
        let user_id = 0;
        if(req.session.user.id) {
            user_id = req.session.user.id;
        }
        collection.getAllCollection (user_id)
        .then (result => {
            console.log(result)
            res.render ('index', {
                data: { dt : result, islogin : req.session.login, user : req.session.user.email },
                vue: {
                    head: {
                        title: 'Color Pro',
                        meta: [
                            // { script: '/public/js/home/script.js' },
                            { style: '/public/css/home/style.css',type: 'text/css',rel: 'stylesheet' }
                            ],
                        },
                    components: ['myheader', 'pallet']
                }
            });
        });
    });

    app.get ( '/search/:q/:term' , ( req, res ) => {
        let q = req.params['q'];
        let term = req.params['term'];
        if ( q === 'all' ) {
            collection.getAllCollection ()
            .then ( data => {
                res.json ( {dt : data ,islogin : req.session.login, user : req.session.user.email} );
            });
        } else if ( q === 'hex' ) {
            term = '#' + term;
            collection.searchCollection (term)
            .then (data => {
                res.json ( {dt : data ,islogin : req.session.login, user : req.session.user.email} );
            });
        } else {
            collection.searchCollection (term)
            .then (data => {
                res.json( {dt : data ,islogin : req.session.login, user : req.session.user.email} );
            });
        }
    });
    
    app.get('/relate', (req, res) => {
        let id = req.query.id;
        let id_parent = req.query.idparent;
        let hex = "#" + id;
        let arr = [];
        collection.getColorRelated ( hex, id_parent )
        .then ( data => {
            res.json ({dt : data, islogin : req.session.login, user : req.session.user.email});
        });
    });

    app.get ('/detail/:id', (req, res) => {
        let id = req.params.id;
        collection.getCollection (id)
        .then ( (data) => {
            res.render ('detail', {
                data: { collection: data , islogin : req.session.login, user : req.session.user.email },
                vue: {
                    head: {
                        title: data['name'],
                        meta: [
                                // { script: '/public/js/detail/script.js' },
                                { style: '/public/css/detail/style.css',type: 'text/css',rel: 'stylesheet' }
                            ]
                    },
                    components: ['myheader', 'footerdetail', 'related']
                }
            });
        });
    });

    app.post ('/likedislike', (req, res) => {
        if(req.session.user.id) {
            let status = req.body['action'];
            let user_id = req.session.user.id;
            let collection_id = req.body['collection_id'];

            likedislike.clickLikeDislike(collection_id, user_id, status)
                .then(data => {
                        collection.getCollection (data, user_id)
                            .then ( (data1) => {
                                //console.log(data1);
                                res.json(data1)
                            });
                    },
                    failed => {
                        res.json({error: 'failed'});
                    });
        }else{
            //console.log('Unauthorized');
            res.json({error: 'Error'});
        }
    });

    app.post ('/register', (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        let status = {};
        account.register ( email, password )
        .then ( succeed => {
            if ( succeed ) {
                status = true;
            } else {
                status = false;
            }
            res.json( { status : status ,islogin : req.session.login, user : req.session.user.email} );
        });
    });

    app.get ('/logout', (req, res)=>{
        let session = req.session;
        session.login = false;
        session.user = {};
        session.destroy(function (err) {
            res.json ( { islogin : false } ); 
        });
    });

    app.get ( "/logined" , ( req, res ) => {
        let data = {};
        if (req.session.login) {
            data = { 'islogin' : true, 'user' : req.session.user.email };
        } else {
            data = { 'islogin' : false };
        }
        res.json ( data );
    });

    app.post ( "/login" ,passport.authenticate ( 'local', { successRedirect: '/logined', failureRedirect: '/logined' }));


    //REST for IOS

    app.get ('/all', (req, res) => {
        let user_id = 0;
        if(req.session.user.id) {
            user_id = req.session.user.id;
        }
        collection.getAllCollection (user_id)
        .then (result => {
            res.json(result)
        });
    });


    app.get ('/detailios/:id', (req, res) => {
        let user_id = 0;
        if(req.session.user.id) {
            user_id = req.session.user.id;
        }
        let id = req.params.id;
        collection.getCollection (id, user_id)
        .then ( (data) => {
            res.json(data)
        });
    });

    app.get('/relatedios', (req, res) => {
        let id = req.query.id;
        let id_parent = req.query.idparent;
        let hex = "#" + id;
        let arr = [];
        collection.getColorRelated ( hex, id_parent )
        .then ( data => {
            res.json (data);
        });
    });
}