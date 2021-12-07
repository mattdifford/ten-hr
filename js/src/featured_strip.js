$(document).ready(function(){
    $('.featured-strip__link').on("click", function () {
        if (typeof gtag === 'function') {
            gtag('event', $(this).attr("title"), { 'event_category': 'Featured Brands Click', "event_label": "External link click - exit" });
        }
    });
})