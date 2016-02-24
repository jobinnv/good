app.showSignOff = true

app.slides.currentSlideId = '00.00';
app.slides.summarySlideId = "";
var slide_metadata = [
{ guid: 'FEC2D4DA-4530-40D2-B758-D833BA0A25B5', isChild: false }
]


var activeTabIndex;
var ref1 = {
    click: function () {
        popups.ref_popup1.show();
    }
}
app.footer.buttons.ssi_section = {
    click: function () {
        popups.ssi_popup1.show();
    }
}

$('#footer #ssi #ssi1').css('visibility', 'inherit').siblings().css('visibility', 'hidden');

app.slides.load = function () {

    app.slides.currentSlide = slide_metadata[0];
    app.tracking.trackSlideVisit();
    var active_overlay;
    popups.add('isi_popup', { url: 'isi.html', class: 'large', enableCloseOnScroll: true, disableCloseButton: true, scrollable: true, title: "", group: 'footer', title: "IMPORTANT SAFETY INFORMATION AND INDICATION",
        onopen: function () {
            $("#toolbar .isi").addClass('active');
            active_overlay = $('.overlays .overlay1.active').index();
          //   alert(active_overlay);
            $('.overlay1.isi').addClass('active').siblings('.overlay1').removeClass('active');
           // alert($('.overlays .overlay1.active').index());
        },
        onclose: function () {
            $("#toolbar .isi").removeClass('active');
            $('.overlay1').eq(active_overlay).addClass('active').siblings('.overlay1').removeClass('active');

        }
    });

    popups.add('dual_popup', { url: 'dual-use_popup.html', class: 'small', scrollable: false, title: "Stage 2 <span class='capitalize'>Meaningful Use</span> objectives support the standard of care<br /> for screening and treating smokers<sup class='meaningSup'>3,4</sup>",
        onopen: function () {

            $('.overlay1').eq(1).addClass('active').siblings('.overlay1').removeClass('active');
        },
        onclose: function () {

            $('.overlay1').eq(0).addClass('active').siblings('.overlay1').removeClass('active');

        }
    });

    popups.add('meaningful_popup', { url: 'meaningful_popup.html', class: 'small', scrollable: true, title: "Patients asking about e-cigarettes <span class='capitalize'>may want to quit</span> tobacco cigarettes<br/><span class='italic-text'><i> Use this opportunity to counsel them on smoking cessation and FDA-approved medications</i><span>",
        onopen: function () {
            $('div.plus-popup > a.dual-use.show').removeClass('show');
            $('.overlay1').eq(2).addClass('active').siblings('.overlay1').removeClass('active');

        },
        onclose: function () {

            $('.overlay1').eq(0).addClass('active').siblings('.overlay1').removeClass('active');

        }
    });

    popups.add('overlay_1', { class: 'small small1', scrollable: false, dontCloseOnClick: true,
        onopen: function () {
        },
        onclose: function () {
        }
    });

    popups.add('overlay_2', { class: 'small small2', scrollable: false, dontCloseOnClick: true,
        onopen: function () {
        },
        onclose: function () {
        }
    });
    popups.add('overlay_3', { url: 'overlay.html', class: 'small small3', scrollable: false, dontCloseOnClick: true,
        onopen: function () {
        },
        onclose: function () {
        }
    });
    popups.add('overlay_4', { url: 'overlay.html', class: 'small small4', scrollable: false, dontCloseOnClick: true,
        onopen: function () {
        },
        onclose: function () {
        }
    });
    popups.add('ref_popup1', { group: 'footer', url: 'ref1.html', class: 'small', scrollable: false, title: "REFERENCES",
        onopen: function () {


            $('ul#toolbar li.reference').addClass('active');
        },
        onclose: function () {

            $('#footer #ssi #ssi1').css('visibility', 'inherit').siblings().css('visibility', 'hidden');
            $('ul#toolbar li.reference').removeClass('active');
        }
    });

    popups.add('ssi_popup1', { group: 'footer', url: 'isi.html', class: 'large', scrollable: true, disableCloseButton: true, title: "IMPORTANT SAFETY INFORMATION AND INDICATION", onopen: function () {
        
        active_overlay = $('.overlays .overlay1.active').index();
        //     alert(active_overlay);
        $('.overlay1.isi').addClass('active').siblings('.overlay1').removeClass('active');
    },
        onclose: function () {
           
            $('.overlay1').eq(active_overlay).addClass('active').siblings('.overlay1').removeClass('active');

        } 
    });
    popups.add('ssi_popup2', { group: 'footer', element: $('#ssi #ssi2 .overview').clone(), class: 'large', scrollable: true, title: "SELECTED SAFETY INFORMATION AND INDICATION" });
    popups.add('ssi_popup3', { group: 'footer', element: $('#ssi #ssi3 .overview').clone(), class: 'large', scrollable: true, title: "SELECTED SAFETY INFORMATION AND INDICATION" });
    popups.add('ssi_popup4', { group: 'footer', element: $('#ssi #ssi4 .overview').clone(), class: 'large', scrollable: true, title: "SELECTED SAFETY INFORMATION AND INDICATION" });
    popups.add('ssi_popup5', { group: 'footer', element: $('#ssi #ssi5 .overview').clone(), class: 'large', scrollable: true, title: "SELECTED SAFETY INFORMATION AND INDICATION" });
    app.footer.buttons.reference = ref1;
    app.footer.buttons.sd = null;
    var main_data_tabs;
}

var main_tabs = $('#main_data').tabs({});
$('div.plus-popup > a.plus').on('click', function () {

    $('div.plus-popup > a.dual-use').toggleClass('show');
    $('div.plus-popup > a.meaningful-link').toggleClass('show');
    $('div.plus-popup > a.plus').toggleClass('hide');
    $('div.plus-popup > a.minus').toggleClass('show');


});




$('div.plus-popup > a.minus').on('click', function () {

    $('div.plus-popup > a.dual-use').toggleClass('show');
    $('div.plus-popup > a.meaningful-link').toggleClass('show');
    $('div.plus-popup > a.plus').toggleClass('hide');
    $('div.plus-popup > a.minus').toggleClass('show');

});


$('div.plus-popup > a.dual-use').on('click', function () {
    popups.meaningful_popup.show();
    $('div.plus-popup > a.dual-use').toggleClass('show');
    $('div.plus-popup > a.meaningful-link').toggleClass('show');
    $('div.plus-popup > a.plus').toggleClass('hide');
    $('div.plus-popup > a.minus').toggleClass('show');




});

$('div.plus-popup > a.meaningful-link').on('click', function () {

    popups.dual_popup.show();

    $('div.plus-popup > a.dual-use').toggleClass('show');
    $('div.plus-popup > a.meaningful-link').toggleClass('show');
    $('div.plus-popup > a.plus').toggleClass('hide');
    $('div.plus-popup > a.minus').toggleClass('show');



});
