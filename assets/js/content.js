let Pinterest = (function() {
    let _status = false,
        widthMargin = 24,
        heightMargin = 24;

    let getColumns = (pWidth, cWidth) => {
        return (pWidth + widthMargin) / (cWidth + widthMargin);
    };

    let reorder = () => {
        let posts = $("._4f"),
            pins = [],
            heights = [],
            cols = getColumns(posts.eq(0).parent().innerWidth(), posts.eq(0).width());

        for (let i = 0; i < posts.length; i ++) {
            let pinCounts = posts.eq(i).find(".socialMetaCount.repinCountSmall span").text().trim();
            if (pinCounts.match(/k/g)) {
                pinCounts = parseFloat(pinCounts.replace(/k/g, '')) * 1000;
            } else if (pinCounts.match(/m/g)) {
                pinCounts = parseFloat(pinCounts.replace(/m/g, '')) * 1000000;
            } else {
                pinCounts = parseFloat(pinCounts);
            }
            pins.push({
                index: i,
                count: pinCounts,
                width: posts.eq(i).width(),
                height: posts.eq(i).height()
            });
        }

        for (let i = 0; i < pins.length - 1; i ++) {
            for (let j = i + 1; j < pins.length; j ++) {
                if (pins[i].count < pins[j].count) {
                    let temp = pins[i];
                    pins[i] = pins[j];
                    pins[j] = temp;
                }
            }
        }

        let getTransY = (rIn, cIn) => {
            let result = 0;
            rIn--;
            while(rIn > -1) {
                result += (pins[rIn * cols + cIn].height + heightMargin);
                rIn--;
            }
            return result;
        }

        //  Rearrange
        for (let i = 0; i < pins.length; i ++) {
            let curPost = posts.eq(pins[i].index),
                rowIndex = parseInt(i / cols),
                colIndex = i % cols;
            
            if (!heights[colIndex]) {
                heights[colIndex] = 0;
            }

            let transX = 0 + colIndex * (pins[i].width + widthMargin);
            // let transY = getTransY(rowIndex, colIndex);
            curPost.css({
                "transform": `translateX(${transX}px) translateY(${heights[colIndex]}px)`
            });
            heights[colIndex] += posts.eq(pins[i].index).height();
        }

        console.log(pins);
    }


    let init = () => {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch(request.from) {
                case "popup":
                    if (request.action == "reorder") {
                        reorder();
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