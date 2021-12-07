$(document).ready(function () {
    $('.list-strip__list--root.list-strip__list--mobile').slick({
        dots: false,
        arrows: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        cssEase: 'ease-in-out',
        responsive: [
            {
                breakpoint: 1460,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 993,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: 1,
                    dots: true
                }
            }
        ]
    });
    $('.list-strip__list--root.list-strip__list--not-mobile').slick({
        dots: false,
        arrows: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        cssEase: 'ease-in-out',
        responsive: [
            {
                breakpoint: 1460,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 993,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 700,
                settings: "unslick"
            }
        ]
    });
    $('.list-strip__list--nested.list-strip__list--mobile').slick({
        dots: false,
        arrows: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        cssEase: 'ease-in-out',
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 1,
                }
            },
            {
                breakpoint: 993,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: 1,
                    dots: true
                }
            }
        ]
    });
    $('.list-strip__list--nested.list-strip__list--not-mobile').slick({
        dots: false,
        arrows: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        cssEase: 'ease-in-out',
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 1,
                }
            },
            {
                breakpoint: 993,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 700,
                settings: "unslick"
            }
        ]
    });
})