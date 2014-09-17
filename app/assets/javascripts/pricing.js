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
  $('body').on('focus', '.addons-list .addon-item--quantity', function() {
    $('.addons-summary-container').empty();
  });

  $('body').on('change', '.addons-list .checkbox', function() {
    $('.addons-summary-container').empty();
    if ( ! this.checked) {
      $(this).parent().find('.addon-item--quantity input').val(0);
    }
    else {
      $(this).parent().find('.addon-item--quantity input').val(1);
    }
  });
  pricing.on('set.addon', addonHandler);


  function addonHandler(addon) {
    console.log(addon);
    showAddonsSummary(addon);
    
  }

  //Coupon
  $('#enter-coupon').click(function() {
     pricing.on('set.coupon', couponHandler);
  });
 

  function couponHandler(coupon) {
    console.log(coupon);
    var num = (coupon.discount.amount.USD);
    var n = num.toFixed(2);
    $('.coupon li').html('<span class="coupon-code">'+coupon.code + '</span><span class="coupon-amount-off">-$'+n+'</span>');
  }

  $('.coupon-text').click(function() {
    $('.coupon-none, .coupon-text').hide();
    $('.hidden').show();
    return false;
  });

  //Payment Option
  $('.payment-type a').click(function() {
    var tab = $(this).attr('href');
    $('.payment-type a').removeClass('active');
    $(this).addClass('active');
    $('.panel').hide();
    $(tab).show();

    return false;
  });

});
