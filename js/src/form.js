function getUserIp() {
    window.ip_address = "217.33.255.60";
    $.get('https://api.ipify.org', function (data) {
        window.ip_address = data;
    });
}
$(document).ready(function () {
    $('.form__field[data-condition-field]').each(function () {
        var condition_value = $(this).attr("data-condition-value");
        var $field = $(this);
        var $input = $field.find("input, select");
        $('input[name="' + $(this).attr("data-condition-field") + '"]').on("click change", function () {
            if ($(this).val() == condition_value) {
                $input.attr("required", "required");
                $field.show();
            } else {
                $input.removeAttr("required");
                $field.hide();
            }
        })
    });
    getUserIp();
    window._mfq = window._mfq || [];
    window._mfq.push(["tag", "variant-a"]);
    var url_string = window.location.search;
    var url_params = new URLSearchParams(url_string);
    {% for utm_field in site.utm_fields %}
    if (url_params.get("{{utm_field}}") !== null && $('input[name="{{utm_field}}"]').length > 0) {
        $('input[name="{{utm_field}}"]').val(url_params.get("{{utm_field}}"));
    }
    {% endfor %}
    if (url_params.get("internal_source") !== null && $('input[name="internal_source"]').length > 0) {
        $('input[name="internal_source"]').val(url_params.get("internal_source"));
    }
    if (url_params.get("channel_id") !== null && $('input[name="channel_id"]').length > 0) {
        $('input[name="channel_id"]').val(url_params.get("channel_id"));
    }
    if (url_params.get("channelId") !== null && $('input[name="channel_id"]').length > 0) {
        $('input[name="channel_id"]').val(url_params.get("channelId"));
    }
    if (url_params.get("supplierkey") !== null && $('input[name="supplierkey"]').length > 0) {
        $('input[name="supplierkey"]').val(url_params.get("supplierkey"));
    }
    if (url_params.get("supplierId") !== null && $('input[name="supplierId"]').length > 0) {
        $('input[name="supplierId"]').val(url_params.get("supplierId"));
    }
    $('.form__proceed-button').on('click', function () {
        var parent_fieldset = $(this).parents('fieldset');
        var group_name = parent_fieldset.attr('data-fieldset-name');
        var parent_form = $(this).parents('form');
        parent_form.parsley().whenValidate({
            group: group_name,
            force: true
        }).done(function () {
            parent_fieldset.removeClass('active');
            parent_fieldset.next().addClass('active');
            var index = parent_fieldset.attr("data-index");
            $('.form__fieldset-count').find('span[data-index="' + (parseInt(index) + 1) + '"]').addClass('active');
            $("body, html").animate({ scrollTop: parent_form.offset().top - 20 });
            $('.form__progress-bar .inner').width(((parseInt($('.form__steps--current').text()) / fieldset_count) * 100) + "%");
            $('.form__steps--current').text((parseInt($('.form__steps--current').text()) + 1));
        });
    });

    $('.form__fieldset').each(function () {
        var field = $(this).find('.form__field:not(.form__field--text)');
        if (field.length == 1 && field.hasClass('form__field--radio')) {
            field.addClass('form__field--single');
            $(this).addClass('form__fieldset--single');
        }
    });

    $('body').on("click", '.form__field--radio .field__radio-label', function () {
        var $this = $(this);
        var $input = $(this).prev();
        if ($input[0].hasAttribute("data-block-option") && $input.attr("data-block-option") == "true") {
            $('.field__block-message').hide();
            $('.field__block-message[for="' + $input.attr("id") + '"]').show();
            $('.form__proceed-button').attr("disabled", "disabled");
        } else {
            $('.field__block-message').hide();
            $('.form__proceed-button').removeAttr("disabled");
            setTimeout(function () {
                if ($this.parents('.form__field--radio').hasClass("form__field--single")) {
                    $this.parents('fieldset').find('.form__proceed-button').trigger("click");
                }
            }, 100)
        }
    })

    $(document).on("keydown", "form", function (event) {
        return event.key != "Enter";
    });

    var fieldset_count = $('.form__fieldset').length;
    $('.form__progress-bar.custom').each(function () {
        var perc = (parseInt($(this).attr("data-count")) + 1) / (fieldset_count + 1) * 100;
        perc = perc.toFixed(0);
        $(this).find(".inner").css("width", perc + "%")
        $(this).find(".val").text(perc + "%");
    });

    $('.form__back-button').on("click", function (e) {
        var parent_fieldset = $(this).parents('fieldset');
        var group_name = parent_fieldset.attr('data-fieldset-name');
        var parent_form = $(this).parents('form');
        e.preventDefault();
        parent_fieldset.removeClass('active');
        parent_fieldset.prev().addClass('active').removeClass('form__fieldset--single');
        var index = parent_fieldset.attr("data-index");
        $('.form__fieldset-count').find('span[data-index="' + parseInt(index) + '"]').removeClass('active');
        $("body, html").animate({ scrollTop: parent_form.offset().top - 20 });
        $('.form__steps--current').text((parseInt($('.form__steps--current').text()) - 1));
        $('.form__progress-bar .inner').width(((parseInt($('.form__steps--current').text() - 1) / fieldset_count) * 100) + "%");
    });

    $('.form__submit-button').on("click", function (e) {
        e.preventDefault();
        $('.form__message').remove();
        var parent_form = $(this).parents('.form');
        window._mfq.push(["formSubmitAttempt", "#form"]);
        parent_form.parsley().whenValidate({
            force: true
        }).done(function () {
            parent_form.addClass("submitting");
            var formData = parent_form.serializeObject();
            formData.WebsiteId = parseInt("{{ site.WebsiteId }}");
            if (typeof formData.MarketingPermission == "undefined") {
                formData.MarketingPermission = false;
            }
            formData.ip_address = window.ip_address;
            window.localStorage.setItem('name', formData.first_name);
            var href = window.location.href;
            if (formData.redirect_url != '') {
                window.internal_href = formData.redirect_url;
            } else {
                window.internal_href = href.replace("/form", "/thankyou")
            }
            window.formData = formData;

            var portal_url = '{{site.portal_api_url}}' + formData.api_suffix + '/create';
            $.ajax({
                type: 'POST',
                data: JSON.stringify(formData),
                contentType: 'application/json',
                url: portal_url,
                success: function (data, status, response) {
                    window._mfq.push(["formSubmitSuccess", "#form"]);
                    if (formData.postback_url != null) {
                        var url = formData.postback_url;
                        {% for utm_field in site.utm_fields %}
                        if (url_params.get("{{utm_field}}") !== null) {
                            url = url.replace('[{{utm_field}}]', url_params.get("{{utm_field}}"));
                        }
                        {% endfor %}
                        $.ajax({
                            type: 'POST',
                            url: url
                        })
                    }
                    handleFBConversion(data.leadId, window.formData.first_name, window.formData.last_name, window.formData.EmailAddress, window.formData.Phone)
                    if (typeof gtag === 'function') {
                        gtag('event', 'Form submission success', { 'event_category': 'Form submission' });
                    }
                },
                error: function (e) {
                    parent_form.removeClass("submitting");
                    if (typeof e.responseJSON != "undefined" && typeof e.responseJSON["errors"] != "undefined") {
                        var errors = e.responseJSON["errors"];
                        errors.forEach((entry) => {
                            var input = $('input[name="' + entry.field + '"]');
                            if (input.length > 0) {
                                parent_form.addClass("has_errors");
                                var parent = input.parents(".form__field");
                                input.addClass("error");
                                parent.addClass("field--error");
                                parent.find("label.error").remove();
                                parent.append('<label class="error">' + entry.message + '</label>');
                            } else {
                                var msg = 'An error occurred. Please try again, or contact us referencing error code: ' + e.status;
                                setTimeout(function () {
                                    parent_form.find(".form__submit").append('<p class="form__message form__message--error">' + msg + '</p>');
                                }, 500)
                            }
                        });
                        if (typeof gtag === 'function') {
                            gtag('event', 'Form submission error', { 'event_category': 'Form submission', 'event_label': JSON.stringify(e.responseJSON) });
                        }
                    } else {
                        var msg = 'An error occurred. Please try again, or contact us referencing error code: ' + e.status;
                        setTimeout(function () {
                            parent_form.find(".form__submit").append('<p class="form__message form__message--error">' + msg + '</p>');
                        }, 500)
                        if (typeof gtag === 'function') {
                            gtag('event', 'Form submission error', { 'event_category': 'Form submission', 'event_label': 'Unknown error' });
                        }
                    }
                    window._mfq.push(["formSubmitFailure", "#form"]);
                }
            })

        });
    });
    var txt = document.getElementById('field_postcode_lookup');

    if (typeof data8 != "undefined" && typeof data8.predictiveaddressui != "undefined") {
        new data8.predictiveaddressui(txt, {
        {% if jekyll.environment == "development" %}
    ajaxKey: "{{site.d8_test}}",
        {% else %}
ajaxKey: "{{site.d8_live}}",
    {% endif %}
    initialCountry: 'GB',
    fallbackCountry: 'GB',
    allowedCountries: ['GB'],
    barredCountries: [],
    selectAddress: function () {
        $('.form__field--address').show()
    },
    fields: [
    { element: 'address', field: 'line1' },
    { element: 'address2', field: 'line2' },
    { element: 'city', field: 'town' },
    { element: 'county', field: 'county' },
    { element: 'field_postcode_lookup', field: 'postcode' }
]
                });
            }

$('.field__input[data-store="true"]').on("change blur", function () {
    localStorage.setItem($(this).attr("name"), $(this).val());
});
});


$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    window.a = a;
    $.each(a, function () {
        var count = window.a.filter((obj) => obj.name === this.name).length;
        if (o[this.name]) {
            o[this.name] += ', ' + this.value || '';
            if (!o[this.value]) {
                o[this.value] = true;
            }
        } else {
            o[this.name] = this.value || '';
            if (count > 1 && !o[this.value]) {
                o[this.value] = true;
            }
        }
    });
    return o;
};

window["Parsley"].on('field:error', function () {
    window._mfq.push(["formSubmitFailure", "#form"]);
    if (typeof gtag === 'function') {
        gtag('event', this.element.name, { 'event_category': 'Form validation error', 'event_label': this.validationResult[0]['assert'].name, });
    }
});

$('input[type="checkbox"],input[type="radio"]').on("click", function () {
    if (typeof gtag === 'function') {
        gtag('event', $(this).attr("name"), { 'event_category': 'Form interaction', 'event_label': $(this).val(), });
    }
});
$('input[type="text"],input[type="email"],input[type="tel"]').on("focusin", function () {
    if (typeof gtag === 'function') {
        gtag('event', $(this).attr("name"), { 'event_category': 'Form interaction', 'event_label': "Focus", });
    }
});
$('.field--dropdown .field__input--select').on("change", function () {
    if (typeof gtag === 'function') {
        gtag('event', $(this).attr("name"), { 'event_category': 'Form interaction', 'event_label': "Change", });
    }
})
/*$('input[type="tel"]').on("keypress keyup blur", function (event) {
    $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
});*/
$(document).ready(function () {
    $('input[type="tel"]').unbind('keypress keyup blur').bind('keypress keyup blur', function () {
        $(this).val($(this).val().replace(/\s/g, ''));
    });
});

function handleFBConversion(lead_id, first_name, last_name, email, phone) {
    if (typeof fbq != "undefined") {
        fbq('track', 'Lead', { "external_id": lead_id }, { "eventID": lead_id });
    }
    var url = "https://prod-26.uksouth.logic.azure.com:443/workflows/626d0c8d49244c93b8be24e5137a867b/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=44U9c0WAeCDMg0UcwduAGG5hoFETxP-3-XllUbOtCaY";
    var data = { "fbp": getCookie('_fbp'), "fbc": getCookie('_fbc'), "lead_id": lead_id, "first_name": first_name, "last_name": last_name, "email": email, "phone": phone, "source_url": window.location.href, "pixel_id": window.internal_pixel_id, "ts": Math.floor(Date.now() / 1000), "user_agent": navigator.userAgent, "ip_address": window.ip_address };
    var redirect = window.internal_href;
    var url_string = window.location.search;
    if (redirect.indexOf("?") > -1) {
        redirect = redirect + url_string.replace("?", "&");
    } else {
        redirect = redirect + url_string;
    }
    if (typeof window.internal_pixel_id != "undefined") {
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: url,
            success: function () {
                window.location.href = redirect;
            }
        });
    } else {
        window.location.href = redirect;
    }


}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

// window.addEventListener('beforeunload', function (e) {
//     e['returnValue'] = "Are you sure you want to leave?";
//   });
