'use strict';

let Popup = (() => {
	let _temp = [],
		_status = null,
		_keyword = JSON.parse(localStorage._keyword || "null") || "",
		_similarWords = $("#similar-words"),
        _wordFoxPro = WordFoxPro,
		_startButton = $("#btn-search"),
		_keywordBox = $("#keyword"),
		_resultBlock = $("ul#results"),
		_btnPinterest = $("#search-pinterest"),
		_numPages = $("#number-of-pages"),
		_btnOptimize = $("#merch-optimize"),

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
				_resultBlock.append(
					$("<li/>").addClass("result-row google").append(
						$("<div/>").addClass("rank").text(i + 1),
						$("<div/>").addClass("keyword").html(items[i][0])
					)
				);
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

				_resultBlock.append(
					$("<li/>").addClass("result-row amazon").append(
						$("<div/>").addClass("rank").text(i + 1),
						$("<div/>").addClass("keyword").html(items[i])
					)
				);
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

				_resultBlock.append(
					$("<li/>").addClass("result-row cafepress").append(
						$("<div/>").addClass("rank").text(i + 1),
						$("<div/>").addClass("keyword").html(items[i])
					)
				);
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
			_resultBlock.children().remove();
			for (let i = 0; i < items.length; i ++) {
				_resultBlock.append(
					$("<li/>").addClass("result-row " + items[i].provider).append(
						$("<div/>").addClass("rank").text(items[i].rank),
						$("<div/>").addClass("keyword").html(items[i].keyword)
					)
				);
			}
		},

		start = () => {
			_keyword = _keywordBox.val();
			localStorage._data = JSON.stringify([]);
			localStorage._suggestions = JSON.stringify([]);
			_resultBlock.children().remove();
			_wordFoxPro.start(_keyword, showSimilarWords, showResults);
		},

		init = () => {
            _wordFoxPro.init();
			_status = _wordFoxPro.status();
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

			$(".source-container img").click((event) => {
				let target = event.target.getAttribute("data-target"),
					isActive = (event.target.className.split(" ").indexOf("active") > -1);

				if (isActive) {
					$("#results li." + target).removeClass("hide");
					$(event.target).removeClass("active");
				} else {
					$("#results li." + target).addClass("hide");
					$(event.target).addClass("active");
				}
			});

			_btnPinterest.click(() => {
				chrome.tabs.query({url: "https://www.pinterest.com/*"}, function(tabs) {
					if (tabs.length > 0) {
						chrome.tabs.update(tabs[0].id, {active:true, url: "https://www.pinterest.com/search/pins/?q=t%20shirts"});
					} else {
						chrome.tabs.create({url: "https://www.pinterest.com/search/pins/?q=t%20shirts"});
					}
				});
			});

			_btnOptimize.click(() => {
				let pages = parseInt(_numPages.val() || 5);
				chrome.tabs.query({active: true}, (tabs) => {
					if (tabs[0].url.indexOf("https://www.pinterest.com/") == 0) {
						chrome.tabs.sendMessage(tabs[0].id, {
							"message": "sort_by_repins",
							// "message": "sort_by_likes",
							"pages": pages
						});
					} else {
						_btnPinterest.click();
					}
				})
			})
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