if (window['app'] == undefined) app = {};
app.imagesToLoad = [];
app.showSignOff = false;
app.peNumber = "";
app.unloading = false;
app.pageUnload = function () {
    this.unloading = true;
    $('.enable_gpu').removeClass('enable_gpu');
    //var oldTransform = $('.tab-pages').css('transform');
    //$('.tab-pages-container').iScroll().destroy();
    //$('.tab-pages, .overview').css('transform', oldTransform);
    app.slides.unload();
}
app.slides = {
    summarySlideId: "",
    ready: function () { },
    load: function () { },
    unload: function () { }
}
app.footer = {
    ssi: {
        scrollable: function () {
            $('#footer #ssi').attachScrollbar({ useTransform: false/*, indicatorSizeV: 50*/ });
        }
    },
    initialized_buttons: {},
    buttons: {
        refresh: function () {
            var me = this;
            var $footer = $('.body #footer');
            var bind = function (button, elem) {
                if (!elem) elem = $('.' + button, $footer);
                if (me[button] && (me[button].click || me[button].popup)) {
                    if (!app.footer.initialized_buttons[button]) {
                        elem.click(function () {
                            if ((elem.hasClass('disabled') || elem.hasClass('active')) && elem.closest("#footer").length == 0) return;
                            else if (((elem.hasClass('disabled') || elem.hasClass('active')) && button != "ssi_section")) {
                                console.log("element is "+elem+" button is "+button);
                                return;
                            }
                            elem.addClass('active').siblings().removeClass('active');
                            if (me[button].popup) {
                                me[button].popup.show();
                            } else {
                                me[button].click();
                            }
                        });
                        app.footer.initialized_buttons[button] = true;
                    }
                    elem.removeClass('disabled');
                }
                else {
                    elem.addClass('disabled');
                }
            }
            for (var btn in this) {
                if (btn != "refresh" && btn != "ssi_section") {
                    bind(btn);
                }
            }
            bind('ssi_section', $('#footer #ssi .overview'));
        },
        reference: undefined,
        isi: undefined,
        sd: undefined
    }
}

app.footer.buttons.ssi_section = {
    click: function () {
        popups.isi_popup.show();
    }
}

app.footer.buttons.isi = {
    click: function () {
        popups.isi_popup.show();
    }
}

app.footer.buttons.pi = {
    click: function () {
        veeva.gotoPISlide();
        //popups.pi_popup.show();
    }
}

/*
if ('ontouchmove' in document)
    document.addEventListener('touchmove', function (e) { e.preventDefault(); });
*/
$('#isi_popup .pi').click(function () {
    veeva.gotoPISlide();
});


function showBackgroundImage()
{
    $('.body>img').show();
}

$(document).ready(function () {
    //  preloadImages();
//    popups.add('isi_popup', { url: 'isi.html', class: 'large', enableCloseOnScroll: true, scrollable: true, title: "", group: 'footer', title: "IMPORTANT SAFETY INFORMATION AND INDICATION",
//        onopen: function () {
//            $("#toolbar .isi").addClass('active');

//        },
//        onclose: function () {
//            $("#toolbar .isi").removeClass('active');
//        }
//    });

    app.slides.ready();
});

$(window).load(function () {

    app.slides.summarySlideId = 'CHANTIX_JAN_POA_90.00';
    $("#main_data a.logo").click(function () {
        veeva.gotoSlide(app.slides.summarySlideId);
    });
    requestAnimationFrame_1(function () {
        var $footer = $('.body #footer');
        app.footer.ssi.scrollable();
        app.slides.load();
        app.footer.buttons.refresh();
    });
});