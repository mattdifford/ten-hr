$(document).ready(function () {
    $('.video-wrapper').on("click", function () {
        $(this).after('<div class="iframe-wrapper"><iframe src="https://www.youtube.com/embed/' + $(this).attr("data-video-id") + '?controls=0&autoplay=1&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>');
        $(this).remove();
    });
})