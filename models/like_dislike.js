const elas = require('../elastic/index');
const async = require("async");
const convert = require("color-convert");
const core = require("./core");
const Promise = require("bluebird");
const quickSort = require('./quicksort');
const shortid = require('shortid');
const moment = require("moment");
const collection = require('../models/collection');

class Likedislike {
    constructor(){}

    getLikeAndDislike (item, cb) {
        elas.search ("icolor", "like_dislike", item['id'])
        .then ( (data) => {
            if ( !data.length ) {
                item['like'] = 0 ;
                item['dislike'] = 0 ;
                cb (null, item);
            } else {
                let like = data.filter( (obj) => {
                    // 1 = like
                    // 0 = dislike
                    return obj['status'] === 1;
                }).length;

                //console.log(like);

                let dislike = data.length - like; 
                item['like'] = like;
                item['dislike'] = dislike;
                cb (null, item);
            }
        },
        error => {
            cb (null, item);
        });
    }

    checkLikeDislike(item, cb){
        let fields = ["id_collection", "id_user"];
        elas.search2("icolor", "like_dislike", item.id + ' ' + item.userlogin, fields, "AND")
            .then((data) => {
                    if(data.length > 0) {
                        item.currentAction = data[0].status
                    }else{
                        item.currentAction = '';
                    }
                    cb (null, item);
                },
                error => {
                    cb (null, item);
                });
    }

    clickLikeDislike(collection_id, user_id, status, cb ){
        return new Promise( ( resolve, reject ) => {
            let fields = ["id_collection", "id_user"];
            elas.search2("icolor", "like_dislike", collection_id + ' ' + user_id, fields, "AND")
                .then((data) => {
                        elas.search ("icolor", "collection", collection_id)
                            .then(data2 => {
                                 let like_old = data2[0].like;
                                 let dislike_old = data2[0].dislike;
                                 if (data.length >= 1) {
                                    //Change or Delete
                                    if (data[0].status !== status) {
                                        //Change
                                        let doc1 = {};
                                        if (data[0].status === 1) {
                                            data[0].status = 0;
                                            doc1 = {
                                                id: collection_id,
                                                like: like_old - 1,
                                                dislike: dislike_old + 1
                                            };
                                        } else {
                                            data[0].status = 1;
                                            doc1 = {
                                                id: collection_id,
                                                like: like_old + 1,
                                                dislike: dislike_old - 1
                                            };
                                        }

                                        elas.updateDocument('icolor', 'like_dislike', data[0])
                                            .then((data1) => {
                                                elas.updateDocument('icolor', 'collection', doc1)
                                                .then((data3) => {
                                                    resolve(collection_id)
                                                })
                                            })
                                    } else {
                                        //Delete
                                        let doc1 = {};
                                        if (status === 1) {
                                            doc1 = {
                                                id: collection_id,
                                                like: like_old - 1
                                            };
                                        }else{
                                            doc1 = {
                                                id: collection_id,
                                                dislike: dislike_old - 1
                                            };
                                        }
                                        elas.deleteDocument('icolor', 'like_dislike', data[0])
                                            .then((data1) => {
                                                elas.updateDocument('icolor', 'collection', doc1)
                                                .then((data3) => {
                                                    resolve(collection_id)
                                                })
                                            })

                                    }
                                } else {
                                    //Insert
                                    let doc = {
                                        "id": shortid.generate(),
                                        "id_collection": collection_id,
                                        "id_user": user_id,
                                        "status": status,
                                        "date": moment().format("DD-MM-YYYY HH:mm:ss")
                                    };

                                    let doc1 = {};
                                    if (status === 1) {
                                        doc1 = {
                                            id: collection_id,
                                            like: like_old + 1
                                        };
                                    }else{
                                        doc1 = {
                                            id: collection_id,
                                            dislike: dislike_old + 1
                                        };
                                    }
                                    elas.insertDocument('icolor', 'like_dislike', doc)
                                        .then((data1) => {
                                            elas.updateDocument('icolor', 'collection', doc1)
                                            .then((data3) => {
                                                resolve(collection_id)
                                            })
                                        })
                                }

                            })
                    },
                    error => {
                        return '';
                    });
        });
    }

    addLike (data) {
        elas.insertDocument ("icolor", "like_dislike", data)
        .then ((data) => {
            console.log(data);
        });
    }
}

module.exports = new Likedislike();
