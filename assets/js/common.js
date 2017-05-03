let WordFoxPro = (() => {
	let _data = [],
		_googleBaseUrl = "https://www.google.com/complete/search?client=serp&hl=en&" + 
					"gs_rn=64&" + 
					"gs_ri=serp&" + 
					"tok=_26fsU2zJJ1O7pXrkf9WGw&cp=8&gs_id=fe&xhr=t&gl=us&q=",
		_amazonBaseUrl = "http://completion.amazon.com/search/complete?method=completion&mkt=1" +
					"&client=amazon-search-ui&search-alias=aps" + 
					"&qs=&cf=1&noCacheIE=1439383634993&fb=1&sc=1&q=",
		_dictionaryBaseUrl = "http://www.dictionaryapi.com/api/v1/references/thesaurus/xml/",
		_dictionaryKeyParams = "?key=cf6596ea-440b-42fb-9bbd-70a4525c8c95",
		_cafeBaseUrl = "",
		_chars = ["abcdefghijklmnopqrstuvwxyz"],

		checkDictionary = function(keyword, callback) {
			$.ajax({
				url: _dictionaryBaseUrl + keyword + _dictionaryKeyParams,
				method: "GET",
				success: function(response) {
					console.log(response);

					if (typeof callback === "function") {
						callback(response);
					}
				}
			});
		},

		checkGoogle = function(keyword, callback) {
			$.ajax({
				url: _googleBaseUrl + keyword,
				method: "GET",
				success: function(response) {
					console.log(response);

					if (typeof callback === "function") {
						callback(response);
					}
				}
			});
		},

		checkAmazon = function(keyword, callback) {
			$.ajax({
				url: _amazonBaseUrl + keyword,
				method: "GET",
				success: function(response) {
					console.log(response);

					if (typeof callback === "function") {
						callback(response);
					}
				}
			});
		},

		start = (keyword, callback) => {
			localStorage._keyword = JSON.stringify(keyword || "");

			checkDictionary(keyword);
			checkGoogle(keyword);
			checkAmazon(keyword);
			if (typeof callback === "function") {
				callback();
			}
		},
		
		init = () => {
			console.log("initializing");
		};

	return {
		init: init,
		start: start
	};
})();