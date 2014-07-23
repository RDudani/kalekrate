$(document).ready(function() {
  var pricing = recurly.Pricing();
  pricing.attach($('.form'));


  // Plans
  pricing.on('set.plan', planHandler);

  function planHandler(plan) {
    console.log(plan);
  }


  // Addons
  pricing.on('set.addon', addonHandler);

  function addonHandler(addon) {
    console.log(addon);
  }
});
