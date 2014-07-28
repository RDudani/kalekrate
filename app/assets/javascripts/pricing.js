$(document).ready(function() {
  var pricing = recurly.Pricing();
  pricing.attach($('form'));


  // Plans
  pricing.on('set.plan', planHandler);

  function planHandler(plan) {
    console.log(plan);
    $('.subscription-price').text(plan.price.USD.unit_amount);
  }


  // Addons
  pricing.on('set.addon', addonHandler);

  function addonHandler(addon) {
    console.log(addon);
  }
});
