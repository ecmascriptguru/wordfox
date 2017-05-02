let Popup = (() => {
	let _temp = [],
		_keyword = JSON.parse(localStorage._keyword || "null") || "",
        _wordFoxPro = WordFoxPro,
		_startButton = $("#btn-search"),
		_keywordBox = $("#keyword"),

		showResults = function() {
			//
		},

		start = function() {
			_keyword = _keywordBox.val();
			localStorage._keyword = JSON.stringify(_keyword);
			_wordFoxPro.start(showResults);
		},

		init = () => {
            _wordFoxPro.init();
			_startButton.click(start);
			_keywordBox.keydown(function(event) {
				if (event.which == 13 || event.keyCode == 13) {
					if ($(this).val()) {
						start();
					}
				}
				return true;
			})

			console.log("initializing...");
		};

	return {
		init: init
	};
})();

((window, jQuery) => {
	let self = Popup;
	self.init();
})(window, $);