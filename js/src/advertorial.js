$(document).ready(function () {
    $('.advertorial-strip__wrapper a').on("click", function () {
        if (typeof gtag === 'function') {
            if ($(this).text().length > 0) {
                gtag('event', $(this).text(), { 'event_category': 'Advertorial button click' });
            } else if ($(this).find("img").length > 0) {
                gtag('event', $(this).find("img").attr("src"), { 'event_category': 'Advertorial button click' });
            }
        }
    })
    $('.advertorial-strip__sidebar a').on("click", function () {
        if (typeof gtag === 'function') {
            gtag('event', $(this).find("img").attr("src"), { 'event_category': 'Advertorial sidebar click' });
        }
    });
    if ($('.advertorial-strip__date').text().length == 0){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;
        $('.advertorial-strip__date').text(today);
    }
    replaceLoc();
})

function replaceLoc() {
    var url_string = window.location.search;
    var url_params = new URLSearchParams(url_string);
    var elements = '.advertorial-strip__title, .advertorial-strip__subtitle, .advertorial-strip__content';
    $(elements).each(function () {
        var replace;
        if (url_params.get("loc") != null && url_params.get("loc") != '' && url_params.get("loc") != undefined) {
            replace = $(this).html().replace("[loc]", decodeURIComponent(url_params.get("loc"))).replace("[LOC]", decodeURIComponent(url_params.get("loc")).toUpperCase())
        } else {
            replace = $(this).html().replace("[loc]", "the UK").replace("[LOC]", "THE UK")
        }
        $(this).html(replace)
    })
}