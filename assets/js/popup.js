let Popup = (() => {
	let _temp = [],
		_keyword = JSON.parse(localStorage._keyword || "null") || "",
        _wordFoxPro = WordFoxPro,
		_startButton = $("#btn-search"),
		_keywordBox = $("#keyword"),

		getKeyword = () => {
			return _keyword;
		},

		showResults = () => {
			//
		},

		start = () => {
			_keyword = _keywordBox.val();
			_wordFoxPro.start(_keyword, showResults);
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
		init: init,
		getKeyword: getKeyword
	};
})();

((window, jQuery) => {
	let self = Popup;
	self.init();
})(window, $);