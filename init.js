/*
* Author : nguyenpham93
* This file is to create and add data to Elasticsearch
*/

const elas = require("./elastic/index");
const moment = require("moment");
const shortid = require("shortid");
const data = require("./data.json");
const async = require("async");
const coll = require("./models/collection");
const bcrypt = require('bcrypt-nodejs');
//Create Index
function createIndex () {
    elas.createIndex("icolor",(err,stt)=>{
        if (err) {
            console.log(err);
        } else {
            console.log(stt);
        }
    });
}
//createIndex();

//Delete Index
function deleteIndex () {
    elas.deleteIndex("icolor",(err, stt)=>{
        if (err) console.log(err);
        else console.log(stt);
    });
}
//deleteIndex();

// Merge Data into ElasticSearch
function initData() {
    let colors = [];
    for (let count in data) {
        delete data[count].key;
        delete data[count].key1;
        data[count].id = shortid.generate();
        data[count].name = data[count]['string'];
        delete data[count]["string"];
        data[count].color1 = data[count]['array'][0];
        data[count].color2 = data[count]['array'][1];
        data[count].color3 = data[count]['array'][2];
        data[count].color4 = data[count]['array'][3];
        data[count].color5 = data[count]['array'][4];
        delete data[count]["array"];
        data[count].date = moment().format("DD-MM-YYYY HH:mm:ss");
        data[count].description = "Color collection";
        data[count]['id_user'] = "rJBkgtYyb";
        delete data[count].author;
        delete data[count].author_email;
        data[count].like = 0;
        data[count].dislike = 0;

        data[count].share = 0;
        colors.push(data[count]);
    }
    async.mapSeries (colors, merge, (err, rs) => {
        console.log(rs);
    });
}

 //initData();

function merge(item, cb){
    coll.addCollection(item)
    .then (data => {
        cb(null,data);
    },
    error => {
        console.log(error);
        cb (null, error);
    });
}


// Add author
let author = {
    "id"  : 'rJBkgtYyb',
    "email" : "bluevn@gmail.com",
    "password" : "rootvn",
    'facebook_id' : "",
    "facebook_access_token" : "",
    'google_id' : "",
    "google_access_token" : "",
    "date" :  moment().format("DD-MM-YYYY HH:mm:ss")
}

function addAuthor (author){
    bcrypt.hash(author['password'], null, null, function(err, hash) {
                        author['password'] = hash;
                        elas.insertDocument ("icolor", "users", author)
            .then ((data) => {
                console.log(data);
            });
                    });
}

//addAuthor(author);

let collection = {
    id: shortid.generate(),
    name: "The Shepherd's Boy",
    color1: '#FE4365',
    color2: '#036564',
    color3: '#B38184',
    color4: '#F77825',
    color5: '#E6AC27',
    date: moment().format("DD-MM-YYYY HH:mm:ss"),
    description: 'Pro color',
    id_user: 'rJBkgtYyb',
    like: 0,
    dislike: 0,
    share: 0
}

function addCollection2 (collection){
    coll.addCollection(collection)
    .then (data => {
        console.log(data);
    },
    error => {
        console.log (error);
    });
}
// addCollection2(collection);

let doc1 = [ { id: 'SkQW2aJWb',
      name: 'Dat',
      color1: '#ffffff',
      color2: '#ffff00',
      color3: '#ff0000',
      color4: '#000000',
      color5: '#ff00ff',
      date: '22-05-2017 09:24:58',
      description: '',
      id_user: 'r1o1n61WZ',
      like: 0,
      dislike: 0,
      share: 0,
      userlogin: 0,
      author: 'thanhdat21293@gmail.com',
      currentAction: '' },
    { id: 'r1uMeXTJZb',
      name: 'LoversInJapan',
      color1: '#E94E77',
      color2: '#D68189',
      color3: '#C6A49A',
      color4: '#C6E5D9',
      color5: '#F4EAD5',
      date: '22-05-2017 08:46:18',
      description: 'Color collection',
      id_user: 'rJBkgtYyb',
      like: 0,
      dislike: 0,
      share: 0,
      userlogin: 0,
      author: 'bluevn@gmail.com',
      currentAction: '' },
    { id: 'r1vzl7pyZ-',
      name: 'Ocean Five',
      color1: '#00A0B0',
      color2: '#6A4A3C',
      color3: '#CC333F',
      color4: '#EB6841',
      color5: '#EDC951',
      date: '22-05-2017 08:46:18',
      description: 'Color collection',
      id_user: 'rJBkgtYyb',
      like: 0,
      dislike: 0,
      share: 0,
      userlogin: 0,
      author: 'bluevn@gmail.com',
      currentAction: '' },
    { id: 'B1qgzx7pk--',
      name: 'forever lost',
      color1: '#5D4157',
      color2: '#838689',
      color3: '#A8CABA',
      color4: '#CAD7B2',
      color5: '#EBE3AA',
      date: '22-05-2017 08:46:18',
      description: 'Color collection',
      id_user: 'rJBkgtYyb',
      like: 0,
      dislike: 0,
      share: 0,
      userlogin: 0,
      author: 'bluevn@gmail.com',
      currentAction: '' },
    { id: 'rkLxzxmak-Z',
      name: 'Maddening Caravan',
      color1: '#FAD089',
      color2: '#FF9C5B',
      color3: '#F5634A',
      color4: '#ED303C',
      color5: '#3B8183',
      date: '22-05-2017 02:46:18',
      description: 'Color collection',
      id_user: 'rJBkgtYyb',
      like: 0,
      dislike: 0,
      share: 0,
      userlogin: 0,
      author: 'bluevn@gmail.com',
      currentAction: '' },
    { id: 'BkRgMemaybW',
      name: 'A Dream in Color',
      color1: '#1B676B',
      color2: '#519548',
      color3: '#88C425',
      color4: '#BEF202',
      color5: '#EAFDE6',
      date: '22-05-2017 09:46:18',
      description: 'Color collection',
      id_user: 'rJBkgtYyb',
      like: 0,
      dislike: 0,
      share: 0,
      userlogin: 0,
      author: 'bluevn@gmail.com',
      currentAction: '' },
    { id: 'rk1WMlQ6ybZ',
      name: '1001 Stories',
      color1: '#F8B195',
      color2: '#F67280',
      color3: '#C06C84',
      color4: '#6C5B7B',
      color5: '#355C7D',
      date: '21-04-2017 08:46:18',
      description: 'Color collection',
      id_user: 'rJBkgtYyb',
      like: 0,
      dislike: 0,
      share: 0,
      userlogin: 0,
      author: 'bluevn@gmail.com',
      currentAction: '' },
    { id: 'BkYMe7a1ZZ',
      name: 'Good Friends',
      color1: '#D9CEB2',
      color2: '#948C75',
      color3: '#D5DED9',
      color4: '#7A6A53',
      color5: '#99B2B7',
      date: '30-05-2017 08:46:18',
      description: 'Color collection',
      id_user: 'rJBkgtYyb',
      like: 0,
      dislike: 0,
      share: 0,
      userlogin: 0,
      author: 'bluevn@gmail.com',
      currentAction: '' }];

function deleteDocument (doc2){
    elas.deleteDocument ("icolor","like_dislike", doc2)
    .then ( data => {
        console.log (data);
    }, 
    err => {
        console.log (err);
    });
}
doc1.forEach((i) => {
    //deleteDocument(i);
})

// Add Like & Dislike
let like = {
    "id"            : shortid.generate(),
    "id_collection" : "r1-bxZIEe-",
    "id_user"       : "rJBkgtYyb",
    "status"        : 0,
    "date"          : moment().format("DD-MM-YYYY HH:mm:ss")
}
function addLike () {
    elas.insertDocument ("icolor", "like_dislike", like)
    .then ((data) => {
        console.log(data);
    });
}
//addLike();


//update
let like1 = [ { id: 'SkQW2aJWb',
      name: 'Dat',
      color1: '#ffffff',
      color2: '#ffff00',
      color3: '#ff0000',
      color4: '#000000',
      color5: '#ff00ff',
      date: '22-05-2017 09:24:58',
      description: '',
      id_user: 'r1o1n61WZ',
      like: 0,
      dislike: 0,
      share: 0,
      userlogin: 0,
      author: 'thanhdat21293@gmail.com',
      currentAction: '' },
    { id: 'r1uMeXTJZb',
      name: 'LoversInJapan',
      color1: '#E94E77',
      color2: '#D68189',
      color3: '#C6A49A',
      color4: '#C6E5D9',
      color5: '#F4EAD5',
      date: '22-05-2017 08:46:18',
      description: 'Color collection',
      id_user: 'rJBkgtYyb',
      like: 0,
      dislike: 0,
      share: 0,
      userlogin: 0,
      author: 'bluevn@gmail.com',
      currentAction: '' },
    { id: 'r1vzl7pyZ-',
      name: 'Ocean Five',
      color1: '#00A0B0',
      color2: '#6A4A3C',
      color3: '#CC333F',
      color4: '#EB6841',
      color5: '#EDC951',
      date: '22-05-2017 08:46:18',
      description: 'Color collection',
      id_user: 'rJBkgtYyb',
      like: 0,
      dislike: 0,
      share: 0,
      userlogin: 0,
      author: 'bluevn@gmail.com',
      currentAction: '' },
    { id: 'B1qgzx7pk--',
      name: 'forever lost',
      color1: '#5D4157',
      color2: '#838689',
      color3: '#A8CABA',
      color4: '#CAD7B2',
      color5: '#EBE3AA',
      date: '22-05-2017 08:46:18',
      description: 'Color collection',
      id_user: 'rJBkgtYyb',
      like: 0,
      dislike: 0,
      share: 0,
      userlogin: 0,
      author: 'bluevn@gmail.com',
      currentAction: '' },
    { id: 'rkLxzxmak-Z',
      name: 'Maddening Caravan',
      color1: '#FAD089',
      color2: '#FF9C5B',
      color3: '#F5634A',
      color4: '#ED303C',
      color5: '#3B8183',
      date: '22-05-2017 02:46:18',
      description: 'Color collection',
      id_user: 'rJBkgtYyb',
      like: 0,
      dislike: 0,
      share: 0,
      userlogin: 0,
      author: 'bluevn@gmail.com',
      currentAction: '' },
    { id: 'BkRgMemaybW',
      name: 'A Dream in Color',
      color1: '#1B676B',
      color2: '#519548',
      color3: '#88C425',
      color4: '#BEF202',
      color5: '#EAFDE6',
      date: '22-05-2017 09:46:18',
      description: 'Color collection',
      id_user: 'rJBkgtYyb',
      like: 0,
      dislike: 0,
      share: 0,
      userlogin: 0,
      author: 'bluevn@gmail.com',
      currentAction: '' },
    { id: 'rk1WMlQ6ybZ',
      name: '1001 Stories',
      color1: '#F8B195',
      color2: '#F67280',
      color3: '#C06C84',
      color4: '#6C5B7B',
      color5: '#355C7D',
      date: '21-04-2017 08:46:18',
      description: 'Color collection',
      id_user: 'rJBkgtYyb',
      like: 0,
      dislike: 0,
      share: 0,
      userlogin: 0,
      author: 'bluevn@gmail.com',
      currentAction: '' },
    { id: 'BkYMe7a1ZZ',
      name: 'Good Friends',
      color1: '#D9CEB2',
      color2: '#948C75',
      color3: '#D5DED9',
      color4: '#7A6A53',
      color5: '#99B2B7',
      date: '30-05-2017 08:46:18',
      description: 'Color collection',
      id_user: 'rJBkgtYyb',
      like: 0,
      dislike: 0,
      share: 0,
      userlogin: 0,
      author: 'bluevn@gmail.com',
      currentAction: '' }];

function update (val) {
    elas.updateDocument('icolor','collection', val);
}

like1.forEach((i) => {
    //update (i)
});

//update();

// Search ALl for test
function searchAll (){
	elas.search("icolor","users", "thanhdat21293@gmail.com")
     .then (data => {
         console.log(data);
         console.log(data.length);
     });
}
searchAll();


// elas.search("icolor","color_related", "#D95B43")
//  .then (data => {
//      console.log(data);
//  });

// rJDog98lb
let allPallet = [
    {
        id: 'B1GkgJ3xb',
        name: 'TD123',
        color1: '#234567',
        color2: '#234568',
        color3: '#234569',
        color4: '#234560',
        color5: '#234561',
        date: '19-05-2017',
        description: '',
        id_user: 'rJDog98lb',
        share: 0
    },
    {
        id: 'B1GkgJ3xb1',
        name: 'TD',
        color1: '#234567',
        color2: '#234568',
        color3: '#234569',
        color4: '#234560',
        color5: '#234561',
        date: '19-05-2017',
        description: '',
        id_user: 'rJDog98lb',
        share: 0
    },
];

let userPallet = {
        id: 'rJW-xyngZ',
        name: ' td123 ',
        color1: '#234567',
        color2: '#234568',
        color3: '#234569',
        color4: '#234560',
        color5: '#234561',
        date: '19-05-2017',
        description: '',
        id_user: 'rJDog98lb',
        share: 0
    };

let isSamePallet = ( allPallet , userPallet ) => {
    let n = allPallet.length;
    let check = 0;
    for(let i = 0; i < n; i++){
        let name_old = allPallet[i].name.trim().toLowerCase();
        let name_new = userPallet.name.trim().toLowerCase();

        if(name_old === name_new){
            check = 1;
        }
    }
    if(check === 1){
        return true
    }else{
        return false;
    }
};

//console.log(isSamePallet ( allPallet , userPallet ));

// function makeArrayConsecutive2(statues) {
//     var n = statues.length;
//     var a = 0;
//
//     for(var i = 0; i < n; i++){
//         for(var j = i-1; j >= 0; j--){
//             if(statues[j] > statues[j + 1]) {
//                 var term = statues[j];
//                 statues[j] = statues[j+1];
//                 statues[j+1] = term;
//             }
//         }
//     }
//
//     if(n > 1){
//         var a = 0;
//         var current = 0;
//         for(var i = n-2; i >=0; i--){
//             var b = statues[i+1] - statues[i];
//             if(b > 1) {
//                a += b - 1;
//             }
//         }
//
//         // for(var j = current - 1; j >=0; j--){
//         //     a += statues[current] - statues[j] - 1;
//         // }
//     }
//
//     return a;
//
// }
// //[2,3,5,6]
// console.log(makeArrayConsecutive2([5,4,6]))
//makeArrayConsecutive2([6,2,3,8])
