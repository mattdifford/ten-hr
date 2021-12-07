var current_url = window.location.protocol + '//' + window.location.hostname;
$('.link_tidy a').each(function () {
    var href = $(this).attr("href");
    if (href.charAt(0) != '/' && href.substr(0, 7) != 'mailto:' && href.indexOf(current_url) == -1) {
        $(this).attr("rel", "external noopener")
        $(this).attr("target", "_blank")
    }
})

$('a[href]').each(function () {
    var href = $(this).attr('href');
    if (href.indexOf(location.host) !== -1 && href.indexOf('?') !== -1) {
        href += '&' + location.search.replace(/^\?/, '');
    } else {
        href += location.search;
    }
    $(this).attr('href', href);
});