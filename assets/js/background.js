'use strict';

let Background = (function() {
    let _wordFox = null,// WordFoxPro,
        _data = [];

    let init = function() {
        // _wordFox.init();
    };

    return {
        init: init
    };
})();

(function(window, jQuery) {
    Background.init();
})(window, $);

function DownloadImage(imageURL) {
    var a = document.createElement('a');
    a.href = imageURL;
    a.download = "pinterest-download.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function handleImageURL(img) {
    chrome.tabs.query({active: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {main_action: "img_url"}, (response) => {
            if (response.img) {
                DownloadImage(response.img)
            }
        })
    })
}

chrome.contextMenus.create({
    title: "Download this image...",
    contexts:["all"],
    documentUrlPatterns: ["https://www.pinterest.com/*", "https://www.pinterest.co.uk/*"],
    onclick: function(info) {
        handleImageURL(info);
    }
});