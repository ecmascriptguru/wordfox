var WordFoxPro = (function() {
	var _data = [],
		_googleBaseUrl = "",
		_amazonBaseUrl = "",
		_dictionaryBaseUrl = "",
		_cafeBaseUrl = "",

		start = function(callback) {
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