function config (){
     return {
			"number_of_shards": 5,

			"analysis" : {
				"char_filter" : {
					"&_to_and" : {
						"type" : "mapping",
						"mappings" : [ "& => and" ]  
				}},
				"filter" : {
					"my_filter" : {
						"type" : "nGram",
						"min_gram" : 1,
						"max_gram" : 15,
						"token_chars" : [
							"letter",
							"digit",
							"punctuation",
							"symbol"
						]
					}},
				"analyzer" : {
					"analyzer_for_index" : {
						"type" 		  : "custom",
						"char_filter" : [ "html_strip", "&_to_and" ],
						"tokenizer"	  : "standard",
						"filter"	  : [ 'lowercase', "my_filter", 'asciifolding' ]
					},
					"analyzer_for_searching" : {
						"type"	: "custom",
						"char_filter" : [ "html_strip", "&_to_and" ],
						"tokenizer"	  : "standard",
						"filter"	  : [ 'lowercase']	
					}
				}
			}
		}
}

module.exports = config;
