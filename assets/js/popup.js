let Popup = (() => {
    let _temp = [],
        init = () => {
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