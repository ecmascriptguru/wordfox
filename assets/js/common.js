'use strict';

let WordFoxPro = (() => {
	let _data = JSON.parse(localStorage._data || "[]"),
		_step = JSON.parse(localStorage._step || "0"),
		_suggestions = JSON.parse(localStorage._suggestions || "[]"),
		_keyword = JSON.parse(localStorage._keyword || "null"),
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
		_chars = " abcdefghijklmnopqrstuvwxyz",

		checkDictionary = function(keyword, callback) {
			$.ajax({
				url: _dictionaryBaseUrl + keyword + _dictionaryKeyParams,
				method: "GET",
				success: function(response) {
					if (typeof callback === "function") {
						callback(response);
					} else {
						console.log(response);
					}
				}
			});
		},

		checkGoogle = function(keyword, step, callback) {
			step = parseInt(step);
			if (step > _chars.length - 1) {
				return false;
			}
			$.ajax({
				url: _googleBaseUrl + (keyword + " " + _chars[step]).trim(),
				method: "GET",
				success: function(response) {
					// checkGoogle(keyword, step + 1, callback);
					if (typeof callback === "function") {
						if (response.length > 2) {
							callback("google", response[1]);
						}
					}
				}
			});
		},

		checkAmazon = function(keyword, step, callback) {
			step = parseInt(step);
			if (step > _chars.length - 1) {
				return false;
			}
			$.ajax({
				url: _amazonBaseUrl + (keyword + " " + _chars[step]).trim(),
				method: "GET",
				success: function(response) {
					// checkAmazon(keyword, step + 1, callback);
					let data = JSON.parse(response);

					if (data.length > 2 && typeof callback === "function") {
						callback("amazon", data[1]);
					}
				}
			});
		},

		getStatus = function() {
			return {
				keyword: _keyword,
				suggestions: _suggestions,
				step: _step,
				data: _data
			};
		},

		checkSuggestions = (keyword, callback) => {
			let curStep = _step;
			checkGoogle(keyword, curStep, callback);
			checkAmazon(keyword, curStep, callback);
		},

		start = (keyword, dictCallback, resultsCallback) => {
			localStorage._keyword = JSON.stringify(keyword || "");
			_step = localStorage._step = JSON.stringify(0);
			_data = localStorage._data = JSON.stringify([]);
			checkDictionary(keyword, dictCallback);
			checkSuggestions(keyword, resultsCallback);
		},
		
		init = () => {
			_step = 0;
		};

	return {
		init: init,
		status: getStatus,
		start: start
	};
})();