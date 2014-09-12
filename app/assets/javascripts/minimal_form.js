var  invalid_fields = []
  ,  error_fields = {
       first_name: 'First name',
       last_name: 'Last name',
       email: 'Email address',
       number: 'Credit Card number',
       postal_code: 'Postal Code',
       month: 'Expiration Month',
       year: 'Expiration Year',
       cvv: 'CVV',
       address: 'Street address',
       city: 'City' }

var invalid_fields = [];

$(document).ready(function() {
  // Configure recurly.js
  recurly.configure('sc-Hw20ERMh8bzGFiWKO7NvDB');

  // On form submit, we stop submission to go get the token
  $('form').on('submit', function (event) {
    event.preventDefault();

    // Disable the submit button
    $('.btn-submit').prop('disabled', true);
    clear_errors();
    check_required_fields()

    var form = this;

    // Now we call recurly.token with the form. It goes to Recurly servers
    // to tokenize the credit card information, then injects the token into the
    // data-recurly="token" field above
    recurly.token(form, function (err, token) {
      if (err) {
        error(err);
      }
      else {
        var data = {
          "recurly-token": $('input[name="recurly-token"]').val(),
          "first-name": $('input[name="first-name"]').val(),
          "last-name": $('input[name="last-name"]').val(),
          "email": $('input[name="email"]').val()
        };

        $.ajax({
          type: "POST",
          url: '/api/subscriptions/new',
          data: data,
          success: subscription_created(data),
          dataType: 'json'
        });

      };

    });

  });



});

$(document).ready(function() {

  // Identity card type
  $("#number").on('change', function(event) {
    var card_number = $("#number").val()
      , card_type = recurly.validate.cardType(card_number)
      , card_is_valid = recurly.validate.cardNumber($("#number").val())
      , number_field = $('.customer-fields--card-number .form-input');

    if(card_is_valid) {
      $(number_field).removeClass('form-input__error');
    }
    else {
      $(number_field).addClass('form-input__error');
    }

    if((card_type == 'default') || (card_type == 'unknown')) {
      $('.icon-card').addClass('icon-card__generic');
      $('.icon-card').removeClass('icon-card__visa icon-card__mastercard icon-card__amex icon-card__visa discover');
    }
    else {
      $('.icon-card').removeClass('icon-card__generic');
      $('.icon-card').addClass('icon-card__' + card_type);
    }
  });

});

function subscription_created(data) {
  console.log(data);
  $('form').addClass('form__success');

  $('.confirmation').addClass('confirmation__show');
  $('.confirmation-messaging').addClass('animate');
}

function clear_errors() {
  while(invalid_fields.length > 0) {
    invalid_fields.pop();
  }
  $('.form-errors--invalid-field').removeClass('form-errors--invalid-field');
}

function check_required_fields() {
  var fields = $('.form-input__required');

  $.each(fields, function(i, field) {
    if($(field).val() == "") {
      invalid_fields.push($(field).attr('data-recurly'));
    }
    else {
      $('.form-input__' + $(field).attr('data-recurly')).removeClass('form-input__error');
    }
  });
}


// A simple error handling function to expose errors to the customer
function error (err) {
  $.each(err.fields, function(i, field) {
    if(typeof invalid_fields[field] == undefined) {
      invalid_fields.push(field);
    }
  });

  var errors_markup = $.map(invalid_fields, function (field) {
    $('.form-input__' + field).addClass('form-input__error');
    return '<li class="form-errors--invalid-field">'+ error_fields[field] +'</li>';
  }).join('');

  $('.form-errors').removeClass('form-errors__hidden');
  $('.form-errors ul')
    .empty()
    .append(errors_markup);

  $('input[type="submit"]').prop('disabled', false);
}
