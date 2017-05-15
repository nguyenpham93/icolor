const elas = require('../elastic/index');
const async = require("async");
const convert = require("color-convert");
const core = require("./core");
const Promise = require("bluebird");
const quickSort = require('./quicksort');
const user = require('./users');
const likedislike = require('./like_dislike');

class Collection {
    constructor(){}

    getAllCollection (user_id) {
        return new Promise ( (resolve, reject) => {
            elas.searchAll ( "icolor", "collection" )
            .then ( (data) => {
                data.forEach((i) => {
                    i.userlogin = user_id;
                });
                async.mapSeries (data, user.getAuthor, (err, result) => {
                    async.mapSeries (data, likedislike.getLikeAndDislike, (err, result) => {
                        async.mapSeries (data, likedislike.checkLikeDislike, (err, result) => {
                            resolve (result);
                        });
                    });
                });
            });
        });
    }

    getCollection (id, user_id) {
        return new Promise ( (resolve, reject) => {
            elas.search ("icolor", "collection", id)
            .then ( (data) => {
                // ES search will return an array, so we just get by index 0
                user.getAuthor ( data[0] , (err, result) => {
                    likedislike.getLikeAndDislike(data[0], (err, result) => {
                            resolve(result);
                    });

                    // async.mapSeries(data, likedislike.getLikeAndDislike, (err, result) => {
                    //
                    // })

                });
            });
        });
    }

    searchCollection ( term ) {
        return new Promise ( (resolve, reject) => {
            elas.search ("icolor", "collection", term)
            .then ( data => {
                async.mapSeries (data, user.getAuthor, (err, result) => {
                    async.mapSeries (data, likedislike.getLikeAndDislike, (err, result) => {
                        resolve (result);
                    });
                });
            });
        });
    }

    getAllColor() {
        return elas.searchAll ( "icolor", "color" );
    }

    getColorRelated ( hex, id_parent ) {
        let that = this;
        return new Promise ( (resolve, reject) => {
            // Get all color related
            elas.search ( "icolor", "color_related", hex )
            .then (data => {
                let n = data.length;
                let arr_id_related = [];
                // Sort by Ascending 
                let sorted = quickSort ( data, 0, n-1 );
                // Get 10 most related
                sorted = sorted.slice ( 0, 10 );
                arr_id_related = that.getIdRelated (sorted, hex);
                that.getCollectionRelated (arr_id_related)
                .then ( (data) => {
                    let temp = [];
                    data.forEach ( (val) => {
                        val.forEach ( (item) => {
                            if ( !that.isSameResult ( item['id'], id_parent, temp) ) {
                                temp.push ( item );
                            }
                        });
                    });
                    async.mapSeries ( temp, user.getAuthor, (err, result) => {
                        resolve (result);
                    });
                });
            });
        });
    }

    getIdRelated ( arr, id ) {
        let temp = [];
        arr.forEach ( (val) => {
            if (val['id'] === id) {
                temp.push ( val['id_related'] );
            } else {
                temp.push ( val['id'] );
            }
        }) ;
        return temp;
    }

    getCollectionRelated ( colors ) {
        let that = this;
        return new Promise ( (resolve, reject) => {
            async.mapSeries (colors, that.findCollection, (err, result) => {
                resolve (result);
            });
        });
    }

    findCollection ( item, cb ) {
        elas.search ( "icolor", "collection", item)
        .then ( (data) => {
            cb (null, data);
        },
        error => {
            cb (null, data);
        });
    }

    /*
    * Param id : id cua pallet muon kiem tra
    * Param id_parent : id cua pallet duoc tim kiem lien quan
    * Param pallets : danh sach cac pallets lien quan lay ra duoc
    * Return 'TRUE' : neu pallet can kiem tra da ton tai 
    * Return 'FALSE' : neu pallet can kiem tra chua ton tai
    */
    //TODO : kiem tra Pallet hien tai co bi trung lap khong
    isSameResult ( id, id_parent, pallets ) {
        let tmp = pallets.find ( (element) => {
                    return id === element['id']; 
                  });
        if ( !tmp && id !== id_parent ){
            return false;
        }
        return true;
    }

    addCollection( userPallet ) {
        let that = this;
        return new Promise ( (resolve, reject) => {
            elas.searchAll ( "icolor", "collection" )
            .then ( pallets => {
                if ( that.isPalletExist ( pallets, userPallet ) ) {
                    reject ( 'Pallet already existed' );
                } else {
                    elas.insertDocument ( "icolor", "collection", userPallet )
                    .then (() => {
                        let colors = that.getColorsInPallet ( userPallet );
                        that.addColor ( colors )
                        .then ( data => {
                            resolve ( "Insert succeed" );
                        },
                        error => {
                            resolve ( "Insert succeed" );
                        });
                    });
                }
            });
        });
    }

    // TODO : Check if Pallet already existed in database
    /* 
    * Param allPallet  : Array contains all Pallets in database
    * Param userPallet : New pallet to add to database  
    * Return 'TRUE' if Pallet already existed 
    * Return 'FALSE' if Pallet not existed , available to add to database
    */

    isPalletExist ( allPallet, userPallet ) {
        let n = allPallet.length;
        let pallet2 = this.getColorsInPallet ( userPallet );
        for ( let i = 0; i < n; i++ ) {
            let pallet1 = this.getColorsInPallet ( allPallet[i] );               
            if ( this.isSamePallet ( pallet1, pallet2 ) ) { return true; }
        }
        return false;
    }

    // TODO : Check if two Pallet is the same
    /* 
    * Return 'TRUE' if two Pallets are the same 
    * Return 'FALSE' if they are not same 
    */

    isSamePallet ( pallet1 , pallet2 ){
        let n = pallet1.length;
        for ( let i = 0; i < n; i++){
            let flag = 0;
            for ( let j = 0; j < n; j ++ ) {
                if ( pallet2 [i] === pallet1 [j]) {
                    flag++;
                    break;
                }
            }
            if ( !flag ) { return false; }
        }
        return true;
    }

    // TODO : Just get all colors of Pallet
    getColorsInPallet ( pallet ){
        return [ pallet['color1'],
                pallet['color2'],
                pallet['color3'],
                pallet['color4'],
                pallet['color5']];
    }

    addColor ( arrColor ) {
        console.log(arrColor);
        let that = this;
        return new Promise (( resolve, reject ) => {
            function demo ( item, cb ) {
                that.checkColorExist ( item )
                .then (( data ) => {
                    cb ( null, data );
                },
                error => {
                    cb (null, error);
                });
            }
            async.mapSeries ( arrColor, demo, ( err, result ) => {
                resolve ( result );
            });
        });
    }

    checkColorExist ( color ) {   
        let that = this;
        return new Promise (( resolve, reject ) => {
            elas.search ( "icolor", "color", color )
            .then (data => {
                console.log(data.length);
                if ( !data.length ) {
                    let temp = {
                        "id" : color
                    }
                    elas.insertDocument ( "icolor", "color", temp )
                    .then ( data => {
                        that.findColorSimilar ( color )
                        .then ( data => {
                            resolve ( data );
                        });
                    });
                } else {
                    resolve ( color );
                }
            });
        });
    }

    findColorSimilar ( color1 ) {
        let that = this;
        return new Promise (( resolve, reject ) => {
            that.getAllColor ()
            .then (data => {
                data.forEach ( (color2) => {
                    let temp1 = {};
                    let lab1 = convert.hex.lab ( color1 );
                    let lab2 = convert.hex.lab ( color2['id'] );
                    let distance = core.DeltaECIE ( lab1, lab2 );

                    // color related if score between two colors less than 50
                    if ( distance < 50 ) {
                        temp1['id'] = color1;
                        temp1['id_related'] = color2 ['id'];
                        temp1['_score'] = distance;
                        elas.insertColorRelated ( "icolor", "color_related", temp1 ).then (()=>{
                            resolve ('Colors are related');
                        });
                    } else {
                        resolve ("Colors are not related");
                    }
                });
            });
        });
    }
}

module.exports = new Collection();
