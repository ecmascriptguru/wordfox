let loadRepins = (function() {

    let pages = 5;
    let count = 0;
    let mylist = [];
    let timeout;

    function load() {
        $('.Pin').each(function() {
            mylist.push($(this)[0])
        });

        if (pages > 0) {

            $(window).scrollTop($(document).height());

            timeout = window.setTimeout(load, 4000);

            count++;
            if (count == pages) {
                finish();
            }

        } else {
            finish();
        }
    }

    function getColsCount() {
        let width = $(".Pin").parents("._4e").innerWidth(),
            postWidth = 236,
            horGap = 24;

        return (width + horGap) / (postWidth + horGap);
    }

    function finish() {
        let colsCount = getColsCount(),
            positions = [];

        for (let i = 0; i < colsCount; i ++) {
            positions.push({
                left: 0,
                top: 0
            })
        }

        for (let i = 1; i < positions.length; i ++) {
            positions[i].left = (236 + 24) * i;
        }

        window.clearTimeout(timeout);

        let list = mylist.filter(function(f) {
            if ($(f).find('.repinIconSmall').length > 0) {
                return f;
            }
        });

        list.sort(function(a, b) {
            let compAText = $(a).find('.repinIconSmall').next().text().trim(),
                compBText = $(b).find('.repinIconSmall').next().text().trim();
            let compA = turnK(compAText);
            let compB = turnK(compBText);
            return (compA == compB) ? 0 : (compA > compB) ? -1 : 1;
        });

        if ($(".Grid").length) {
            $(".Grid").before('<div id="organized" style="margin:0 12px;"></div>');
        } else {
            $("._4e.relative").before('<div id="organized" style="margin:0 12px;"></div>');
        }

        let setPosition = (itm) => {
            let minTop = Number.POSITIVE_INFINITY,
                minIndex = 0;
            
            for (let i = 0; i < positions.length; i ++) {
                if (positions[i].top < minTop) {
                    minTop = positions[i].top;
                    minIndex = i;
                }
            }
            $(itm).css({
                top: 0,
                left: 0,
                transform: `translateX(${positions[minIndex].left}px) translateY(${positions[minIndex].top}px)`,
                width: "236px",
                position: "absolute"
            });
            positions[minIndex].top += ($(itm).height() + 24);
        }


        $.each(list, function(idx, itm) {
            $("#organized").append($(itm));
            setPosition(itm);
        });

        if ($(".Grid").length) {
            $(".Grid").remove();
        } else {
            $("._4e.relative").remove();
            $("#organized").addClass("_4e relative");
            // $(".gridCentered").remove();
        }

        let containerHeight = 0;
        positions.forEach((pos) => {
            if (containerHeight < pos.top) {
                containerHeight = pos.top;
            }
        });
        $("#organized").height(containerHeight);
        reorderIsDone();
    }

    function turnK(text) {
        let number = Number(text.replace(/k/g, ''));
        if (text.indexOf("k") !== -1) {
            number = number * 1000;
        }
        return number;
    }

    function resetValues(pageCount, initialCount, list) {
        pages = pageCount;
        count = initialCount;
        mylist = list;
        clearTimeout(timeout);
    }

    function reorderIsDone() {
        $('#loading-page-merchpins').remove();
        $("html, body").scrollTop(0);
        chrome.runtime.sendMessage({main_action: 'reorder_done'});
    }

    return function(page) {
        resetValues(page, 0, []);
        $('body').append('<div id="loading-page-merchpins" style="opacity: 0.4; background: black; position: fixed; top: 0px; left: 0px; right: 0px; bottom: 0px; text-align: center;"><img style="position: fixed; top: 45%; margin-left:-40px;" width="80px" src="'+chrome.extension.getURL('assets/images/loader.svg')+'" /></div>');
        load();
    }

}());



chrome.runtime.onMessage.addListener(
    function(request) {
        if (request.message === "sort_by_repins") {
            console.log("Sort by repins");
            loadRepins(request.pages);
        } else if (request.message == "sort_by_likes") {
            // console.log("Sort by likes");
            // loadLikes(request.pages);
        }
    }
);