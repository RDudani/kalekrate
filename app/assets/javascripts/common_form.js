var invalid_fields = {};
var error_fields = {
  first_name: 'First name',
  last_name: 'Last name',
  email: 'Email address',
  number: 'Credit Card number',
  postal_code: 'Postal Code',
  month: 'Expiration Month',
  year: 'Expiration Year',
  cvv: 'CVV',
  address: 'Street address',
  city: 'City',
  country: 'Country',
  name_on_account: 'Name on Account',
  routing_number: 'Routing Number',
  account_number: 'Account Number',
  account_number_confirmation: 'Account Number Confirmation',
  account_type: 'Bank Account Type'
};
var paypal_error_fields = {
  first_name: 'First name',
  last_name: 'Last name'
};

// Configure recurly.js
recurly.configure('sc-Hw20ERMh8bzGFiWKO7NvDB');

function create_subscription (recurring) {
  if (typeof recurring == 'undefined') recurring = true;

  var data = {
    "recurly-token": $('input[name="recurly-token"]').val(),
    "first-name": $('input[name="first-name"]').val(),
    "last-name": $('input[name="last-name"]').val(),
    "email": $('input[name="email"]').val(),
    "address" : $('input[name="address"]').val(),
    "city" : $('input[name="city"]').val(),
    "state" : $('#state').val(),
    "zip": $('input[name="postal-code"]').val(),
    "number": $('input[data-recurly="number"]').val(),
    "month": $('input[name="month"]').val(),
    "year": $('input[name="year"]').val(),
    "routing_number": $('input[name="routing-number"]').val(),
    "routing_number_bank": $('.routing_number_bank').html(),
    "account_number": $('input[name="account-number"]').val()
  };

  $.ajax({
    type: "POST",
    url: recurring ? '/api/subscriptions/new' : '/api/transactions',
    data: data,
    success: subscription_created(data),
    dataType: 'json'
  });
}

function subscription_created(data) {
  console.log(data);

  $('.confirmation').addClass('confirmation__show');
  $('.confirmation-messaging').addClass('animate');

  if (typeof advancedConfirmation !== "undefined") {
    $('.hide-form-onsuccess').addClass('form__success');
    advancedConfirmation(data);
  }
  else {
    $('form').addClass('form__success');
  }
}

function clear_errors() {
  invalid_fields = {};
  $('.form-errors--invalid-field').removeClass('form-errors--invalid-field');
  $('.form-input__error').removeClass('form-input__error');
  $('.form-errors').addClass('form-errors__hidden');
}

function paypalError (err) {

    if (err.niceMessage) {
      errors_markup = '<li class="form-errors--invalid-field">' + err.niceMessage + '</li>';
      } else {
        $.each(err.fields, function(i, field) {
          if(typeof invalid_fields[field] === 'undefined') {
            invalid_fields[field] = field;
          }
        });

        var errors_markup = $.map(invalid_fields, function (field) {
          $('.form-input__' + field).addClass('form-input__error');
          return '<li class="form-errors--invalid-field">' + paypal_error_fields[field] || field + '</li>';
        }).join('');
      }

      $('.form-errors').removeClass('form-errors__hidden');
      $('.form-errors ul')
        .empty()
        .append(errors_markup);

      $('input[type="submit"]').prop('disabled', false);
}

// A simple error handling function to expose errors to the customer
function error (err) {

  if (err.niceMessage) {
    errors_markup = '<li class="form-errors--invalid-field">' + err.niceMessage + '</li>';
  } else {
    $.each(err.fields, function(i, field) {
      if(typeof invalid_fields[field] === 'undefined') {
        invalid_fields[field] = field;
      }
    });

    var errors_markup = $.map(invalid_fields, function (field) {
      $('.form-input__' + field).addClass('form-input__error');
      return '<li class="form-errors--invalid-field">' + error_fields[field] || field + '</li>';
    }).join('');
  }

  $('.form-errors').removeClass('form-errors__hidden');
  $('.form-errors ul')
    .empty()
    .append(errors_markup);

  $('input[type="submit"]').prop('disabled', false);
}

function cancel () {
  $('.form-container').show();
  $('.review-container').hide();
  $(".quantity, .addon-item--quantity input, select.plan, select.curr")
    .removeAttr("disabled")
    .parents('.select-wrap')
    .removeClass('disabled');

  var $advancedContinue = $('#continue.advanced');
  if ($advancedContinue[0]) {
    $advancedContinue.parent().show();
    $("#subscribe").parent().hide();
  }
}

function review () {
  $('.form-container').hide();
  $('.review-container').show();

  var $advancedContinue = $('#continue.advanced');
  if ($advancedContinue[0]) {
    $advancedContinue.parent().hide();
    $("#subscribe").parent().show();
  }

  $(".quantity, .addon-item--quantity input, select.plan, select.curr")
    .attr("disabled", true)
    .parents('.select-wrap')
    .addClass('disabled');

  populateReviewInfo();
}

function populateReviewInfo () {
  var nameOnAccount = $('#name_on_account').val();
  var routingNumber = $('#routing_number').val();
  var accountNumber = $('#account_number').val();
  var accountType = $('input[name="account-type"]').val().toUpperCase();
  var amount = $('#amount').html();

  $('.name_on_account_confirm').html(nameOnAccount);
  $('.routing_number_confirm').html(routingNumber);
  $('.account_number_confirm').html(accountNumber);
  $('.account_type_confirm').html(accountType);
  $('.amount_confirm').html(amount);
}

$(document).ready(function() {
  // routing number bank lookup
  $("input#routing_number").on('change', function(event) {
    var routingNumber = $("#routing_number").val();

    recurly.bankAccount.bankInfo({routingNumber: routingNumber}, function(err, bank) {
      if (!err && bank && bank.bank_name) {
        $(".routing_number_bank").html(bank.bank_name);
      }
    });
  });

  $('.cancel').on('click', cancel);

  $('input#number').mask('0000 0000 0000 0000');
});
