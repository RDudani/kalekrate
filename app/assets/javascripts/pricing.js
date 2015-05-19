var planDetails;

$(document).ready(function() {
  var pricing = recurly.Pricing();

  pricing.attach($('form'));

  // Plans
  pricing.on('set.plan', function planHandler (plan) {
    planDetails = plan;
    updateSubscriptionPrice();
    showAddons(plan.addons);
    pricing.attach($('form'));
    updateLineItemsSummary();
  });

  pricing.on('set.addon', function addonHandler (addon) {
    updateAddonForSummary(addon);
  });

  // Coupon
  pricing.on('set.coupon', function couponHandler (coupon) {
    var num = coupon.discount.amount.USD;
    var n = num.toFixed(2);
    $('.coupon li').html('<span class="coupon-code">'+coupon.code + '</span><span class="coupon-amount-off">-$'+n+'</span>');
  });

  $('.coupon-text').click(function() {
    $('.coupon-none, .coupon-text').hide();
    $('.hidden').show();
    $('.coupon-code').focus();
    return false;
  });

  $("#currency").on('change', updateSubscriptionPrice);

  // Payment Option
  $('.payment-type a').click(function() {
    clear_errors();
    var tab = $(this).attr('href').replace("#", "");
    $('.payment-type a').removeClass('active');
    $(this).addClass('active');
    showPaymentTypePanels(tab);
    $('#payment_type').val(tab);
    return false;
  });

  $("#plan_quantity").on('change', function() {
    // wait for next event loop so that planDetails gets updated
    setTimeout(updateLineItemsSummary, 100);
  });

  function showPaymentTypePanels (type) {
    $('.panel').hide();
    $('.panel.'+type).show();
  }

  function updateSubscriptionPrice () {
    $('.subscription-price').text('$'+subscriptionPrice());
    updateLineItemsSummary();
  }
});

function updateLineItemsSummary () {
  var source   = $("#line-items-summary-template").html()
    , template = Handlebars.compile(source);

  $('.line-items-summary').html(template({
    plan_name: planDetails.name,
    plan_price: subscriptionPrice(),
    plan_quantity: planDetails.quantity,
    addons: addonsList
  }));
}

function subscriptionPrice() {
  var currency = $("#currency").val();
  return planDetails.price[currency].unit_amount.toFixed(2);
}
