$(document).ready(function () {
    $('.tabs-block__item-title').on("click", function () {
        $(this).next().slideToggle();
        $(this).toggleClass('open').parent().toggleClass('open');
    });
    $('.tabs-block__titles-item').on("click", function () {
        var parent_block = $(this).parents('.tabs-block');
        parent_block.find(".active").removeClass("active");
        var index = $(this).attr("data-tab-index");
        var new_active = parent_block.find('.tabs-block__tabs-item[data-tab-index="' + index + '"]')
        new_active.addClass("active");
        $(this).addClass("active");
    });
    $('.tabs-block--tabs-horizontal').each(function () {
        var elementHeights = $(this).find('.tabs-block__tabs-item').map(function () {
            return $(this).height();
        }).get();

        var maxHeight = Math.max.apply(null, elementHeights);

        $(this).find('.tabs-block__tabs').height(maxHeight);
    })
})