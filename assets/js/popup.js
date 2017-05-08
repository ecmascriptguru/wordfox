'use strict';

let Popup = (() => {
	let _temp = [],
		_status = null,
		_keyword = JSON.parse(localStorage._keyword || "null") || "",
        _wordFoxPro = WordFoxPro,
		_startButton = $("#btn-search"),
		_keywordBox = $("#keyword"),
		_resultsTable = $("#tbl-results"),
		_resultsBody = _resultsTable.find("tbody"),

		getKeyword = () => {
			return _keyword;
		},

		showSimilarWords = (simWords) => {
			console.log(simWords);
		},

		renderGoogleResults = (items) => {
			for (let i = 0; i < items.length; i ++) {
				_resultsBody.append(
					$("<tr/>").append(
						$("<td/>").html(i + 1),
						$("<td/>").html("google"),
						$("<td/>").html(items[i][0])
					)
				)
			}
		},

		renderAmazonResults = (items) => {
			for (let i = 0; i < items.length; i ++) {
				_resultsBody.append(
					$("<tr/>").append(
						$("<td/>").html(i + 1),
						$("<td/>").html("amazon"),
						$("<td/>").html(items[i])
					)
				)
			}
		},

		showResults = (provider, data) => {
			console.log(provider, data);
			switch(provider) {
				case "google":
					renderGoogleResults(data);
					break;

				case "amazon":
					renderAmazonResults(data);
					break;

				default:
					console.log("Unknown provider found");
					break;
			}
		},

		start = () => {
			_keyword = _keywordBox.val();
			_resultsTable.show();
			_wordFoxPro.start(_keyword, showSimilarWords, showResults);
		},

		init = () => {
            _wordFoxPro.init();
			_status = _wordFoxPro.status();
			_keywordBox.val(_status.keyword);
			_startButton.click(start);
			_keywordBox.keydown(function(event) {
				if (event.which == 13 || event.keyCode == 13) {
					if ($(this).val()) {
						start();
					}
				}
				return true;
			});
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