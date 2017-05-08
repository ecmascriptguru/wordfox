'use strict';

let Background = (function() {
    let _wordFox = WordFoxPro,
        _data = [],

        init = function() {
            _wordFox.init();
        };

    return {
        init: init
    };
})();

(function(window, jQuery) {
    Background.init();
})(window, $);