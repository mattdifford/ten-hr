$(document).ready(function(){
    $('.router__question').on("click", function () {
        if ($('.router__question').length == $('.router__radio-input:checked').length) {
            $('html, body').animate({
                scrollTop: $(".router").offset().top
            }, 500);
            var conditions = [];
            $('.router__inner').addClass('loading');
            $('.router__wrapper').addClass('results');
            $('.router__answer, .router__question').hide();
            $('.router__question').each(function () {
                conditions.push($(this).find('input:checked').val());
            });
            var condition_str = conditions.join(':');
            $('.router__answer').each(function () {
                var conditions = $(this).attr("data-condition").split(",");
                var $this = $(this);
                conditions.forEach(function (item, index) {
                    if (item === condition_str) {
                        $(this).show();
                    }
                }, $this);
            });
            $('.router__answers').addClass("visible");
            location.hash = 'results';
            setTimeout(function () {
                $('.router__inner').removeClass('loading');
            }, 1500);
        }
    });
})

function resetRouterForm() {
    $('.router__wrapper').removeClass('results');
    $('.router__question').show();
    $('.router__radio-input').prop('checked', false)
    $('.router__answer').hide();
    $('.router__answers').removeClass("visible");
}