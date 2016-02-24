/// <reference path="jquery.js" />
/// <reference path="jquery.tinyscrollbar.js" />
/// <reference path="jquery.multiswipe.js" />
/// <reference path="json2.js" />

$.ajaxSetup({ dataType: 'text' });

(function () {
    var lastTime=0;
    if (!window.requestAnimationFrame_1)
        window.requestAnimationFrame_1 = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
} ());


$.fn.attachScrollbar = function (options) {
    var $this = $(this);
    options = $.extend(options, {bounce: false, hideScrollbar:false, fixedScrollbar:true });
    requestAnimationFrame_1(function () {
        var $scrollview = $('.scrollview', $this);
        if ($scrollview.length == 0 && $this.hasClass('scrollview')) {
            $scrollview = $this;
        }
        if ($('.viewport', $scrollview).iScroll) {
            $('.viewport', $scrollview).iScroll(options);
            $scrollview.addClass('native');
        }
    });
    return this;
}

$.fn.resetClass = function (className) {
    var $this = $(this)
    $(this).removeClass(className);
    requestAnimationFrame_1(function () {
        $this.addClass(className);
    });
}

$.fn.safeEval = function (code, onError) {
    try {
        (new Function(code)).call(this);
    } catch (ex) {
        if (console && console.error) {
            console.error(ex.stack);
        }
        if (onError) {
            onError(ex);
        }
    }
    return this;
}
$.fn.tabs = function (o) {
    var $tab_pages_container = $('>.tab-pages-container', this);
    var $tab_pages = $('>.tab-pages', $tab_pages_container);
    var $tab_links = $('>.tab-links', this);
    var $tab_titles = o.titles || $('>.tab-titles', this);
    var $tab_container = $(this);
    $tab_container.addClass('tab-container');
    var that = this;
    var $scroller;
    this.removeTab = function (index) {
        $('>li:eq(' + (index) + ")", $tab_links).remove();
        $('>ul>li:eq(' + (index) + ")", $tab_titles).remove();
        $('>div:eq(' + (index) + ')', $tab_pages).remove();
        $scroller.refresh();
    }
    var dontSelectTab = false;
    this.selectTab = function (index) {
        scrolling = true;

        $scroller.scrollToPage(0, index, 0);
    }
    var scrolling = false;
    that.prevPagIndex;
    function onScrollEnd() {
        if (!scrolling || app.unloading) return;
        scrolling = false;
        var index = this.currPageY;

        if (that.prevPagIndex == index) {
            return;
        }
        that.prevPagIndex = index;
        requestAnimationFrame_1(function () {
            try {
                function removeClasses() {
                    $tab_container.removeClass(function (index, css) {
                        return (css.match(/\bactive-tab-\S+/g) || []).join(' ');
                    })
                    $('>div', $tab_pages).removeClass('active');
                    $('>li', $tab_links).removeClass('active');
                    $('>ul>li', $tab_titles).removeClass('active');
                }
                function addClasses() {
                    $tab_container.addClass('active-tab-' + index);
                    $('>li:eq(' + (index) + ")", $tab_links).addClass('active');
                    $('>ul>li:eq(' + (index) + ")", $tab_titles).addClass('active');
                    $('>div:eq(' + (index) + ')', $tab_pages).addClass('active');
                }
                removeClasses()
                addClasses();

                if (o && o.tabchange) {
                    try {
                        o.tabchange.call($('>div:eq(' + (index) + ')', $tab_pages).get(0), index);
                    } catch (ex) {
                        alert(ex);
                    }
                    app.footer.buttons.refresh();
                }
            }
            catch (ex) {
            }
        });
    }
    $scroller = $tab_pages_container.iScroll({ snap: true, bounce: false, momentum: false, hideScrollbar: true, vScrollbar: false, onScrollEnd: onScrollEnd, onTouchEnd: onScrollEnd,
        onScrollMove: function () {
            scrolling = true;
        }
    });
    this.enable = function () { $scroller.enable() }
    this.disable = function () { $scroller.disable() }
    //   $scroller.destroy();
    $('>li>a', $tab_links).click(function () {
        if ($(this).closest('li').hasClass('active'));
        that.selectTab($(this).parent().index(), false);

    });
    return this;
}

