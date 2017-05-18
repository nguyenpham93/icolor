const cn = require ('./connect');
const analyse_setting = require ("./analyse_setting");
const mapping_setting = require ("./mapping_setting");
const Promise = require('bluebird');
const shortid = require("shortid");
const elas = require('../elastic/index');

class elastic {
	constructor () {
		this.elas = cn;
	}

	updateDocument (index, type, doc) {
		return new Promise ( (resolve, reject) => {
            this.elas.update({
                index: index,
                type: type,
                id: doc['id'],
                body: {doc: doc},
				refresh : "wait_for"
            }, (err, result, status) => {
					resolve(result);

            });
        });
	};

	createIndex (index, cb) {
		let setting = analyse_setting();
		let mapping = mapping_setting();
		this.elas.indices.create ({
			index : index,
			body  : {
				"settings" : setting,
				"mappings" : mapping
			}
		}, (err, result, status) => {
			if (err) {
				cb (err.message);
			} else {
				cb (null, `Index ${result} was created`);
			}
		});
	}

	insertDocument (index, type, doc) {
		return new Promise ( (resolve, reject) => {
			this.elas.index ({
				index : index,
				type  : type,
				id : doc['id'],
				body : doc,
				refresh : "wait_for"
			}, ( err, resp, status ) => {
				resolve (resp)
			});
		});
	}

	insertColorRelated (index, type, doc) {
		return new Promise ( (resolve, reject) => {
			this.elas.index ({
				index : index,
				type  : type,
				body : doc,
				refresh : "wait_for"
			}, ( err, resp, status ) => {
				resolve (resp)
			});
		});
	}

	deleteIndex (index, cb) {
		this.elas.indices.delete ({
			index : index
		}, ( err, result, status) => {
			if ( err ) {
				cb (err.message);
			}
			else {
				cb (null, `deleted ${result}`);
			}
		})
	}

	// deleteDocument (index, type, id ){
	// 	return new Promise ( (resolve, reject) => {
	// 		this.elas.deleteByQuery({
	// 			index: index,
	// 			type: type,
	// 			body : {
	// 				"query": {
	// 						"match": {
	// 							"id_collection": id
	// 						}
	// 					}
	// 			}
	// 		},function(err,resp,status) {
	// 			if (err) {
	// 				reject (err);
	// 			} else {
	// 				resolve (resp);
	// 			}
	// 		});
	// 	});
	// }

    deleteDocument (index, type, doc ){
        return new Promise ( (resolve, reject) => {
            this.elas.delete({
                index: index,
                type: type,
                id : doc['id'],
                body : doc,
				refresh : "wait_for"
            },function(err,resp,status) {
                if (err) {
                    reject (err);
                } else {
                    resolve (resp);
                }
            });
        });
    }

	searchAll ( index, type ) {
		return new Promise ( ( resolve, reject ) => {
			this.elas.search ({
				index : index,
				type : type,
				body : {
					"from"  : 0,
					"size"  : 5000,
					"query" : {
						"match_all" : {}
					}
				}
			} , ( err, resp, stt) => {
				if (err) {
					reject (err.message);
				} else {
					let products = [];
					resp.hits.hits.forEach ( (product) => {
						products.push ( product['_source'] );
					});
					resolve ( products );
				}
			});
		})
	}

	searchPagination ( index, type, pgfrom, n, selected ) {
    	let sort = {};
    	if(selected === 'like') {
            sort = {
                "date": {
                    "order": "asc"
                }
            };
        }else{
    		sort = {
                "date": {
                    "order": "desc"
                }
            };
		}
		return new Promise ( ( resolve, reject ) => {
			this.elas.search ({
				index : index,
				type : type,
				body : {
					"from"  : pgfrom,
					"size"  : n,
					sort: sort,
					"query" : {
						"match_all" : {}
					}
				}
			} , ( err, resp, stt) => {
				if (err) {
					reject (err.message);
				} else {
					let products = [];
					resp.hits.hits.forEach ( (product) => {
						products.push ( product['_source'] );
					});
					resolve ( products );
				}
			});
		})
	}

	searchPaginationTerm ( index, type, term, selected, pgfrom, n ) {
    	let fields = this.setTypeFields (type);
    	let sort = {};
    	if(selected === 'like') {
            // sort = {
            //     "date": {
            //         "order": "desc"
            //     }
            // };
        }else{
    		sort = {
                "date": {
                    "order": "desc"
                }
            };
		}
		return new Promise( ( resolve, reject ) => {
			this.elas.search ({
				index : index,
				type  : type,
				body  : {
					"from"  : pgfrom,
					"size"  : n,
					sort: sort,
					query: {
						"multi_match" : {
							"query"  	 : term,
							"type" 	 	 : "best_fields",
							"fields" 	 : fields,
							"tie_breaker" : 0.3
						}
					}
				}
			}, (error, response, status) => {
				if (error) {
					reject ( error.message );
				} else {
					let products = [];
					response.hits.hits.forEach ( (product) => {
						products.push ( product["_source"] );
					});
					resolve ( products );
				}
			});
		});
	}

	searchTerm ( index, type, term, selected ) {

		return new Promise( ( resolve, reject ) => {
    		let fields = this.setTypeFields (type);
			this.elas.search ({
				index : index,
				type  : type,
				body  : {
					"from"  : 0,
					"size"  : 5000,
					query: {
						"multi_match" : {
							"query"  	 : term,
							"type" 	 	 : "best_fields",
							"fields" 	 : fields,
							"tie_breaker" : 0.3
						}
					}
				}
			}, (error, response, status) => {
				if (error) {
					reject ( error.message );
				} else {
					let products = [];
					response.hits.hits.forEach ( (product) => {
						products.push ( product["_source"] );
					});
					resolve ( products );
				}
			});
		});
	}

	search ( index, type, term ) {

		return new Promise( ( resolve, reject ) => {
    		let fields = this.setTypeFields (type);
			this.elas.search ({
				index : index,
				type  : type,
				body  : {
					"from"  : 0,
					"size"  : 5000,
					query: {
						"multi_match" : {
							"query"  	 : term,
							"type" 	 	 : "best_fields",
							"fields" 	 : fields,
							"tie_breaker" : 0.3
						}
					}
				}
			}, (error, response, status) => {
				if (error) {
					reject ( error.message );
				} else {
					let products = [];
					response.hits.hits.forEach ( (product) => {
						products.push ( product["_source"] );
					});
					resolve ( products );
				}
			});
		});
	}

	search2 ( index, type, term, fields, operator ) {

		return new Promise( ( resolve, reject ) => {
			this.elas.search ({
				index : index,
				type  : type,
				body  : {
					"from"  : 0,
					"size"  : 50,
					query   : {
						"multi_match" : {
							"query"  	 : term,
							"type" 	 	 : "cross_fields",
							"fields" 	 : fields,
							"tie_breaker" : 0.3,
							"operator" : operator
						}
					}
				}
			}, (error, response, status) => {
				if (error) {
					console.log(error);
					reject ( error.message );
				} else {
					let products = [];
					response.hits.hits.forEach ( (product) => {
						products.push ( product["_source"] );
					});
					resolve ( products );

				}
			});
		});
	}

	search2Pagination ( index, type, term, fields, operator, pgfrom, n ) {

		return new Promise( ( resolve, reject ) => {
			this.elas.search ({
				index : index,
				type  : type,
				body  : {
					"from"  : pgfrom,
					"size"  : n,
					query   : {
						"multi_match" : {
							"query"  	 : term,
							"type" 	 	 : "cross_fields",
							"fields" 	 : fields,
							"tie_breaker" : 0.3,
							"operator" : operator
						}
					}
				}
			}, (error, response, status) => {
				if (error) {
					console.log(error);
					reject ( error.message );
				} else {
					let products = [];
					response.hits.hits.forEach ( (product) => {
						products.push ( product["_source"] );
					});
					resolve ( products );

				}
			});
		});
	}

	setTypeFields (type){
		switch (type) {
			case "collection" :
				return [ "id", "name", "color1", "color2", "color3", "color4", "color5", "id_user" ];
			case "users"    :
				return [ "id", "email" ];
			case "like_dislike" :
				return [ "id_collection", "id_user" ];
			case "color" :
				return [ "id"];
			case "color_related" :
				return [ "id", "id_related" ];
			default :
				return [];
		}
	}
}

module.exports = new elastic();