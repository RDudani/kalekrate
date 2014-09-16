function showAddons(addons) {
  var source   = $("#addon-template").html()
    , template = Handlebars.compile(source)
    , data = { list: [] };

  $(addons).each(function(idx, value) {
    data.list.push({
      name: value.name,
      code: value.code,
      price: value.price.USD.unit_amount
    });
  });

  $('.addons-container').html(template(data));
}

function showAddonsSummary(addon) {
  var source   = $("#addon-summary-template").html()
    , template = Handlebars.compile(source)
    , data = { list: [] };

    console.log(addon);
    if(addon.quantity != 0) {
        data.list.push({
        name: addon.name,
        code: addon.code,
        quantity: addon.quantity,
        price: addon.price.USD.unit_amount

      });
    }
    

 /* $(addon).each(function(idx, value) {
    data.list.push({
      name: value.name,
      code: value.code,
      quantity: value.quantity,
      price: value.price.USD.unit_amount
    });
  }); */

  $('.addons-summary-container').html(template(data));

}
