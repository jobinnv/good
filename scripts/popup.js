
var popups = {
    settings: { template: '<div class="background"></div><a class="close" href="javascript:void(0)"></a><div class="content scrollview"><div class="viewport"><div class="overview"></div></div></div>', template2: "", max_index: 5000 },
    add: function (id, options) {
        function popup(id, options) {
            var loaded = false;
            this.options = options;
            var me = this;
            this.create = function (callback) {
                var $popup = $('<div class="popup" id=' + id + '/>');
                this.popups_element = $('.body');
                if (this.popups_element.length == 0) {
                    this.popups_element = $('<div id="popups"/>').appendTo('.body');
                }
                if (options.class) $popup.addClass(options.class);

                $popup.appendTo(this.popups_element).prop('obj', this);

                function afterLoad(data) {
                    $popup.html(data);
                    if (options.title) {
                        if (!options.title.image) {
                            $('<h1 class="title"/>').html(options.title).insertBefore($('.content', $popup));
                        } else {
                            $('<img class="title"/>').attr('src', options.title.image).width(options.title.width).height(options.title.height).insertBefore($('.content', $popup));
                        }
                    }
                    var smallPopup = $popup.hasClass('small');
                    var largePopup = $popup.hasClass('large');
                    var closeButton = '.close';

                    options.disableCloseButton = options.disableCloseButton == true || id == 'safety_popup';

                    if (options.scrollable && options.disableCloseButton)
                        $('.close', $popup).addClass('disabled');
                    options.closeHandle = options.closeHandle || "";
                    if ((!smallPopup && !largePopup) && !options.dontCloseOnClick) {
                        if (options.closeHandle != "") options.closeHandle += ", ";
                        options.closeHandle += ".content";
                    }
                    if (options.closeHandle != "")
                        closeButton += ", " + options.closeHandle;
                    $(closeButton, $popup).click(function (e) {
                        if (e.target.tagName.toLowerCase() == "a" && $('.close', $popup).get(0) != e.target)
                            return;
                        if (!$('.close', $('.body>#' + id)).hasClass('disabled')) me.close();
                    });
                    var $logo_button = { click: function () {
                        //                        veeva.gotoSlide(app.slides.summarySlideId); 
                    }
                    };
                    var $pi_button = { click: function () { veeva.gotoPISlide(); } };
                    var afterLoad3 = function () {
                        options.buttons = $.extend({ pi: largePopup ? $pi_button : false, logo: (smallPopup || largePopup) ? $logo_button : false }, options.buttons || {});
                        for (var btn in options.buttons) {
                            if ($('>.' + btn, $popup).length > 0) continue;
                            var $a = $('<a href="javascript:void(0)"></a>').attr('class', btn).insertAfter($('>.background', $popup));
                            if (options.buttons[btn] && options.buttons[btn].click)
                                $a.click(options.buttons[btn].click);
                        }
                        if (callback) callback();
                        if (options.onload)
                            options.onload.call($popup);
                    }

                    var scrollMoveCallback = function () {
                        $popup.toggleClass('scroll-end', this.y - this.maxScrollY < 50);
                        if (this.y - this.maxScrollY < 50)
                            $('.close', $popup).removeClass('disabled');
                    }

                    var scrollOptions = {
                        onRefresh: scrollMoveCallback,
                        onScrollMove: scrollMoveCallback,
                        onScrollEnd: scrollMoveCallback,
                        bounce: false/*,
                        indicatorSizeV: 50*/
                    }
                    if (options.type == "image") {
                        var $img;
                        if (options.url)
                            $img = $('<img/>').prop('src', options.url);
                        else
                            $img = $('<div class=img/>');
                        if (options.width)
                            $img.width(options.width);
                        if (options.height)
                            $img.height(options.height);
                        $('.overview', $popup).empty().append($img);
                        if (options.scrollable) {
                            $popup.attachScrollbar(scrollOptions);
                        }

                        afterLoad3();
                    } else {
                        var afterLoad2 = function () {
                            if (!options.title) {
                                var $h1 = $('h1', $popup);
                                if ($h1.length > 0) {
                                    var title = $('h1', $popup).remove().html();
                                    $('<h1 class="title"/>').html(title).insertBefore($('.content', $popup));
                                }
                            }

                            if (options.scrollable) {
                                $popup.attachScrollbar(scrollOptions);
                            }
                            afterLoad3();
                        }
                        if (options.url) {
                            $('.overview', $popup).load(options.url, afterLoad2);
                        } else if (options.element) {
                            var elem = $(options.element);
                            $('.overview', $popup).html(elem.html());
                            elem.remove();
                            afterLoad2();
                        } else if ($('#main_data #' + id).length > 0) {
                            $('.overview', $popup).html($('#main_data #' + id).html());
                            $('#main_data #' + id).remove();
                            afterLoad2();
                        }
                    }

                }
                if (!popups.settings.template) {
                    $.get('popup.html').done(function (data) {
                        popups.settings.template = data;
                        afterLoad(data);
                    });
                } else {
                    afterLoad(popups.settings.template);
                }
            }
            me.create();
            this.show = function () {
                if (options.group)
                    popups.closeAllInGroup(options.group);
                var $popup = $('.body>#' + id);
                var show = function () {
                    $popup = $('.body>#' + id);
                    $('.body').addClass('active-popup-' + options.class);
                    $('.body').addClass('active-popup-id-' + id);
                    $popup.css('z-index', popups.settings.max_index + 1);
                    popups.settings.max_index += 1;
                    $popup.addClass('visible');
                    setTimeout(function () {
                        if (options.scrollable) {
                            if (options.disableCloseButton)
                                $('.close', $popup).addClass('disabled');
                            if ($('.viewport', $popup).iScroll && id != 'safety_popup')
                                $('.viewport', $popup).iScroll().scrollTo(0, 0);
                        }
                        if (options.onopen) {
                            options.onopen.call($popup);
                            app.footer.buttons.refresh();
                        }
                    }, 100);
                }
                if ($popup.length == 0) {
                    this.create(function () { show(); });
                } else {
                    show();
                }
            }
            this.close = function () {
                var $popup = $('.body>#' + id);
                if ($popup.hasClass('visible')) {
                    $popup.removeClass('visible');
                    $('.body').removeClass('active-popup-' + options.class);
                    $('.body').removeClass('active-popup-id-' + id);
                    if (options.onclose) {
                        options.onclose();
                        app.footer.buttons.refresh();
                    }
                }
            }
        }
        var $popup = this[id];
        if (!$popup) {
            $popup = $('.body>#' + id);
            $popup = $popup.prop('obj') || new popup(id, options);
            this[id] = $popup;
        }
        return $popup;
    },
    closeAllInGroup: function (group) {
        $('.body>.popup').each(function () {
            var $popup = $(this);
            var obj = $popup.prop('obj');
            if (obj.options.group == group) obj.close();
        });
    },
    closeAll: function (except) {
        $('.body>.popup').each(function () {
            if (this.id == except) return;
            var $popup = $(this);
            var obj = $popup.prop('obj');
            if (obj) obj.close();
        });
    }
}

