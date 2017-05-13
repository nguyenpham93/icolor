const collection = require ('../models/collection');
const account = require ('../models/register');
const auth = require ( '../passport/auth');
const user = require('../models/users');
const likedislike = require('../models/like_dislike');

module.exports = function (app, passport) {

    app.get ('/', (req, res) => {
        collection.getAllCollection ()
        .then (result => {
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
                    components: ['myheader']
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
                data: { collection: data[0] , islogin : req.session.login, user : req.session.user.email },
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
        let status = req.body['action'];
        let user_id = req.body['user_id'];
        let collection_id = req.body['collection_id'];

        let like = {
            "id_collection" : collection_id,
            "id_user"  : user_id,
            "status"   : status,
            "date"     : moment().format("DD/MM/YYYY")
        }

        likedislike.checkLikeDislike(collection_id, user_id, status)
            .then ( succeed => {
                status = {
                    'success' : 'Register succesfull'
                }
                res.json( succeed );
            },
            failed => {
                status = {
                    'error' : 'Email is already used'
                }
            });
            //res.json( status );

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
}