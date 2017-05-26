let Pinterest = (function() {
    let _status = false,
        something = null;

    let init = () => {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch(request.from) {
                case "popup":
                    if (request.action == "reorder") {
                        console.log(request);
                    }
                    break;

                default:
                    console.log("Unknown request detected.");
                    break;
            }
        });
    };

    return {
        init: init
    }
})();

(function(window, jQuery) {
    Pinterest.init();
})(window, $);