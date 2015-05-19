$(document).ready(function() {

  // On form submit, we stop submission to go get the token
  $('form').on('submit', function (event) {
    event.preventDefault();

    var reviewActive = $('.review-container').hasClass('active');

    // Disable the submit button
    $('#subscribe').prop('disabled', true);
    var recurring = false;
    create_subscription(recurring);
  });

  $('#continue').on('click', function() {
    var form = $("form")[0];

    clear_errors();

    // Now we call appropriate recurly.token function with the form. It goes to Recurly servers
    // to tokenize the credit card information, then injects the token into the
    // data-recurly="token" field above

    recurly.bankAccount.token(form, function (err, token) {
      if (err) {
        error(err);
      } else {
        review();
      }
    });
  });

  updateAmount();
  $(".quantity").on('change', updateAmount);
});

function updateAmount() {
  var quantity = +$("#quantity").val();
  var priceEach = +$("#price-each").val();
  var totalPrice = priceEach * quantity;
  $("#amount").html("$"+totalPrice.toFixed(2));
}





