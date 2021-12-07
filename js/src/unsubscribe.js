$(document).ready(function () {
    $('.form__submit-button').on("click", function (e) {
        e.preventDefault();
        $('.form__message').remove();
        var parent_form = $(this).parents('.form');
        parent_form.parsley().whenValidate({
            force: true
        }).done(function () {
            parent_form.addClass("submitting");
            var formData = parent_form.serializeObject();
            window.formData = formData;

            var portal_url = '{{site.portal_api_url}}unsubscribe/create';
            $.ajax({
                type: 'POST',
                data: JSON.stringify(formData),
                contentType: 'application/json',
                url: portal_url,
                success: function (data, status, response) {       
                    parent_form.removeClass("submitting");      
                    var html = '<div class="form form--nested"><div class="form__pre-form-text"><h2>Unsubscribe Complete</h2>';
                    html += '<p>Your unsubscribe is complete and we will ensure that your email address is removed from our system and any 3rd parties that we work with.</p>';
                    html += '<p>Please note that it can take up to 10 working days for the request to be actioned.</p></div></div>';
                    parent_form.after(html).remove();
                    if (typeof gtag === 'function') {
                        gtag('event', 'Unsubscribe submission success', { 'event_category': 'Unsubscribe submission' });
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
                    } else {
                        var msg = 'An error occurred. Please try again, or contact us referencing error code: ' + e.status;
                        setTimeout(function () {
                            parent_form.find(".form__submit").append('<p class="form__message form__message--error">' + msg + '</p>');
                        }, 500)
                    }
                }
            })

        });
    })
});