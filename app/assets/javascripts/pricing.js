$(document).ready(function() {
  var pricing = recurly.Pricing();
  pricing.attach($('form'));

  // Plans
  pricing.on('set.plan', planHandler);

  function planHandler(plan) {
    console.log(plan);
    $('.subscription-price').text('$'+plan.price.USD.unit_amount);
    showAddons(plan.addons);
    pricing.attach($('form'));
  }

  // Addons
  $('body').on('change', '.addons-list .checkbox', function() {
    pricing.on('set.addon', addonHandler);
  });


  function addonHandler(addon) {
    console.log(addon);
    //$('.addons-summary-container').empty();

    showAddonsSummary(addon);
  }

  //coupon
  $('#enter-coupon').click(function() {
     pricing.on('set.coupon', couponHandler);
  });
 

  function couponHandler(coupon) {
    console.log(coupon);
    var num = (coupon.discount.amount.USD);
    var n = num.toFixed(2);
    $('.coupon').html('<span class="coupon-code">'+coupon.code + '</span><span class="coupon-amount-off">-$'+n+'</span>');
  }

  $('.coupon-text').click(function() {
    $('.coupon-none, .coupon-text').hide();
    $('.hidden').show();
    return false;
  });

});
