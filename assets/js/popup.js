let Popup = (() => {
	let _temp = [],
        _wordFoxPro = WordFoxPro,

		init = () => {
            _wordFoxPro.init();
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