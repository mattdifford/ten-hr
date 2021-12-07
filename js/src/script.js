$(document).ready(function () {
    $('body').addClass("loaded");
    var elements = document.querySelectorAll('.scrollwatch');
    var config = {
        threshold: 0.01
    };
    var observer;
    function onIntersection(entries) {
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0) {
                observer.unobserve(entry.target);
                handleScrolledIntoView(entry.target);
            }
        });
    }
    var url_string = window.location.search;
    $('a').each(function () {
        var href = $(this).attr("href");
        if (href.indexOf("?") > -1) {
            $(this).attr("href", href + url_string.replace("?", "&"));
        } else {
            $(this).attr("href", href + url_string);
        }
    });
    if (!('IntersectionObserver' in window)) {
        Array.from(elements).forEach(el => handleScrolledIntoView(el));
    } else {
        observer = new IntersectionObserver(onIntersection, config);
        elements.forEach(el => {
            observer.observe(el);
        });
    }
    function handleScrolledIntoView(target) {
        target.classList.add('scrolled');
    }
    $('a').on("click", function () {
        if ($(this).attr("href").charAt(0) === '#') {
            $("html,body").animate({ scrollTop: $($(this).attr("href")).offset().top - 100 }, 750);
        }
        if (typeof gtag === 'function') {
            gtag('event', $(this).attr("href"), { 'event_category': 'Link Click', "event_label": $(this).text() });
        }
    });
    $("span[data-func-val]").each(function () {
        var f = $(this).attr("data-func-val");
        var value = window[f]();
        $(this).text(value);
    });

    $('.ty-banner a').on("click", function () {
        if (typeof gtag === 'function') {
            gtag('event', $(this).attr("href"), { 'event_category': 'Thank you page banner click' });
        }
    });



    $('.cms_content a').each(function () {
        if (($(this).parent('p').text() == $(this).text()) && $(this).find('img').length == 0) {
            $(this).addClass("button");
        }
    });
    $('.header__menu-icon').on("click", function (e) {
        e.preventDefault();
        $('body').toggleClass('nav-open');
        $('.header__nav').slideToggle();
    });
    $('.header__nav-item a').on("click", function (e) {
        if (window.innerWidth < 993) {
            var sub_nav = $(this).next();
            if (sub_nav.find(".header__sub-nav-item").length > 0) {
                e.preventDefault();
                sub_nav.toggleClass('active');
            }
        }
    });

});

function getERValue() {
    var age = localStorage.getItem('age');
    var prop_value = parseInt(localStorage.getItem('property_value').replace("£", "").replace(",", ""));
    localStorage.removeItem('age');
    localStorage.removeItem('property_value');
    var perc;
    var table = (function () {
        var table = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "/data/er_age_perc.json",
            'dataType': "json",
            'success': function (data) {
                table = data;
            }
        });
        return table;
    })();
    $.each(table, function (index, value) {
        if (value["age"] == age && typeof perc != "number") {
            perc = value["perc"];
        }
    });
    var num = Math.round((prop_value / perc) / 100) * 100;

    return '£' + num.toLocaleString();
}

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            o[this.name] += ', ' + this.value || '';
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};