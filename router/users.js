const collection = require('../models/collection');
const account = require('../models/register');
const auth = require('../passport/auth');
const user = require('../models/users');
const likedislike = require('../models/like_dislike');
const moment = require("moment");
const Promise = require("bluebird");
const bcrypt = require('bcrypt-nodejs');

module.exports = function (app, passport) {
    app.get('/myaccount111', (req, res) => {
        let user_id = req.session.user.id;

        if (typeof user_id === 'undefined') {
            res.redirect('/');
        } else {
            user.getUser(user_id)
                .then((data) => {
                    res.render('account', {
                        data: {
                            islogin: req.session.login,
                            users: req.session.user.email,
                            pagecurrent: 'account'
                        },
                        vue: {
                            head: {
                                title: req.session.user.name,
                            },
                            components: ['myheader', 'leftmenuaccount']
                        }
                    })
                })
        }
    });

    app.get('/myaccount111/changepassword', (req, res) => {
        let user_id = req.session.user.id;

        if (typeof user_id === 'undefined') {
            res.redirect('/');
        } else {
            user.getUser(user_id)
                .then((data) => {
                    res.render('changepassword', {
                        data: {
                            islogin: req.session.login,
                            users: req.session.user.email,
                            pagecurrent: 'changepassword'
                        },
                        vue: {
                            head: {
                                title: req.session.user.name,
                            },
                            components: ['myheader', 'leftmenuaccount']
                        }
                    })
                })
        }
    });

    app.post('/myaccount111/changepassword', (req, res) => {
        let user_id = req.session.user.id;

        let oldpass = req.body['oldpass'];
        let newpass = req.body['newpass'];
        let confirmnewpass = req.body['confirmnewpass'];

        if (typeof user_id === 'undefined') {
            res.json({
                errMsg: 'You must login to change password',
                islogin: req.session.login,
                users: req.session.user.email,
            });
        } else if (newpass !== confirmnewpass) {
            res.json({
                errMsg: 'Password do not match',
                islogin: req.session.login,
                users: req.session.user.email,
            });
        } else if (oldpass && newpass && confirmnewpass) {
            user.getUser(user_id)
                .then((data) => {
                    // console.log(data[0].password)
                    //
                    // bcrypt.hash(oldpass, null, null, function(err, hash) {
                    //     console.log(oldpass)
                    //     console.log(hash + ' \n \n')
                    // });

                    bcrypt.compare(oldpass, data[0].password, (err, result) => {
                        if (err) {
                            return done(err);
                        }
                        if (!result) {
                            res.json({
                                errMsg: 'Old password is incorrect',
                                islogin: req.session.login,
                                users: req.session.user.email,
                            });
                        } else {
                            bcrypt.hash(newpass, null, null, function (err, hash) {
                                let doc = {
                                    id: data[0].id,
                                    email: data[0].email,
                                    password: hash,
                                    facebook_id: "",
                                    facebook_access_token: "",
                                    google_id: "",
                                    google_access_token: "",
                                    date: moment().format("DD-MM-YYYY HH:mm:ss")
                                };
                                user.updateUser(doc)
                                    .then(data => {
                                        res.json({
                                            errMsg: 'Password Change Successful!',
                                            islogin: req.session.login,
                                            users: req.session.user.email,
                                        });
                                    });
                            });
                        }
                    });
                })
        } else {
            res.json({
                errMsg: 'Error',
                islogin: req.session.login,
                users: req.session.user.email,
            });
        }
    });

    app.get('/myaccount111/my-pallet', (req, res) => {

        let user_id = req.session.user.id;

        let q = req.body['page'];
        let n = 20;
        let pgfrom = 0;
        if (q != undefined && q > 0) {
            pgfrom = (pgfrom + q - 1) * n;
        } else {
            q = 1;
        }

        if (typeof user_id === 'undefined') {
            res.redirect('/');
        } else {

            let getTerm = Promise.coroutine(function* () {
                let resultA = yield collection.searchPaginationCollectionByIdUser(user_id, pgfrom, n);
                let resultB = yield collection.searchCollectionByIdUser (user_id);
                return [resultA, resultB];
            });

            getTerm()
                .then(data => {
                    let countAll = data[1].length;
                    p = Math.ceil(countAll / n, 0);

                    res.render('mypallet', {
                        data: {
                            dt: data[0],
                            islogin: req.session.login,
                            users: req.session.user.email || '',
                            allpage: p,
                            page: q,
                            pagecurrent: 'mypallet'
                        },
                        vue: {
                            head: {
                                title: req.session.user.name,
                            },
                            components: ['myheader', 'leftmenuaccount', 'pallet']
                        }
                    })
                });
        }
    });

    app.post('/myaccount111/my-pallet', (req, res) => {

        let selected = req.body['selected'];
        let q = req.body['page'];

        let user_id = req.session.user.id;

        let n = 20;
        let pgfrom = 0;
        if (q != undefined && q > 0) {
            pgfrom = (pgfrom + q - 1) * n;
        } else {
            q = 1;
        }

        if (typeof user_id === 'undefined') {
            res.redirect('/');
        } else {

            collection.searchPaginationCollectionByIdUser(user_id, pgfrom, n)
                .then(data => {
                    //console.log(data);
                    res.json({
                            dt: data,
                            islogin: req.session.login,
                            users: req.session.user.email || '',
                            page: q,
                        })
                });
        }
    });
};