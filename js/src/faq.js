$(document).ready(function(){
    $('.faq-strip__item-question').on("click", function () {
        $(this).next().slideToggle();
        $(this).parent().toggleClass('open');
    });
})