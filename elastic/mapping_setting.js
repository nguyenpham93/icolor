// This config mapping for COFFY TUNG7

function config () {
    return {
			"collection" : {
				"include_in_all" : false,
				"properties" : {
					"id" : {
						"type" 			 : "text",
						"include_in_all" : true,
						"index"			 : "not_analyzed",
						"analyzer" 		 : "whitespace"
					},
					"name" : {
						"type" 			 : "text",
						"include_in_all" : true,
						"analyzer" 		 : "analyzer_for_index",
						"search_analyzer": "analyzer_for_searching"
					},
					"id_user" : {
						"type" 			 : "text",
						"include_in_all" : true,
						"index"			 : "not_analyzed",
						"analyzer" 		 : "whitespace"
					},
					"share" : {
						"type" : "integer",
						"include_in_all" : true
					},
					"color1" : {
						"type" 			 : "text",
						"include_in_all" : true,
						"index"			 : "not_analyzed",
						"analyzer" 		 : "whitespace"
					},
					"color2" : {
						"type" 			 : "text",
						"include_in_all" : true,
						"index"			 : "not_analyzed",
						"analyzer" 		 : "whitespace"
					},
					"color3" : {
						"type" 			 : "text",
						"include_in_all" : true,
						"index"			 : "not_analyzed",
						"analyzer" 		 : "whitespace"
					},
					"color4" : {
						"type" 			 : "text",
						"include_in_all" : true,
						"index"			 : "not_analyzed",
						"analyzer" 		 : "whitespace"
					},
					"color5" : {
						"type" 			 : "text",
						"include_in_all" : true,
						"index"			 : "not_analyzed",
						"analyzer" 		 : "whitespace"
					},
					"date" : {
						"type" 			 : "date",
						"include_in_all" : true,
						"format": "dd-MM-yyyy HH:mm:ss"
					}
				}
			},
			"users" : {
				"include_in_all" : false,
				"properties"	 : {
					"id" : {
						"type" : "text",
						"include_in_all" : true,
						"index"			 : "not_analyzed",
						"analyzer" 		 : "whitespace"
					},
					"email" : {
						"type" : "text",
						"include_in_all" : true,
						"index"			 : "not_analyzed",
						"analyzer" 		 : "whitespace"
					},
					"date" : {
						"type" 			 : "date",
						"include_in_all" : true,
						"format": "dd-MM-yyyy HH:mm:ss"
					}
				} 
			},
			"like_dislike" : {
				"include_in_all" : false,
				"properties"	 : {
					"id_collection" : {
						"type" : "text",
						"include_in_all" : true,
						"index"			 : "not_analyzed",
						"analyzer" 		 : "whitespace"
					},
					"id_user" : {
						"type" : "text",
						"include_in_all" : true,
						"index"			 : "not_analyzed",
						"analyzer" 		 : "whitespace"
					},
					"status" : {
						// 0 = dislike
						// 1 = like
						"type" : "integer",
						"include_in_all" : true
					},
				} 
			},
			"color" : {
				"include_in_all" : false,
				"properties"	 : {
					"id" : {
						"type" : "text",
						"include_in_all" : true,
						"index"			 : "not_analyzed",
						"analyzer" 		 : "whitespace"
					}
				} 
			},
			"color_related" : {
				"include_in_all" : false,
				"properties"	 : {
					"id" : {
						"type" : "text",
						"include_in_all" : true,
						"index"			 : "not_analyzed",
						"analyzer" 		 : "whitespace"
					},
					"id_related" : {
						"type" : "text",
						"include_in_all" : true,
						"index"			 : "not_analyzed",
						"analyzer" 		 : "whitespace"
					}
				} 
			}
		}
}

module.exports = config;