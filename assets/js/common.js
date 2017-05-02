let WordFoxPro = (function() {
	let _data = [],
		_googleBaseUrl = "",
		_amazonBaseUrl = "",
		_dictionaryBaseUrl = "",
		_cafeBaseUrl = "",

		start = function(keyword, callback) {
			localStorage._keyword = JSON.stringify(keyword || "");
			if (typeof callback === "function") {
				callback();
			}
		},
		
		init = function() {
			console.log("initializing");
		};

	return {
		init: init,
		start: start
	};
})();