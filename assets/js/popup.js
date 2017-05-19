'use strict';

let Popup = (() => {
	let _temp = [],
		_status = null,
		_keyword = JSON.parse(localStorage._keyword || "null") || "",
		_similarWords = $("#similar-words ul"),
        _wordFoxPro = WordFoxPro,
		_startButton = $("#btn-search"),
		_keywordBox = $("#keyword"),
		_resultsTable = $("#tbl-results"),
		_resultsBody = _resultsTable.find("tbody"),
		_dataTable = null,

		getKeyword = () => {
			return _keyword;
		},

		renderSuggestions = function(words) {
			_similarWords.children().remove();

			for (let i = 0; i < words.length; i ++) {
				_similarWords.append(
					$("<li/>").text(words[i])
				);
			}
			
		},

		showSimilarWords = (simWords) => {
			if ($(simWords).find("entry sens rel").length == 0) {
				if ($(simWords).find("suggestion").length > 0) {
					let _rel = $(simWords).find("suggestion"),
						words = [];
					
					for (let i = 0; i < _rel.length; i ++) {
						words.push(_rel.eq(i).text());
					}
					localStorage._suggestions = JSON.stringify(words);
					renderSuggestions(words);
				}
			} else {
				let _rel = $(simWords).find("entry sens rel").eq(0).text(),
					words = _rel.split(", ");

				localStorage._suggestions = JSON.stringify(words);
				renderSuggestions(words);
			}
		},

		saveItems = (items) => {
			let curItems = JSON.parse(localStorage._data || "[]");
			curItems = curItems.concat(items);
			localStorage._data = JSON.stringify(curItems);
		},

		renderGoogleResults = (items) => {
			let _items = [];
			for (let i = 0; i < items.length; i ++) {
				_items.push({
					rank: i + 1,
					provider: "google",
					keyword: items[i][0]
				});
				_dataTable.row.add([
					i + 1,
					"google",
					items[i][0]
				]).draw();
			}

			saveItems(_items);
		},

		renderAmazonResults = (items) => {
			let _items = [];
			for (let i = 0; i < items.length; i ++) {
				_items.push({
					rank: i + 1,
					provider: "amazon",
					keyword: items[i]
				});

				_dataTable.row.add([
					i + 1,
					"amazon",
					items[i]
				]).draw();
			}

			saveItems(_items);
		},

		renderCafeResults = (items) => {
			let _items = [];
			for (let i = 0; i < items.length; i ++) {
				_items.push({
					rank: i + 1,
					provider: "cafepress",
					keyword: items[i]
				});

				_dataTable.row.add([
					i + 1,
					"cafepress",
					items[i]
				]).draw();
			}

			saveItems(_items);
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

				case "cafepress":
					renderCafeResults(data);
					break;

				default:
					console.log("Unknown provider found");
					break;
			}
		},

		renderSavedResults = (items) => {
			_dataTable.clear();
			for (let i = 0; i < items.length; i ++) {
				_dataTable.row.add([
					items[i].rank,
					items[i].provider,
					items[i].keyword
				]).draw();
			}
		},

		start = () => {
			_keyword = _keywordBox.val();
			localStorage._data = JSON.stringify([]);
			localStorage._suggestions = JSON.stringify([]);
			_dataTable.clear();
			_resultsTable.show();
			_wordFoxPro.start(_keyword, showSimilarWords, showResults);
		},

		init = () => {
            _wordFoxPro.init();
			_status = _wordFoxPro.status();
			_dataTable = _resultsTable.DataTable();
			_keywordBox.val(_status.keyword);
			renderSavedResults(_status.data);
			renderSuggestions(_status.suggestions);
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