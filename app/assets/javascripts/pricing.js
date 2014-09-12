$(document).ready(function() {
  var pricing = recurly.Pricing();
  pricing.attach($('form'));

  $('.addons-summary-container').empty();

  // Plans
  pricing.on('set.plan', planHandler);

  function planHandler(plan) {
    console.log(plan);
    $('.subscription-price').text(plan.price.USD.unit_amount);
    showAddons(plan.addons);
    pricing.attach($('form'));
  }

  // Addons
  pricing.on('set.addon', addonHandler);

  function addonHandler(addon) {
    console.log(addon);
    showAddonsSummary(addon);
  }

  //coupon
  pricing.on('set.coupon', couponHandler);

  function couponHandler(coupon) {
    console.log(coupon);
  }
});
