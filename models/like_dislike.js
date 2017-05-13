const elas = require('../elastic/index');
const async = require("async");
const convert = require("color-convert");
const core = require("./core");
const Promise = require("bluebird");
const quickSort = require('./quicksort');

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

    checkLikeDislike(collection_id, user_id, status){

        let fields = [ "id_collection", "id_user" ];

        elas.search2 ("icolor", "like_dislike", '"' + collection_id + ' ' + user_id + '"', fields, "AND")
            .then ( (data) => {
                console.log(data)
                if(data.length > 0){
                    if(data[0].status === status){
                        //delete
                        elas.deleteDocument2("icolor", "like_dislike", "SJLSY3B-l- r1QCo_xkb1")
                            .then ( (data) => {
                                console.log('Delete ok')
                                return 1
                            },
                            error => {
                                console.log('Delete not ok')
                                return 0
                            });
                    }else{
                        //Change status -> !status

                    }
                }
                //cb (null, 'ok');
                return 1
            },
            error => {
                //cb (null, null);
                return 0
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